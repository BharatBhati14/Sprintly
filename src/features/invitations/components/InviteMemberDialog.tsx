"use client";

import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";

import { Button, Input } from "@/components/ui";

import { createOrganizationInvitation } from "@/features/organizations/organization.api";
import { invitationSchema } from "@/features/invitations/validations/invitation.validation";
import { InvitationSuccessDialog } from "./InvitationSuccessDialog";

interface InviteMemberDialogProps {
  orgName: string;
  organizationId: string;
  open: boolean;
  onClose: () => void;
}

export function InviteMemberDialog({
  orgName,
  organizationId,
  open,
  onClose,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [invitationLink, setInvitationLink] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const result = invitationSchema.safeParse({
      email,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    try {
      setIsSubmitting(true);

      const invitation = await createOrganizationInvitation(organizationId, {
        email: result.data.email,
      });

      const link = `${window.location.origin}/invitations/${invitation.token}`;

      setInvitedEmail(result.data.email);
      setInvitationLink(link);
      setShowSuccess(true);
      setEmail("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create invitation",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <InvitationSuccessDialog
        orgName={orgName}
        open
        email={invitedEmail}
        invitationLink={invitationLink}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="mb-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
            <UserPlus className="h-5 w-5 text-zinc-700" />
          </div>

          <h2 className="text-lg font-semibold text-zinc-950">Invite member</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Create an invitation link for someone to join this organization.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="invite-email"
              className="mb-2 block text-sm font-medium text-zinc-900"
            >
              Email address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="person@example.com"
                className="pl-9"
                disabled={isSubmitting}
              />
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isSubmitting}>
              Create invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
