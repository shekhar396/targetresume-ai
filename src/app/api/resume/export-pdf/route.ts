import { chromium } from "playwright";
import { renderResumeHtml } from "@/lib/pdf/resume-html";
import { isTailoredResume } from "@/lib/openai/resume-generator";

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
