export type GenerateResumeInput = {
  profileText: string;
  targetCompany: string;
  targetPosition: string;
  jobDescription?: string;
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

export async function generateTailoredResume(
  input: GenerateResumeInput,
): Promise<TailoredResume> {
  const targetContext = `${input.targetPosition} at ${input.targetCompany}`;

  return {
    candidateName: "Candidate Name",
    targetRole: targetContext,
    professionalSummary:
      `Mock resume draft for a ${targetContext}. This placeholder will be replaced by OpenAI-generated content in a future milestone.`,
    coreSkills: [
      "Role-aligned communication",
      "Problem solving",
      "Cross-functional collaboration",
      "Impact-focused execution",
    ],
    experience: [
      {
        company: "Previous Company",
        role: "Relevant Professional Role",
        highlights: [
          "Translated profile context into role-relevant achievements.",
          "Highlighted measurable impact and responsibilities aligned to the target position.",
          "Prepared structured experience content for future AI generation.",
        ],
      },
    ],
    projects: [
      {
        name: "Targeted Resume Draft",
        description:
          "A placeholder project entry showing how generated project content will be structured.",
        highlights: [
          "Connects professional background to target company needs.",
          "Keeps output predictable for HTML preview and PDF export.",
        ],
      },
    ],
    education: ["Education details will be inferred from provided profile text."],
  };
}
