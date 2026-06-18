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
- Optional additional instructions for user-directed tailoring.
- AI-powered profile analysis and resume generation.
- Structured resume output rendered as an HTML preview.
- PDF export through Playwright.
- Simple error handling and loading states.
- Environment-based OpenAI API configuration.

See [docs/mvp-scope.md](docs/mvp-scope.md) for the full scope and exclusions.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- npm
- OpenAI API
- Playwright for server-side PDF generation

PDF export is implemented with Playwright Chromium.

## Local Setup

Install dependencies:

```bash
npm install
```

Install the Playwright browser used for PDF export:

```bash
npx playwright install chromium
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Run the development server:

```bash
npm run dev
```

Check code quality:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Generate a PDF:

1. Run the app with `npm run dev`.
2. Open `/builder`.
3. Generate a resume preview.
4. Click `Download PDF`.

## Environment Variables

The application will require:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

`OPENAI_API_KEY` is read only by server-side API code. Do not prefix it with `NEXT_PUBLIC_`, and do not expose it to browser code.

Future production deployments may add variables for authentication, persistence, analytics, billing, and observability, but those are intentionally outside v1.0.

## Planned Folder Structure

```text
targetresume-ai/
  src/
    app/
      api/
        generate-resume/
        export-pdf/
      globals.css
      layout.tsx
      page.tsx
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

## Current App Shell

The repository now includes a minimal Next.js app with:

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
```

The landing page introduces TargetResume AI and the v1.0 workflow:

```text
LinkedIn text -> target role/company -> AI tailored resume -> HTML preview -> PDF export
```

The builder also accepts optional customization instructions, such as emphasizing a specific technology area, leadership experience, ATS screening, or one-page resume style. These instructions guide the AI only when they remain truthful to the provided profile and job context.

After generation, the resume preview can be exported as a downloadable PDF. PDF export uses the already generated resume JSON and does not call OpenAI again.

## Documentation

- [Vision](docs/vision.md)
- [MVP Scope](docs/mvp-scope.md)
- [Architecture](docs/architecture.md)
- [Release Plan](docs/release-plan.md)
- [Codex Workflow](docs/codex-workflow.md)

## Current Status

Project documentation, the Next.js application shell, the builder form, server-side OpenAI resume generation, HTML resume preview, and Playwright PDF export have been initialized.
