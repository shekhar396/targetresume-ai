import Link from "next/link";

const workflowSteps = [
  "LinkedIn text",
  "Target role/company",
  "AI tailored resume",
  "HTML preview",
  "PDF export",
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-8 lg:px-12">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-between gap-12">
        <nav className="flex items-center justify-between border-b border-[color:var(--border)] pb-5">
          <span className="text-base font-semibold text-[color:var(--foreground)]">
            TargetResume AI
          </span>
          <span className="text-sm font-medium text-[color:var(--muted)]">
            v1.0
          </span>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--primary)]">
              Resume tailoring workspace
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
              TargetResume AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
              Turn existing profile context into a focused resume draft for a
              specific role and company.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[color:var(--primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2"
                href="/builder"
              >
                Start Building Resume
              </Link>
              <span className="text-sm text-[color:var(--muted)]">
                OpenAI and PDF export arrive after the workflow shell.
              </span>
            </div>
          </div>

          <div
            className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm"
            id="workflow"
          >
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-[color:var(--border)] pb-4">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
                  v1.0 Workflow
                </h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  A focused path from profile text to reviewable resume.
                </p>
              </div>
              <span className="rounded-sm bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                MVP
              </span>
            </div>

            <ol className="space-y-3">
              {workflowSteps.map((step, index) => (
                <li
                  className="flex items-center gap-3 border border-[color:var(--border)] bg-slate-50 p-4"
                  key={step}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-base font-medium text-[color:var(--foreground)]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid gap-4 border-t border-[color:var(--border)] pt-6 text-sm text-[color:var(--muted)] sm:grid-cols-3">
          <p>Paste profile context.</p>
          <p>Define the role and company.</p>
          <p>Review before export.</p>
        </div>
      </section>
    </main>
  );
}
