"use client";

import { useState } from "react";
import { Button, Input, Textarea, useToast } from "@/components/ui";
import { projectSchema } from "../project.validation";
import type { Project, UpdateProjectInput } from "../project.types";

interface ProjectSettingsFormProps {
  project: Project;
  onSave: (input: UpdateProjectInput) => Promise<void>;
}

export function ProjectSettingsForm({
  project,
  onSave,
}: ProjectSettingsFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(project.name);
  const [key, setKey] = useState(project.key);
  const [description, setDescription] = useState(project.description ?? "");

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    const result = projectSchema.safeParse({
      name,
      key,
      description: description || undefined,
    });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? "Invalid project information.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        name: result.data.name,
        key: result.data.key,
        description: result.data.description,
      });

      toast({
        type: "success",
        title: "Project updated",
        message: "Project was updated successfully.",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update project.",
      );
      toast({
        type: "error",
        title: "Failed to update project",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Project name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isSaving}
      />

      <Input
        label="Project key"
        value={key}
        maxLength={10}
        onChange={(event) => setKey(event.target.value.toUpperCase())}
        disabled={isSaving}
      />

      <Textarea
        label="Description"
        value={description}
        rows={4}
        onChange={(event) => setDescription(event.target.value)}
        disabled={isSaving}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" loading={isSaving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
