import OpenAI from "openai";
import {
  normalizeResume,
  type GenerateResumeRequest,
  type Resume,
} from "@/types/resume";

export type { GenerateResumeRequest, Resume } from "@/types/resume";

const DEFAULT_MODEL = "gpt-5.5";

const resumeSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "candidateName",
    "targetRole",
    "contact",
    "presentation",
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
    contact: {
      type: "object",
      additionalProperties: false,
      required: [
        "email",
        "phone",
        "linkedinUrl",
        "githubUrl",
        "portfolioUrl",
        "location",
      ],
      properties: {
        email: { type: "string" },
        phone: { type: "string" },
        linkedinUrl: { type: "string" },
        githubUrl: { type: "string" },
        portfolioUrl: { type: "string" },
        location: { type: "string" },
      },
      description:
        "Contact fields shown on the resume. Use only provided contact values.",
    },
    presentation: {
      type: "object",
      additionalProperties: false,
      required: ["headerLayout", "accentColor", "styleTone"],
      properties: {
        headerLayout: {
          type: "string",
          enum: ["top-right", "under-name", "centered", "auto"],
        },
        accentColor: {
          type: "string",
          description:
            "A simple safe color name or hex value requested by the user.",
        },
        styleTone: {
          type: "string",
          enum: ["classic", "modern", "executive", "minimal"],
        },
      },
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
        required: ["title", "company", "startDate", "endDate", "bullets"],
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          startDate: {
            type: "string",
            description:
              "Experience start date. Use 'Date not provided' when unavailable.",
          },
          endDate: {
            type: "string",
            description:
              "Experience end date. Use 'Date not provided' when unavailable.",
          },
          bullets: {
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
        required: ["name", "description", "technologies", "link", "bullets"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          technologies: {
            type: "array",
            items: { type: "string" },
          },
          link: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "institution",
          "degree",
          "field",
          "startDate",
          "endDate",
          "details",
        ],
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          field: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          details: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  },
} as const;

export async function generateTailoredResume(
  input: GenerateResumeRequest,
): Promise<Resume> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
      instructions: buildResumeInstructions(input.mode),
      input: buildResumeInput(input),
      max_output_tokens: 2400,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "targetresume_schema_v2",
          strict: true,
          schema: resumeSchema,
        },
      },
    });

    return parseResume(response.output_text);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("OpenAI returned")) {
      throw error;
    }

    throw new Error(
      "Resume generation failed while communicating with OpenAI.",
    );
  }
}

function buildResumeInstructions(mode: GenerateResumeRequest["mode"]) {
  const sharedInstructions = [
    "You are an expert resume strategist writing concise, ATS-friendly resumes.",
    "Return only structured JSON that matches the provided schema.",
    "Use only facts supported by the supplied profile text, job description, contact fields, and current resume when revising.",
    "Never invent contact data, employers, degrees, certifications, titles, dates, metrics, achievements, or projects.",
    "Contact fields must come exactly from provided contact fields or explicit revision instructions.",
    "For optional strings that are unknown or not provided, return an empty string. For optional arrays that are not provided, return an empty array.",
    "The final resume must always include a contact object and a presentation object.",
    "Default presentation.headerLayout is 'auto' when no layout preference is supplied.",
    "Default presentation.styleTone is 'modern' when no style preference is supplied.",
    "Every experience item must include startDate and endDate. Use 'Date not provided' if dates are unavailable.",
    "Keep the response concise enough for a one-page resume style preview.",
    "Preserve ATS optimization with clear titles, relevant keywords, concise bullets, and grounded skills.",
    "Map design instructions into presentation: top right contact means headerLayout 'top-right'; under name means 'under-name'; centered header means 'centered'; blue color means accentColor 'blue'; more professional means styleTone 'executive' or 'modern'; minimal means 'minimal'; classic means 'classic'.",
  ];

  if (mode === "generate") {
    return [
      ...sharedInstructions,
      "Mode is generate: create a new tailored resume from profile text, target company, target position, optional job description, contact fields, and additional instructions.",
      "Treat additional instructions as user preferences only when truthful and supported by profile or job data.",
      "Use provided contact fields exactly and do not guess missing contact details.",
      "Follow design instructions through the presentation object.",
    ].join(" ");
  }

  return [
    ...sharedInstructions,
    "Mode is revise: treat currentResume as the source of truth.",
    "Apply only the requested changes from additionalInstructions.",
    "Use strict minimal-diff behavior.",
    "If the user asks for one change, make only that change and keep everything else unchanged.",
    "Preserve all unrelated sections, wording, bullets, ordering, dates, contact details, and structure exactly unless the user explicitly asks to change them.",
    "Do not rewrite the full resume.",
    "Do not remove content unless requested.",
    "If the user provides contact info in revision instructions, update contact.",
    "If the user asks for layout or design changes, update only presentation unless content changes are also requested.",
    "If the user asks to remove a section, return an empty array for that section and keep other sections unchanged.",
    "Return the full updated resume JSON.",
  ].join(" ");
}

function buildResumeInput(input: GenerateResumeRequest) {
  return [
    `Mode: ${input.mode}`,
    `Target company: ${input.targetCompany}`,
    `Target position: ${input.targetPosition}`,
    "",
    "Contact fields supplied by user:",
    JSON.stringify(input.contact ?? {}, null, 2),
    "",
    "Profile text:",
    input.profileText,
    "",
    "Optional job description:",
    input.jobDescription || "Not provided.",
    "",
    input.mode === "revise"
      ? "Revision instructions:"
      : "Additional user tailoring instructions:",
    input.additionalInstructions || "Not provided.",
    "",
    "Current resume for revise mode:",
    input.currentResume
      ? JSON.stringify(input.currentResume, null, 2)
      : "Not provided.",
  ].join("\n");
}

function parseResume(rawText: string): Resume {
  if (!rawText.trim()) {
    throw new Error("OpenAI returned an empty resume response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("OpenAI returned invalid JSON for the resume response.");
  }

  const resume = normalizeResume(parsed);

  if (!resume) {
    throw new Error("OpenAI returned a resume response with an invalid shape.");
  }

  return resume;
}
