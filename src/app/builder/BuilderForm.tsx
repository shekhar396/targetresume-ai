"use client";

import { FormEvent, useState } from "react";

type BuilderFormValues = {
  profileText: string;
  targetCompany: string;
  targetPosition: string;
  jobDescription: string;
};

type BuilderFormErrors = Partial<
  Record<"profileText" | "targetCompany" | "targetPosition", string>
>;

const initialValues: BuilderFormValues = {
  profileText: "",
  targetCompany: "",
  targetPosition: "",
  jobDescription: "",
};

export function BuilderForm() {
  const [values, setValues] = useState<BuilderFormValues>(initialValues);
  const [errors, setErrors] = useState<BuilderFormErrors>({});
  const [submittedValues, setSubmittedValues] =
    useState<BuilderFormValues | null>(null);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedValues(null);
      return;
    }

    setSubmittedValues({
      profileText: values.profileText.trim(),
      targetCompany: values.targetCompany.trim(),
      targetPosition: values.targetPosition.trim(),
      jobDescription: values.jobDescription.trim(),
    });
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
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[color:var(--border)] pt-5">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[color:var(--primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2"
            type="submit"
          >
            Generate Preview Summary
          </button>
          <p className="text-sm text-[color:var(--muted)]">
            No AI request will be made in this milestone.
          </p>
        </div>
      </form>

      <aside className="border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm sm:p-6">
        <div className="border-b border-[color:var(--border)] pb-5">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
            Preview Summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Submitted values will appear here before AI generation is wired in.
          </p>
        </div>

        {submittedValues ? (
          <div className="mt-6 space-y-5">
            <div className="border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900">
              AI generation will be connected in the next milestone.
            </div>
            <SummaryItem label="Target company" value={submittedValues.targetCompany} />
            <SummaryItem label="Target position" value={submittedValues.targetPosition} />
            <SummaryItem
              label="Profile text"
              value={submittedValues.profileText}
            />
            <SummaryItem
              label="Job description"
              value={submittedValues.jobDescription || "Not provided"}
            />
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-[color:var(--border)] bg-slate-50 px-4 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
            Complete the required fields and submit to preview the current
            resume-building inputs.
          </div>
        )}
      </aside>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
        {label}
      </h3>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
