import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDot,
  FolderKanban,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { Avatar } from "@/components/ui";

const capabilities = [
  {
    icon: FolderKanban,
    title: "Projects",
    description:
      "Create focused workspaces with project members, lifecycle controls, and project-specific issues.",
  },
  {
    icon: CircleDot,
    title: "Issues",
    description:
      "Track work with statuses, priorities, assignees, due dates, and structured issue management.",
  },
  {
    icon: Users,
    title: "Team access",
    description:
      "Control organization and project membership with clear role-based permissions.",
  },
  {
    icon: Layers3,
    title: "Labels",
    description:
      "Organize issues with reusable organization-level labels and flexible filtering.",
  },
];

const securityItems = [
  "Session-based authentication",
  "Argon2 password hashing",
  "HttpOnly authentication cookies",
  "Organization-level tenant isolation",
  "Server-side authorization",
  "Runtime request validation",
];

const architectureItems = [
  {
    name: "Next.js",
    description: "Application framework",
  },
  {
    name: "TypeScript",
    description: "Type-safe application layer",
  },
  {
    name: "PostgreSQL",
    description: "Relational data storage",
  },
  {
    name: "Drizzle",
    description: "Type-safe database access",
  },
  {
    name: "Zod",
    description: "Runtime validation",
  },
];

const issueRows = [
  {
    id: "WEB-24",
    title: "Improve authentication flow",
    status: "IN PROGRESS",
    priority: "HIGH",
  },
  {
    id: "WEB-23",
    title: "Add project member controls",
    status: "TODO",
    priority: "MEDIUM",
  },
  {
    id: "WEB-22",
    title: "Create label management",
    status: "DONE",
    priority: "LOW",
  },
  {
    id: "WEB-21",
    title: "Update dashboard layout",
    status: "IN REVIEW",
    priority: "HIGH",
  },
];

function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
        variant === "primary" && "bg-zinc-950 text-white hover:bg-zinc-800",
        variant === "secondary" &&
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-[26px] font-semibold tracking-tight">
            Sprintly
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="#product"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
              Product
            </Link>

            <Link
              href="#features"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
              Features
            </Link>

            <Link
              href="#security"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
              Security
            </Link>

            <Link
              href="#architecture"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
              Architecture
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/BharatBhati14"
              target="_blank"
              rel="noreferrer"
              aria-label="Sprintly on GitHub"
              className="hidden rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 sm:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.87-1.35-3.87-1.35-.53-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.75 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.04.78 2.1v3.11c0 .3.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/bharat-bhati-/"
              target="_blank"
              rel="noreferrer"
              aria-label="Sprintly on LinkedIn"
              className="hidden rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 sm:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="5" cy="5" r="1.5" />
                <rect x="3.5" y="8" width="3" height="12" rx="0.5" />
                <path
                  d="M10 8h3v1.7c.7-1.1 1.8-2 3.7-2
       3.2 0 4.3 2.1 4.3 5.3V20h-3v-6.4
       c0-1.5-.3-3-2-3s-2.4 1.2-2.4 3V20h-3V8Z"
                />
              </svg>
            </a>

            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 sm:block"
            >
              Sign in
            </Link>

            <ButtonLink href="/register">Get started</ButtonLink>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="border-t border-zinc-100 md:hidden">
          <nav className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-6 py-3">
            <Link
              href="#product"
              className="whitespace-nowrap text-xs font-medium text-zinc-600"
            >
              Product
            </Link>

            <Link
              href="#features"
              className="whitespace-nowrap text-xs font-medium text-zinc-600"
            >
              Features
            </Link>

            <Link
              href="#security"
              className="whitespace-nowrap text-xs font-medium text-zinc-600"
            >
              Security
            </Link>

            <Link
              href="#architecture"
              className="whitespace-nowrap text-xs font-medium text-zinc-600"
            >
              Architecture
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="overflow-hidden border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-15 lg:px-8 lg:py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                Project & issue management
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                Plan work.
                <br />
                Track progress.
                <br />
                Ship with clarity.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                Sprintly gives teams a structured workspace for organizations,
                projects, issues, members, and labels without losing control
                over who can access what.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/register">
                  Create an account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>

                <ButtonLink href="/login" variant="secondary">
                  Sign in
                </ButtonLink>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
                <span>Multi-tenant</span>
                <span>Role-based access</span>
                <span>Secure sessions</span>
                <span>PostgreSQL</span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative">
              <div className="absolute -inset-10 -z-10 rounded-full bg-zinc-100 blur-3xl" />

              <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-200/60">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50">
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>

                    <span className="text-[10px] font-medium text-zinc-400">
                      Sprintly Workspace
                    </span>

                    <div className="h-6 w-6 rounded-full bg-zinc-100">
                      <Avatar />
                    </div>
                  </div>

                  <div className="grid min-h-107.5 grid-cols-[145px_1fr]">
                    <div className="border-r border-zinc-200 p-4">
                      {/* <div className="mb-7 h-7 w-20 rounded-md bg-zinc-900" /> */}
                      <p className="text-[12px] font-medium text-zinc-500 border-b border-zinc-300 pb-3 mb-2">
                        My Organization
                      </p>

                      <div className="space-y-1.5">
                        {[
                          "Overview",
                          "Issues",
                          "Projects",
                          "Members",
                          "Labels",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className={cn(
                              "rounded-md px-3 py-2 text-[11px]",
                              index === 1
                                ? "bg-zinc-200 font-medium text-zinc-900"
                                : "text-zinc-500",
                            )}
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 border-t border-zinc-200 pt-4">
                        <p className="mb-3 text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                          Project
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                          <span className="h-2 w-2 rounded-full bg-zinc-900" />
                          Website
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                            Project
                          </p>

                          <h3 className="mt-1 text-base font-semibold">
                            Website Redesign
                          </h3>
                        </div>

                        <span className="rounded-md border border-zinc-200 px-2 py-1 text-[9px] text-zinc-500">
                          Active
                        </span>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-2">
                        {[
                          ["24", "Issues"],
                          ["8", "Members"],
                          ["6", "Labels"],
                        ].map(([value, label]) => (
                          <div
                            key={label}
                            className="rounded-lg border border-zinc-200 p-3"
                          >
                            <p className="text-lg font-semibold">{value}</p>

                            <p className="mt-1 text-[9px] text-zinc-500">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold">
                            Recent issues
                          </span>

                          <span className="text-[9px] text-zinc-400">
                            View all
                          </span>
                        </div>

                        <div className="space-y-2">
                          {issueRows.map((issue) => (
                            <div
                              key={issue.id}
                              className="flex items-center gap-2 rounded-lg border border-zinc-100 p-3"
                            >
                              <span className="font-mono text-[8px] text-zinc-400">
                                {issue.id}
                              </span>

                              <span className="min-w-0 flex-1 truncate text-[10px] text-zinc-700">
                                {issue.title}
                              </span>

                              <span className="hidden rounded-full bg-zinc-100 px-2 py-1 text-[7px] font-medium text-zinc-500 sm:block">
                                {issue.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((item) => (
                            <span
                              key={item}
                              className="h-6 w-6 rounded-full border-2 border-white bg-zinc-200"
                            />
                          ))}
                        </div>

                        <span className="text-[9px] text-zinc-400">
                          Workspace members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product */}
      <section id="product" className="scroll-mt-24 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-zinc-500">The product</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              One system for the work behind every project.
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-600">
              Sprintly connects organizations, projects, people, issues, and
              labels into one predictable structure.
            </p>
          </div>

          <div className="mt-8 lg:mt-14 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-4">
            {[
              ["01", "Organizations", "Define the tenant and its members."],
              ["02", "Projects", "Create focused spaces for initiatives."],
              ["03", "Issues", "Turn work into trackable units."],
              ["04", "Labels", "Classify and filter related work."],
            ].map(([number, title, description]) => (
              <div key={number} className="bg-white p-7">
                <span className="text-xs font-mono text-zinc-400">
                  {number}
                </span>

                <h3 className="mt-10 font-semibold">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 border-b border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-10 lg:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-zinc-500">Features</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The building blocks of organized work.
            </h2>
          </div>

          <div className="mt-8 lg:mt-12 grid gap-4 md:grid-cols-2">
            {capabilities.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-zinc-200 bg-white p-7"
                >
                  <Icon className="h-5 w-5 text-zinc-700" />

                  <h3 className="mt-7 font-semibold">{feature.title}</h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-24 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-medium text-zinc-500">How it works</p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                A simple hierarchy for complex work.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-600">
                Each level has a clear responsibility, making it easier to
                reason about access, ownership, and the work being managed.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  number: "01",
                  title: "Organization",
                  text: "Your primary workspace and tenant boundary.",
                },
                {
                  number: "02",
                  title: "Project",
                  text: "A focused area containing its own members and issues.",
                },
                {
                  number: "03",
                  title: "Issue",
                  text: "A concrete unit of work with status, priority, assignment, and dates.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="flex gap-5 rounded-xl border border-zinc-200 p-6"
                >
                  <span className="font-mono text-xs text-zinc-400">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="font-semibold">{item.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className="scroll-mt-24 border-b border-zinc-200 bg-zinc-950 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-24 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                <ShieldCheck className="h-5 w-5 text-zinc-300" />
              </div>

              <p className="mt-7 text-sm font-medium text-zinc-400">Security</p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Access is enforced where it matters.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-400">
                The frontend presents capabilities, but the server remains the
                authority for authentication, authorization, and tenant
                isolation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {securityItems.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300" />

                  <span className="text-sm text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section
        id="architecture"
        className="scroll-mt-24 border-b border-zinc-200"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-zinc-500">Architecture</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built on a modern TypeScript stack.
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-600">
              The application is designed around explicit boundaries between the
              UI, API, authorization, services, and database layers.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {architectureItems.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-zinc-200 p-6"
              >
                <h3 className="font-semibold">{item.name}</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-zinc-700">
              {[
                "Request",
                "Validation",
                "Authentication",
                "Authorization",
                "Service",
                "Database",
              ].map((item, index, items) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                    {item}
                  </span>

                  {index < items.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        {/* <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"> */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-16 md:py-20 lg:py-24 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Bring your work into one structured workspace.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-500">
            Create an organization, add your projects, and start managing issues
            with Sprintly.
          </p>

          <div className="mt-8">
            <ButtonLink href="/register">
              Create an account
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
        {/* </div> */}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Sprintly
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-500">
                A structured workspace for managing projects, issues, teams, and
                access.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold">Product</p>

              <div className="mt-4 space-y-3 text-sm text-zinc-500">
                <Link href="#product" className="block hover:text-zinc-950">
                  Product
                </Link>
                <Link href="#features" className="block hover:text-zinc-950">
                  Features
                </Link>
                <Link href="#security" className="block hover:text-zinc-950">
                  Security
                </Link>
                <Link
                  href="#architecture"
                  className="block hover:text-zinc-950"
                >
                  Architecture
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Account</p>

              <div className="mt-4 space-y-3 text-sm text-zinc-500">
                <Link href="/login" className="block hover:text-zinc-950">
                  Sign in
                </Link>
                <Link href="/register" className="block hover:text-zinc-950">
                  Create account
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Connect</p>

              <div className="mt-4 flex gap-2">
                <a
                  href="https://github.com/BharatBhati14"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="rounded-md border border-zinc-200 p-2.5 text-zinc-500 transition-colors hover:bg-zinc-950 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.87-1.35-3.87-1.35-.53-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.75 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.04.78 2.1v3.11c0 .3.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/in/bharat-bhati-/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-md border border-zinc-200 p-2.5 text-zinc-500 transition-colors hover:bg-zinc-950 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <circle cx="5" cy="5" r="1.5" />
                    <rect x="3.5" y="8" width="3" height="12" rx="0.5" />
                    <path
                      d="M10 8h3v1.7c.7-1.1 1.8-2 3.7-2
       3.2 0 4.3 2.1 4.3 5.3V20h-3v-6.4
       c0-1.5-.3-3-2-3s-2.4 1.2-2.4 3V20h-3V8Z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Sprintly</span>

            <span>Built with Next.js, TypeScript & PostgreSQL</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
