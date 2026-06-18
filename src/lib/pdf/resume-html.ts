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
        size: Letter;
        margin: 0.55in;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #172033;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        line-height: 1.45;
      }

      header {
        border-bottom: 1px solid #9aa8ba;
        padding-bottom: 12px;
        margin-bottom: 18px;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        color: #111827;
        font-size: 24pt;
        line-height: 1.1;
      }

      .target-role {
        color: #0f766e;
        font-size: 11.5pt;
        font-weight: 700;
        margin-top: 5px;
      }

      section {
        margin-top: 16px;
        break-inside: avoid;
      }

      h2 {
        border-bottom: 1px solid #d5dce6;
        color: #111827;
        font-size: 9.5pt;
        letter-spacing: 0.08em;
        margin-bottom: 8px;
        padding-bottom: 4px;
        text-transform: uppercase;
      }

      h3 {
        color: #111827;
        font-size: 10.75pt;
        font-weight: 700;
      }

      .muted {
        color: #526071;
        font-weight: 700;
      }

      .entry {
        margin-top: 10px;
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

      ul {
        margin: 6px 0 0;
        padding-left: 17px;
      }

      li {
        margin-top: 3px;
      }

      .skills {
        display: grid;
        gap: 5px 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        list-style: none;
        padding-left: 0;
      }

      .skills li {
        margin-top: 0;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(resume.candidateName)}</h1>
      <p class="target-role">${escapeHtml(resume.targetRole)}</p>
    </header>

    <section>
      <h2>Professional Summary</h2>
      <p>${escapeHtml(resume.professionalSummary)}</p>
    </section>

    <section>
      <h2>Core Skills</h2>
      <ul class="skills">
        ${resume.coreSkills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}
      </ul>
    </section>

    <section>
      <h2>Experience</h2>
      ${resume.experience.map(renderExperienceItem).join("")}
    </section>

    <section>
      <h2>Projects</h2>
      ${resume.projects.map(renderProjectItem).join("")}
    </section>

    <section>
      <h2>Education</h2>
      ${renderBulletList(resume.education)}
    </section>
  </body>
</html>`;
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
