"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui";
import { Button, Input } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";

import { updateOrganizationSchema } from "../validations/organization.validation";

import type { Organization } from "../organization.types";

interface OrganizationSettingsFormProps {
  organization: Organization;
  canManage: boolean;
  onSave: (input: { name?: string; slug?: string }) => Promise<void>;
}

export function OrganizationSettingsForm({
  organization,
  canManage,
  onSave,
}: OrganizationSettingsFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);

  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    form?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(organization.name);
    setSlug(organization.slug);
  }, [organization]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManage) {
      return;
    }

    setErrors({});
    setSuccess(false);

    const result = updateOrganizationSchema.safeParse({
      name,
      slug,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        slug: fieldErrors.slug?.[0],
        form: result.error.flatten().formErrors[0],
      });

      return;
    }

    try {
      setIsSaving(true);

      await onSave(result.data);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 2500);

      toast({
        type: "success",
        title: "Organization updated",
        message: "Your organization was updated successfully.",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({
          form: error.message,
        });
      } else {
        setErrors({
          form: "Unable to update organization.",
        });
      }

      toast({
        type: "error",
        title: "Failed to update organization",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    name.trim() !== organization.name || slug.trim() !== organization.slug;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="organization-name"
          className="mb-2 block text-sm font-medium text-zinc-900"
        >
          Organization name
        </label>

        <Input
          id="organization-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSuccess(false);
          }}
          disabled={!canManage || isSaving}
          placeholder="Organization name"
          aria-invalid={Boolean(errors.name)}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="organization-slug"
          className="mb-2 block text-sm font-medium text-zinc-900"
        >
          Organization slug
        </label>

        <Input
          id="organization-slug"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value.toLowerCase());
            setSuccess(false);
          }}
          disabled={!canManage || isSaving}
          placeholder="organization-slug"
          aria-invalid={Boolean(errors.slug)}
        />

        {errors.slug && (
          <p className="mt-1.5 text-xs text-red-600">{errors.slug}</p>
        )}

        <p className="mt-1.5 text-xs text-zinc-500">
          Use lowercase letters, numbers, and hyphens.
        </p>
      </div>

      {errors.form && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      {canManage && (
        <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-5">
          <div>
            {success && (
              <p className="text-sm text-emerald-600">
                Organization updated successfully.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!hasChanges || isSaving}
            loading={isSaving}
          >
            {!isSaving && <Save className="h-4 w-4" />}
            Save changes
          </Button>
        </div>
      )}
    </form>
  );
}
