import Link from "next/link";
import { BuilderForm } from "./BuilderForm";

export default function BuilderPage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-8 lg:px-12">
      <section className="mx-auto w-full max-w-6xl">
        <nav className="flex items-center justify-between border-b border-[color:var(--border)] pb-5">
          <Link
            className="text-base font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--primary)]"
            href="/"
          >
            TargetResume AI
          </Link>
          <span className="text-sm font-medium text-[color:var(--muted)]">
            Builder shell
          </span>
        </nav>

        <header className="max-w-3xl py-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--primary)]">
            Resume builder
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-5xl">
            Start with the role, then shape the resume.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:var(--muted)]">
            Capture the source profile and target context now. The generation
            service will be connected after the frontend workflow is stable.
          </p>
        </header>

        <BuilderForm />
      </section>
    </main>
  );
}
