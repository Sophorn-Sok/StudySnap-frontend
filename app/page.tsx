import Link from "next/link";
import { Manrope, Playfair_Display } from "next/font/google";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

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
    title: "AI Meeting Notes",
    text: "Capture spoken ideas instantly and transform them into structured notes.",
    accentColor: "bg-sky-400",
  },
  {
    title: "Organized by Subject",
    text: "Automatically group study materials by topic, class, or exam timeline.",
    accentColor: "bg-indigo-400",
  },
  {
    title: "Smart Flashcards",
    text: "Turn long content into memory-focused cards with spaced repetition.",
    accentColor: "bg-amber-400",
  },
];

const processSteps = [
  {
    title: "Record or Paste",
    text: "Add lecture audio, meeting notes, or raw text from class.",
  },
  {
    title: "AI Summarizes",
    text: "StudySnap identifies key concepts and creates clean note blocks.",
  },
  {
    title: "Practice with Cards",
    text: "Review with interactive flashcards and active recall prompts.",
  },
  {
    title: "Track Progress",
    text: "Measure confidence across topics and focus where it matters.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$19",
    subtitle: "For solo learners",
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Pro",
    price: "$54",
    subtitle: "For power students",
    cta: "Choose Pro",
    featured: false,
  },
  {
    name: "Campus",
    price: "$89",
    subtitle: "For teams and classes",
    cta: "Contact Sales",
    featured: true,
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
        <section className="relative w-full" style={{backgroundImage: "url('/Asset/meeting.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '600px'}}>
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
            Build a complete learning loop from collecting ideas to retaining
            concepts with confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
            >
              <div className={`h-1.5 w-16 rounded-full ${card.accentColor}`} />
              <h3 className="mt-5 text-xl [font-family:var(--font-heading)]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl [font-family:var(--font-heading)]">
              Let AI take notes during meetings
            </h2>
            <p className="mt-4 max-w-xl text-slate-600">
              Capture every key detail while staying present in discussions.
              StudySnap builds structured summaries and clear action points.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
              <div className="h-60 bg-slate-800 p-5 text-white">
                <div className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.15em]">
                  Meeting in Progress
                </div>
                <p className="mt-5 max-w-xs text-2xl [font-family:var(--font-heading)]">
                  Product Review Sync with Engineering Team
                </p>
              </div>
              <div className="space-y-4 p-5">
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  Focused summary: release blockers, final ownership, and next
                  milestones identified in under 30 minutes.
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  Action items: finalize API schema, align QA checklist, and ship
                  beta notes by Friday.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.1)]">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Auto Transcript
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                &quot;The onboarding flow should prioritize first-time users,
                simplify permissions, and trigger reminders based on
                behavior.&quot;
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.1)]">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Key Questions
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>How do we reduce friction in week one?</li>
                <li>What are the top signals of student dropout?</li>
                <li>Which workflow should be automated first?</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)] md:p-8">
          <h2 className="text-3xl [font-family:var(--font-heading)] md:text-4xl">
            Powerful note organization
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Keep lecture summaries, research snippets, and revision plans grouped
            so nothing gets lost before exam day.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-100 p-5 md:col-span-2">
              <p className="text-sm font-semibold text-slate-700">Current Folder</p>
              <p className="mt-2 text-2xl [font-family:var(--font-heading)]">
                Software Engineering Lecture
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <li>Week 1: System Design Basics</li>
                <li>Week 2: API Strategies</li>
                <li>Week 3: Event Architecture</li>
                <li>Week 4: Testing and Rollout</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[#e8efff] p-5">
              <p className="text-sm font-semibold text-blue-700">Quick Actions</p>
              <button className="mt-4 w-full rounded-full bg-[#2f5dff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#284de1]">
                Generate Summary
              </button>
              <button className="mt-3 w-full rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                Create Flashcards
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid gap-10 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_45px_rgba(15,23,42,0.1)] lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl sm:text-4xl [font-family:var(--font-heading)]">
              Turn knowledge into long-term memory
            </h2>
            <p className="mt-4 text-slate-600">
              StudySnap converts your notes into active recall prompts and spaced
              repetition decks that improve retention.
            </p>
            <div className="mt-7 space-y-3">
              <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                Question: What is memoization in dynamic programming?
              </div>
              <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                Question: Explain REST constraints in one sentence.
              </div>
              <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                Question: When should indexing be avoided?
              </div>
            </div>
          </div>

          <div className="relative min-h-72 rounded-2xl bg-[#f9fafb] p-6">
            <div className="absolute left-5 top-6 w-40 rounded-xl bg-white p-3 text-xs shadow-md">
              Recall Score: 74%
            </div>
            <div className="absolute right-5 top-20 w-44 rounded-xl bg-white p-3 text-xs shadow-md">
              Next Review: 2h
            </div>
            <div className="absolute bottom-6 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-lg">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Flashcard Preview
              </p>
              <p className="mt-3 text-xl [font-family:var(--font-heading)]">
                What is encapsulation?
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Bundling data and methods while restricting direct access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-6xl scroll-mt-32 px-6 py-14 md:px-10 md:py-20"
      >
        <h2 className="text-center text-3xl [font-family:var(--font-heading)] md:text-4xl">
          How It Works
        </h2>
        <p className="mt-3 text-center text-slate-600">
          Build your study workflow in four simple steps.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-lg [font-family:var(--font-heading)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="mx-auto w-full max-w-6xl scroll-mt-32 px-6 pb-20 md:px-10 md:pb-24"
      >
        <div className="rounded-[2rem] border border-slate-200 bg-[#f9fafb] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)] md:p-9">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl [font-family:var(--font-heading)] md:text-4xl">
                Plans and Pricing
              </h2>
              <p className="mt-3 max-w-xl text-slate-600">
                Start free, then upgrade when you need advanced AI limits and
                collaboration.
              </p>
            </div>
            <button className="w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              Monthly Billing
            </button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.featured
                    ? "border-[#1f2d5f] bg-[#1f2d5f] text-white shadow-[0_20px_45px_rgba(31,45,95,0.4)]"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.12em]">{plan.name}</p>
                <p className="mt-4 text-4xl [font-family:var(--font-heading)]">{plan.price}</p>
                <p className={`mt-2 text-sm ${plan.featured ? "text-slate-200" : "text-slate-600"}`}>
                  {plan.subtitle}
                </p>
                <ul className={`mt-6 space-y-2 text-sm ${plan.featured ? "text-slate-100" : "text-slate-600"}`}>
                  <li>Unlimited note generation</li>
                  <li>Auto flashcards and quizzes</li>
                  <li>Export to PDF and Notion</li>
                </ul>
                <button
                  className={`mt-7 w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-white text-[#1f2d5f] hover:bg-slate-100"
                      : "bg-[#2f5dff] text-white hover:bg-[#284de1]"
                  }`}
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="about" className="scroll-mt-24 border-t border-slate-200 bg-white/80">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-4 md:px-10">
          <div className="md:col-span-2">
            <a className="text-2xl [font-family:var(--font-heading)]" href="/">
              StudySnap
            </a>
            <p className="mt-3 max-w-sm text-sm text-slate-600">
              Build stronger study habits with AI support that keeps your notes,
              meetings, and revision cards in one place.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Features</li>
              <li>Pricing</li>
              <li>Roadmap</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>About</li>
              <li>Contact</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
