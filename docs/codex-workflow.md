# Codex Workflow

Codex should be used as a disciplined development partner for TargetResume AI. The project should move forward through small, clear tasks rather than broad prompts that mix unrelated work.

## Working Principles

- One feature per prompt.
- Keep changes small and reviewable.
- Prefer existing project patterns once they exist.
- Update documentation when architecture, scope, scripts, or setup changes.
- Keep app code clean, typed, and easy to explain.
- Avoid speculative abstractions until the code needs them.

## Recommended Prompt Style

Good Codex prompts should include:

- The exact feature or fix to implement.
- Files or areas of the app that are relevant, if known.
- Any constraints, such as "do not add auth" or "do not change styling outside this component."
- The verification expected, such as running lint, typecheck, or a specific test.

Example:

```text
Initialize the Next.js app with TypeScript and Tailwind CSS for TargetResume AI.
Do not implement resume generation yet.
Create the basic app shell, confirm scripts, and update README setup instructions.
```

## Development Sequence

Recommended task order:

1. Initialize Next.js, TypeScript, and Tailwind CSS.
2. Build the static form and resume preview layout with mock data.
3. Add the server-side OpenAI generation route.
4. Connect the form to generated structured resume data.
5. Add Playwright PDF export.
6. Add polish, validation, and basic tests.
7. Update docs for v1.0 release readiness.

## Code Quality Expectations

- Keep OpenAI API usage on the server.
- Keep `OPENAI_API_KEY` in environment variables.
- Use TypeScript types for resume data.
- Keep prompts centralized in a library file.
- Keep PDF rendering logic isolated from UI components where practical.
- Avoid committing generated PDFs, local environment files, or secrets.

## Documentation Expectations

Documentation should change when:

- Setup commands change.
- Environment variables change.
- Architecture changes.
- MVP scope changes.
- Release steps change.

Docs should stay practical and recruiter-friendly. They should explain what the project does, why it matters, and how the implementation is organized.
