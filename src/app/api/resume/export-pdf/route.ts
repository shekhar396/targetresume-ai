import { chromium } from "playwright";
import { renderResumeHtml } from "@/lib/pdf/resume-html";
import type { TailoredResume } from "@/lib/openai/resume-generator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        message: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  if (!isTailoredResume(payload)) {
    return Response.json(
      {
        success: false,
        message: "A valid generated resume is required for PDF export.",
      },
      { status: 400 },
    );
  }

  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(renderResumeHtml(payload), {
      waitUntil: "networkidle",
    });

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="targetresume-ai-resume.pdf"',
      },
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "PDF export failed. Please try again.",
      },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}

function isTailoredResume(value: unknown): value is TailoredResume {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.candidateName === "string" &&
    typeof value.targetRole === "string" &&
    typeof value.professionalSummary === "string" &&
    isStringArray(value.coreSkills) &&
    isExperienceArray(value.experience) &&
    isProjectArray(value.projects) &&
    isStringArray(value.education)
  );
}

function isExperienceArray(
  value: unknown,
): value is TailoredResume["experience"] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.company === "string" &&
        typeof item.role === "string" &&
        isStringArray(item.highlights),
    )
  );
}

function isProjectArray(value: unknown): value is TailoredResume["projects"] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.name === "string" &&
        typeof item.description === "string" &&
        isStringArray(item.highlights),
    )
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
