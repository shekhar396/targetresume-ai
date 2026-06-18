"use client";

import { FormEvent, useState } from "react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import type {
  GenerateResumeInput,
  TailoredResume,
} from "@/lib/openai/resume-generator";

type BuilderFormValues = {
  profileText: string;
  targetCompany: string;
  targetPosition: string;
  jobDescription: string;
  additionalInstructions: string;
};

type BuilderFormErrors = Partial<
  Record<"profileText" | "targetCompany" | "targetPosition" | "currentResume", string>
>;

type GenerateResumeSuccessResponse = {
  success: true;
  resume: TailoredResume;
};

type GenerateResumeErrorResponse = {
  success: false;
  errors?: BuilderFormErrors & {
    request?: string;
  };
  message?: string;
};

type GenerateResumeResponse =
  | GenerateResumeSuccessResponse
  | GenerateResumeErrorResponse;

const initialValues: BuilderFormValues = {
  profileText: "",
  targetCompany: "",
  targetPosition: "",
  jobDescription: "",
  additionalInstructions: "",
};

export function BuilderForm() {
  const [values, setValues] = useState<BuilderFormValues>(initialValues);
  const [errors, setErrors] = useState<BuilderFormErrors>({});
  const [resume, setResume] = useState<TailoredResume | null>(null);
  const [submittedInstructions, setSubmittedInstructions] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationAction, setGenerationAction] = useState<
    "generating" | "updating"
  >("generating");

  function updateValue(field: keyof BuilderFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (field in errors && value.trim()) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field as keyof BuilderFormErrors];
        return nextErrors;
      });
    }
  }

  function validateForm(formValues: BuilderFormValues) {
    const nextErrors: BuilderFormErrors = {};

    if (!formValues.profileText.trim()) {
      nextErrors.profileText = "Profile text is required.";
    }

    if (!formValues.targetCompany.trim()) {
      nextErrors.targetCompany = "Target company is required.";
    }

    if (!formValues.targetPosition.trim()) {
      nextErrors.targetPosition = "Target position is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    setApiError(null);
    setExportError(null);

    if (Object.keys(nextErrors).length > 0) {
      setResume(null);
      return;
    }

    const existingResume = resume;
    const requestBody: GenerateResumeInput = {
      profileText: values.profileText.trim(),
      targetCompany: values.targetCompany.trim(),
      targetPosition: values.targetPosition.trim(),
    };

    const jobDescription = values.jobDescription.trim();
    const additionalInstructions = values.additionalInstructions.trim();

    if (jobDescription) {
      requestBody.jobDescription = jobDescription;
    }

    requestBody.additionalInstructions = additionalInstructions;

    if (existingResume) {
      requestBody.currentResume = existingResume;
    }

    setGenerationAction(existingResume ? "updating" : "generating");
    setIsGenerating(true);
    setResume(null);
    setSubmittedInstructions("");

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = (await response.json()) as GenerateResumeResponse;

      if (!result.success) {
        const fieldErrors = result.errors ?? {};
        const { request, ...formErrors } = fieldErrors;

        setErrors(formErrors);
        setApiError(
          request ??
            result.message ??
            "Resume generation could not be completed. Please review the form and try again.",
        );
        return;
      }

      if (!response.ok) {
        setApiError(
          "Resume generation could not be completed. Please try again.",
        );
        return;
      }

      setSubmittedInstructions(additionalInstructions);
      setResume(result.resume);
    } catch {
      setApiError(
        "Resume generation could not be reached. Please try again in a moment.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleExportPdf() {
    if (!resume) {
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch("/api/resume/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        setExportError("PDF export could not be completed. Please try again.");
        return;
      }

      const pdfBlob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "targetresume-ai-resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      setExportError("PDF export could not be reached. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="border-b border-[color:var(--border)] pb-5">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
            Resume Inputs
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Provide the source profile and target context for the first resume
            draft.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              className="block text-sm font-semibold text-[color:var(--foreground)]"
              htmlFor="profileText"
            >
              LinkedIn profile text / professional profile text
            </label>
            <textarea
              aria-describedby={
                errors.profileText ? "profileText-error" : undefined
              }
              aria-invalid={Boolean(errors.profileText)}
              className="mt-2 min-h-44 w-full resize-y border border-[color:var(--border)] bg-white px-3 py-3 text-sm leading-6 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              id="profileText"
              name="profileText"
              onChange={(event) =>
                updateValue("profileText", event.target.value)
              }
              placeholder="Paste LinkedIn About, experience bullets, or a professional summary."
              value={values.profileText}
            />
            {errors.profileText ? (
              <p
                className="mt-2 text-sm font-medium text-red-700"
                id="profileText-error"
              >
                {errors.profileText}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                className="block text-sm font-semibold text-[color:var(--foreground)]"
                htmlFor="targetCompany"
              >
                Target company
              </label>
              <input
                aria-describedby={
                  errors.targetCompany ? "targetCompany-error" : undefined
                }
                aria-invalid={Boolean(errors.targetCompany)}
                className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
                id="targetCompany"
                name="targetCompany"
                onChange={(event) =>
                  updateValue("targetCompany", event.target.value)
                }
                placeholder="Example: Stripe"
                type="text"
                value={values.targetCompany}
              />
              {errors.targetCompany ? (
                <p
                  className="mt-2 text-sm font-medium text-red-700"
                  id="targetCompany-error"
                >
                  {errors.targetCompany}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-[color:var(--foreground)]"
                htmlFor="targetPosition"
              >
                Target position
              </label>
              <input
                aria-describedby={
                  errors.targetPosition ? "targetPosition-error" : undefined
                }
                aria-invalid={Boolean(errors.targetPosition)}
                className="mt-2 h-12 w-full border border-[color:var(--border)] bg-white px-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
                id="targetPosition"
                name="targetPosition"
                onChange={(event) =>
                  updateValue("targetPosition", event.target.value)
                }
                placeholder="Example: Frontend Engineer"
                type="text"
                value={values.targetPosition}
              />
              {errors.targetPosition ? (
                <p
                  className="mt-2 text-sm font-medium text-red-700"
                  id="targetPosition-error"
                >
                  {errors.targetPosition}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-[color:var(--foreground)]"
              htmlFor="jobDescription"
            >
              Optional job description
            </label>
            <textarea
              className="mt-2 min-h-32 w-full resize-y border border-[color:var(--border)] bg-white px-3 py-3 text-sm leading-6 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              id="jobDescription"
              name="jobDescription"
              onChange={(event) =>
                updateValue("jobDescription", event.target.value)
              }
              placeholder="Paste the role description or key requirements when available."
              value={values.jobDescription}
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-[color:var(--foreground)]"
              htmlFor="additionalInstructions"
            >
              Additional Instructions (Optional)
            </label>
            <textarea
              className="mt-2 min-h-32 w-full resize-y border border-[color:var(--border)] bg-white px-3 py-3 text-sm leading-6 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              id="additionalInstructions"
              name="additionalInstructions"
              onChange={(event) =>
                updateValue("additionalInstructions", event.target.value)
              }
              placeholder={[
                "Emphasize Kubernetes and Terraform experience",
                "Focus on leadership and team management",
                "Keep the resume to one page",
                "Highlight fintech experience",
                "Optimize for ATS screening",
              ].join("\n")}
              value={values.additionalInstructions}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[color:var(--border)] pt-5">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[color:var(--primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isGenerating}
            type="submit"
          >
            {isGenerating
              ? generationAction === "updating"
                ? "Updating resume..."
                : "Generating resume..."
              : resume
                ? "Update Resume Preview"
                : "Generate Resume Preview"}
          </button>
          <p className="text-sm text-[color:var(--muted)]">
            Generates a structured resume with server-side AI.
          </p>
        </div>

        {apiError ? (
          <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {apiError}
          </div>
        ) : null}
      </form>

      <aside className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm sm:p-6">
        <div className="border-b border-[color:var(--border)] pb-5">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
            Resume Preview
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Generated resume content will render here in a printable layout.
          </p>
        </div>

        {resume ? (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-[color:var(--muted)]">
                Export the current preview without regenerating the resume.
              </p>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[color:var(--primary)] bg-white px-4 text-sm font-semibold text-[color:var(--primary)] transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                disabled={isExporting}
                onClick={handleExportPdf}
                type="button"
              >
                {isExporting ? "Exporting..." : "Download PDF"}
              </button>
            </div>
            {exportError ? (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {exportError}
              </div>
            ) : null}
            {submittedInstructions ? (
              <div className="border border-teal-200 bg-teal-50 px-4 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-900">
                  Applied customization
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-teal-900">
                  {submittedInstructions}
                </p>
              </div>
            ) : null}
            <ResumePreview resume={resume} />
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-[color:var(--border)] bg-slate-50 px-4 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
            {isGenerating
              ? generationAction === "updating"
                ? "Updating the resume preview..."
                : "Generating the resume preview..."
              : "Complete the required fields and submit to generate the resume preview."}
          </div>
        )}
      </aside>
    </div>
  );
}
