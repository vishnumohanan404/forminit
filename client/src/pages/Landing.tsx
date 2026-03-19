import Logo from "@/components/svg/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import {
  LayoutTemplate,
  Share2,
  BarChart2,
  FolderOpen,
  Puzzle,
  Zap,
  ArrowRight,
  Type,
  AlignLeft,
  ListChecks,
  ChevronDown,
  Star,
  Calendar,
  Mail,
} from "lucide-react";

const Landing = () => {
  const { user } = useAuth();
  return (
    <main className="bg-background text-foreground">
      {/* ── Navbar ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            to="#"
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8">
              <Logo />
            </div>
            <span className="font-semibold">FormInIt</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5 leading-none">
              beta
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <Link to="/dashboard">
              <Button size="sm">{user ? "Dashboard" : "Start free"}</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="container mx-auto grid max-w-[1100px] px-4 py-20 md:grid-cols-2 md:gap-16 md:py-32">
        <div className="flex flex-col justify-center gap-5 hero-fade-in">
          <div className="inline-flex items-center gap-2 w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Notion-like form builder
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Build forms like you
            <br />
            write in Notion.
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg max-w-md">
            Add blocks, reorder questions, publish a link — collect responses with rich analytics.
            No code, no drag-and-drop fatigue.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/dashboard">
              <Button className="gap-2">
                Create your first form
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline">See how it works</Button>
            </a>
          </div>
        </div>

        {/* Editor mockup */}
        <div className="hidden md:flex items-center justify-center">
          <div className="border border-border bg-card rounded-sm w-full max-w-[380px] overflow-hidden">
            {/* Mockup toolbar */}
            <div className="border-b border-border px-3 py-2 flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="ml-3 h-2 w-28 bg-muted rounded-sm" />
            </div>
            {/* Mockup form title */}
            <div className="px-5 pt-5 pb-3 border-b border-border">
              <div className="h-4 w-40 bg-muted rounded-sm mb-1.5" />
              <div className="h-2.5 w-24 bg-muted/60 rounded-sm" />
            </div>
            {/* Mockup blocks */}
            <div className="px-5 py-4 space-y-4">
              <MockBlock
                icon={<Type className="h-3.5 w-3.5" />}
                label="Short Answer"
                inputHeight="h-7"
              />
              <MockBlock
                icon={<ListChecks className="h-3.5 w-3.5" />}
                label="Multiple Choice"
                choices
              />
              <MockBlock
                icon={<Star className="h-3.5 w-3.5" />}
                label="Rating"
                rating
              />
            </div>
            {/* Mockup footer */}
            <div className="border-t border-border px-5 py-3 flex justify-end">
              <div className="h-7 w-16 bg-primary/30 rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto max-w-[1100px] px-4 py-6 grid grid-cols-3 divide-x divide-border text-center">
          {stats.map(s => (
            <div
              key={s.label}
              className="px-4 py-2"
            >
              <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="container mx-auto max-w-[1100px] px-4 py-20 md:py-28"
      >
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
          Three steps to your first response
        </h2>
        <p className="mt-2 text-muted-foreground max-w-lg">
          FormInIt keeps the flow simple — spend time on questions, not the tool.
        </p>

        <div className="mt-12 grid gap-px grid-cols-1 md:grid-cols-3 border border-border rounded-sm overflow-hidden">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="bg-card p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium tabular-nums text-muted-foreground border border-border rounded px-1.5 py-0.5">
                  0{i + 1}
                </span>
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Block types ──────────────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto max-w-[1100px] px-4 py-16">
          <SectionLabel>Block library</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Every input type you need</h2>
          <p className="mt-2 text-muted-foreground">
            Mix and match blocks to build any kind of form.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {blockTypes.map(b => (
              <div
                key={b.label}
                className="flex items-center gap-2.5 rounded-sm border border-border bg-background px-3 py-2.5"
              >
                <b.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section
        id="features"
        className="container mx-auto max-w-[1100px] px-4 py-20 md:py-28"
      >
        <SectionLabel>Features</SectionLabel>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Everything in one place</h2>
        <p className="mt-2 text-muted-foreground max-w-lg">
          Designed for speed — from blank canvas to live form in minutes.
        </p>

        <div className="mt-12 grid gap-px grid-cols-1 md:grid-cols-3 border border-border rounded-sm overflow-hidden">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-card p-5 flex flex-col gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-medium text-sm">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        id="get-started"
        className="border-t border-b border-border"
      >
        <div className="container mx-auto max-w-[1100px] px-4 py-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-balance text-xl font-semibold md:text-2xl">
              Start building for free
            </h3>
            <p className="mt-1.5 text-muted-foreground max-w-md">
              Unlimited drafts during beta. Organize forms by workspace and publish when ready.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/dashboard">
              <Button className="gap-2">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline">Explore features</Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FormInIt</p>
          </div>
          <nav className="flex gap-4 text-sm">
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
};

export default Landing;

/* ── Sub-components ──────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium uppercase tracking-widest text-primary">{children}</span>
  );
}

function MockBlock({
  icon,
  label,
  inputHeight = "h-8",
  choices,
  rating,
}: {
  icon: React.ReactNode;
  label: string;
  inputHeight?: string;
  choices?: boolean;
  rating?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      {choices ? (
        <div className="space-y-1.5">
          {["Option A", "Option B", "Option C"].map(o => (
            <div
              key={o}
              className="flex items-center gap-2"
            >
              <div className="h-3 w-3 rounded-full border border-border shrink-0" />
              <div className="h-2 bg-muted rounded-sm w-16" />
            </div>
          ))}
        </div>
      ) : rating ? (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <div
              key={n}
              className={`h-5 w-5 rounded-sm border ${n <= 3 ? "bg-primary/20 border-primary/40" : "border-border bg-muted/40"}`}
            />
          ))}
        </div>
      ) : (
        <div className={`${inputHeight} w-full rounded-sm border border-border bg-input`} />
      )}
    </div>
  );
}

/* ── Data ────────────────────────────────────────────────────── */

const stats = [
  { value: "8+", label: "Block types" },
  { value: "∞", label: "Forms during beta" },
  { value: "100%", label: "Free right now" },
];

const steps = [
  {
    icon: LayoutTemplate,
    title: "Build with blocks",
    description:
      "Add questions as blocks — short answer, rating, dropdown, multiple choice and more. Reorder them freely.",
  },
  {
    icon: Share2,
    title: "Publish a link",
    description:
      "One click to publish. Share the public link anywhere — email, Slack, or embed on a page.",
  },
  {
    icon: BarChart2,
    title: "Collect & analyze",
    description:
      "Responses appear in real time. See per-question analytics: averages, option distributions, response counts.",
  },
];

const blockTypes = [
  { label: "Short Answer", icon: Type },
  { label: "Long Answer", icon: AlignLeft },
  { label: "Multiple Choice", icon: ListChecks },
  { label: "Dropdown", icon: ChevronDown },
  { label: "Rating", icon: Star },
  { label: "Date", icon: Calendar },
  { label: "Email", icon: Mail },
  { label: "Question Title", icon: Type },
];

const features = [
  {
    icon: LayoutTemplate,
    title: "Visual block editor",
    description:
      "Edit forms inline, reorder blocks, and customize question types without touching code.",
  },
  {
    icon: Puzzle,
    title: "Rich input types",
    description:
      "Text, long answer, multiple choice, dropdown, rating, date, email — more arriving each release.",
  },
  {
    icon: Share2,
    title: "Publish & share",
    description: "Share a public link instantly. Forms are live the moment you hit publish.",
  },
  {
    icon: BarChart2,
    title: "Response analytics",
    description:
      "Per-question breakdowns: rating averages, choice distributions, and completion trends.",
  },
  {
    icon: FolderOpen,
    title: "Workspaces",
    description:
      "Separate areas for school, work, or side projects — organize forms by team or context.",
  },
  {
    icon: Zap,
    title: "Fast by design",
    description:
      "No drag-and-drop fatigue. Add a block, type a question, publish — done in minutes.",
  },
];
