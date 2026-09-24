"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";
import { Button, Input } from "@/components/ui";

import type { CreateOrganizationInput } from "../organization.types";

interface CreateOrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateOrganizationInput) => Promise<void>;
}

export function CreateOrganizationDialog({
  open,
  onClose,
  onCreate,
}: CreateOrganizationDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError("Organization name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Organization name must be at least 2 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        name: trimmedName,
        ...(trimmedSlug ? { slug: trimmedSlug } : {}),
      });

      toast({
        type: "success",
        title: "Organization created",
        message: "Your organization was created successfully.",
      });
      setName("");
      setSlug("");
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to create organization.");
      }
      toast({
        type: "error",
        title: "Failed to create organization",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-organization-title"
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-organization-title"
              className="text-base font-semibold text-zinc-950"
            >
              Create organization
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Set up a workspace for your team.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            id="organization-name"
            name="name"
            label="Name"
            placeholder="Acme Inc."
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            autoFocus
          />

          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isSubmitting}>
              Create organization
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
