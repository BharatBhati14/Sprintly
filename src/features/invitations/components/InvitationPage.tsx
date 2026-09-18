"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { acceptOrganizationInvitation } from "../invitation.api";

interface InvitationPageProps {
  token: string;
}

export function InvitationPage({ token }: InvitationPageProps) {
  const [status, setStatus] = useState<
    "ready" | "accepting" | "accepted" | "error"
  >("ready");

  const [error, setError] = useState("");

  const handleAccept = async () => {
    try {
      setStatus("accepting");
      setError("");

      await acceptOrganizationInvitation(token);

      setStatus("accepted");
    } catch (error) {
      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Unable to accept this invitation.",
      );
    }
  };

  if (status === "accepted") {
    return (
      <Card className="mx-auto w-full px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-lg font-semibold text-zinc-950">
            Invitation accepted
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            You have successfully joined the organization.
          </p>

          <Button
            type="button"
            className="mt-8"
            onClick={() => {
              window.location.href = "/organizations";
            }}
          >
            Go to organizations
          </Button>
        </div>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="mx-auto w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-lg font-semibold text-zinc-950">
            Unable to accept invitation
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">{error}</p>

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => {
              setStatus("ready");
              setError("");
            }}
          >
            Try again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full  p-8">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-zinc-950">
          Organization invitation
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          You have been invited to join an organization on Sprintly.
        </p>

        <Button
          type="button"
          className="mt-8 w-full"
          disabled={status === "accepting"}
          onClick={handleAccept}
        >
          {status === "accepting" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {status === "accepting" ? "Accepting..." : "Accept invitation"}
        </Button>
      </div>
    </Card>
  );
}
