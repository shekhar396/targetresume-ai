import { NextResponse } from "next/server";
import {
  generateTailoredResume,
  type GenerateResumeRequest,
} from "@/lib/openai/resume-generator";
import {
  normalizeContact,
  normalizeResume,
  type ResumeContact,
} from "@/types/resume";

type ValidationErrors = Partial<
  Record<
    | keyof GenerateResumeRequest
    | keyof ResumeContact
    | "request",
    string
  >
>;

type RawGenerateResumeRequest = {
  mode?: unknown;
  profileText?: unknown;
  targetCompany?: unknown;
  targetPosition?: unknown;
  jobDescription?: unknown;
  contact?: unknown;
  additionalInstructions?: unknown;
  currentResume?: unknown;
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
  | { success: true; input: GenerateResumeRequest }
  | { success: false; errors: ValidationErrors } {
  if (!isGenerateResumeRequest(payload)) {
    return {
      success: false,
      errors: {
        request: "Request body must be a JSON object.",
      },
    };
  }

  const errors: ValidationErrors = {};
  const mode = normalizeText(payload.mode);
  const profileText = normalizeText(payload.profileText);
  const targetCompany = normalizeText(payload.targetCompany);
  const targetPosition = normalizeText(payload.targetPosition);
  const jobDescription = normalizeText(payload.jobDescription);
  const additionalInstructions = normalizeText(payload.additionalInstructions);
  const contact = normalizeContact(payload.contact);

  if (mode !== "generate" && mode !== "revise") {
    errors.mode = "Mode must be either generate or revise.";
  }

  if (!profileText) {
    errors.profileText = "Profile text is required.";
  }

  if (!targetCompany) {
    errors.targetCompany = "Target company is required.";
  }

  if (!targetPosition) {
    errors.targetPosition = "Target position is required.";
  }

  if (!contact) {
    errors.contact = "Contact must be a valid object.";
  } else {
    Object.assign(errors, validateContact(contact));
  }

  const currentResume =
    payload.currentResume === undefined
      ? null
      : normalizeResume(payload.currentResume);

  if (mode === "revise" && !currentResume) {
    errors.currentResume =
      "Current resume is required and must match schema v2 in revise mode.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const input: GenerateResumeRequest = {
    mode: mode as GenerateResumeRequest["mode"],
    profileText,
    targetCompany,
    targetPosition,
    contact: contact ?? {},
    additionalInstructions,
  };

  if (jobDescription) {
    input.jobDescription = jobDescription;
  }

  if (currentResume) {
    input.currentResume = currentResume;
  }

  return {
    success: true,
    input,
  };
}

function validateContact(contact: ResumeContact): ValidationErrors {
  const errors: ValidationErrors = {};

  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.email = "Email must be a valid email address.";
  }

  for (const key of ["linkedinUrl", "githubUrl", "portfolioUrl"] as const) {
    const value = contact[key];

    if (value && !/^https?:\/\//i.test(value)) {
      errors[key] = "URL must start with http:// or https://.";
    }
  }

  return errors;
}

function isGenerateResumeRequest(
  payload: unknown,
): payload is RawGenerateResumeRequest {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload);
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
