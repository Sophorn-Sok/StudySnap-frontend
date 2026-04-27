# StudySnap Frontend

## Setup

1. Install dependencies
   npm install

2. Create local env file
   Copy `.env.example` to `.env.local` and fill in your values.

3. Required Supabase variables
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

4. Optional OTP email variables (Resend)
   - RESEND_API_KEY
   - OTP_FROM_EMAIL

5. Meeting AI summary backend (Vertex-backed)
   - STUDY_BACKEND_URL (recommended): Public backend URL that serves `/api/study/generate`.
   - BACKEND_API_URL (fallback alias)
   - NEXT_PUBLIC_STUDY_BACKEND_URL (fallback alias)

By default, meeting summary generation now requires the Vertex-backed backend path.
If you intentionally want local non-Vertex fallback, set:
   - MEETING_NOTES_ALLOW_LOCAL_FALLBACK=true

If Resend variables are not configured, OTP delivery falls back to Supabase email OTP.

## Run locally

npm run dev

## Build

npm run build
