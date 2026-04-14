'use client';

import React from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Bell,
  Upload,
  MoreVertical,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Brain,
  Code,
  Database,
  Cpu,
  Globe,
  Play
} from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function FlashcardsPageContent() {
  return (
    <div className="flex h-full w-full text-[#1E293B] overflow-hidden font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="min-h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-3 shrink-0">
          <h1 className="text-lg sm:text-xl font-bold">Flashcards</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative group w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search decks, cards..." 
                className="w-full bg-[#F1F5F9] border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button size="sm" className="hidden sm:flex">
                <Plus size={16} /> Create
              </Button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer hover:ring-4 ring-indigo-50 transition-all">
                H
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Your Flashcard Decks</h2>
                  <p className="text-sm text-gray-400 mt-1">6 decks · 258 total cards</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Button variant="outline" size="sm">
                    <Upload size={16} /> Import CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Sparkles size={16} className="text-purple-500" /> Generate from Notes
                  </Button>
                  <Button size="sm">
                    <Plus size={18} /> Create Deck
                  </Button>
                </div>
              </div>

              {/* Deck Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                <DeckCard 
                  icon={<Brain className="text-blue-500" size={24} />}
                  title="Machine Learning"
                  count={52}
                  mastery={75}
                  tags={["AI-generated", "Study set"]}
                  color="blue"
                />
                <DeckCard 
                  icon={<Code className="text-indigo-500" size={24} />}
                  title="Algorithms"
                  count={38}
                  mastery={60}
                  tags={["Study set"]}
                  color="indigo"
                />
                <DeckCard 
                  icon={<Database className="text-emerald-500" size={24} />}
                  title="Database Systems"
                  count={45}
                  mastery={88}
                  tags={["AI-generated"]}
                  color="emerald"
                />
                <DeckCard 
                  icon={<Cpu className="text-orange-500" size={24} />}
                  title="Operating Systems"
                  count={31}
                  mastery={42}
                  tags={["Study set"]}
                  color="orange"
                />
                <DeckCard 
                  icon={<Globe className="text-pink-500" size={24} />}
                  title="Computer Networks"
                  count={28}
                  mastery={55}
                  tags={["AI-generated", "Study set"]}
                  color="pink"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all mb-4">
                    <Plus size={24} />
                  </div>
                  <span className="font-bold text-gray-500 group-hover:text-blue-600 transition-colors text-lg">Create New Deck</span>
                </div>
              </div>
            </div>
          </main>

          {/* Right Summary Sidebar */}
          <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-[#E2E8F0] p-4 sm:p-6 lg:p-8 overflow-y-auto shrink-0 block">
            <section className="mb-10">
              <h3 className="text-lg font-bold mb-6">Study Summary</h3>
              <div className="space-y-4 mb-8">
                <SummaryCard 
                  icon={<CheckCircle2 size={18} className="text-emerald-500" />}
                  label="Cards Mastered"
                  value="128"
                  bgColor="bg-emerald-50/50 hover:bg-emerald-50"
                />
                <SummaryCard 
                  icon={<Clock size={18} className="text-amber-500" />}
                  label="Due Today"
                  value="24"
                  bgColor="bg-amber-50/50 hover:bg-amber-50"
                />
                <SummaryCard 
                  icon={<Flame size={18} className="text-rose-500" />}
                  label="Study Streak"
                  value="14 days"
                  bgColor="bg-rose-50/50 hover:bg-rose-50"
                  active
                />
                <SummaryCard 
                  icon={<TrendingUp size={18} className="text-blue-500" />}
                  label="Weekly Progress"
                  value="+18%"
                  bgColor="bg-blue-50/50 hover:bg-blue-50"
                />
              </div>
              <Button className="w-full h-14 shadow-lg shadow-blue-200/50">
                Review Due Cards
              </Button>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
              <div className="space-y-6">
                <ActivityItem 
                  title="Machine Learning"
                  action="Studied 12 cards"
                  time="2h ago"
                />
                <ActivityItem 
                  title="Algorithms"
                  action="Added 5 new cards"
                  time="5h ago"
                />
                <ActivityItem 
                  title="Database Systems"
                  action="Completed review"
                  time="1d ago"
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Floating Action Button (Mobile/Tablet visible) */}
      <div className="fixed bottom-6 right-6 lg:right-96 xl:right-[432px] pointer-events-none">
        <button className="pointer-events-auto w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}

function DeckCard({ icon, title, count, mastery, tags, color }: { icon: React.ReactNode, title: string, count: number, mastery: number, tags: string[], color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100/50",
    indigo: "bg-indigo-50 border-indigo-100/50",
    emerald: "bg-emerald-50 border-emerald-100/50",
    orange: "bg-orange-50 border-orange-100/50",
    pink: "bg-pink-50 border-pink-100/50"
  };

  const progressColorMap: Record<string, string> = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500"
  };

  const tagColorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    pink: "bg-pink-50 text-pink-600"
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col h-full ring-1 ring-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <button className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <h4 className="text-xl font-bold mb-1 text-gray-900">{title}</h4>
      <p className="text-sm font-medium text-gray-400 mb-6">{count} cards</p>

      <div className="flex gap-2 mb-8">
        {tags.map((tag, idx) => (
          <span key={idx} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${tag === "AI-generated" ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-400">Mastery</span>
          <span className={`text-xs font-bold ${progressColorMap[color].replace('bg-', 'text-')}`}>{mastery}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div 
            className={`h-full ${progressColorMap[color]} transition-all duration-1000`} 
            style={{ width: `${mastery}%` }}
          />
        </div>

        <Button 
          variant="outline" 
          className={`
            w-full justify-center py-3.5 rounded-2xl gap-2 font-bold transition-all 
            ${colorMap[color]} border-transparent 
            hover:shadow-lg hover:shadow-gray-100/50 hover:bg-white hover:border-gray-100
            active:scale-[0.98]
          `}
        >
          <Play size={16} className={progressColorMap[color].replace('bg-', 'text-')} fill="currentColor" /> 
          <span className={progressColorMap[color].replace('bg-', 'text-')}>Study Now</span>
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, bgColor, active = false }: { icon: React.ReactNode, label: string, value: string, bgColor: string, active?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100 ${bgColor}`}>
      <div className="flex items-center gap-3">
        <div className="bg-white p-2.5 rounded-xl shadow-sm">
          {icon}
        </div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      <span className={`text-sm font-extrabold ${active ? 'text-rose-600' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

function ActivityItem({ title, action, time }: { title: string, action: string, time: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-gray-50 pl-4 relative">
      <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-gray-200"></div>
      <h5 className="text-[15px] font-bold text-gray-900">{title}</h5>
      <p className="text-xs text-gray-500 leading-none">{action} · <span className="text-gray-400 font-medium">{time}</span></p>
    </div>
  );
}
