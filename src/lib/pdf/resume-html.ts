import type {
  ResumeExperienceItem,
  ResumeProjectItem,
  TailoredResume,
} from "@/lib/openai/resume-generator";

export function renderResumeHtml(resume: TailoredResume) {
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

      .resume {
        background: #ffffff;
        border: 1px solid #d9e1ec;
        padding: 28px 32px;
      }

      header {
        border-bottom: 1px solid #cbd5e1;
        margin-bottom: 24px;
        padding-bottom: 20px;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        color: #111827;
        font-size: 26pt;
        font-weight: 700;
        line-height: 1.1;
      }

      .target-role {
        color: #0f766e;
        font-size: 12pt;
        font-weight: 600;
        margin-top: 8px;
      }

      .sections {
        display: grid;
        gap: 24px;
      }

      section {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      section,
      .entry {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      h2 {
        border-bottom: 1px solid #e2e8f0;
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
      <header>
        <h1>${escapeHtml(resume.candidateName)}</h1>
        <p class="target-role">${escapeHtml(resume.targetRole)}</p>
      </header>

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

function renderExperienceSection(items: ResumeExperienceItem[]) {
  if (items.length === 0) {
    return "";
  }

  return `<section>
    <h2>Experience</h2>
    ${items.map(renderExperienceItem).join("")}
  </section>`;
}

function renderProjectsSection(items: ResumeProjectItem[]) {
  if (items.length === 0) {
    return "";
  }

  return `<section>
    <h2>Projects</h2>
    ${items.map(renderProjectItem).join("")}
  </section>`;
}

function renderEducationSection(items: string[]) {
  if (items.length === 0) {
    return "";
  }

  return `<section>
    <h2>Education</h2>
    ${renderBulletList(items)}
  </section>`;
}

function renderExperienceItem(item: ResumeExperienceItem) {
  return `<div class="entry">
    <div class="entry-heading">
      <h3>${escapeHtml(item.role)}</h3>
      <p class="muted">${escapeHtml(item.company)}</p>
    </div>
    ${renderBulletList(item.highlights)}
  </div>`;
}

function renderProjectItem(item: ResumeProjectItem) {
  return `<div class="entry">
    <h3>${escapeHtml(item.name)}</h3>
    <p>${escapeHtml(item.description)}</p>
    ${renderBulletList(item.highlights)}
  </div>`;
}

function renderBulletList(items: string[]) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
