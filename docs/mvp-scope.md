# MVP Scope

TargetResume AI v1.0 focuses on one complete workflow: generate a tailored resume from professional profile text and export it as a PDF.

## Inputs

The v1.0 form will collect:

- LinkedIn/profile text.
- Target company.
- Target position.
- Optional job description.

The profile text can come from LinkedIn, a personal bio, an existing resume, or any professional summary the user chooses to paste.

## Core Features

- Analyze the user's professional background.
- Identify relevant skills, experience, projects, and achievements.
- Generate a tailored resume for the target company and position.
- Use the optional job description to improve alignment when provided.
- Render the generated resume in a clean HTML preview.
- Export the preview as a PDF using Playwright.
- Provide basic loading, validation, and error states.

## AI Output Expectations

The generated resume should include common professional resume sections:

- Name/contact placeholder area when contact details are present in source text.
- Professional summary.
- Skills.
- Experience.
- Projects or selected work, when relevant.
- Education, when available.

The system should avoid inventing unsupported employment history, credentials, or metrics. If source material is missing, the generated resume should stay conservative.

## Out Of Scope For v1.0

The following are intentionally excluded from the first release:

- User accounts and authentication.
- Resume history or database persistence.
- Payment, subscriptions, or billing.
- Multiple resume templates.
- Drag-and-drop resume editing.
- LinkedIn OAuth or automated LinkedIn scraping.
- Browser extensions.
- Applicant tracking system scoring.
- Automated job application submission.
- Collaboration features.
- Multi-language resume generation.
- Fine-tuned models or custom model training.

## MVP Quality Bar

Although the feature set is small, v1.0 should still be production-minded:

- TypeScript should be used throughout the app.
- OpenAI calls should run server-side only.
- API errors should be handled gracefully.
- Resume data should use a structured schema where practical.
- PDF export should be deterministic enough for a polished portfolio demo.
- Documentation should stay current as implementation decisions change.
