# Architecture

TargetResume AI v1.0 will use a compact Next.js architecture with server-side AI and PDF generation routes.

## High-Level Flow

1. User enters profile text, target company, target position, and optional job description.
2. The client submits the form to a server route.
3. The server route builds a structured prompt and calls the OpenAI API.
4. The response is normalized into resume data.
5. The client renders an HTML resume preview.
6. When the user exports, a PDF route renders the resume HTML and uses Playwright to generate a PDF.

## Planned Stack

- Next.js for the application framework.
- TypeScript for type safety.
- Tailwind CSS for styling.
- OpenAI API for resume analysis and generation.
- Playwright for PDF rendering.

## Planned Folder Structure

```text
targetresume-ai/
  app/
    api/
      generate-resume/
        route.ts
      export-pdf/
        route.ts
    layout.tsx
    page.tsx
    globals.css
  components/
    resume/
      ResumePreview.tsx
      ResumeSection.tsx
    ui/
      Button.tsx
      Textarea.tsx
      TextInput.tsx
  lib/
    openai.ts
    prompts.ts
    resume-schema.ts
    pdf.ts
  docs/
  public/
  tests/
```

This structure is a starting point, not a commitment to unnecessary abstraction. The implementation should stay small until real complexity appears.

## API Routes

### `POST /api/generate-resume`

Responsibilities:

- Validate form input.
- Build the OpenAI prompt.
- Call the OpenAI API using `OPENAI_API_KEY`.
- Return structured resume data for the preview.

### `POST /api/export-pdf`

Responsibilities:

- Accept resume data or rendered resume HTML.
- Render the resume in a controlled HTML document.
- Use Playwright to generate a PDF.
- Return the PDF as a downloadable response.

## Environment Variables

Required for v1.0:

```env
OPENAI_API_KEY=
```

Recommended later:

```env
OPENAI_MODEL=
APP_BASE_URL=
```

`OPENAI_API_KEY` must remain server-side. It should never be exposed to browser code.

## OpenAI Strategy

The app should use a structured prompt that asks the model to:

- Extract relevant background from the profile text.
- Emphasize experience related to the target position.
- Use the job description as guidance when available.
- Return predictable structured data suitable for rendering.
- Avoid fabricating unsupported details.

## PDF Export Strategy

Playwright will be used because browser-based rendering gives better control over layout fidelity than manually assembling PDFs.

The planned approach:

- Build a print-friendly HTML resume document.
- Apply dedicated print styles for page size, spacing, typography, and section breaks.
- Launch Playwright server-side from the PDF route.
- Render the HTML in a headless browser page.
- Export with standard PDF settings, likely letter format for v1.0.

The generated PDF should look close to the HTML preview, with predictable margins and readable typography.

## Security And Reliability Notes

- Run OpenAI requests only from server routes.
- Validate input lengths before calling the model.
- Avoid logging full user profile text in production.
- Return user-friendly errors when AI or PDF generation fails.
- Keep the first version stateless to reduce operational complexity.
