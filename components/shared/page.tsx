'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  ExternalLink,
  Search,
  Share2,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useNotesStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { getRelativeTime } from '@/utils/helpers';

type ShareTargetInput = Record<string, string>;

function shortenId(value: string) {
  if (!value) return 'Unknown';
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export default function SharingPage() {
  const { user } = useAuth();
  const {
    notes,
    isLoading,
    error,
    fetchNotes,
    shareNote,
  } = useNotesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [shareTargets, setShareTargets] = useState<ShareTargetInput>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  const ownedSharedNotes = useMemo(
    () => notes.filter((note) => note.userId === user?.id && note.isShared),
    [notes, user?.id]
  );

  const notesSharedWithMe = useMemo(
    () =>
      notes.filter(
        (note) => note.userId !== user?.id && (note.sharedWith ?? []).includes(user?.id ?? '')
      ),
    [notes, user?.id]
  );

  const allSharedNotes = useMemo(
    () => [...ownedSharedNotes, ...notesSharedWithMe],
    [ownedSharedNotes, notesSharedWithMe]
  );

  const filteredSharedNotes = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return allSharedNotes;
    }

    return allSharedNotes.filter((note) => {
      const searchable = [
        note.title,
        note.content,
        ...(note.tags ?? []),
        note.userId,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalized);
    });
  }, [allSharedNotes, searchQuery]);

  const activityFeed = useMemo(
    () =>
      [...allSharedNotes]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [allSharedNotes]
  );

  const totalCollaborators = useMemo(() => {
    const collaborators = new Set<string>();
    for (const note of ownedSharedNotes) {
      for (const id of note.sharedWith ?? []) {
        collaborators.add(id);
      }
    }
    return collaborators.size;
  }, [ownedSharedNotes]);

  const handleShareNote = async (noteId: string) => {
    const raw = (shareTargets[noteId] ?? '').trim();
    if (!raw) {
      setLocalError('Enter at least one user ID to share this note.');
      return;
    }

    const userIds = raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (userIds.length === 0) {
      setLocalError('Enter valid user IDs separated by commas.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);
    setFeedback(null);

    try {
      await shareNote(noteId, userIds);
      setShareTargets((current) => ({ ...current, [noteId]: '' }));
      setFeedback('Note shared successfully.');
    } catch (shareError) {
      setLocalError((shareError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shared</h1>
          <p className="mt-2 text-gray-500">Collaborate on notes using your Supabase sharing schema.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="bg-white text-gray-700">
            <UserPlus className="h-4 w-4" />
            Invite by User ID
          </Button>
          <Link href="/notes">
            <Button variant="primary">
              <Share2 className="h-4 w-4" />
              Open Notes
            </Button>
          </Link>
        </div>
      </div>

      {(error || localError) && <p className="text-sm text-red-600">{localError ?? error}</p>}
      {feedback && <p className="text-sm text-emerald-600">{feedback}</p>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Shared by You</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{ownedSharedNotes.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Shared With You</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{notesSharedWithMe.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unique Collaborators</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalCollaborators}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search shared notes..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4">Access</th>
                <th className="px-6 py-4">Shared With</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Loading shared notes...
                  </td>
                </tr>
              ) : filteredSharedNotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No shared notes found.
                  </td>
                </tr>
              ) : (
                filteredSharedNotes.map((note) => {
                  const isOwner = note.userId === user?.id;
                  const access = isOwner ? 'Owner' : 'Shared';
                  return (
                    <tr key={note.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{note.title}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {isOwner ? 'You' : shortenId(note.userId)}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{getRelativeTime(note.updatedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                          isOwner ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {access}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {(note.sharedWith ?? []).length}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/notes" className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600">
                          Open <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 text-gray-900">
            <Users className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold">Share Your Notes</h2>
          </div>

          {ownedSharedNotes.length === 0 ? (
            <p className="text-sm text-gray-500">
              You have no shared notes yet. Go to Notes to create content, then share by user ID below.
            </p>
          ) : (
            <div className="space-y-4">
              {ownedSharedNotes.slice(0, 4).map((note) => (
                <div key={note.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-900">{note.title}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={shareTargets[note.id] ?? ''}
                      onChange={(event) =>
                        setShareTargets((current) => ({
                          ...current,
                          [note.id]: event.target.value,
                        }))
                      }
                      placeholder="User IDs (comma separated)"
                      className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    />
                    <Button
                      variant="primary"
                      className="h-10 justify-center"
                      isLoading={isSubmitting}
                      onClick={() => void handleShareNote(note.id)}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">Activity Feed</h2>
          {activityFeed.length === 0 ? (
            <p className="text-sm text-gray-500">No sharing activity yet.</p>
          ) : (
            <div className="space-y-4">
              {activityFeed.map((note) => {
                const isOwner = note.userId === user?.id;
                return (
                  <div key={note.id} className="flex gap-3">
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                    <div>
                      <p className="text-sm text-gray-700">
                        {isOwner ? 'You' : shortenId(note.userId)} updated shared note{' '}
                        <span className="font-semibold text-gray-900">{note.title}</span>
                      </p>
                      <p className="text-xs text-gray-400">{getRelativeTime(note.updatedAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
