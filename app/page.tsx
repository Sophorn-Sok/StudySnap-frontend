'use client';

import Link from "next/link";
import { Manrope, Playfair_Display } from "next/font/google";
import {
  Mic,
  Folder,
  Zap,
  FileText,
  Search,
  History,
  Tag,
  ChevronDown,
  List,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  MoreVertical,
  Sparkles,
  Clock,
  FileUp,
  RotateCw,
  Layers,
  BarChart2,
  Trophy,
  Check
} from "lucide-react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import HowItWorksSection from "@/components/application/how-it-works/HowItWorksSection";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

{/* Navbar links */ }
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const stats = [
  { value: "50,000+", label: "Notes Generated" },
  { value: "12,000+", label: "Flashcards Created" },
  { value: "32,000+", label: "Daily Active Learners" },
];

const featureCards = [
  {
    icon: Mic,
    category: "AI-Powered",
    categoryColor: "bg-blue-100",
    featureColor: "text-blue-600",
    title: "AI Meeting Notes",
    description: "Upload recordings and get instant transcripts, summaries, and action items powered by AI.",
    features: ["Instant transcripts", "Smart summaries", "Action items"],
  },
  {
    icon: Folder,
    category: "Organized",
    categoryColor: "bg-emerald-100",
    featureColor: "text-emerald-600",
    title: "Organize Your Knowledge Easily",
    description: "Create notes, folders, and tags to keep everything structured and searchable.",
    features: ["Folders & tags", "Full-text search", "Smart filters"],
  },
  {
    icon: Zap,
    category: "Spaced Repetition",
    categoryColor: "bg-orange-100",
    featureColor: "text-orange-600",
    title: "Learn Faster with Smart Flashcards",
    description: "Convert notes into flashcards and review with spaced repetition to improve memory.",
    features: ["Auto-generation", "Spaced repetition", "Progress tracking"],
  },
];

{/* Plan and pricing Section */ }
const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Get started with StudySnap",
    cta: "Start Free",
    featured: false,
    features: [
      "50 notes/month",
      "100 flashcards",
      "3 meeting transcriptions/month",
      "Basic search",
    ],
  },
  {
    name: "Pro",
    price: "$24",
    subtitle: "For power students",
    cta: "Choose Pro",
    featured: true,
    badge: "Most Popular",
    features: [
      "Unlimited everything",
      "AI summaries",
      "AI flashcard generation",
      "Advanced analytics",
      "Export to PDF & Notion",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$99",
    subtitle: "For teams and classrooms",
    cta: "Contact Sales",
    featured: false,
    features: [
      "All Pro features",
      "Collaboration & shared workspaces",
      "Admin tools & user management",
      "Team analytics",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    src: "/facebook%20(1).png",
  },
  {
    label: "Google",
    href: "https://google.com",
    src: "/google.png",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    src: "/twitter.png",
  },
];


export default function Home() {
  return (
    <main
      className={`${bodyFont.variable} ${headingFont.variable} min-h-screen bg-[#FFFFFF] text-slate-900 [font-family:var(--font-body)]`}
    >
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-[#FFFFFF]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="text-2xl font-semibold [font-family:var(--font-heading)]">
            StudySnap
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-950"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 sm:inline-flex">
              Login
            </Link>
            <Link href="/register" className="rounded-full bg-[#2f5dff] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(47,93,255,0.35)] transition hover:bg-[#284de1]">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full" style={{ backgroundImage: "url('/Asset/meeting.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '600px' }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 md:px-10 md:py-24">
          <div className="flex flex-col justify-center space-y-7 max-w-2xl">
            <p className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
              AI Study Workspace
            </p>
            <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-6xl [font-family:var(--font-heading)]">
              Study Smarter with AI-Powered Notes and Flashcards
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              Turn recordings, documents, and lecture content into organized
              study notes and memory-friendly flashcards in seconds.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/register" className="rounded-full bg-[#2f5dff] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(47,93,255,0.35)] transition hover:-translate-y-0.5 hover:bg-[#284de1] inline-block">
                Get Started
              </Link>
              <button className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 hover:border-white/50">
                Watch Demo
              </button>
            </div>

            <p className="text-sm text-white/75 pt-2">
              Trusted by students and professionals worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Prove Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <p className="text-4xl font-semibold [font-family:var(--font-heading)] text-slate-900">{stat.value}</p>
              <p className="mt-3 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="mx-auto w-full max-w-6xl scroll-mt-32 px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl [font-family:var(--font-heading)]">
            Everything you need to study smarter
          </h2>
          <p className="mt-4 text-slate-600">
            StudySnap combines AI note-taking, smart organization, and science-backed
            flashcards into one seamless experience.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              icon={card.icon}
              category={card.category}
              categoryColor={card.categoryColor}
              featureColor={card.featureColor}
              title={card.title}
              description={card.description}
              features={card.features}
            />
          ))}
        </div>
      </section>

      {/* Ai meeting Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-20">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl [font-family:var(--font-heading)]">
            Let AI take notes during meetings
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Automatically capture conversations, generate summaries, and track
            important decisions from Zoom and Google Meet.
          </p>
        </div>

        {/* Two Feature Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Focus on the Conversation Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition-shadow duration-300 overflow-hidden">
            {/* Image Section */}
            <div className="relative h-72 bg-gradient-to-b from-slate-200 to-slate-100 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/Asset/meeting transcript.jpg')" }}
              />
              <div className="absolute inset-0 bg-black/30" />

              {/* Live Indicator Badge */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-green-50/95 backdrop-blur px-3 py-1.5 border border-green-200">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-700">
                  Listening
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="text-xl font-semibold [font-family:var(--font-heading)] text-slate-900">
                Focus on the conversation
              </h3>
              <p className="mt-3 text-slate-600 text-sm">
                StudySnap converts meeting audio into real-time transcripts while you stay focused on discussion.
              </p>

              {/* Live Transcript Preview */}
              <div className="mt-5 space-y-4 bg-slate-50 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    C
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900">Charlie</p>
                    <p className="mt-1 text-xs text-slate-600 leading-snug">
                      The new interface is looking great. Any feedback on the color palette?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                    M
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900">Madison</p>
                    <p className="mt-1 text-xs text-slate-600 leading-snug">
                      I love the subtle shadows. It feels very clean and modern like Notion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Meeting Summaries Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition-shadow duration-300 overflow-hidden">
            {/* Header Section */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="text-xl font-semibold [font-family:var(--font-heading)] text-slate-900">
                Instant meeting summaries
              </h3>
              <p className="mt-2 text-slate-600 text-sm">
                AI extracts key insights, decisions, and action items from meeting conversations.
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 px-6">
              <div className="flex gap-8">
                <button className="py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
                  Summary
                </button>
                <button className="py-3 text-sm font-medium text-slate-600 hover:text-slate-900 border-b-2 border-transparent">
                  Transcript
                </button>
                <button className="py-3 text-sm font-medium text-slate-600 hover:text-slate-900 border-b-2 border-transparent">
                  Action Items
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              {/* Key Decisions */}
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-slate-600 mb-3">
                  Key Decisions
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">▸</span>
                    <span>Launch marketing campaign on Monday</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">▸</span>
                    <span>Finalize product demo by Friday</span>
                  </li>
                </ul>
              </div>

              {/* Key Points */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-slate-600 mb-3">
                  Key Points
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0">●</span>
                    <span>UI design receives positive feedback</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0">●</span>
                    <span>Need to address accessibility concerns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/register">
            <button className="rounded-full bg-[#2f5dff] px-8 py-3 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(47,93,255,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#284de1] hover:shadow-[0_12px_36px_rgba(47,93,255,0.45)]">
              Try It Free
            </button>
          </Link>
        </div>
      </section>

      {/* notemanagement section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#0f172a] [font-family:var(--font-heading)]">
            Powerful note organization
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-[17px] text-slate-600 leading-relaxed">
            Capture ideas with a distraction-free editor and organize knowledge
            using folders, tags, and powerful search.
          </p>
        </div>

        {/* Browser/App Mockup */}
        <Card className="border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.05)] bg-white overflow-hidden flex flex-col md:flex-row h-auto md:h-[520px] mb-8 !p-0 !rounded-[24px]">
          {/* Sidebar */}
          <div className="w-full md:w-[260px] bg-[#f9fafb] border-r border-slate-200 p-4 md:p-5 flex flex-col flex-shrink-0">
            {/* Workspace Header */}
            <div className="flex items-center justify-between mb-8 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer -mx-1.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-[#4f46e5] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  S
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-900 leading-tight">StudySnap</p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Workspace</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-0.5 mb-8 text-[13px] font-medium text-slate-600">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer">
                <FileText className="w-4 h-4 text-slate-400" />
                Quick Note
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer">
                <Search className="w-4 h-4 text-slate-400" />
                Search
              </div>
            </div>

            {/* Folders */}
            <div>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Folders</p>
              <div className="space-y-0.5 text-[13px] font-medium">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-[#4f46e5] cursor-pointer">
                  <Folder className="w-4 h-4 text-indigo-500" />
                  Courses
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer">
                  <Folder className="w-4 h-4 text-emerald-500" />
                  Meetings
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer">
                  <Folder className="w-4 h-4 text-orange-400" />
                  Personal Notes
                </div>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-white flex flex-col relative w-full">
            {/* Toolbar */}
            <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-1 text-slate-400">
                <button className="px-2 py-1.5 rounded text-slate-700 font-semibold bg-slate-100 text-sm">H</button>
                <button className="px-2 py-1.5 hover:bg-slate-100 rounded text-slate-700 font-bold text-sm">B</button>
                <button className="px-2 py-1.5 hover:bg-slate-100 rounded text-slate-700 italic text-sm">I</button>
                <div className="w-px h-4 bg-slate-200 mx-2"></div>
                <button className="p-1.5 hover:bg-slate-100 rounded"><List className="w-[15px] h-[15px]" /></button>
                <button className="p-1.5 hover:bg-slate-100 rounded"><Code className="w-[15px] h-[15px]" /></button>
                <div className="w-px h-4 bg-slate-200 mx-2"></div>
                <button className="p-1.5 hover:bg-slate-100 rounded"><ImageIcon className="w-[15px] h-[15px]" /></button>
                <button className="p-1.5 hover:bg-slate-100 rounded"><LinkIcon className="w-[15px] h-[15px]" /></button>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400 font-medium">Edited just now</span>
                <button className="p-1 hover:bg-slate-100 rounded"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-8 md:px-14 md:py-12 overflow-y-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 [font-family:var(--font-heading)] max-w-lg tracking-tight">
                Software Engineering Lecture
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold">
                  Topic
                </span>
                <span className="text-[15px] font-medium text-slate-700">
                  Software Development Life Cycle
                </span>
              </div>

              <h3 className="text-[17px] font-bold text-slate-900 mb-4">Key Phases</h3>
              <ul className="space-y-3.5 text-[15px] text-slate-600 list-disc ml-5 marker:text-slate-400">
                <li className="pl-1.5">Planning</li>
                <li className="pl-1.5">Design</li>
                <li className="pl-1.5">Implementation</li>
                <li className="pl-1.5">Testing</li>
              </ul>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-6 right-6">
              <Button className="!rounded-xl flex items-center gap-2.5 !bg-[#5352ff] hover:!bg-[#4645e6] !text-white px-5 py-3 shadow-[0_8px_20px_rgba(83,82,255,0.3)] transition-all transform hover:-translate-y-0.5 text-sm font-semibold">
                <Sparkles className="w-[18px] h-[18px]" />
                Generate Flashcards
              </Button>
            </div>
          </div>
        </Card>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <Card className="p-6 border border-slate-100/60 bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 !shadow-sm !rounded-[20px]">
            <div className="w-[42px] h-[42px] rounded-[12px] bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-5">
              <FileText className="w-[20px] h-[20px]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-2">Rich text formatting</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Write notes with headers, lists, images, and code blocks.
            </p>
          </Card>

          <Card className="p-6 border border-slate-100/60 bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 !shadow-sm !rounded-[20px]">
            <div className="w-[42px] h-[42px] rounded-[12px] bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-5">
              <Tag className="w-[20px] h-[20px]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-2">Folders and tags</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Organize notes by subjects, meetings, or topics.
            </p>
          </Card>

          <Card className="p-6 border border-slate-100/60 bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 !shadow-sm !rounded-[20px]">
            <div className="w-[42px] h-[42px] rounded-[12px] bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-5">
              <Search className="w-[20px] h-[20px]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-2">Full-text search</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Instantly find any note in your workspace.
            </p>
          </Card>

          <Card className="p-6 border border-slate-100/60 bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 !shadow-sm !rounded-[20px]">
            <div className="w-[42px] h-[42px] rounded-[12px] bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-5">
              <History className="w-[20px] h-[20px]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-2">Version history</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Track changes and restore previous versions.
            </p>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/register">
            <button className="rounded-full bg-[#2f5dff] px-8 py-3 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(47,93,255,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#284de1] hover:shadow-[0_12px_36px_rgba(47,93,255,0.45)]">
              Try It Free
            </button>
          </Link>
        </div>
      </section>

      {/* Flashcard learning section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-20 lg:py-28">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-medium leading-[1.1] text-slate-900 [font-family:var(--font-heading)]">
            Turn knowledge into <span className="text-[#5352ff]">long-<br className="hidden sm:block" />term memory</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-[17px] text-slate-600 leading-relaxed">
            StudySnap converts notes and meeting transcripts into intelligent<br className="hidden sm:block" />
            flashcards that adapt to your learning progress.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left features list */}
          <div className="space-y-4">
            <Card className="p-6 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white !rounded-[20px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">AI Flashcard Generation</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Automatically generate flashcards from notes and meeting transcripts.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white !rounded-[20px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">Spaced Repetition Algorithm</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Review cards at optimized intervals to improve memory retention.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white !rounded-[20px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-4">
                <Folder className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">Deck Organization</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Group flashcards into decks by topic or subject.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white !rounded-[20px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[#eef0ff] flex items-center justify-center text-[#5352ff] mb-4">
                <FileUp className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">CSV Import</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Import and export flashcards easily.
              </p>
            </Card>
          </div>

          {/* Right visualization */}
          <div className="relative w-full h-[650px] bg-[#f8fafc] rounded-[32px] overflow-hidden">
            {/* Background gradient blur */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-[70%] bg-[#eeecff] rounded-full blur-[100px] opacity-60"></div>

            {/* Floating element 1: Progress - Bottom Left */}
            <Card className="absolute left-6 bottom-32 w-40 !bg-white !rounded-2xl !p-5 !shadow-[0_12px_40px_rgba(0,0,0,0.1)] z-30">
              <div className="flex items-center gap-2.5 mb-4">
                <BarChart2 className="w-4 h-4 text-[#5352ff] flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Progress</span>
              </div>
              <div className="h-2 w-24 bg-gradient-to-r from-[#5352ff] to-[#7070ff] rounded-full"></div>
            </Card>

            {/* Floating element 2: Retention - Middle Left */}
            <Card className="absolute left-6 top-1/4 w-56 !bg-white !rounded-2xl !p-5 !shadow-[0_12px_40px_rgba(0,0,0,0.1)] z-30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-[#eef0ff] flex items-center justify-center text-[16px] font-bold text-slate-900 bg-white flex-shrink-0">
                92%
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Retention</div>
                <div className="text-[15px] font-bold text-slate-900 mt-1">Excellent Score</div>
              </div>
            </Card>

            {/* Floating element 3: Current Deck - Right side */}
            <Card className="absolute right-6 top-1/4 !bg-white !rounded-2xl !px-6 !py-5 !shadow-[0_12px_40px_rgba(0,0,0,0.1)] z-30 flex items-center gap-4 w-56">
              <div className="w-12 h-12 rounded-xl bg-[#f0f0ff] flex items-center justify-center text-[#5352ff] flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Deck</div>
                <div className="text-[15px] font-bold text-slate-900 mt-1">Card 12 of 50</div>
              </div>
            </Card>

            {/* Top Navigation Bar */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-30 flex items-center gap-6 whitespace-nowrap">
              <div className="flex flex-col items-center gap-1.5 opacity-50">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Notes</span>
              </div>
              <div className="w-4 h-[1px] bg-slate-200"></div>
              <div className="flex flex-col items-center gap-1.5 opacity-50">
                <Sparkles className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest">AI Flashcard</span>
              </div>
              <div className="w-4 h-[1px] bg-slate-200"></div>
              <div className="flex flex-col items-center gap-1.5 text-slate-900">
                <Layers className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Study</span>
              </div>
              <div className="w-4 h-[1px] bg-slate-200"></div>
              <div className="flex flex-col items-center gap-1.5 opacity-50">
                <Trophy className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Mastery</span>
              </div>
            </div>

            {/* Main Flashcard & Buttons Container - Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-8">
              {/* Main Flashcard */}
              <Card className="w-[380px] h-[320px] !bg-white !rounded-[28px] !p-8 !shadow-[0_24px_64px_-8px_rgba(0,0,0,0.14)] flex flex-col items-center justify-center relative">
                <div className="absolute top-8 px-5 py-1.5 bg-[#f0f4ff] border border-[#e0e7ff] rounded-full text-[10px] font-bold text-[#6366f1] uppercase tracking-[0.18em]">
                  Question
                </div>

                <h3 className="text-[32px] font-semibold text-center text-slate-900 leading-[1.3] mt-4 px-3">
                  What is <span className="text-[#5352ff]">Agile methodology</span>?
                </h3>

                <div className="absolute bottom-8 flex items-center gap-2.5 text-slate-400 text-[13px] font-medium cursor-pointer hover:text-slate-600 transition-colors">
                  <RotateCw className="w-4 h-4" />
                  <span>Click to flip</span>
                </div>
              </Card>

              {/* Bottom Buttons - Absolutely positioned below card */}
              <div className="absolute bottom-24 flex gap-3">
                <Button variant="secondary" className="!px-8 !py-2.5 !bg-white !rounded-full border border-slate-200 shadow-[0_8px_24px_rgb(0,0,0,0.05)] text-[14px] !font-semibold !text-slate-700 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0,0,0,0.1)] transition-all duration-200">
                  Easy
                </Button>
                <Button variant="secondary" className="!px-8 !py-2.5 !bg-white !rounded-full border border-slate-200 shadow-[0_8px_24px_rgb(0,0,0,0.05)] text-[14px] !font-semibold !text-slate-700 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0,0,0,0.1)] transition-all duration-200">
                  Medium
                </Button>
                <Button variant="secondary" className="!px-8 !py-2.5 !bg-white !rounded-full border border-slate-200 shadow-[0_8px_24px_rgb(0,0,0,0.05)] text-[14px] !font-semibold !text-slate-700 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0,0,0,0.1)] transition-all duration-200">
                  Hard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 flex justify-center">
        <Link href="/register">
          <Button className="!rounded-full !bg-[#2f5dff] !text-white !px-8 !py-3 text-[15px] !font-semibold shadow-[0_12px_32px_rgba(47,93,255,0.35)] transition-all hover:-translate-y-0.5 hover:!bg-[#284de1] hover:shadow-[0_12px_36px_rgba(47,93,255,0.45)]">
            Try It Free
          </Button>
        </Link>
      </div>

      <HowItWorksSection />

      {/* Pricing Section */}
      <section
        id="pricing"
        className="mx-auto w-full max-w-6xl scroll-mt-32 px-6 py-12 md:px-10 md:py-20 lg:py-28"
      >
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-medium leading-[1.1] text-slate-900 [font-family:var(--font-heading)]">
            Plans & Pricing
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
            Turn meetings into notes, notes into flashcards, and learn faster with AI.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col h-full !rounded-[24px] !p-6 sm:!p-8 transition-all duration-300 ${plan.featured
                  ? "!border-indigo-600 !bg-indigo-50 ring-2 ring-indigo-500/20 shadow-lg hover:shadow-xl"
                  : "!border-slate-200 !bg-white hover:!shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 text-white text-xs font-bold px-4 py-1 tracking-wider uppercase">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="pt-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">
                  {plan.name}
                </h3>
                <p className={`mt-2 text-sm ${plan.featured ? "text-slate-700" : "text-slate-600"}`}>
                  {plan.subtitle}
                </p>
              </div>

              {/* Pricing */}
              <div className="mt-6 mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.price !== "$0" && (
                    <span className="text-sm text-slate-600">/month</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm leading-relaxed ${plan.featured ? "text-slate-700" : "text-slate-600"
                        }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full !rounded-full !py-3 !font-semibold text-sm transition-all ${plan.featured
                    ? "!bg-indigo-600 !text-white hover:!bg-indigo-700 shadow-lg hover:shadow-xl"
                    : "!bg-slate-100 !text-slate-900 hover:!bg-slate-200"
                  }`}
              >
                {plan.cta}
              </Button>

              {/* Footer Text */}
              {plan.featured && (
                <p className="mt-4 text-center text-xs text-slate-600">
                  14-day free trial • No credit card required
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Link href="/register">
            <Button className="!rounded-full !bg-[#2f5dff] !text-white !px-8 !py-3 text-[15px] !font-semibold shadow-[0_12px_32px_rgba(47,93,255,0.35)] transition-all hover:-translate-y-0.5 hover:!bg-[#284de1] hover:shadow-[0_12px_36px_rgba(47,93,255,0.45)]">
              Try It Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="scroll-mt-24 border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
          {/* Main Footer Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* About Us Section */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 [font-family:var(--font-heading)]">
                About Us
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                StudySnap is an AI-powered learning platform that helps students and professionals turn meetings, lectures, and ideas into organized notes and smart flashcards.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-3">
                From capturing knowledge to mastering it, StudySnap supports your full learning workflow.
              </p>
            </div>

            {/* Product Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 [font-family:var(--font-heading)]">
                Product
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="#features" className="hover:text-slate-900 transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    AI Meeting Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Smart Notes
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Flashcards
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 [font-family:var(--font-heading)]">
                Resources
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-slate-900 transition">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-slate-900 transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Contact Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 [font-family:var(--font-heading)]">
                Legal & Contact
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-slate-900 transition">
                    Security
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@studysnap.com" className="hover:text-slate-900 transition">
                    support@studysnap.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Copyright Text */}
            <p className="text-sm text-slate-600">
              © 2026 StudySnap – Made for students and life long learners.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition"
                  aria-label={social.label}
                >
                  <img
                    src={social.src}
                    alt={social.label}
                    className="w-5 h-5 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
