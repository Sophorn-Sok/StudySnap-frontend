'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Plus, Save, Search, Trash2, BookOpen, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ShareNoteModal } from './ShareNoteModal';
import { useNotesStore } from '@/store';
import { useMeetingsStore } from '@/store';
import { getRelativeTime } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import type { Note } from '@/types';
import type { Meeting } from '@/types';

type DisplayItem = (Note & { type: 'note' }) | (Meeting & { type: 'meeting' });

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
    shareNote,
  } = useNotesStore();

  const {
    meetings,
    isLoading: meetingsLoading,
    fetchMeetings,
    updateMeeting,
  } = useMeetingsStore();

  const [query, setQuery] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftTags, setDraftTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'note' | 'meeting' | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    void fetchNotes();
    void fetchMeetings();
  }, [fetchNotes, fetchMeetings]);

  const displayItems = useMemo<DisplayItem[]>(() => {
    const items: DisplayItem[] = [
      ...notes.map(note => ({ ...note, type: 'note' as const })),
      ...meetings
        .filter(meeting => meeting.aiNotes && meeting.aiNotes.trim().length > 0)
        .map(meeting => ({ ...meeting, type: 'meeting' as const })),
    ];
    return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, meetings]);

  useEffect(() => {
    if (!selectedItemId && displayItems.length > 0) {
      const firstItem = displayItems[0];
      setSelectedItemId(firstItem.id);
      setSelectedItemType(firstItem.type);
      return;
    }

    const selectedItem = displayItems.find(item => item.id === selectedItemId);
    if (selectedItem) {
      const isReadOnlyItem = selectedItem.type === 'meeting';
      setIsReadOnly(isReadOnlyItem);
      
      if (selectedItem.type === 'meeting') {
        setDraftTitle(`Meeting: ${selectedItem.title}`);
        setDraftContent(selectedItem.aiNotes);
        setDraftTags(['meeting-summary', ...selectedItem.title.split(' ').slice(0, 2)].join(', '));
      } else {
        setDraftTitle(selectedItem.title);
        setDraftContent(selectedItem.content);
        setDraftTags((selectedItem.tags ?? []).join(', '));
      }
    }
  }, [displayItems, selectedItemId]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return displayItems;

    return displayItems.filter((item) => {
      if (item.type === 'meeting') {
        const searchableText = `${item.title} ${item.aiNotes}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      } else {
        const searchableText = `${item.title} ${item.content} ${(item.tags ?? []).join(' ')}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      }
    });
  }, [displayItems, query]);

  const handleCreateNote = async () => {
    setLocalError(null);
    try {
      const created = await createNote('Untitled Note', 'Start writing your note here...', []);
      setSelectedItemId(created.id);
      setSelectedItemType('note');
    } catch (createError) {
      setLocalError((createError as Error).message);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedItemId || selectedItemType !== 'note') return;

    setIsSaving(true);
    setLocalError(null);

    try {
      const tags = draftTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await updateNote(selectedItemId, {
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

  const handleDeleteSelected = async () => {
    if (!selectedItemId || !selectedItemType) return;

    setLocalError(null);
    try {
      if (selectedItemType === 'note') {
        await deleteNote(selectedItemId);
      } else {
        await updateMeeting(selectedItemId, { aiNotes: '' });
      }

      const nextItem = displayItems.find((item) => item.id !== selectedItemId) ?? null;
      if (nextItem) {
        setSelectedItemId(nextItem.id);
        setSelectedItemType(nextItem.type);
      } else {
        setSelectedItemId(null);
        setSelectedItemType(null);
      }
    } catch (deleteError) {
      setLocalError((deleteError as Error).message);
    }
  };

  const handleShare = async (userIds: string[]) => {
    if (!selectedItemId) return;

    setIsSharing(true);
    setLocalError(null);

    try {
      if (selectedItemType === 'meeting') {
        // Convert meeting to a note and share it
        const meeting = meetings.find(m => m.id === selectedItemId);
        if (!meeting) throw new Error('Meeting not found');
        
        const noteTitle = `${meeting.title} - AI Summary`;
        const noteContent = meeting.aiNotes || meeting.title;
        
        // Create note from meeting
        const note = await createNote(noteTitle, noteContent, ['meeting-summary']);
        // Share the created note
        await shareNote(note.id, userIds);
        
        setLocalError(null);
      } else {
        // Share regular note
        await shareNote(selectedItemId, userIds);
      }
    } catch (shareError) {
      setLocalError((shareError as Error).message);
      throw shareError;
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden font-sans text-slate-800">
      <aside className="flex h-full w-full max-w-sm shrink-0 flex-col border-r border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Notes & Summaries</h2>
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

        {(isLoading || meetingsLoading) && <p className="text-sm text-slate-500">Loading...</p>}
        {(error || localError) && <p className="mb-3 text-sm text-red-600">{localError ?? error}</p>}

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {!isLoading && !meetingsLoading && filteredItems.length === 0 && (
            <p className="text-sm text-slate-500">No notes found.</p>
          )}

          {filteredItems.map((item) => {
            const active = selectedItemId === item.id;
            const isMeeting = item.type === 'meeting';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedItemId(item.id);
                  setSelectedItemType(item.type);
                }}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-blue-200 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  {isMeeting && <BookOpen size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {isMeeting ? `Meeting: ${item.title}` : item.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {isMeeting ? item.aiNotes : item.content}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={12} />
                      {getRelativeTime(item.updatedAt)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={ROUTES.PRICING}
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Pricing
            </Link>
            <Link
              href={ROUTES.SETTINGS}
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Settings
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-white p-6 lg:p-8">
        {!selectedItemId ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Select a note or meeting summary to view.
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {isReadOnly ? 'Meeting Summary (Auto-generated)' : 'Synced with backend'}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 size={14} /> {isReadOnly ? 'Delete Summary' : 'Delete'}
                </Button>
                {!isReadOnly && (
                  <Button size="sm" onClick={handleSaveNote} isLoading={isSaving}>
                    <Save size={14} /> Save
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareModalOpen(true)}
                >
                  <Share2 size={14} /> Share
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
                  disabled={isReadOnly}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 ${isReadOnly ? 'bg-slate-50' : ''}`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</label>
                <input
                  type="text"
                  value={draftTags}
                  onChange={(event) => setDraftTags(event.target.value)}
                  disabled={isReadOnly}
                  placeholder="ai, database, algorithms"
                  className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 ${isReadOnly ? 'bg-slate-50' : ''}`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Content</label>
                <textarea
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                  disabled={isReadOnly}
                  rows={18}
                  className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 ${isReadOnly ? 'bg-slate-50' : ''}`}
                />
              </div>

              {selectedItemType === 'note' && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shared With
                  </label>
                  <div className="min-h-9">
                    {(notes.find(n => n.id === selectedItemId)?.sharedWith ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500 italic">Not shared with anyone</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(notes.find(n => n.id === selectedItemId)?.sharedWith ?? []).map((userId) => (
                          <span
                            key={userId}
                            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-mono"
                          >
                            {userId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedItemType === 'meeting' && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-sm text-amber-700">
                    💡 <strong>Tip:</strong> Click "Share" to convert this meeting summary to a note and share it with others.
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Created {new Date(displayItems.find(i => i.id === selectedItemId)?.createdAt ?? new Date()).toLocaleString()} · Updated {new Date(displayItems.find(i => i.id === selectedItemId)?.updatedAt ?? new Date()).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </main>

      <ShareNoteModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        note={selectedItemType === 'meeting' 
          ? (meetings.find(m => m.id === selectedItemId) 
              ? {
                  id: selectedItemId || '',
                  userId: '',
                  title: meetings.find(m => m.id === selectedItemId)?.title || '',
                  content: meetings.find(m => m.id === selectedItemId)?.aiNotes || '',
                  tags: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  isShared: false,
                } 
              : null)
          : (notes.find(n => n.id === selectedItemId) ?? null)
        }
        itemType={selectedItemType || 'note'}
        onShare={handleShare}
        isLoading={isSharing}
      />
    </div>
  );
}
