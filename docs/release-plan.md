# Release Plan

TargetResume AI will be built in small, reviewable increments. The v1.0 release should demonstrate one polished workflow rather than many partial features.

## Phase 1: Project Initialization

- Initialize the Next.js app with TypeScript and Tailwind CSS.
- Add linting and formatting defaults.
- Create the initial app shell.
- Configure environment variable documentation.
- Confirm local development scripts.

## Phase 2: Resume Generation Workflow

- Build the input form for profile text, target company, target position, and optional job description.
- Add server-side OpenAI integration.
- Define a structured resume data shape.
- Render the generated resume preview.
- Add loading, empty, and error states.

## Phase 3: PDF Export

- Create a print-friendly resume layout.
- Add a PDF export API route.
- Use Playwright to render the resume and return a PDF.
- Test PDF output for readability, margins, and section flow.

## Phase 4: Polish And Portfolio Readiness

- Refine UI spacing, typography, and responsive behavior.
- Improve prompt quality and output consistency.
- Add basic tests for critical utilities or API behavior.
- Update documentation to reflect final v1.0 implementation.
- Prepare screenshots or demo notes for GitHub.

## v1.0 Release Checklist

- User can submit all required inputs.
- Resume generation works with `OPENAI_API_KEY`.
- Resume preview is readable and professional.
- PDF export works locally.
- Empty, loading, and error states are handled.
- README and docs reflect actual implementation.
- No secrets are committed.

## Future Roadmap

After v1.0, the product can grow in focused directions:

- Editable resume sections before export.
- Multiple resume templates.
- Resume version history.
- User accounts and saved resumes.
- Job description keyword comparison.
- Cover letter generation.
- Export to DOCX.
- Authentication and billing.
- Deployment with observability and rate limiting.
- Team or career-coach collaboration features.

Future work should be added only after the core generate-preview-export workflow feels reliable.
