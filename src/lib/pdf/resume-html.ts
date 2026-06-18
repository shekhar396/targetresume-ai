import type {
  Resume,
  ResumeContact,
  ResumeExperience,
  ResumeProject,
} from "@/types/resume";

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

export function renderResumeHtml(resume: Resume) {
  const accentColor = resolveAccentColor(resume.presentation.accentColor);
  const toneClass = resume.presentation.styleTone ?? "modern";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(resume.candidateName)} Resume</title>
    <style>
      @page {
        size: A4;
        margin: 14mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        background: #ffffff;
        color: #172033;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10pt;
        line-height: 1.5;
        margin: 0;
      }

      a {
        color: ${accentColor};
        text-decoration: none;
      }

      .resume {
        background: #ffffff;
        border: ${toneClass === "minimal" ? "0" : "1px solid #d9e1ec"};
        padding: ${toneClass === "minimal" ? "18px 10px" : "28px 32px"};
      }

      header {
        border-bottom: 1px solid ${accentColor}55;
        margin-bottom: 24px;
        padding-bottom: 20px;
      }

      .header-top-right {
        align-items: flex-start;
        display: flex;
        gap: 20px;
        justify-content: space-between;
      }

      .header-centered {
        text-align: center;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        color: #111827;
        font-size: ${toneClass === "classic" ? "24pt" : "26pt"};
        font-weight: 700;
        line-height: 1.1;
      }

      .target-role {
        color: ${accentColor};
        font-size: 12pt;
        font-weight: 600;
        margin-top: 8px;
      }

      .contact {
        color: #475569;
        display: flex;
        flex-wrap: wrap;
        font-size: 9.5pt;
        gap: 5px 12px;
        margin-top: 14px;
      }

      .header-top-right .contact {
        justify-content: flex-end;
        margin-top: 0;
        max-width: 260px;
        text-align: right;
      }

      .header-centered .contact {
        justify-content: center;
      }

      .sections {
        display: grid;
        gap: 24px;
      }

      section,
      .entry {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      h2 {
        border-bottom: 1px solid ${accentColor}40;
        color: #111827;
        font-size: 10pt;
        font-weight: 700;
        letter-spacing: 0.12em;
        margin-bottom: 12px;
        padding-bottom: 8px;
        text-transform: uppercase;
      }

      h3 {
        color: #111827;
        font-size: 11pt;
        font-weight: 700;
      }

      p {
        color: #334155;
      }

      .entry {
        margin-top: 20px;
      }

      .entry:first-child {
        margin-top: 0;
      }

      .entry-heading {
        align-items: baseline;
        display: flex;
        gap: 12px;
        justify-content: space-between;
      }

      .muted {
        color: #475569;
        font-size: 10pt;
        font-weight: 600;
      }

      ul {
        margin: 12px 0 0;
        padding-left: 18px;
      }

      li {
        color: #334155;
        margin-top: 7px;
      }

      .skills {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        list-style: none;
        margin-top: 0;
        padding-left: 0;
      }

      .skills li {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #334155;
        font-weight: 600;
        margin-top: 0;
        padding: 8px 10px;
      }
    </style>
  </head>
  <body>
    <article class="resume">
      ${renderHeader(resume, accentColor)}

      <div class="sections">
        <section>
          <h2>Professional Summary</h2>
          <p>${escapeHtml(resume.professionalSummary)}</p>
        </section>

        ${renderSkillsSection(resume.coreSkills)}

        ${renderExperienceSection(resume.experience)}

        ${renderProjectsSection(resume.projects)}

        ${renderEducationSection(resume.education)}
      </div>
    </article>
  </body>
</html>`;
}

function renderHeader(resume: Resume, accentColor: string) {
  const layout = resume.presentation.headerLayout;
  const contact = renderContact(resume.contact);

  if (layout === "centered") {
    return `<header class="header-centered">
      <h1>${escapeHtml(resume.candidateName)}</h1>
      <p class="target-role">${escapeHtml(resume.targetRole)}</p>
      ${contact}
    </header>`;
  }

  if (layout === "under-name") {
    return `<header>
      <h1>${escapeHtml(resume.candidateName)}</h1>
      <p class="target-role">${escapeHtml(resume.targetRole)}</p>
      ${contact}
    </header>`;
  }

  return `<header class="header-top-right">
    <div>
      <h1>${escapeHtml(resume.candidateName)}</h1>
      <p class="target-role">${escapeHtml(resume.targetRole)}</p>
    </div>
    ${contact || `<span style="color:${accentColor}"></span>`}
  </header>`;
}

function renderContact(contact: ResumeContact) {
  const items = getContactItems(contact);

  if (items.length === 0) {
    return "";
  }

  return `<div class="contact">${items
    .map((item) =>
      item.href
        ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`
        : `<span>${escapeHtml(item.label)}</span>`,
    )
    .join("")}</div>`;
}

function renderSkillsSection(skills: string[]) {
  if (skills.length === 0) {
    return "";
  }

  return `<section>
    <h2>Core Skills</h2>
    <ul class="skills">
      ${skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}
    </ul>
  </section>`;
}

function renderExperienceSection(items: ResumeExperience[]) {
  if (items.length === 0) {
    return "";
  }

  return `<section>
    <h2>Experience</h2>
    ${items.map(renderExperienceItem).join("")}
  </section>`;
}

function renderProjectsSection(items: ResumeProject[]) {
  if (items.length === 0) {
    return "";
  }

  return `<section>
    <h2>Projects</h2>
    ${items.map(renderProjectItem).join("")}
  </section>`;
}

function renderEducationSection(items: Resume["education"]) {
  if (items.length === 0) {
    return "";
  }

  return `<section>
    <h2>Education</h2>
    ${items
      .map(
        (item) => `<div class="entry">
          <div class="entry-heading">
            <h3>${escapeHtml(item.degree)}${item.field ? `, ${escapeHtml(item.field)}` : ""}</h3>
            <p class="muted">${escapeHtml(
              [item.startDate, item.endDate].filter(Boolean).join(" - "),
            )}</p>
          </div>
          <p>${escapeHtml(item.institution)}</p>
          ${item.details?.length ? renderBulletList(item.details) : ""}
        </div>`,
      )
      .join("")}
  </section>`;
}

function renderExperienceItem(item: ResumeExperience) {
  return `<div class="entry">
    <div class="entry-heading">
      <h3>${escapeHtml(item.title)} <span style="font-weight:400;color:#64748b">|</span> ${escapeHtml(item.company)}</h3>
      <p class="muted">${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</p>
    </div>
    ${renderBulletList(item.bullets)}
  </div>`;
}

function renderProjectItem(item: ResumeProject) {
  return `<div class="entry">
    <div class="entry-heading">
      <h3>${escapeHtml(item.name)}</h3>
      ${item.link ? `<a href="${escapeHtml(item.link)}">Project link</a>` : ""}
    </div>
    <p>${escapeHtml(item.description)}</p>
    ${item.technologies?.length ? `<p class="muted">${escapeHtml(item.technologies.join(", "))}</p>` : ""}
    ${item.bullets?.length ? renderBulletList(item.bullets) : ""}
  </div>`;
}

function renderBulletList(items: string[]) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
