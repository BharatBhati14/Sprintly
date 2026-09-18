"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

import { Button, Dialog } from "@/components/ui";

interface InvitationSuccessDialogProps {
  orgName: string;
  open: boolean;
  email: string;
  invitationLink: string;
  onClose: () => void;
}

export function InvitationSuccessDialog({
  orgName,
  open,
  email,
  invitationLink,
  onClose,
}: InvitationSuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const invitationContent = `You're invited to join an organization - ${orgName} on Sprintly.

Accept your invitation:
${invitationLink}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(invitationContent);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check className="h-5 w-5" />
          </div>

          <h2 className="text-lg font-semibold text-zinc-950">
            Invitation created
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            The invitation for{" "}
            <span className="font-medium text-zinc-700">{email}</span> is ready
            to share.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-900">
            Invitation message
          </p>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {invitationContent}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-900">
            Invitation link
          </p>

          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 truncate rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
              {invitationLink}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy invitation"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>

          <a
            href={invitationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Open link
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Dialog>
  );
}
