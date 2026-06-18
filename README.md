# TargetResume AI

TargetResume AI is a portfolio-ready SaaS-style application for generating company-specific resumes from a user's LinkedIn or professional profile text. The product helps candidates translate their background into a focused, polished resume for a target company and role, then export the result as a professional PDF.

The v1.0 release is intentionally narrow: collect profile context, target company, target position, and an optional job description; generate a tailored resume with the OpenAI API; render a clean HTML preview; and export the preview to PDF with Playwright.

## Product Goals

- Turn broad LinkedIn/profile content into a targeted resume narrative.
- Make resume tailoring faster while keeping the user in control of the source material.
- Demonstrate production-minded AI application design with a clear MVP boundary.
- Provide a GitHub-ready project that is easy for recruiters, reviewers, and collaborators to understand.

## v1.0 Scope

The initial version will support:

- LinkedIn/profile text input.
- Target company input.
- Target position input.
- Optional job description input.
- AI-powered profile analysis and resume generation.
- Structured resume output rendered as an HTML preview.
- PDF export through Playwright.
- Simple error handling and loading states.
- Environment-based OpenAI API configuration.

See [docs/mvp-scope.md](docs/mvp-scope.md) for the full scope and exclusions.

## Planned Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API
- Playwright for server-side PDF generation

## Environment Variables

The application will require:

```env
OPENAI_API_KEY=
```

Future production deployments may add variables for authentication, persistence, analytics, billing, and observability, but those are intentionally outside v1.0.

## Planned Folder Structure

```text
targetresume-ai/
  app/
    api/
      generate-resume/
      export-pdf/
    page.tsx
    layout.tsx
  components/
    resume/
    ui/
  lib/
    openai.ts
    prompts.ts
    resume-schema.ts
    pdf.ts
  docs/
  public/
  tests/
```

The exact structure may evolve during implementation, but v1.0 should remain compact and easy to review.

## Documentation

- [Vision](docs/vision.md)
- [MVP Scope](docs/mvp-scope.md)
- [Architecture](docs/architecture.md)
- [Release Plan](docs/release-plan.md)
- [Codex Workflow](docs/codex-workflow.md)

## Current Status

Project documentation has been initialized. Application code has not been scaffolded yet.
