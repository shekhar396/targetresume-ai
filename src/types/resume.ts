export type ResumeContact = {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
};

export type ResumePresentation = {
  headerLayout: "top-right" | "under-name" | "centered" | "auto";
  accentColor?: string;
  styleTone?: "classic" | "modern" | "executive" | "minimal";
};

export type ResumeExperience = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ResumeProject = {
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
  bullets?: string[];
};

export type ResumeEducation = {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  details?: string[];
};

export type Resume = {
  candidateName: string;
  targetRole: string;
  contact: ResumeContact;
  presentation: ResumePresentation;
  professionalSummary: string;
  coreSkills: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
};

export type GenerateResumeRequest = {
  mode: "generate" | "revise";
  profileText: string;
  targetCompany: string;
  targetPosition: string;
  jobDescription?: string;
  contact?: ResumeContact;
  additionalInstructions?: string;
  currentResume?: Resume;
};

const headerLayouts = ["top-right", "under-name", "centered", "auto"];
const styleTones = ["classic", "modern", "executive", "minimal"];

export function normalizeResume(value: unknown): Resume | null {
  if (!isRecord(value)) {
    return null;
  }

  const contact = normalizeContact(value.contact);
  const presentation = normalizePresentation(value.presentation);
  const experience = normalizeExperienceArray(value.experience);
  const projects = normalizeProjectArray(value.projects);
  const education = normalizeEducationArray(value.education);

  if (
    typeof value.candidateName !== "string" ||
    typeof value.targetRole !== "string" ||
    typeof value.professionalSummary !== "string" ||
    !isStringArray(value.coreSkills) ||
    !contact ||
    !presentation ||
    !experience ||
    !projects ||
    !education
  ) {
    return null;
  }

  return {
    candidateName: value.candidateName,
    targetRole: value.targetRole,
    contact,
    presentation,
    professionalSummary: value.professionalSummary,
    coreSkills: value.coreSkills,
    experience,
    projects,
    education,
  };
}

export function isResume(value: unknown): value is Resume {
  return normalizeResume(value) !== null;
}

export function normalizeContact(value: unknown): ResumeContact | null {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isRecord(value)) {
    return null;
  }

  const contact: ResumeContact = {};

  for (const key of [
    "email",
    "phone",
    "linkedinUrl",
    "githubUrl",
    "portfolioUrl",
    "location",
  ] as const) {
    const fieldValue = value[key];

    if (typeof fieldValue === "string" && fieldValue.trim()) {
      contact[key] = fieldValue.trim();
    }
  }

  return contact;
}

export function normalizePresentation(
  value: unknown,
): ResumePresentation | null {
  if (value === undefined || value === null) {
    return {
      headerLayout: "auto",
      styleTone: "modern",
    };
  }

  if (!isRecord(value)) {
    return null;
  }

  const headerLayout = headerLayouts.includes(String(value.headerLayout))
    ? (value.headerLayout as ResumePresentation["headerLayout"])
    : "auto";
  const styleTone = styleTones.includes(String(value.styleTone))
    ? (value.styleTone as ResumePresentation["styleTone"])
    : "modern";
  const presentation: ResumePresentation = {
    headerLayout,
    styleTone,
  };

  if (typeof value.accentColor === "string" && value.accentColor.trim()) {
    presentation.accentColor = value.accentColor.trim();
  }

  return presentation;
}

function normalizeExperienceArray(value: unknown): ResumeExperience[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const experience: ResumeExperience[] = [];

  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.title !== "string" ||
      typeof item.company !== "string" ||
      !isStringArray(item.bullets)
    ) {
      return null;
    }

    experience.push({
      title: item.title,
      company: item.company,
      startDate:
        typeof item.startDate === "string" && item.startDate.trim()
          ? item.startDate.trim()
          : "Date not provided",
      endDate:
        typeof item.endDate === "string" && item.endDate.trim()
          ? item.endDate.trim()
          : "Date not provided",
      bullets: item.bullets,
    });
  }

  return experience;
}

function normalizeProjectArray(value: unknown): ResumeProject[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const projects: ResumeProject[] = [];

  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.name !== "string" ||
      typeof item.description !== "string"
    ) {
      return null;
    }

    const project: ResumeProject = {
      name: item.name,
      description: item.description,
    };

    if (isStringArray(item.technologies)) {
      project.technologies = item.technologies;
    }

    if (typeof item.link === "string" && item.link.trim()) {
      project.link = item.link.trim();
    }

    if (isStringArray(item.bullets)) {
      project.bullets = item.bullets;
    }

    projects.push(project);
  }

  return projects;
}

function normalizeEducationArray(value: unknown): ResumeEducation[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const education: ResumeEducation[] = [];

  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.institution !== "string" ||
      typeof item.degree !== "string"
    ) {
      return null;
    }

    const educationItem: ResumeEducation = {
      institution: item.institution,
      degree: item.degree,
    };

    if (typeof item.field === "string" && item.field.trim()) {
      educationItem.field = item.field.trim();
    }

    if (typeof item.startDate === "string" && item.startDate.trim()) {
      educationItem.startDate = item.startDate.trim();
    }

    if (typeof item.endDate === "string" && item.endDate.trim()) {
      educationItem.endDate = item.endDate.trim();
    }

    if (isStringArray(item.details)) {
      educationItem.details = item.details;
    }

    education.push(educationItem);
  }

  return education;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
