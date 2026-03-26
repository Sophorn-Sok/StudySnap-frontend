# StudySnap Frontend - Project Structure Guide

## 📁 Folder Structure Overview

This is a **feature-based, scalable Next.js 14 frontend** architecture optimized for the StudySnap SRS.

### Root Directories

```
studysnap-frontend/
├── app/                    # Next.js App Router pages & layouts
├── components/             # Reusable UI components (shared across features)
├── features/              # Feature modules (core business logic)
├── hooks/                 # Global custom hooks
├── lib/                   # External library configuration (Firebase, OpenAI, etc.)
├── services/              # API client & global services
├── store/                 # State management (Zustand)
├── types/                 # Global TypeScript types
├── utils/                 # Utility functions & helpers
└── styles/               # Global CSS & Tailwind configuration
```

---

## 📂 Directory Details

### 1. `app/` - Pages & Routing (Next.js App Router)

The main entry point for your application. Uses Next.js 14 App Router.

```
app/
├── layout.tsx              # Root layout wrapper
├── page.tsx               # Landing page
├── globals.css            # Global styles

├── (auth)/               # Auth route group (public)
│   ├── login/page.tsx
│   └── register/page.tsx

├── dashboard/            # Main dashboard
├── notes/               # Notes feature
│   ├── page.tsx         # List all notes
│   ├── new/page.tsx     # Create new note
│   └── [noteId]/page.tsx # View/edit specific note

├── flashcards/          # Flashcards feature
│   ├── page.tsx         # List decks
│   ├── [deckId]/page.tsx # Study deck
│   └── study/page.tsx   # Study mode

├── meetings/            # Meetings feature
│   ├── page.tsx         # List meetings
│   └── [meetingId]/page.tsx # View meeting transcript & AI notes

└── settings/           # User settings
```

**Key Points:**
- Route groups like `(auth)` don't affect URL structure
- Dynamic routes use `[id]` for individual items
- Each page is a server component by default (add `'use client'` for interactive components)

---

### 2. `features/` - Feature Modules (CORE LOGIC)

Each feature is **self-contained** with its own:
- Components
- Custom hooks
- Services (API wrappers)
- Types
- Business logic

```
features/
├── auth/
│   ├── components/          # LoginForm, RegisterForm, etc.
│   ├── hooks/              # useAuthForm
│   ├── services/           # authService
│   └── types.ts            # AuthContextType, etc.

├── notes/
│   ├── components/         # NoteEditor, NoteCard, Toolbar
│   ├── hooks/             # useNotesList, useNoteEditor
│   ├── services/          # notesService
│   └── types.ts           # NoteFilters, NoteContextType

├── flashcards/
│   ├── components/        # DeckCard, StudyMode, CardEditor
│   ├── hooks/            # useFlashcardDecks
│   ├── services/         # flashcardsService
│   └── types.ts

├── meetings/
│   ├── components/       # TranscriptViewer, AINotesDisplay
│   ├── hooks/           # useMeetingHistory
│   ├── services/        # meetingsService
│   └── types.ts

├── ai/
│   ├── components/      # AIPromptInput, AISummary
│   ├── services/       # aiService
│   └── types.ts

└── search/
    ├── components/     # SearchBar, SearchResults
    ├── hooks/         # useSearch
    └── services/      # searchService
```

**Why Feature-Based?**
- ✅ Easy to scale - add new features without affecting existing code
- ✅ Encapsulation - each feature owns its logic
- ✅ Reusable - feature services can be imported anywhere
- ✅ Testable - isolated feature units are easier to test

---

### 3. `components/` - Reusable UI Components

Shared UI building blocks used across all features.

```
components/
├── ui/                  # Base UI components
│   ├── Button.tsx      # Reusable button with variants
│   ├── Input.tsx       # Form input
│   ├── Modal.tsx       # Modal dialog
│   └── ...

├── layout/             # Layout components
│   ├── DashboardLayout.tsx  # Main dashboard wrapper
│   ├── Navbar.tsx          # Top navigation bar
│   └── Sidebar.tsx         # Side navigation

└── common/            # Common utility components
    ├── LoadingSpinner.tsx
    ├── EmptyState.tsx
    └── ...
```

**Usage Example:**
```tsx
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NotesPage() {
  return (
    <DashboardLayout>
      <Button variant="primary">Create Note</Button>
    </DashboardLayout>
  );
}
```

---

### 4. `services/` - API Client & Services

Centralized API integration layer.

```
services/
├── apiClient.ts        # Axios/fetch setup with interceptors
├── auth.api.ts         # Authentication endpoints
├── notes.api.ts        # Notes API calls
├── flashcards.api.ts   # Flashcards API calls
└── meetings.api.ts     # Meetings API calls
```

**Architecture:**
```
UI Component → Feature Service → Global Service → API Client → Backend
```

---

### 5. `store/` - Global State (Zustand)

Centralized state management for each feature.

```
store/
├── index.ts            # Re-exports all stores
├── authStore.ts        # Auth state (user, token, login/logout)
├── noteStore.ts        # Notes state (notes list, selected note)
├── flashcardStore.ts   # Flashcards state
└── meetingsStore.ts    # Meetings state
```

**Example:**
```tsx
import { useAuthStore } from '@/store';

export default function LoginForm() {
  const { login, isLoading } = useAuthStore();
  
  const handleSubmit = async () => {
    await login(email, password);
  };
}
```

---

### 6. `hooks/` - Custom React Hooks

Reusable logic hooks.

```
hooks/
├── index.ts        # useDebounce, useLocalStorage
├── useAuth.ts      # Auth hook (check user & initialize)
├── useApi.ts       # Generic API call hook
└── useSearch.ts    # Search logic hook
```

---

### 7. `types/` - TypeScript Type Definitions

Global type definitions for the entire app.

```
types/
├── index.ts        # Re-exports all types
├── user.ts         # User, AuthCredentials, AuthResponse
├── note.ts         # Note, CreateNotePayload, NoteVersion
├── flashcard.ts    # Flashcard, FlashcardDeck, StudySession
└── meeting.ts      # Meeting, TranscriptSegment, AIGeneratedNotes
```

---

### 8. `utils/` - Utility Functions

Helper functions & constants.

```
utils/
├── helpers.ts      # formatDate, truncate, slugify, groupBy
├── errors.ts       # Error handling utilities
├── constants.ts    # API endpoints, routes, validation rules
└── validation.ts   # Input validation functions
```

---

### 9. `lib/` - External Configuration

Setup for third-party libraries.

```
lib/
└── config.ts       # Firebase, OpenAI, Socket.io configuration
```

---

### 10. `styles/` - Global Styling

CSS files (Tailwind CSS setup).

```
styles/
└── globals.css     # Global styles & Tailwind directives
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Fill in your actual API URLs and keys
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📝 Creating a New Feature

### 1. Create Feature Folder
```
features/my-feature/
├── components/
├── hooks/
├── services/
├── types.ts
└── README.md (optional)
```

### 2. Define Types
```typescript
// features/my-feature/types.ts
export interface MyFeature {
  id: string;
  name: string;
}
```

### 3. Create Service
```typescript
// features/my-feature/services/myService.ts
import { api } from '@/services/apiClient';

export const myFeatureService = {
  async getItems() {
    const response = await api.get('/my-feature');
    return response.data;
  },
};
```

### 4. Create Store (if needed)
```typescript
// store/myFeatureStore.ts
import { create } from 'zustand';

export const useMyFeatureStore = create((set) => ({
  items: [],
  fetchItems: async () => {
    // Implementation
  },
}));
```

### 5. Create Components
```typescript
// features/my-feature/components/MyComponent.tsx
export const MyComponent = () => {
  return <div>My Component</div>;
};
```

### 6. Create Pages
```typescript
// app/my-feature/page.tsx
import { MyComponent } from '@/features/my-feature/components/MyComponent';

export default function MyFeaturePage() {
  return <MyComponent />;
}
```

---

## 🏗️ Import Aliases

The `tsconfig.json` is configured with path aliases for clean imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import { Note } from '@/types';

// ❌ Avoid
import { Button } from '../../../components/ui/Button';
```

---

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Dark Mode Support** in components
- **Global Colors** defined in `tailwind.config.ts`

---

## 🔐 Authentication Flow

```
Login Page → useAuthStore.login() → API Call → Store Update → Redirect to Dashboard
```

---

## 📡 API Integration

All API calls go through:
1. Feature Service (e.g., `notesService`)
2. Global Service (e.g., `apiClient`)
3. Zustand Store (state management)
4. React Component (UI)

---

## 🧪 Testing

(Future: Configure Jest + React Testing Library)

---

## 📦 Deployment

- Deploy to Vercel (recommended for Next.js)
- Or Docker + any Node.js hosting

---

## 🎯 Best Practices

1. **Keep components small** - each component should have one responsibility
2. **Use Zustand stores** - for cross-component state only
3. **Leverage feature services** - centralize API logic
4. **Type everything** - use TypeScript for type safety
5. **Use path aliases** - avoid relative imports
6. **Keep util functions pure** - no side effects
7. **Lazy load pages** - use Next.js dynamic imports for large components

---

## 🐛 Common Issues & Solutions

### Issue: Import not working
**Solution:** Check `tsconfig.json` path aliases

### Issue: Component state not persisting
**Solution:** Use Zustand store instead of local state

### Issue: API calls failing
**Solution:** Check `.env.local` and ensure backend is running

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Support

For questions or issues, refer to the [StudySnap SRS Document](./README.md)

---

**Last Updated:** March 2026
