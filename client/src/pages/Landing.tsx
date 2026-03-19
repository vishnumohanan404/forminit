import Logo from "@/components/svg/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <main>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            to="#"
            className="flex items-center gap-2"
          >
            <div className="h-10 w-10">
              <Logo />
            </div>
            <span className="font-semibold">forminit</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a
              href="#features"
              className="text-foreground/80 hover:text-foreground"
            >
              Features
            </a>
            <Link to={"/dashboard"}>
              <Button variant="default">Start free</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto grid max-w-[1050px] px-4 py-16 md:grid-cols-2 md:gap-10 md:py-24">
        <div className="flex flex-col justify-center gap-4 hero-fade-in">
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
            Build powerful forms.
            <br />
            Publish in minutes.
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            WYSIWYG forms with rich input types &amp; analytics.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Link to={"/dashboard"}>
              <Button>Create your first form</Button>
            </Link>
            <a href="#features">
              <Button variant="ghost">See features</Button>
            </a>
          </div>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <div className="border border-border bg-card p-4 rounded-sm w-full max-w-[360px] space-y-3">
            <div className="h-3 bg-muted rounded-sm w-3/4" />
            <div className="h-3 bg-muted rounded-sm w-1/2" />
            <div className="h-8 bg-muted/50 rounded-sm w-full" />
            <div className="h-3 bg-muted rounded-sm w-2/3" />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="container mx-auto max-w-[1300px] px-4 py-16 md:py-24"
      >
        <div className="grid gap-px grid-cols-1 md:grid-cols-3 border border-border rounded-sm overflow-hidden">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-card p-5"
            >
              <p className="font-medium text-sm mb-1">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="get-started"
        className="container mx-auto max-w-[1300px] px-4 py-16 md:py-24"
      >
        <div className="border-t border-b border-border py-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-balance text-xl font-semibold md:text-2xl">
              Start building for free
            </h3>
            <p className="mt-1 text-muted-foreground">
              Unlimited drafts during beta. Keep your workspaces organized and publish when ready.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={"/dashboard"}>
              <Button>Get started</Button>
            </Link>
            <a
              href="#features"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-border px-4 text-sm font-medium hover:bg-accent"
            >
              Explore features
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-sm text-foreground/70">© {new Date().getFullYear()} FormInit</p>
            <nav className="flex gap-4 text-sm">
              <a
                href="#features"
                className="text-foreground/70 hover:text-foreground"
              >
                Features
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;

const features = [
  {
    title: "Visual WYSIWYG",
    description: "Edit forms inline, reorder blocks, and customize styles without touching code.",
  },
  {
    title: "Rich Inputs",
    description: "Text fields, text editors, multi‑choice, and more arriving each release.",
  },
  {
    title: "Publish & Collect",
    description: "Share a public link instantly. Submissions are stored and easy to export.",
  },
  {
    title: "Analytics",
    description: "See views, conversion, and completion trends to optimize your forms.",
  },
  {
    title: "Workspaces",
    description: "Separate areas for school, college, work—organize forms by team or context.",
  },
  {
    title: "Fully Customizable",
    description: "Add logic, tweak styles, and extend with components as your needs grow.",
  },
];
