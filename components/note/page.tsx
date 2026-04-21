'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Plus, Save, Search, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNotesStore } from '@/store';
import { getRelativeTime } from '@/utils/helpers';

export default function NotesPageContent() {
  const {
    notes,
    selectedNote,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setSelectedNote,
  } = useNotesStore();

  const [query, setQuery] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftTags, setDraftTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!selectedNote && notes.length > 0) {
      setSelectedNote(notes[0]);
      return;
    }

    if (selectedNote) {
      setDraftTitle(selectedNote.title);
      setDraftContent(selectedNote.content);
      setDraftTags((selectedNote.tags ?? []).join(', '));
    }
  }, [notes, selectedNote, setSelectedNote]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return notes;

    return notes.filter((note) => {
      const searchableText = `${note.title} ${note.content} ${(note.tags ?? []).join(' ')}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [notes, query]);

  const handleCreateNote = async () => {
    setLocalError(null);
    try {
      const created = await createNote('Untitled Note', 'Start writing your note here...', []);
      setSelectedNote(created);
    } catch (createError) {
      setLocalError((createError as Error).message);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    setIsSaving(true);
    setLocalError(null);

    try {
      const tags = draftTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await updateNote(selectedNote.id, {
        title: draftTitle.trim() || 'Untitled Note',
        content: draftContent,
        tags,
      });
    } catch (saveError) {
      setLocalError((saveError as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    setLocalError(null);
    try {
      await deleteNote(selectedNote.id);
      const nextNote = notes.find((note) => note.id !== selectedNote.id) ?? null;
      setSelectedNote(nextNote);
    } catch (deleteError) {
      setLocalError((deleteError as Error).message);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden font-sans text-slate-800">
      <aside className="w-full max-w-sm shrink-0 border-r border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Notes</h2>
          <Button variant="outline" size="sm" onClick={handleCreateNote}>
            <Plus size={14} /> New
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {isLoading && <p className="text-sm text-slate-500">Loading notes...</p>}
        {(error || localError) && <p className="mb-3 text-sm text-red-600">{localError ?? error}</p>}

        <div className="space-y-2 overflow-y-auto pr-1">
          {!isLoading && filteredNotes.length === 0 && (
            <p className="text-sm text-slate-500">No notes found.</p>
          )}

          {filteredNotes.map((note) => {
            const active = selectedNote?.id === note.id;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => setSelectedNote(note)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-blue-200 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <p className="truncate text-sm font-semibold text-slate-900">{note.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{note.content}</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock size={12} />
                  {getRelativeTime(note.updatedAt)}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-white p-6 lg:p-8">
        {!selectedNote ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Select a note to view and edit.
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Synced with backend
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDeleteNote}>
                  <Trash2 size={14} /> Delete
                </Button>
                <Button size="sm" onClick={handleSaveNote} isLoading={isSaving}>
                  <Save size={14} /> Save
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</label>
                <input
                  type="text"
                  value={draftTags}
                  onChange={(event) => setDraftTags(event.target.value)}
                  placeholder="ai, database, algorithms"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Content</label>
                <textarea
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                  rows={18}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <p className="text-xs text-slate-400">
                Created {new Date(selectedNote.createdAt).toLocaleString()} · Updated {new Date(selectedNote.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
