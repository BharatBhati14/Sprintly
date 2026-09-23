"use client";

import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

import { Card } from "@/components/ui";

import { IssuePriorityBadge, IssueStatusBadge } from "./";

import type { Issue } from "../issue.types";

interface IssueDetailProps {
  issue: Issue;
  projectKey: string;
}

export function IssueDetail({ issue, projectKey }: IssueDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-zinc-500">
            {projectKey}-{issue.number} &nbsp; |
          </span>
          <>
            <span className="text-sm font-medium text-zinc-500">Status</span>
            <IssueStatusBadge status={issue.status} />
            <span className="text-sm font-medium text-zinc-500">|</span>
          </>

          <>
            <span className="text-sm text-zinc-500">Priority</span>
            <IssuePriorityBadge priority={issue.priority} />
          </>
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
          {issue.title}
        </h1>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-zinc-950">Description</h2>

          <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
            {issue.desc || "No description provided."}
          </div>
        </div>

        {issue.labels && issue.labels.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-zinc-950">Labels</h2>

            <div className="mt-2 flex flex-wrap gap-2">
              {issue.labels.map((label) => (
                <span
                  key={label.id}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700"
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-zinc-950">Details</h2>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Assignee
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-700">
              <User className="h-4 w-4 text-zinc-400" />
              <p>{issue.assignee?.name || "Unassigned"}</p>
              {issue.assignee && (
                <p className="text-xs text-zinc-400">{issue.assignee.email}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Reporter
            </p>

            <div className="mt-1 text-sm text-zinc-700 flex items-center gap-2">
              <p>{issue.reporter?.name || "Unknown"}</p>
              {issue.reporter && (
                <p className="text-xs text-zinc-400">{issue.reporter.email}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Due date
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-700">
              <CalendarDays className="h-4 w-4 text-zinc-400" />
              {issue.dueDate
                ? new Date(issue.dueDate).toLocaleDateString()
                : "No due date"}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Created
            </p>

            <p className="mt-1 text-sm text-zinc-700 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-zinc-400" />
              {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
