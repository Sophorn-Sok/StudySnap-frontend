import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { createSupabaseAdminClient, createSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const scrypt = promisify(scryptCallback);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const OTP_TTL_MS = 1000 * 60 * 10;

type RouteContext = {
  params: Promise<{ path?: string[] }> | { path?: string[] };
};

type AppUserRow = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
};

type SessionRow = {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
};

type OtpPurpose = 'register' | 'login';

type OtpRow = {
  id: string;
  email: string;
  purpose: OtpPurpose;
  otp_hash: string;
  expires_at: string;
  attempts: number;
  consumed_at: string | null;
  created_at: string;
};

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  is_shared: boolean | null;
  shared_with: string[] | null;
};

type NoteVersionRow = {
  id: string;
  note_id: string;
  content: string;
  created_at: string;
  created_by: string;
};

type FlashcardDeckRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type FlashcardRow = {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  last_reviewed_at: string | null;
  review_count: number | null;
};

type StudySessionRow = {
  id: string;
  user_id: string;
  deck_id: string;
  cards_studied: number;
  correct_answers: number;
  started_at: string;
  ended_at: string | null;
};

type MeetingRow = {
  id: string;
  user_id: string;
  title: string;
  transcript: string;
  ai_notes: string | null;
  recording_url: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
};

type UserPayload = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

type DbClient = ReturnType<typeof createSupabaseAdminClient>;

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

function errorResponse(message: string, status = 400) {
  return json({ error: message }, { status });
}

function dbErrorStatus(message?: string) {
  if (!message) {
    return 500;
  }

  if (message.toLowerCase().includes('row-level security policy')) {
    return 403;
  }

  return 500;
}

function humanizeDbError(message?: string) {
  if (!message) {
    return 'Database operation failed.';
  }

  if (message.toLowerCase().includes('row-level security policy')) {
    return 'Database is blocking this action (RLS). Add SUPABASE_SERVICE_ROLE_KEY to server env or disable RLS for these app tables.';
  }

  return message;
}

function isRateLimitedError(message?: string) {
  const normalized = (message ?? '').toLowerCase();
  return normalized.includes('rate limit') || normalized.includes('too many requests');
}

function isResendDomainRestriction(message?: string) {
  const normalized = (message ?? '').toLowerCase();
  return normalized.includes('testing emails to your own email address') || normalized.includes('domain is not verified');
}

function otpSendErrorStatus(message?: string) {
  const normalized = (message ?? '').toLowerCase();

  if (normalized.includes('missing resend_api_key') || normalized.includes('otp_from_email')) {
    return 503;
  }

  if (normalized.includes('invalid') && normalized.includes('email')) {
    return 400;
  }

  if (normalized.includes('testing emails to your own email address')) {
    return 403;
  }

  if (normalized.includes('domain is not verified')) {
    return 403;
  }

  if (isRateLimitedError(message)) {
    return 429;
  }

  return 502;
}

function humanizeOtpProviderError(message?: string) {
  const normalized = (message ?? '').toLowerCase();

  if (normalized.includes('testing emails to your own email address')) {
    return 'Resend test mode is active: you can only send OTP to your own Resend account email. Verify a domain in Resend and use a from-address on that domain to send OTP to all users.';
  }

  if (normalized.includes('domain is not verified')) {
    return 'Resend sender domain is not verified. Verify your domain in Resend and set OTP_FROM_EMAIL to an address on that domain.';
  }

  return message ?? 'Failed to send OTP email.';
}

function hasResendConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.OTP_FROM_EMAIL);
}

function parseSegments(context: RouteContext) {
  return Promise.resolve(context.params).then((params) => params.path ?? []);
}

function getAuthToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header) {
    return null;
  }

  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, hashedValue] = storedHash.split(':');
  if (!salt || !hashedValue) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hashedValue, 'hex');
  if (expected.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(expected, derivedKey);
}

function isValidOtpPurpose(value: unknown): value is OtpPurpose {
  return value === 'register' || value === 'login';
}

function generateOtpCode() {
  return String(randomBytes(3).readUIntBE(0, 3) % 900000).padStart(6, '0');
}

function hashOtp(email: string, purpose: OtpPurpose, otp: string) {
  return createHash('sha256').update(`${email}:${purpose}:${otp}`).digest('hex');
}

async function sendOtpEmail(email: string, purpose: OtpPurpose, otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.OTP_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    throw new Error('Missing RESEND_API_KEY or OTP_FROM_EMAIL environment variables.');
  }

  const actionText = purpose === 'register' ? 'finish your StudySnap sign up' : 'sign in to StudySnap';
  const send = async (from: string) =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your StudySnap OTP Code',
        html: `<p>Use this code to ${actionText}:</p><p style=\"font-size: 24px; font-weight: 700; letter-spacing: 2px;\">${otp}</p><p>This code expires in 10 minutes.</p>`,
      }),
    });

  let response = await send(fromEmail);
  let errorText = '';
  if (!response.ok) {
    errorText = await response.text().catch(() => '');

    // Graceful fallback for unverified custom domains in Resend.
    if (errorText.toLowerCase().includes('domain is not verified')) {
      response = await send('onboarding@resend.dev');
      if (response.ok) {
        return true;
      }

      errorText = await response.text().catch(() => errorText);
    }
  }

  if (!response.ok) {
    throw new Error(errorText || 'Failed to send OTP email.');
  }

  return true;
}

async function sendSupabaseOtp(email: string, purpose: OtpPurpose) {
  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: purpose === 'register',
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function verifySupabaseOtp(email: string, otp: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Invalid OTP code.');
  }
}

async function createOtp(db: DbClient, email: string, purpose: OtpPurpose) {
  const otp = generateOtpCode();
  const otpHash = hashOtp(email, purpose, otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await db
    .from('email_otps')
    .delete()
    .eq('email', email)
    .eq('purpose', purpose)
    .is('consumed_at', null);

  const { error } = await db.from('email_otps').insert({
    email,
    purpose,
    otp_hash: otpHash,
    expires_at: expiresAt,
    attempts: 0,
    consumed_at: null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return otp;
}

async function consumeOtp(db: DbClient, email: string, purpose: OtpPurpose, otp: string) {
  const { data: otpRow, error } = await db
    .from('email_otps')
    .select('*')
    .eq('email', email)
    .eq('purpose', purpose)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .maybeSingle<OtpRow>();

  if (error || !otpRow) {
    return { ok: false, status: 400, error: 'OTP is invalid or missing. Please request a new code.' };
  }

  if (new Date(otpRow.expires_at).getTime() < Date.now()) {
    return { ok: false, status: 400, error: 'OTP has expired. Please request a new code.' };
  }

  const isMatch = hashOtp(email, purpose, otp) === otpRow.otp_hash;
  if (!isMatch) {
    await db
      .from('email_otps')
      .update({ attempts: otpRow.attempts + 1 })
      .eq('id', otpRow.id);

    return { ok: false, status: 400, error: 'Invalid OTP code.' };
  }

  await db
    .from('email_otps')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', otpRow.id);

  return { ok: true };
}

function toUserPayload(row: AppUserRow): UserPayload {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    firstName: row.first_name ?? undefined,
    lastName: row.last_name ?? undefined,
    avatar: row.avatar ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toNote(row: NoteRow) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isShared: row.is_shared ?? false,
    sharedWith: row.shared_with ?? [],
  };
}

function toNoteVersion(row: NoteVersionRow) {
  return {
    id: row.id,
    noteId: row.note_id,
    content: row.content,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}

function toFlashcard(row: FlashcardRow) {
  return {
    id: row.id,
    deckId: row.deck_id,
    front: row.front,
    back: row.back,
    difficulty: row.difficulty,
    lastReviewedAt: row.last_reviewed_at ?? undefined,
    reviewCount: row.review_count ?? 0,
  };
}

function toStudySession(row: StudySessionRow) {
  return {
    id: row.id,
    userId: row.user_id,
    deckId: row.deck_id,
    cardsStudied: row.cards_studied,
    correctAnswers: row.correct_answers,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
  };
}

function toMeeting(row: MeetingRow) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    transcript: row.transcript,
    aiNotes: row.ai_notes ?? '',
    recordingUrl: row.recording_url ?? undefined,
    duration: row.duration ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractKeywords(text: string, limit: number) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function buildSummary(text: string) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return 'No content was provided.';
  }

  return sentences.slice(0, 3).join(' ');
}

function buildFlashcardsFromText(text: string, count: number) {
  const sentences = splitSentences(text);
  const keywords = extractKeywords(text, Math.max(count, 5));
  const cards: Array<{ front: string; back: string; difficulty: 'easy' | 'medium' | 'hard' }> = [];

  for (let index = 0; index < count; index += 1) {
    const keyword = keywords[index] ?? `Topic ${index + 1}`;
    const sentence = sentences[index % Math.max(sentences.length, 1)] ?? text;
    cards.push({
      front: `What should you know about ${keyword}?`,
      back: sentence || `Key idea about ${keyword}.`,
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
    });
  }

  return cards;
}

async function createSession(db: DbClient, userId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  const { error } = await db.from('auth_sessions').insert({
    token,
    user_id: userId,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  return token;
}

async function revokeSession(db: DbClient, token: string) {
  await db
    .from('auth_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', token);
}

async function getAuthenticatedUser(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }

  const db = createSupabaseAdminClient();
  const { data: session, error: sessionError } = await db
    .from('auth_sessions')
    .select('*')
    .eq('token', token)
    .maybeSingle<SessionRow>();

  if (sessionError || !session) {
    return null;
  }

  if (session.revoked_at || new Date(session.expires_at).getTime() < Date.now()) {
    return null;
  }

  const { data: user, error: userError } = await db
    .from('app_users')
    .select('*')
    .eq('id', session.user_id)
    .maybeSingle<AppUserRow>();

  if (userError || !user) {
    return null;
  }

  return { token, db, session, user };
}

async function requireAuthenticatedUser(request: NextRequest) {
  const authContext = await getAuthenticatedUser(request);
  if (!authContext) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return authContext;
}

async function getAllNotes(db: DbClient, userId: string) {
  const [ownedResult, sharedResult] = await Promise.all([
    db.from('notes').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
    db.from('notes').select('*').contains('shared_with', [userId]).order('updated_at', { ascending: false }),
  ]);

  if (ownedResult.error) {
    throw new Error(ownedResult.error.message);
  }

  if (sharedResult.error) {
    throw new Error(sharedResult.error.message);
  }

  const notes = [...(ownedResult.data ?? []), ...(sharedResult.data ?? [])] as NoteRow[];
  const uniqueNotes = new Map<string, NoteRow>();
  for (const note of notes) {
    uniqueNotes.set(note.id, note);
  }

  return [...uniqueNotes.values()].map(toNote);
}

async function getDecksWithCards(db: DbClient, userId: string) {
  const { data: decks, error: deckError } = await db
    .from('flashcard_decks')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (deckError) {
    throw new Error(deckError.message);
  }

  const typedDecks = (decks ?? []) as FlashcardDeckRow[];
  const deckIds = typedDecks.map((deck: FlashcardDeckRow) => deck.id);
  const { data: cards, error: cardError } = deckIds.length
    ? await db.from('flashcards').select('*').in('deck_id', deckIds)
    : { data: [], error: null };

  if (cardError) {
    throw new Error(cardError.message);
  }

  const cardsByDeck = new Map<string, FlashcardRow[]>();
  for (const card of (cards ?? []) as FlashcardRow[]) {
    const existing = cardsByDeck.get(card.deck_id) ?? [];
    existing.push(card);
    cardsByDeck.set(card.deck_id, existing);
  }

  return typedDecks.map((deck: FlashcardDeckRow) => ({
    id: deck.id,
    userId: deck.user_id,
    title: deck.title,
    description: deck.description ?? undefined,
    cards: (cardsByDeck.get(deck.id) ?? []).map(toFlashcard),
    cardCount: cardsByDeck.get(deck.id)?.length ?? 0,
    createdAt: deck.created_at,
    updatedAt: deck.updated_at,
  }));
}

async function getDeckById(db: DbClient, userId: string, deckId: string) {
  const { data: deck, error: deckError } = await db
    .from('flashcard_decks')
    .select('*')
    .eq('id', deckId)
    .eq('user_id', userId)
    .maybeSingle<FlashcardDeckRow>();

  if (deckError || !deck) {
    return null;
  }

  const { data: cards, error: cardError } = await db
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true });

  if (cardError) {
    throw new Error(cardError.message);
  }

  return {
    id: deck.id,
    userId: deck.user_id,
    title: deck.title,
    description: deck.description ?? undefined,
    cards: (cards ?? []).map(toFlashcard),
    cardCount: cards?.length ?? 0,
    createdAt: deck.created_at,
    updatedAt: deck.updated_at,
  };
}

async function getMeetingById(db: DbClient, userId: string, meetingId: string) {
  const { data: meeting, error } = await db
    .from('meetings')
    .select('*')
    .eq('id', meetingId)
    .eq('user_id', userId)
    .maybeSingle<MeetingRow>();

  if (error || !meeting) {
    return null;
  }

  return toMeeting(meeting);
}

async function handleAuth(request: NextRequest, segments: string[]) {
  const action = segments[1];
  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};

  if (action === 'request-otp' && request.method === 'POST') {
    const email = String((body as { email?: string }).email ?? '').trim().toLowerCase();
    const purpose = (body as { purpose?: string }).purpose;

    if (!email || !isValidOtpPurpose(purpose)) {
      return errorResponse('Email and a valid OTP purpose are required.', 400);
    }

    const db = createSupabaseAdminClient();
    if (purpose === 'register') {
      const { data: existingUser } = await db
        .from('app_users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        return errorResponse('An account with this email already exists.', 409);
      }
    }

    if (purpose === 'login') {
      const { data: user } = await db
        .from('app_users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (!user) {
        return errorResponse('No account found for this email.', 404);
      }
    }

    if (!hasResendConfig()) {
      try {
        await sendSupabaseOtp(email, purpose);
        return json({
          message: 'OTP sent to your email.',
          delivery: 'email',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send OTP email.';
        return errorResponse(message, otpSendErrorStatus(message));
      }
    }

    const otp = await createOtp(db, email, purpose);

    try {
      await sendOtpEmail(email, purpose, otp);

      return json({
        message: 'OTP sent to your email.',
        delivery: 'email',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP email.';

      if (isResendDomainRestriction(message) || isRateLimitedError(message)) {
        try {
          // Resend rejected delivery, so use Supabase OTP and remove local OTP record.
          await db
            .from('email_otps')
            .delete()
            .eq('email', email)
            .eq('purpose', purpose)
            .is('consumed_at', null);

          await sendSupabaseOtp(email, purpose);

          return json({
            message: 'OTP sent to your email.',
            delivery: 'email',
          });
        } catch (fallbackError) {
          const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : 'Failed to send OTP email.';
          return errorResponse(humanizeOtpProviderError(fallbackMessage), otpSendErrorStatus(fallbackMessage));
        }
      }

      // Remove generated OTP if delivery fails so users cannot verify a code they never received.
      await db
        .from('email_otps')
        .delete()
        .eq('email', email)
        .eq('purpose', purpose)
        .is('consumed_at', null);

      return errorResponse(humanizeOtpProviderError(message), otpSendErrorStatus(message));
    }
  }

  if (action === 'verify-otp' && request.method === 'POST') {
    const email = String((body as { email?: string }).email ?? '').trim().toLowerCase();
    const otp = String((body as { otp?: string }).otp ?? '').trim();
    const purpose = (body as { purpose?: string }).purpose;

    if (!email || !otp || !isValidOtpPurpose(purpose)) {
      return errorResponse('Email, OTP, and valid purpose are required.', 400);
    }

    const db = createSupabaseAdminClient();
    let locallyVerified = false;
    let localErrorMessage = 'Invalid OTP code.';
    let localErrorStatus = 400;

    try {
      const otpResult = await consumeOtp(db, email, purpose, otp);
      if (otpResult.ok) {
        locallyVerified = true;
      } else {
        localErrorMessage = otpResult.error ?? localErrorMessage;
        localErrorStatus = otpResult.status ?? localErrorStatus;
      }
    } catch (error) {
      localErrorMessage = error instanceof Error ? error.message : localErrorMessage;
    }

    if (!locallyVerified) {
      try {
        await verifySupabaseOtp(email, otp);
      } catch {
        return errorResponse(localErrorMessage, localErrorStatus);
      }
    }

    if (purpose === 'register') {
      const password = String((body as { password?: string }).password ?? '');
      const username = String((body as { username?: string }).username ?? '').trim();

      if (!password || !username) {
        return errorResponse('Username and password are required for registration.', 400);
      }

      const { data: existingUser } = await db
        .from('app_users')
        .select('id')
        .or(`email.eq.${email},username.eq.${username}`)
        .maybeSingle();

      if (existingUser) {
        return errorResponse('An account with that email or username already exists.', 409);
      }

      const passwordHash = await hashPassword(password);
      const timestamp = new Date().toISOString();
      const { data: insertedUser, error } = await db
        .from('app_users')
        .insert({
          email,
          username,
          password_hash: passwordHash,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select('*')
        .single<AppUserRow>();

      if (error || !insertedUser) {
        return errorResponse(humanizeDbError(error?.message), dbErrorStatus(error?.message));
      }

      const token = await createSession(db, insertedUser.id);
      return json({ user: toUserPayload(insertedUser), token, refreshToken: token });
    }

    const { data: existingUser, error: existingUserError } = await db
      .from('app_users')
      .select('*')
      .eq('email', email)
      .maybeSingle<AppUserRow>();

    if (existingUserError || !existingUser) {
      return errorResponse('No account found for this email.', 404);
    }

    const token = await createSession(db, existingUser.id);
    return json({ user: toUserPayload(existingUser), token, refreshToken: token });
  }

  if (action === 'register' && request.method === 'POST') {
    const email = String((body as { email?: string }).email ?? '').trim().toLowerCase();
    const password = String((body as { password?: string }).password ?? '');
    const username = String((body as { username?: string }).username ?? '').trim();

    if (!email || !password || !username) {
      return errorResponse('Email, username, and password are required.', 400);
    }

    const db = createSupabaseAdminClient();
    const { data: existingUser } = await db
      .from('app_users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existingUser) {
      return errorResponse('An account with that email or username already exists.', 409);
    }

    const passwordHash = await hashPassword(password);
    const timestamp = new Date().toISOString();
    const { data: insertedUser, error } = await db
      .from('app_users')
      .insert({
        email,
        username,
        password_hash: passwordHash,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select('*')
      .single<AppUserRow>();

    if (error || !insertedUser) {
      return errorResponse(humanizeDbError(error?.message), dbErrorStatus(error?.message));
    }

    const token = await createSession(db, insertedUser.id);
    return json({ user: toUserPayload(insertedUser), token, refreshToken: token });
  }

  if (action === 'login' && request.method === 'POST') {
    const email = String((body as { email?: string }).email ?? '').trim().toLowerCase();
    const password = String((body as { password?: string }).password ?? '');

    if (!email || !password) {
      return errorResponse('Email and password are required.', 400);
    }

    const db = createSupabaseAdminClient();
    const { data: user, error } = await db
      .from('app_users')
      .select('*')
      .eq('email', email)
      .maybeSingle<AppUserRow>();

    if (error || !user) {
      return errorResponse('Invalid email or password.', 401);
    }

    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      return errorResponse('Invalid email or password.', 401);
    }

    const token = await createSession(db, user.id);
    return json({ user: toUserPayload(user), token, refreshToken: token });
  }

  if (action === 'me' && request.method === 'GET') {
    try {
      const { user } = await requireAuthenticatedUser(request);
      return json(toUserPayload(user));
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }

      return errorResponse('Unauthorized', 401);
    }
  }

  if (action === 'refresh' && request.method === 'POST') {
    try {
      const authContext = await requireAuthenticatedUser(request);
      await revokeSession(authContext.db, authContext.token);
      const token = await createSession(authContext.db, authContext.user.id);
      return json({ token });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }

      return errorResponse('Unauthorized', 401);
    }
  }

  if (action === 'logout' && request.method === 'POST') {
    try {
      const authContext = await requireAuthenticatedUser(request);
      await revokeSession(authContext.db, authContext.token);
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }

      return errorResponse('Unauthorized', 401);
    }
  }

  return errorResponse('Not found', 404);
}

async function handleNotes(request: NextRequest, segments: string[]) {
  const authContext = await requireAuthenticatedUser(request);
  const db = authContext.db;
  const noteId = segments[1];

  if (!noteId && request.method === 'GET') {
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') ?? url.searchParams.get('q') ?? '').trim();
    const tags = url.searchParams.getAll('tags').flatMap((entry) => entry.split(',')).map((tag) => tag.trim()).filter(Boolean);
    let notes = await getAllNotes(db, authContext.user.id);

    if (search) {
      const lowerSearch = search.toLowerCase();
      notes = notes.filter((note) =>
        note.title.toLowerCase().includes(lowerSearch) || note.content.toLowerCase().includes(lowerSearch)
      );
    }

    if (tags.length > 0) {
      notes = notes.filter((note) => tags.every((tag) => note.tags.includes(tag)));
    }

    return json(notes);
  }

  if (!noteId && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const title = String((body as { title?: string }).title ?? '').trim();
    const content = String((body as { content?: string }).content ?? '').trim();
    const tags = Array.isArray((body as { tags?: string[] }).tags) ? (body as { tags?: string[] }).tags ?? [] : [];

    if (!title || !content) {
      return errorResponse('Title and content are required.', 400);
    }

    const timestamp = new Date().toISOString();
    const { data: insertedNote, error } = await db
      .from('notes')
      .insert({
        user_id: authContext.user.id,
        title,
        content,
        tags,
        is_shared: false,
        shared_with: [],
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select('*')
      .single<NoteRow>();

    if (error || !insertedNote) {
      return errorResponse(humanizeDbError(error?.message), dbErrorStatus(error?.message));
    }

    return json(toNote(insertedNote), { status: 201 });
  }

  if (noteId && segments.length === 2 && request.method === 'GET') {
    const { data: note, error } = await db
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .maybeSingle<NoteRow>();

    if (error || !note) {
      return errorResponse('Note not found.', 404);
    }

    const isOwner = note.user_id === authContext.user.id;
    const isShared = (note.shared_with ?? []).includes(authContext.user.id);
    if (!isOwner && !isShared) {
      return errorResponse('Forbidden', 403);
    }

    return json(toNote(note));
  }

  if (noteId && segments.length === 2 && request.method === 'PUT') {
    const { data: note, error: noteError } = await db
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<NoteRow>();

    if (noteError || !note) {
      return errorResponse('Note not found.', 404);
    }

    const body = await request.json().catch(() => ({}));
    const nextTitle = (body as { title?: string }).title ?? note.title;
    const nextContent = (body as { content?: string }).content ?? note.content;
    const nextTags = Array.isArray((body as { tags?: string[] }).tags) ? (body as { tags?: string[] }).tags ?? note.tags ?? [] : note.tags ?? [];

    if (nextContent !== note.content) {
      const { error: versionError } = await db.from('note_versions').insert({
        note_id: note.id,
        content: note.content,
        created_by: authContext.user.id,
      });

      if (versionError) {
        return errorResponse(humanizeDbError(versionError.message), dbErrorStatus(versionError.message));
      }
    }

    const { data: updatedNote, error: updateError } = await db
      .from('notes')
      .update({
        title: String(nextTitle).trim(),
        content: String(nextContent).trim(),
        tags: nextTags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select('*')
      .single<NoteRow>();

    if (updateError || !updatedNote) {
      return errorResponse(humanizeDbError(updateError?.message), dbErrorStatus(updateError?.message));
    }

    return json(toNote(updatedNote));
  }

  if (noteId && segments.length === 2 && request.method === 'DELETE') {
    const { error } = await db.from('notes').delete().eq('id', noteId).eq('user_id', authContext.user.id);
    if (error) {
      return errorResponse(humanizeDbError(error.message), dbErrorStatus(error.message));
    }

    return new NextResponse(null, { status: 204 });
  }

  if (noteId && segments[2] === 'share' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const userIds = Array.isArray((body as { userIds?: string[] }).userIds)
      ? [...new Set((body as { userIds?: string[] }).userIds ?? [])]
      : [];

    const { data: note, error: noteError } = await db
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<NoteRow>();

    if (noteError || !note) {
      return errorResponse('Note not found.', 404);
    }

    const sharedWith = [...new Set([...(note.shared_with ?? []), ...userIds])];
    const { data: updatedNote, error: updateError } = await db
      .from('notes')
      .update({
        is_shared: true,
        shared_with: sharedWith,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select('*')
      .single<NoteRow>();

    if (updateError || !updatedNote) {
      return errorResponse(humanizeDbError(updateError?.message), dbErrorStatus(updateError?.message));
    }

    return json(toNote(updatedNote));
  }

  if (noteId && segments[2] === 'versions' && request.method === 'GET') {
    const { data: versions, error } = await db
      .from('note_versions')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false });

    if (error) {
      return errorResponse(humanizeDbError(error.message), dbErrorStatus(error.message));
    }

    return json((versions ?? []).map(toNoteVersion));
  }

  if (noteId && segments[2] === 'restore' && segments[3] && request.method === 'POST') {
    const versionId = segments[3];

    const { data: note, error: noteError } = await db
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<NoteRow>();

    if (noteError || !note) {
      return errorResponse('Note not found.', 404);
    }

    const { data: version, error: versionError } = await db
      .from('note_versions')
      .select('*')
      .eq('id', versionId)
      .eq('note_id', noteId)
      .maybeSingle<NoteVersionRow>();

    if (versionError || !version) {
      return errorResponse('Version not found.', 404);
    }

    const { error: createVersionError } = await db.from('note_versions').insert({
      note_id: note.id,
      content: note.content,
      created_by: authContext.user.id,
    });

    if (createVersionError) {
      return errorResponse(humanizeDbError(createVersionError.message), dbErrorStatus(createVersionError.message));
    }

    const { data: updatedNote, error: updateError } = await db
      .from('notes')
      .update({
        content: version.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select('*')
      .single<NoteRow>();

    if (updateError || !updatedNote) {
      return errorResponse(humanizeDbError(updateError?.message), dbErrorStatus(updateError?.message));
    }

    return json(toNote(updatedNote));
  }

  return errorResponse('Not found', 404);
}

async function handleFlashcards(request: NextRequest, segments: string[]) {
  const authContext = await requireAuthenticatedUser(request);
  const db = authContext.db;
  const url = new URL(request.url);

  if (segments[1] === 'decks' && segments.length === 2 && request.method === 'GET') {
    return json(await getDecksWithCards(db, authContext.user.id));
  }

  if (segments[1] === 'decks' && segments.length === 2 && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const title = String((body as { title?: string }).title ?? '').trim();
    const description = String((body as { description?: string }).description ?? '').trim();

    if (!title) {
      return errorResponse('Title is required.', 400);
    }

    const timestamp = new Date().toISOString();
    const { data: deck, error } = await db
      .from('flashcard_decks')
      .insert({
        user_id: authContext.user.id,
        title,
        description: description || null,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select('*')
      .single<FlashcardDeckRow>();

    if (error || !deck) {
      return errorResponse(error?.message ?? 'Failed to create deck.', 500);
    }

    const createdDeck = await getDeckById(db, authContext.user.id, deck.id);
    if (!createdDeck) {
      return errorResponse('Deck not found.', 404);
    }

    return json(createdDeck, { status: 201 });
  }

  if (segments[1] === 'decks' && segments[2] && segments.length === 3 && request.method === 'GET') {
    const deck = await getDeckById(db, authContext.user.id, segments[2]);
    if (!deck) {
      return errorResponse('Deck not found.', 404);
    }

    return json(deck);
  }

  if (segments[1] === 'decks' && segments[2] && segments.length === 3 && request.method === 'PUT') {
    const body = await request.json().catch(() => ({}));
    const { data: existingDeck, error: deckError } = await db
      .from('flashcard_decks')
      .select('*')
      .eq('id', segments[2])
      .eq('user_id', authContext.user.id)
      .maybeSingle<FlashcardDeckRow>();

    if (deckError || !existingDeck) {
      return errorResponse('Deck not found.', 404);
    }

    const { data: updatedDeck, error: updateError } = await db
      .from('flashcard_decks')
      .update({
        title: String((body as { title?: string }).title ?? existingDeck.title).trim(),
        description: (body as { description?: string | null }).description ?? existingDeck.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', segments[2])
      .select('*')
      .single<FlashcardDeckRow>();

    if (updateError || !updatedDeck) {
      return errorResponse(updateError?.message ?? 'Failed to update deck.', 500);
    }

    const deck = await getDeckById(db, authContext.user.id, updatedDeck.id);
    if (!deck) {
      return errorResponse('Deck not found.', 404);
    }

    return json(deck);
  }

  if (segments[1] === 'decks' && segments[2] && segments.length === 3 && request.method === 'DELETE') {
    const { error } = await db.from('flashcard_decks').delete().eq('id', segments[2]).eq('user_id', authContext.user.id);
    if (error) {
      return errorResponse(error.message, 500);
    }

    return new NextResponse(null, { status: 204 });
  }

  if (segments[1] === 'decks' && segments[2] && segments[3] === 'cards' && segments.length === 4 && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const deckId = segments[2];
    const { data: deck, error: deckError } = await db
      .from('flashcard_decks')
      .select('*')
      .eq('id', deckId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<FlashcardDeckRow>();

    if (deckError || !deck) {
      return errorResponse('Deck not found.', 404);
    }

    const front = String((body as { front?: string }).front ?? '').trim();
    const back = String((body as { back?: string }).back ?? '').trim();
    const difficulty = ((body as { difficulty?: 'easy' | 'medium' | 'hard' }).difficulty ?? 'easy') as 'easy' | 'medium' | 'hard';

    if (!front || !back) {
      return errorResponse('Front and back are required.', 400);
    }

    const { data: card, error } = await db
      .from('flashcards')
      .insert({
        deck_id: deckId,
        front,
        back,
        difficulty,
        review_count: 0,
      })
      .select('*')
      .single<FlashcardRow>();

    if (error || !card) {
      return errorResponse(error?.message ?? 'Failed to add card.', 500);
    }

    return json(toFlashcard(card), { status: 201 });
  }

  if (segments[1] === 'decks' && segments[2] && segments[3] === 'cards' && segments[4] && segments.length === 5 && request.method === 'PUT') {
    const body = await request.json().catch(() => ({}));
    const { data: card, error: cardError } = await db
      .from('flashcards')
      .select('*')
      .eq('id', segments[4])
      .eq('deck_id', segments[2])
      .maybeSingle<FlashcardRow>();

    if (cardError || !card) {
      return errorResponse('Card not found.', 404);
    }

    const { data: updatedCard, error: updateError } = await db
      .from('flashcards')
      .update({
        front: String((body as { front?: string }).front ?? card.front).trim(),
        back: String((body as { back?: string }).back ?? card.back).trim(),
        difficulty: ((body as { difficulty?: 'easy' | 'medium' | 'hard' }).difficulty ?? card.difficulty) as 'easy' | 'medium' | 'hard',
      })
      .eq('id', segments[4])
      .select('*')
      .single<FlashcardRow>();

    if (updateError || !updatedCard) {
      return errorResponse(updateError?.message ?? 'Failed to update card.', 500);
    }

    return json(toFlashcard(updatedCard));
  }

  if (segments[1] === 'decks' && segments[2] && segments[3] === 'cards' && segments[4] && segments.length === 5 && request.method === 'DELETE') {
    const { error } = await db.from('flashcards').delete().eq('id', segments[4]).eq('deck_id', segments[2]);
    if (error) {
      return errorResponse(error.message, 500);
    }

    return new NextResponse(null, { status: 204 });
  }

  if (segments[1] === 'sessions' && segments.length === 2 && request.method === 'GET') {
    const deckIdFilter = (url.searchParams.get('deckId') ?? '').trim();
    let query = db
      .from('study_sessions')
      .select('*')
      .eq('user_id', authContext.user.id)
      .order('started_at', { ascending: false });

    if (deckIdFilter) {
      query = query.eq('deck_id', deckIdFilter);
    }

    const { data: sessions, error } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return json((sessions ?? []).map(toStudySession));
  }

  if (segments[1] === 'sessions' && segments.length === 2 && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const deckId = String((body as { deckId?: string }).deckId ?? '');

    if (!deckId) {
      return errorResponse('Deck ID is required.', 400);
    }

    const { data: deck, error: deckError } = await db
      .from('flashcard_decks')
      .select('id')
      .eq('id', deckId)
      .eq('user_id', authContext.user.id)
      .maybeSingle();

    if (deckError || !deck) {
      return errorResponse('Deck not found.', 404);
    }

    const { count: cardCount } = await db.from('flashcards').select('*', { count: 'exact', head: true }).eq('deck_id', deckId);
    const { data: session, error } = await db
      .from('study_sessions')
      .insert({
        user_id: authContext.user.id,
        deck_id: deckId,
        cards_studied: 0,
        correct_answers: 0,
        started_at: new Date().toISOString(),
      })
      .select('*')
      .single<StudySessionRow>();

    if (error || !session) {
      return errorResponse(error?.message ?? 'Failed to start study session.', 500);
    }

    return json({ ...toStudySession(session), cardsStudied: cardCount ?? 0 }, { status: 201 });
  }

  if (segments[1] === 'sessions' && segments[2] && segments[3] === 'complete' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const correctAnswers = Number((body as { correctAnswers?: number }).correctAnswers ?? 0);

    const { data: session, error: sessionError } = await db
      .from('study_sessions')
      .select('*')
      .eq('id', segments[2])
      .eq('user_id', authContext.user.id)
      .maybeSingle<StudySessionRow>();

    if (sessionError || !session) {
      return errorResponse('Study session not found.', 404);
    }

    const { count: cardCount } = await db.from('flashcards').select('*', { count: 'exact', head: true }).eq('deck_id', session.deck_id);
    const { data: updatedSession, error: updateError } = await db
      .from('study_sessions')
      .update({
        cards_studied: cardCount ?? session.cards_studied,
        correct_answers: Number.isFinite(correctAnswers) ? correctAnswers : session.correct_answers,
        ended_at: new Date().toISOString(),
      })
      .eq('id', session.id)
      .select('*')
      .single<StudySessionRow>();

    if (updateError || !updatedSession) {
      return errorResponse(updateError?.message ?? 'Failed to complete study session.', 500);
    }

    return json(toStudySession(updatedSession));
  }

  return errorResponse('Not found', 404);
}

async function handleMeetings(request: NextRequest, segments: string[]) {
  const authContext = await requireAuthenticatedUser(request);
  const db = authContext.db;

  if (segments.length === 1 && request.method === 'GET') {
    const { data: meetings, error } = await db
      .from('meetings')
      .select('*')
      .eq('user_id', authContext.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      return errorResponse(error.message, 500);
    }

    return json((meetings ?? []).map(toMeeting));
  }

  if (segments.length === 1 && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const title = String((body as { title?: string }).title ?? '').trim();
    const transcript = String((body as { transcript?: string }).transcript ?? '').trim();
    const recordingUrl = String((body as { recordingUrl?: string }).recordingUrl ?? '').trim();
    const duration = Number((body as { duration?: number }).duration ?? 0);

    if (!title) {
      return errorResponse('Title is required.', 400);
    }

    const timestamp = new Date().toISOString();
    const { data: meeting, error } = await db
      .from('meetings')
      .insert({
        user_id: authContext.user.id,
        title,
        transcript,
        ai_notes: '',
        recording_url: recordingUrl || null,
        duration: Number.isFinite(duration) ? duration : 0,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select('*')
      .single<MeetingRow>();

    if (error || !meeting) {
      return errorResponse(error?.message ?? 'Failed to create meeting.', 500);
    }

    return json(toMeeting(meeting), { status: 201 });
  }

  const meetingId = segments[1];
  if (meetingId && segments.length === 2 && request.method === 'GET') {
    const meeting = await getMeetingById(db, authContext.user.id, meetingId);
    if (!meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    return json(meeting);
  }

  if (meetingId && segments.length === 2 && request.method === 'PUT') {
    const body = await request.json().catch(() => ({}));
    const { data: existingMeeting, error: existingError } = await db
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<MeetingRow>();

    if (existingError || !existingMeeting) {
      return errorResponse('Meeting not found.', 404);
    }

    const { data: updatedMeeting, error: updateError } = await db
      .from('meetings')
      .update({
        title: String((body as { title?: string }).title ?? existingMeeting.title).trim(),
        ai_notes: String((body as { aiNotes?: string; ai_notes?: string }).aiNotes ?? (body as { aiNotes?: string; ai_notes?: string }).ai_notes ?? existingMeeting.ai_notes ?? ''),
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)
      .select('*')
      .single<MeetingRow>();

    if (updateError || !updatedMeeting) {
      return errorResponse(updateError?.message ?? 'Failed to update meeting.', 500);
    }

    return json(toMeeting(updatedMeeting));
  }

  if (meetingId && segments.length === 2 && request.method === 'DELETE') {
    const { error } = await db.from('meetings').delete().eq('id', meetingId).eq('user_id', authContext.user.id);
    if (error) {
      return errorResponse(error.message, 500);
    }

    return new NextResponse(null, { status: 204 });
  }

  if (meetingId && segments[2] === 'generate-notes' && request.method === 'POST') {
    const meeting = await getMeetingById(db, authContext.user.id, meetingId);
    if (!meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    const summary = buildSummary(meeting.transcript || meeting.title);
    const keyPoints = extractKeywords(meeting.transcript || meeting.title, 5);
    const actionItems = keyPoints.map((point) => `Review ${point}`);
    const tags = keyPoints.slice(0, 4);
    const notes = `${summary}\n\nKey points:\n- ${keyPoints.join('\n- ')}\n\nAction items:\n- ${actionItems.join('\n- ')}`;

    const { data: updatedMeeting, error } = await db
      .from('meetings')
      .update({
        ai_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)
      .select('*')
      .single<MeetingRow>();

    if (error || !updatedMeeting) {
      return errorResponse(error?.message ?? 'Failed to generate meeting notes.', 500);
    }

    return json({ summary, keyPoints, actionItems, tags });
  }

  if (meetingId && segments[2] === 'upload' && request.method === 'POST') {
    const formData = await request.formData();
    const recording = formData.get('recording');

    if (!(recording instanceof File)) {
      return errorResponse('Recording file is required.', 400);
    }

    const recordingUrl = `/uploads/${meetingId}/${recording.name}`;
    const { error } = await db
      .from('meetings')
      .update({
        recording_url: recordingUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)
      .eq('user_id', authContext.user.id);

    if (error) {
      return errorResponse(error.message, 500);
    }

    return json({ recordingUrl });
  }

  return errorResponse('Not found', 404);
}

async function handleSearch(request: NextRequest, segments: string[]) {
  const authContext = await requireAuthenticatedUser(request);
  const db = authContext.db;
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();

  if (!query) {
    return json([]);
  }

  const [notes, decks, meetings] = await Promise.all([
    getAllNotes(db, authContext.user.id),
    getDecksWithCards(db, authContext.user.id),
    db.from('meetings').select('*').eq('user_id', authContext.user.id).order('updated_at', { ascending: false }),
  ]);

  const matchingNotes = notes.filter((note: { title: string; content: string; tags: string[] }) =>
    [note.title, note.content, note.tags.join(' ')].join(' ').toLowerCase().includes(query)
  );

  const matchingDecks = decks.filter((deck: { title: string; description?: string; cards: Array<{ front: string; back: string }> }) =>
    [deck.title, deck.description ?? '', deck.cards.map((card: { front: string; back: string }) => `${card.front} ${card.back}`).join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(query)
  );

  if (segments[1] === 'notes') {
    return json(matchingNotes);
  }

  if (segments[1] === 'flashcards') {
    return json(matchingDecks);
  }

  if (segments[1] === 'meetings') {
    if (meetings.error) {
      return errorResponse(meetings.error.message, 500);
    }

    const meetingItems = ((meetings.data ?? []) as MeetingRow[]).map(toMeeting);
    return json(meetingItems.filter((meeting: { title: string; transcript: string; aiNotes: string }) =>
      [meeting.title, meeting.transcript, meeting.aiNotes].join(' ').toLowerCase().includes(query)));
  }

  if (segments[1] === 'global') {
    if (meetings.error) {
      return errorResponse(meetings.error.message, 500);
    }

    const matchingMeetings = ((meetings.data ?? []) as MeetingRow[])
      .map(toMeeting)
      .filter((meeting: { title: string; transcript: string; aiNotes: string }) =>
        [meeting.title, meeting.transcript, meeting.aiNotes].join(' ').toLowerCase().includes(query));

    return json({
      notes: matchingNotes,
      flashcards: matchingDecks,
      meetings: matchingMeetings,
    });
  }

  return errorResponse('Not found', 404);
}

async function handleAi(request: NextRequest, segments: string[]) {
  const authContext = await requireAuthenticatedUser(request);
  const db = authContext.db;

  if (segments[1] === 'notes' && segments[3] === 'summarize' && request.method === 'POST') {
    const noteId = segments[2];
    const { data: note, error } = await db
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<NoteRow>();

    if (error || !note) {
      return errorResponse('Note not found.', 404);
    }

    return json({ summary: buildSummary(note.content) });
  }

  if (segments[1] === 'notes' && segments[3] === 'generate-flashcards' && request.method === 'POST') {
    const noteId = segments[2];
    const body = await request.json().catch(() => ({}));
    const count = Math.max(1, Number((body as { count?: number }).count ?? 10));
    const { data: note, error } = await db
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<NoteRow>();

    if (error || !note) {
      return errorResponse('Note not found.', 404);
    }

    return json(buildFlashcardsFromText(note.content, count));
  }

  if (segments[1] === 'meetings' && segments[3] === 'generate-notes' && request.method === 'POST') {
    const meetingId = segments[2];
    const { data: meeting, error } = await db
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .eq('user_id', authContext.user.id)
      .maybeSingle<MeetingRow>();

    if (error || !meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    const notes = buildSummary(meeting.transcript || meeting.title);
    return json({ notes });
  }

  if (segments[1] === 'ask' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const context = String((body as { context?: string }).context ?? '').trim();
    const question = String((body as { question?: string }).question ?? '').trim();

    if (!context || !question) {
      return errorResponse('Context and question are required.', 400);
    }

    const answer = `${buildSummary(context)} Based on that context, the answer to "${question}" is most likely the main idea above.`;
    return json({ answer });
  }

  return errorResponse('Not found', 404);
}

async function handleRequest(request: NextRequest, context: RouteContext) {
  const segments = await parseSegments(context);

  if (segments[0] === 'auth') {
    return handleAuth(request, segments);
  }

  if (segments[0] === 'notes') {
    return handleNotes(request, segments);
  }

  if (segments[0] === 'flashcards') {
    return handleFlashcards(request, segments);
  }

  if (segments[0] === 'meetings') {
    return handleMeetings(request, segments);
  }

  if (segments[0] === 'search') {
    return handleSearch(request, segments);
  }

  if (segments[0] === 'ai') {
    return handleAi(request, segments);
  }

  return errorResponse('Not found', 404);
}

export function GET(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
