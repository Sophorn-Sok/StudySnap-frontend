'use client';

import { BookOpen, Wand2, Mic, Upload } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const QuickAction = ({ icon: Icon, label, href }: QuickActionProps) => {
  return (
    <Link href={href}>
      <Card className="p-6 border border-slate-100/60 bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 !shadow-sm !rounded-[20px] cursor-pointer h-full">
        <div className="w-[42px] h-[42px] rounded-[12px] bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-4">
          <Icon className="w-[20px] h-[20px]" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-900">{label}</h3>
      </Card>
    </Link>
  );
};

export const QuickActions = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <QuickAction icon={BookOpen} label="Create Note" href="/notes" />
        <QuickAction icon={Wand2} label="Generate Flashcards" href="/flashcards" />
        <QuickAction icon={Mic} label="Start Transcription" href="/meetings" />
        <QuickAction icon={Upload} label="Upload Audio" href="/meetings" />
      </div>
    </div>
  );
};
