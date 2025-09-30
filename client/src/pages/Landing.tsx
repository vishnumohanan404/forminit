import Logo from "@/components/svg/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SwipeableStackCards from "@/components/ui/swipeable-stack-cards";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const transition = { duration: 1, ease: [0.25, 0.1, 0.25, 1] };
const variants = {
  hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};
const Landing = () => {
  const { theme, setTheme } = useTheme();
  return (
    <main>
      {/* <div className="absolute top-0 -z-10 h-full w-full bg-white"> */}
      <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
      {/* </div> */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

            <Switch
              checked={theme === "dark" ? true : false}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </nav>
        </div>
      </header>
      <section className="container mx-auto grid max-w-[1300px] px-4 py-16 md:grid-cols-2 md:gap-10 md:py-24">
        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            <motion.div
              className="mx-auto max-w-[670px] flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.04 }}
            >
              <motion.div
                transition={transition}
                variants={variants}
              >
                Build powerful forms.
              </motion.div>
            </motion.div>
          </h1>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            <motion.div
              className="mx-auto max-w-[670px] flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.04 }}
            >
              <motion.div
                transition={transition}
                variants={variants}
              >
                Notion like.
              </motion.div>
            </motion.div>
          </h1>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            <motion.div
              className="mx-auto max-w-[670px] flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.04 }}
            >
              <motion.div
                transition={transition}
                variants={variants}
              >
                Publish in minutes.
              </motion.div>
            </motion.div>
          </h1>
          <p className="text-pretty text-base pt-6 text-foreground/80 md:text-lg">
            <motion.div
              className="mx-auto max-w-[670px] flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.04 }}
            >
              <motion.div
                transition={transition}
                variants={variants}
              >
                WYSIWYG forms with rich input types & analytics.
              </motion.div>
            </motion.div>
          </p>
          <div className="flex flex-col pt-3 gap-3 sm:flex-row">
            <motion.div
              className=""
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.04 }}
            >
              <motion.div
                transition={transition}
                variants={variants}
              >
                <Link to={"/dashboard"}>
                  <Button>Create your first form</Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className=""
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.04 }}
            >
              <motion.div
                transition={transition}
                variants={variants}
              >
                <Button variant={"ghost"}>See features</Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <motion.div
            className="mx-auto max-w-[670px] flex flex-col gap-10"
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.04 }}
          >
            <motion.div
              transition={transition}
              variants={{
                hidden: { filter: "blur(10px)", opacity: 0 },
                visible: { filter: "blur(0)", opacity: 1 },
              }}
            >
              <SwipeableStackCards />
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section
        id="features"
        className="container mx-auto max-w-[1300px] px-4 py-16 md:py-24"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(f => (
            <Card
              key={f.title}
              className="border-muted bg-card"
            >
              <CardHeader>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/75">{f.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section
        id="get-started"
        className="container mx-auto max-w-[1300px] px-4 py-16 md:py-24"
      >
        <Card className="border-muted bg-card">
          <CardContent className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-balance text-xl font-semibold md:text-2xl">
                Start building for free
              </h3>
              <p className="mt-1 text-foreground/75">
                Unlimited drafts during beta. Keep your workspaces organized and publish when ready.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to={"/dashboard"}>
                <Button className="">Get started</Button>
              </Link>
              <Link
                to="#features"
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
              >
                Explore features
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
      <footer className="border-t  py-10">
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
