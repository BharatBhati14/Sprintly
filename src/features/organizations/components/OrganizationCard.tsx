"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button, Card } from "@/components/ui";

import type { Organization } from "../organization.types";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="group transition-colors hover:border-zinc-300 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-zinc-950">
            {organization.name}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            slug: @{organization.slug}
          </p>
        </div>

        <Link
          href={`/organizations/${organization.id}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors group-hover:border-zinc-300 group-hover:text-zinc-950"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Link
        href={`/organizations/${organization.id}`}
        className="mt-5 block text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950  "
      >
        <Button type="button" variant="secondary">
          Open organization
        </Button>
      </Link>
    </Card>
  );
}
