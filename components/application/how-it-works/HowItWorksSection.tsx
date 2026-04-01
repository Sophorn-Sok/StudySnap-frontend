"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const monthlyRetention = [
  { month: "Mar", value: 56 },
  { month: "Apr", value: 63 },
  { month: "May", value: 71 },
  { month: "Jun", value: 78 },
];

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  showConnector?: boolean;
  children: React.ReactNode;
}

function StepCard({ number, title, description, showConnector, children }: StepCardProps) {
  return (
    <div className="relative">
      <Card className="!rounded-[24px] !shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200 !bg-[#f9fafb] p-4 sm:p-5 flex flex-col h-full">
        {/* Preview Content Area */}
        <div className="mb-4 flex-1 rounded-[16px] border border-slate-200 bg-white p-4 flex flex-col">
          {children}
        </div>

        {/* Step Info Footer */}
        <div className="flex items-start gap-3 pt-2">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {number}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-tight text-slate-900">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </Card>

      {showConnector && (
        <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden h-6 w-6 rounded-full border border-slate-200 bg-white p-1 text-slate-400 lg:block" />
      )}
    </div>
  );
}

/* ─── Preview Components ─────────────────────────────────────────── */

function UploadPreview() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...droppedFiles.map((f) => f.name), ...prev].slice(0, 2));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...selectedFiles.map((f) => f.name), ...prev].slice(0, 2));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* File Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Upload className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-xs font-semibold text-slate-600">Click to upload</p>
            <p className="text-xs text-slate-500">or drag and drop</p>
          </div>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((fileName, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
              <div className="h-6 w-6 rounded-sm bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-slate-700">{fileName}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ✓
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProcessingPreview() {
  return (
    <div className="flex flex-col gap-3">
      {/* Processing Indicator */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        <div className="text-xs font-semibold text-purple-600 uppercase">Processing</div>
      </div>

      {/* Skeleton Lines */}
      <div className="space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-slate-200" />
        <div className="h-2 w-full rounded-full bg-slate-200" />
        <div className="h-2 w-4/5 rounded-full bg-slate-200" />
        <div className="h-2 w-3/5 rounded-full bg-slate-200" />
      </div>

      {/* Result Box */}
      <div className="mt-2 rounded-lg bg-blue-50 p-2 text-xs leading-relaxed text-blue-700">
        6 key points detected and 18 flashcards drafted.
      </div>
    </div>
  );
}

function FlashcardPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        Q: CONCEPT
      </div>
      <div className="h-px w-8 bg-slate-300" />
      <div className="text-sm font-semibold text-slate-900">
        What is active recall?
      </div>
      <Button 
        variant="primary" 
        size="sm" 
        className="mt-2 w-full !bg-indigo-600 !text-white !hover:bg-indigo-700"
      >
        Reveal Answer
      </Button>
    </div>
  );
}

function AnalyticsPreview() {
  return (
    <div className="flex flex-col gap-3">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-xs text-slate-600">Retention</div>
          <div className="text-lg font-bold text-slate-900">94%</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-xs text-slate-600">Streak</div>
          <div className="text-lg font-bold text-slate-900">14d</div>
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="mt-2 flex items-end justify-between gap-1.5 rounded-lg bg-slate-50 p-2 h-20">
        {monthlyRetention.map((item) => (
          <div
            key={item.month}
            className="flex-1 rounded-sm bg-gradient-to-t from-indigo-600 to-indigo-500"
            style={{ height: `${item.value}%` }}
            title={`${item.month}: ${item.value}%`}
          />
        ))}
      </div>
    </div>
  );
}



export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl scroll-mt-32 px-6 py-12 md:px-10 md:py-20 lg:py-28"
    >
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 [font-family:var(--font-heading)]">
          How It Works
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600">
          From notes to mastery in 4 simple steps
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Step 1: Upload */}
        <StepCard
          showConnector
          number={1}
          title="Upload or Create Notes"
          description="Write notes, upload PDFs, or capture content from lectures and meetings."
        >
          <UploadPreview />
        </StepCard>

        {/* Step 2: AI Processing */}
        <StepCard
          showConnector
          number={2}
          title="AI Organizes and Summarizes"
          description="StudySnap AI analyzes your notes and meetings to generate structured summaries and key insights."
        >
          <ProcessingPreview />
        </StepCard>

        {/* Step 3: Flashcards */}
        <StepCard
          showConnector
          number={3}
          title="Study with Smart Flashcards"
          description="Automatically turn your notes into flashcards designed for active recall learning."
        >
          <FlashcardPreview />
        </StepCard>

        {/* Step 4: Progress */}
        <StepCard
          number={4}
          title="Track Your Progress"
          description="Monitor your study performance with progress tracking and spaced repetition."
        >
          <AnalyticsPreview />
        </StepCard>
      </div>

      {/* Call to Action Button */}
      <div className="mt-12 flex justify-center">
        <Link href="/register">
          <Button className="!rounded-full !bg-[#2f5dff] !text-white !px-8 !py-3 text-[15px] !font-semibold shadow-[0_12px_32px_rgba(47,93,255,0.35)] transition-all hover:-translate-y-0.5 hover:!bg-[#284de1] hover:shadow-[0_12px_36px_rgba(47,93,255,0.45)]">
            Try It Free
          </Button>
        </Link>
      </div>
    </section>
  );
}