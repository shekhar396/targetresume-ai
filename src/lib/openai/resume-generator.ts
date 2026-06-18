import OpenAI from "openai";

export type GenerateResumeInput = {
  profileText: string;
  targetCompany: string;
  targetPosition: string;
  jobDescription?: string;
  additionalInstructions?: string;
  currentResume?: TailoredResume;
};

export type ResumeExperienceItem = {
  company: string;
  role: string;
  highlights: string[];
};

export type ResumeProjectItem = {
  name: string;
  description: string;
  highlights: string[];
};

export type TailoredResume = {
  candidateName: string;
  targetRole: string;
  professionalSummary: string;
  coreSkills: string[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  education: string[];
};

const DEFAULT_MODEL = "gpt-5.5";

const resumeSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "candidateName",
    "targetRole",
    "professionalSummary",
    "coreSkills",
    "experience",
    "projects",
    "education",
  ],
  properties: {
    candidateName: {
      type: "string",
      description:
        "Candidate name from the profile text. Use 'Name not provided' when absent.",
    },
    targetRole: {
      type: "string",
      description: "The target position and target company.",
    },
    professionalSummary: {
      type: "string",
      description:
        "A concise ATS-focused summary tailored to the target company and role.",
    },
    coreSkills: {
      type: "array",
      items: { type: "string" },
      description: "A concise list of relevant skills supported by the input.",
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["company", "role", "highlights"],
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "description", "highlights"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    education: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;

export async function generateTailoredResume(
  input: GenerateResumeInput,
): Promise<TailoredResume> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
      instructions: buildResumeInstructions(),
      input: buildResumeInput(input),
      max_output_tokens: 1800,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "tailored_resume",
          strict: true,
          schema: resumeSchema,
        },
      },
    });

    return parseTailoredResume(response.output_text);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("OpenAI returned")) {
      throw error;
    }

    throw new Error(
      "Resume generation failed while communicating with OpenAI.",
    );
  }
}

function buildResumeInstructions() {
  return [
    "You are an expert resume strategist writing concise, ATS-friendly resumes.",
    "Return only structured JSON that matches the provided schema.",
    "Tailor the resume toward the target company and target position.",
    "Use only facts supported by the supplied profile text and optional job description.",
    "Do not invent employers, degrees, certifications, titles, dates, metrics, or projects.",
    "Treat additional instructions as user preferences, not factual source material.",
    "Follow additional instructions only when they remain truthful and supported by the profile or job description.",
    "Ignore any part of the additional instructions that conflicts with the provided experience or would require fabrication.",
    "When a current resume is provided, revise that resume instead of starting from scratch.",
    "When revising, apply the latest additional instructions directly, remove requested items when possible, and add emphasis only when supported by the profile or job description.",
    "If a user asks to remove a section, return an empty array for that section when the schema requires an array.",
    "If a detail is missing, use neutral wording such as 'Name not provided' or omit unsupported specificity.",
    "Keep the content concise enough for a one-page resume preview.",
    "Preserve ATS optimization with clear titles, relevant keywords, concise bullets, and grounded skills.",
    "Use strong professional language, but keep claims truthful and grounded.",
  ].join(" ");
}

function buildResumeInput(input: GenerateResumeInput) {
  return [
    `Target company: ${input.targetCompany}`,
    `Target position: ${input.targetPosition}`,
    "",
    "Profile text:",
    input.profileText,
    "",
    "Optional job description:",
    input.jobDescription || "Not provided.",
    "",
    "Additional user tailoring instructions:",
    input.additionalInstructions || "Not provided.",
    "",
    "Current generated resume to revise, if present:",
    input.currentResume
      ? JSON.stringify(input.currentResume, null, 2)
      : "Not provided.",
  ].join("\n");
}

function parseTailoredResume(rawText: string): TailoredResume {
  if (!rawText.trim()) {
    throw new Error("OpenAI returned an empty resume response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("OpenAI returned invalid JSON for the resume response.");
  }

  if (!isTailoredResume(parsed)) {
    throw new Error("OpenAI returned a resume response with an invalid shape.");
  }

  return parsed;
}

export function isTailoredResume(value: unknown): value is TailoredResume {
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

function isExperienceArray(value: unknown): value is ResumeExperienceItem[] {
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

function isProjectArray(value: unknown): value is ResumeProjectItem[] {
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
