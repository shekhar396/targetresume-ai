import { NextResponse } from "next/server";
import {
  generateTailoredResume,
  type GenerateResumeInput,
} from "@/lib/openai/resume-generator";

type ValidationErrors = Partial<Record<keyof GenerateResumeInput, string>>;

type RawGenerateResumeRequest = {
  profileText?: unknown;
  targetCompany?: unknown;
  targetPosition?: unknown;
  jobDescription?: unknown;
};

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: {
          request: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  const validationResult = validateGenerateResumeInput(payload);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: validationResult.errors,
      },
      { status: 400 },
    );
  }

  try {
    const resume = await generateTailoredResume(validationResult.input);

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Resume generation failed unexpectedly.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

function validateGenerateResumeInput(
  payload: unknown,
):
  | { success: true; input: GenerateResumeInput }
  | { success: false; errors: ValidationErrors } {
  if (!isGenerateResumeRequest(payload)) {
    return {
      success: false,
      errors: {
        profileText: "Profile text is required.",
        targetCompany: "Target company is required.",
        targetPosition: "Target position is required.",
      },
    };
  }

  const input: GenerateResumeInput = {
    profileText: normalizeText(payload.profileText),
    targetCompany: normalizeText(payload.targetCompany),
    targetPosition: normalizeText(payload.targetPosition),
    jobDescription: normalizeText(payload.jobDescription),
  };

  const errors: ValidationErrors = {};

  if (!input.profileText) {
    errors.profileText = "Profile text is required.";
  }

  if (!input.targetCompany) {
    errors.targetCompany = "Target company is required.";
  }

  if (!input.targetPosition) {
    errors.targetPosition = "Target position is required.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    input,
  };
}

function isGenerateResumeRequest(
  payload: unknown,
): payload is RawGenerateResumeRequest {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload);
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
