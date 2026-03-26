'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { useFlashcardStore } from '@/store';
import { useEffect } from 'react';
import Link from 'next/link';

export default function FlashcardsPage() {
  const { decks, isLoading, fetchDecks } = useFlashcardStore();

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Flashcard Decks</h1>
            <Button>Create New Deck</Button>
          </div>

          {isLoading ? (
            <p>Loading decks...</p>
          ) : decks.length === 0 ? (
            <p className="text-gray-600">No decks yet. Create your first deck!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck) => (
                <Link key={deck.id} href={`/flashcards/${deck.id}`}>
                  <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <h3 className="font-semibold text-lg mb-2">{deck.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{deck.description}</p>
                    <p className="text-gray-500 text-xs">{deck.cardCount} cards</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
