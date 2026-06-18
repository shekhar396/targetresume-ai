import type { CSSProperties, ReactNode } from "react";
import type { Resume, ResumeContact } from "@/types/resume";

type ResumePreviewProps = {
  resume: Resume;
};

const safeAccentColors: Record<string, string> = {
  blue: "#2563eb",
  emerald: "#059669",
  green: "#059669",
  gray: "#475569",
  grey: "#475569",
  indigo: "#4f46e5",
  minimal: "#334155",
  navy: "#1d4ed8",
  purple: "#7c3aed",
  red: "#dc2626",
  slate: "#334155",
  teal: "#0f766e",
};

export function ResumePreview({ resume }: ResumePreviewProps) {
  const accentColor = resolveAccentColor(resume.presentation.accentColor);
  const toneClass = getToneClass(resume.presentation.styleTone);

  return (
    <article
      className={`bg-white px-6 py-7 text-[color:var(--foreground)] ring-1 ring-[color:var(--border)] sm:px-8 sm:py-9 ${toneClass}`}
    >
      <ResumeHeader accentColor={accentColor} resume={resume} />

      <div className="mt-6 space-y-6">
        <ResumeSection accentColor={accentColor} title="Professional Summary">
          <p className="text-sm leading-6 text-slate-700">
            {resume.professionalSummary}
          </p>
        </ResumeSection>

        {resume.coreSkills.length > 0 ? (
          <ResumeSection accentColor={accentColor} title="Core Skills">
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
        ) : null}

        {resume.experience.length > 0 ? (
          <ResumeSection accentColor={accentColor} title="Experience">
            <div className="space-y-5">
              {resume.experience.map((item) => (
                <div
                  className="break-inside-avoid"
                  key={`${item.company}-${item.title}-${item.startDate}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-base font-semibold text-slate-900">
                      {item.title}{" "}
                      <span className="font-normal text-slate-500">|</span>{" "}
                      {item.company}
                    </h4>
                    <p className="text-sm font-medium text-slate-600">
                      {item.startDate} - {item.endDate}
                    </p>
                  </div>
                  <BulletList items={item.bullets} />
                </div>
              ))}
            </div>
          </ResumeSection>
        ) : null}

        {resume.projects.length > 0 ? (
          <ResumeSection accentColor={accentColor} title="Projects">
            <div className="space-y-5">
              {resume.projects.map((project) => (
                <div className="break-inside-avoid" key={project.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-base font-semibold text-slate-900">
                      {project.name}
                    </h4>
                    {project.link ? (
                      <a
                        className="text-sm font-medium underline-offset-4 hover:underline"
                        href={project.link}
                        rel="noreferrer"
                        style={{ color: accentColor }}
                        target="_blank"
                      >
                        Project link
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {project.description}
                  </p>
                  {project.technologies?.length ? (
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {project.technologies.join(", ")}
                    </p>
                  ) : null}
                  {project.bullets?.length ? (
                    <BulletList items={project.bullets} />
                  ) : null}
                </div>
              ))}
            </div>
          </ResumeSection>
        ) : null}

        {resume.education.length > 0 ? (
          <ResumeSection accentColor={accentColor} title="Education">
            <div className="space-y-4">
              {resume.education.map((item) => (
                <div
                  className="break-inside-avoid"
                  key={`${item.institution}-${item.degree}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-base font-semibold text-slate-900">
                      {item.degree}
                      {item.field ? `, ${item.field}` : ""}
                    </h4>
                    <p className="text-sm font-medium text-slate-600">
                      {[item.startDate, item.endDate].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {item.institution}
                  </p>
                  {item.details?.length ? (
                    <BulletList items={item.details} />
                  ) : null}
                </div>
              ))}
            </div>
          </ResumeSection>
        ) : null}
      </div>
    </article>
  );
}

function ResumeHeader({
  accentColor,
  resume,
}: {
  accentColor: string;
  resume: Resume;
}) {
  const layout = resume.presentation.headerLayout;
  const borderStyle: CSSProperties = { borderColor: `${accentColor}55` };

  if (layout === "centered") {
    return (
      <header className="border-b pb-5 text-center" style={borderStyle}>
        <h2 className="text-3xl font-semibold leading-tight">
          {resume.candidateName}
        </h2>
        <p className="mt-2 text-base font-medium" style={{ color: accentColor }}>
          {resume.targetRole}
        </p>
        <ContactBlock
          accentColor={accentColor}
          className="mt-4 justify-center"
          contact={resume.contact}
        />
      </header>
    );
  }

  if (layout === "under-name") {
    return (
      <header className="border-b pb-5" style={borderStyle}>
        <h2 className="text-3xl font-semibold leading-tight">
          {resume.candidateName}
        </h2>
        <p className="mt-2 text-base font-medium" style={{ color: accentColor }}>
          {resume.targetRole}
        </p>
        <ContactBlock
          accentColor={accentColor}
          className="mt-4"
          contact={resume.contact}
        />
      </header>
    );
  }

  return (
    <header
      className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between"
      style={borderStyle}
    >
      <div>
        <h2 className="text-3xl font-semibold leading-tight">
          {resume.candidateName}
        </h2>
        <p className="mt-2 text-base font-medium" style={{ color: accentColor }}>
          {resume.targetRole}
        </p>
      </div>
      <ContactBlock
        accentColor={accentColor}
        className="sm:justify-end sm:text-right"
        contact={resume.contact}
      />
    </header>
  );
}

function ContactBlock({
  accentColor,
  className = "",
  contact,
}: {
  accentColor: string;
  className?: string;
  contact: ResumeContact;
}) {
  const contactItems = getContactItems(contact);

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 text-sm ${className}`}>
      {contactItems.map((item) =>
        item.href ? (
          <a
            className="underline-offset-4 hover:underline"
            href={item.href}
            key={item.label}
            rel="noreferrer"
            style={{ color: accentColor }}
            target="_blank"
          >
            {item.label}
          </a>
        ) : (
          <span className="text-slate-600" key={item.label}>
            {item.label}
          </span>
        ),
      )}
    </div>
  );
}

function ResumeSection({
  accentColor,
  children,
  title,
}: {
  accentColor: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <h3
        className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900"
        style={{ borderColor: `${accentColor}40` }}
      >
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

function getContactItems(contact: ResumeContact) {
  return [
    contact.email ? { href: `mailto:${contact.email}`, label: contact.email } : null,
    contact.phone ? { label: contact.phone } : null,
    contact.linkedinUrl
      ? { href: contact.linkedinUrl, label: "LinkedIn" }
      : null,
    contact.githubUrl ? { href: contact.githubUrl, label: "GitHub" } : null,
    contact.portfolioUrl
      ? { href: contact.portfolioUrl, label: "Portfolio" }
      : null,
    contact.location ? { label: contact.location } : null,
  ].filter((item): item is { href?: string; label: string } => Boolean(item));
}

function resolveAccentColor(value: string | undefined) {
  if (!value) {
    return "#0f766e";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (/^#[0-9a-f]{6}$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  return safeAccentColors[normalizedValue] ?? "#0f766e";
}

function getToneClass(styleTone: Resume["presentation"]["styleTone"]) {
  switch (styleTone) {
    case "classic":
      return "shadow-none";
    case "executive":
      return "shadow-sm";
    case "minimal":
      return "shadow-none";
    case "modern":
    default:
      return "shadow-sm";
  }
}
