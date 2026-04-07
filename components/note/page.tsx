'use client';

import React from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Share2, 
  Sparkles, 
  MoreVertical,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { useState } from 'react';
import EditorView from './EditorView';

export default function NotesPageContent() {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <EditorView />;
  }

  return (
    <div className="flex h-full w-full text-[#1E293B] overflow-hidden font-sans">
      {/* Folders Pane */}
      <div className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col p-6 shrink-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold">Folders</h2>
          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2 mb-10">
          <FolderItem icon={<FolderOpen className="text-blue-500" size={18} />} label="AI Lectures" count={12} active />
          <FolderItem icon={<FolderOpen className="text-purple-500" size={18} />} label="Software Engineering" count={8} />
          <FolderItem icon={<FolderOpen className="text-orange-500" size={18} />} label="Machine Learning" count={15} />
          <FolderItem icon={<FolderOpen className="text-emerald-500" size={18} />} label="Personal Notes" count={5} />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <Tag color="bg-blue-100 text-blue-600">AI</Tag>
            <Tag color="bg-orange-100 text-orange-600">Database</Tag>
            <Tag color="bg-emerald-100 text-emerald-600">Algorithms</Tag>
            <Tag color="bg-red-100 text-red-600">Research</Tag>
          </div>
        </div>
      </div>

      {/* Recent Notes Pane */}
      <div className="w-[400px] border-r border-[#E2E8F0] flex flex-col p-6 shrink-0 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Recent Notes</h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">4 notes</span>
        </div>

        <div className="relative mb-6 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="w-full bg-[#F1F5F9] border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <NoteCard 
            title="Introduction to Machine Learning"
            preview="Machine learning is a branch of artificial intelligence that focuses on the use of data and algorithms..."
            tags={[{ label: 'AI', color: 'bg-blue-50 text-blue-500' }, { label: 'Machine Learning', color: 'bg-indigo-50 text-indigo-500' }]}
            time="2 hours ago"
            active
          />
          <NoteCard 
            title="Photosynthesis Study Guide"
            preview="Photosynthesis is the process by which green plants convert sunlight into chemical energy"
            tags={[{ label: 'Biology', color: 'bg-emerald-50 text-emerald-500' }, { label: 'Research', color: 'bg-pink-50 text-pink-500' }]}
            time="5 hours ago"
          />
          <NoteCard 
            title="World War II Timeline"
            preview="A comprehensive timeline covering major events from 1939 to 1945, including key battles and"
            tags={[{ label: 'History', color: 'bg-amber-50 text-amber-500' }]}
            time="1 day ago"
          />
          <NoteCard 
            title="Data Structures & Algorithms"
            preview="Exploring fundamental data structures including arrays, linked lists, trees, and graphs with"
            tags={[{ label: 'Algorithms', color: 'bg-green-50 text-green-500' }, { label: 'Database', color: 'bg-orange-50 text-orange-500' }]}
            time="2 days ago"
          />
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8 bg-white m-4 rounded-[32px] shadow-sm border border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-400">Edited 2 hours ago</span>
              <div className="flex gap-2">
                <Tag color="bg-blue-50 text-blue-600 px-3 py-1 text-xs">#AI</Tag>
                <Tag color="bg-indigo-50 text-indigo-600 px-3 py-1 text-xs">#Machine Learning</Tag>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit
              </Button>
              <Button variant="ghost">
                <Share2 size={16} /> Share
              </Button>
              <Button>
                <Sparkles size={16} /> Generate Flashcards
              </Button>
            </div>
          </header>

          <article>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Introduction to Machine Learning</h1>
            <div className="flex items-center gap-2 text-gray-400 mb-10 flex-wrap">
              <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md text-xs">AI Lectures</span>
              <span>·</span>
              <span className="text-sm">Last edited 2 hours ago</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-sm bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={14} /> Saved
              </span>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-gray-600 font-normal mb-12">
                Machine learning is a branch of artificial intelligence that focuses on the use of data and algorithms to imitate the way humans learn, gradually improving its accuracy. It enables computers to learn from experience without being explicitly programmed, making it one of the most transformative technologies of our time.
              </p>

              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Core Concepts
                </h2>
                <div className="space-y-4">
                  <ConceptItem 
                    title="Supervised Learning" 
                    description="Learning from labeled training data to make predictions on new, unseen data." 
                  />
                  <ConceptItem 
                    title="Unsupervised Learning" 
                    description="Finding hidden patterns or intrinsic structures in unlabeled data." 
                  />
                  <ConceptItem 
                    title="Reinforcement Learning" 
                    description="Learning optimal actions through trial and error with rewards and penalties." 
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Key Applications
                </h2>
                <p className="text-gray-600 leading-relaxed bg-[#F8FAFC]/50 p-6 rounded-2xl border border-[#E2E8F0]">
                  Machine learning powers many modern technologies including natural language processing, computer vision, recommendation systems, and autonomous vehicles. Its applications span across healthcare, finance, education, and entertainment industries.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

function FolderItem({ icon, label, count, active = false }: { icon: React.ReactNode, label: string, count: number, active?: boolean }) {
  return (
    <div className={`
      flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group transition-all
      ${active ? 'bg-blue-50/50' : 'hover:bg-gray-50'}
    `}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-white shadow-sm' : 'bg-transparent group-hover:bg-white'}`}>
          {icon}
        </div>
        <span className={`text-[15px] ${active ? 'font-bold text-gray-900' : 'font-medium text-gray-500 group-hover:text-gray-900'}`}>{label}</span>
      </div>
      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md group-hover:bg-white transition-colors">{count}</span>
    </div>
  );
}

function NoteCard({ title, preview, tags, time, active = false }: { title: string, preview: string, tags: {label: string, color: string}[], time: string, active?: boolean }) {
  return (
    <div className={`
      p-5 rounded-[24px] cursor-pointer border transition-all duration-300
      ${active ? 'bg-white border-blue-100 shadow-[0_12px_24px_-8px_rgba(37,99,235,0.1)] ring-1 ring-blue-50 scale-[1.02]' : 'hover:bg-white hover:border-gray-100 hover:shadow-xl hover:shadow-gray-100/50 grayscale-[0.2] hover:grayscale-0'}
    `}>
      <h4 className={`font-bold mb-2 ${active ? 'text-blue-900' : 'text-gray-800'}`}>{title}</h4>
      <p className="text-sm text-gray-500/80 mb-4 line-clamp-2 leading-relaxed">{preview}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">{time}</span>
      </div>
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode, color: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-pointer ${color}`}>
      {children}
    </span>
  );
}

function ConceptItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[#E2E8F0] hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-50/50 group">
      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 ring-4 ring-blue-100 group-hover:scale-125 transition-transform"></div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}
