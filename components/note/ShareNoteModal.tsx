'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Users } from 'lucide-react';
import type { Note } from '@/types';

interface ShareNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
  itemType?: 'note' | 'meeting';
  onShare: (userIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function ShareNoteModal({
  open,
  onOpenChange,
  note,
  itemType = 'note',
  onShare,
  isLoading = false,
}: ShareNoteModalProps) {
  const [userIdInput, setUserIdInput] = useState('');
  const [userIds, setUserIds] = useState<string[]>(note?.sharedWith ?? []);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddUserId = () => {
    const trimmedId = userIdInput.trim();

    if (!trimmedId) {
      setError('Please enter a user ID');
      return;
    }

    if (userIds.includes(trimmedId)) {
      setError('This user ID is already added');
      return;
    }

    setUserIds([...userIds, trimmedId]);
    setUserIdInput('');
    setError(null);
  };

  const handleRemoveUserId = (id: string) => {
    setUserIds(userIds.filter((uid) => uid !== id));
  };

  const handleShare = async () => {
    if (userIds.length === 0) {
      setError('Please add at least one user ID to share with');
      return;
    }

    try {
      setError(null);
      await onShare(userIds);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setUserIdInput('');
        setUserIds(note?.sharedWith ?? []);
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError((err as Error).message || 'Failed to share note');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton>
        <SheetHeader>
          <SheetTitle>
            {itemType === 'meeting' ? 'Convert & Share Meeting' : 'Share Note'}
          </SheetTitle>
        </SheetHeader>

        {note && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-slate-900">{note.title}</h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{note.content}</p>
              {itemType === 'meeting' && (
                <p className="mt-3 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1.5 rounded-md">
                  This meeting summary will be saved as a note and shared with the users below.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter User ID
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter user ID"
                    value={userIdInput}
                    onChange={(e) => {
                      setUserIdInput(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddUserId();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddUserId}
                    disabled={isLoading || !userIdInput.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                  ✓ Note shared successfully!
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-slate-600" />
                <label className="block text-sm font-medium text-slate-700">
                  Users ({userIds.length})
                </label>
              </div>

              {userIds.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No users added yet</p>
              ) : (
                <div className="space-y-2">
                  {userIds.map((id) => (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200"
                    >
                      <span className="text-sm font-mono text-slate-700">{id}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUserId(id)}
                        className="text-slate-400 hover:text-red-600 transition"
                        aria-label="Remove user"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleShare}
                disabled={isLoading || userIds.length === 0}
                isLoading={isLoading}
              >
                Share
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
