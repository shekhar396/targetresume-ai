import type { TailoredResume } from "@/lib/openai/resume-generator";

type ResumePreviewProps = {
  resume: TailoredResume;
};

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <article className="bg-white px-6 py-7 text-[color:var(--foreground)] shadow-sm ring-1 ring-[color:var(--border)] sm:px-8 sm:py-9">
      <header className="border-b border-slate-300 pb-5">
        <h2 className="text-3xl font-semibold leading-tight">
          {resume.candidateName}
        </h2>
        <p className="mt-2 text-base font-medium text-[color:var(--primary)]">
          {resume.targetRole}
        </p>
      </header>

      <div className="mt-6 space-y-6">
        <ResumeSection title="Professional Summary">
          <p className="text-sm leading-6 text-slate-700">
            {resume.professionalSummary}
          </p>
        </ResumeSection>

        <ResumeSection title="Core Skills">
          <ul className="grid gap-2 sm:grid-cols-2">
            {resume.coreSkills.map((skill) => (
              <li
                className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                key={skill}
              >
                {skill}
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection title="Experience">
          <div className="space-y-5">
            {resume.experience.map((item) => (
              <div key={`${item.company}-${item.role}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-base font-semibold text-slate-900">
                    {item.role}
                  </h4>
                  <p className="text-sm font-medium text-slate-600">
                    {item.company}
                  </p>
                </div>
                <BulletList items={item.highlights} />
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Projects">
          <div className="space-y-5">
            {resume.projects.map((project) => (
              <div key={project.name}>
                <h4 className="text-base font-semibold text-slate-900">
                  {project.name}
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {project.description}
                </p>
                <BulletList items={project.highlights} />
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Education">
          <BulletList items={resume.education} />
        </ResumeSection>
      </div>
    </article>
  );
}

function ResumeSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section>
      <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 pl-4">
      {items.map((item) => (
        <li className="list-disc text-sm leading-6 text-slate-700" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
