"use client";

import { Dialog } from "@/components/ui";
import type { Project, UpdateProjectInput } from "../project.types";
import { ProjectSettingsForm } from "./ProjectSettingsForm";

interface ProjectSettingsDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave: (input: UpdateProjectInput) => Promise<void>;
}

export function ProjectSettingsDialog({
  project,
  open,
  onClose,
  onSave,
}: ProjectSettingsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Project settings"
      description="Manage your project's basic information."
    >
      <ProjectSettingsForm
        project={project}
        onSave={async (input) => {
          await onSave(input);
          onClose();
        }}
      />
    </Dialog>
  );
}
