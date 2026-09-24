"use client";

import { useState } from "react";
import { Dialog, Button, Input, Textarea } from "@/components/ui";
import { projectSchema } from "../project.validation";
import type { CreateProjectInput } from "../project.types";
import { useToast } from "@/components/ui";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateProjectInput) => Promise<void>;
}

export function CreateProjectDialog({
  open,
  onClose,
  onCreate,
}: CreateProjectDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setKey("");
    setDescription("");
    setError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    const result = projectSchema.safeParse({
      name,
      key,
      description: description || undefined,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    try {
      setIsSubmitting(true);

      await onCreate(result.data);

      toast({
        type: "success",
        title: "Project created",
        message: "Project was created successfully.",
      });

      resetForm();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create project.",
      );
      toast({
        type: "error",
        title: "Failed to create project",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create project"
      description="Create a project for this organization."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project name"
          placeholder="Website"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Project key"
          placeholder="WEB"
          value={key}
          onChange={(event) => setKey(event.target.value.toUpperCase())}
          disabled={isSubmitting}
          maxLength={10}
          required
        />

        <Textarea
          label="Description"
          placeholder="What is this project about?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isSubmitting}
          rows={4}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            Create project
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
