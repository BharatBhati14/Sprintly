"use client";

import type { IssueFilters as IssueFilterState } from "../issue.types";
import type { ProjectMember } from "@/features/project-members/project-member.types";
import type { Label } from "@/features/labels/label.types";

interface IssueFiltersProps {
  filters: IssueFilterState;
  projectMembers: ProjectMember[];
  labels: Label[];
  onChange: (filters: Partial<IssueFilterState>) => void;
  onClear: () => void;
}

const selectClassName =
  "h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100";

export function IssueFilters({
  filters,
  projectMembers,
  labels,
  onChange,
  onClear,
}: IssueFiltersProps) {
  const hasFilters =
    Boolean(filters.status) ||
    Boolean(filters.priority) ||
    Boolean(filters.assigneeId) ||
    Boolean(filters.labelId) ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Filters</h2>

            <p className="mt-1 text-xs text-zinc-500">
              Narrow down the issues in this project.
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* Status */}

          <div className="space-y-1.5">
            <label
              htmlFor="issue-status-filter"
              className="text-xs font-medium text-zinc-600"
            >
              Status
            </label>

            <select
              id="issue-status-filter"
              value={filters.status ?? ""}
              onChange={(event) =>
                onChange({
                  status: event.target.value
                    ? (event.target.value as IssueFilterState["status"])
                    : undefined,
                })
              }
              className={selectClassName}
            >
              <option value="">All statuses</option>
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Priority */}

          <div className="space-y-1.5">
            <label
              htmlFor="issue-priority-filter"
              className="text-xs font-medium text-zinc-600"
            >
              Priority
            </label>

            <select
              id="issue-priority-filter"
              value={filters.priority ?? ""}
              onChange={(event) =>
                onChange({
                  priority: event.target.value
                    ? (event.target.value as IssueFilterState["priority"])
                    : undefined,
                })
              }
              className={selectClassName}
            >
              <option value="">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Assignee */}

          <div className="space-y-1.5">
            <label
              htmlFor="issue-assignee-filter"
              className="text-xs font-medium text-zinc-600"
            >
              Assignee
            </label>

            <select
              id="issue-assignee-filter"
              value={filters.assigneeId ?? ""}
              onChange={(event) =>
                onChange({
                  assigneeId:
                    event.target.value === "UNASSIGNED"
                      ? "UNASSIGNED"
                      : event.target.value || undefined,
                })
              }
              className={selectClassName}
            >
              <option value="">All assignees</option>

              <option value="UNASSIGNED">Unassigned</option>

              {projectMembers.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Label */}

          <div className="space-y-1.5">
            <label
              htmlFor="issue-label-filter"
              className="text-xs font-medium text-zinc-600"
            >
              Label
            </label>

            <select
              id="issue-label-filter"
              value={filters.labelId ?? ""}
              onChange={(event) =>
                onChange({
                  labelId: event.target.value || undefined,
                })
              }
              className={selectClassName}
            >
              <option value="">All labels</option>

              {labels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-end">
          {/* Sort */}

          <div className="space-y-1.5">
            <label
              htmlFor="issue-sort"
              className="text-xs font-medium text-zinc-600"
            >
              Sort by
            </label>

            <select
              id="issue-sort"
              value={filters.sortBy ?? "createdAt"}
              onChange={(event) =>
                onChange({
                  sortBy: event.target.value as IssueFilterState["sortBy"],
                })
              }
              className={selectClassName}
            >
              <option value="createdAt">Created date</option>

              <option value="updatedAt">Updated date</option>

              <option value="dueDate">Due date</option>

              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Sort order */}

          <div className="space-y-1.5">
            <label
              htmlFor="issue-sort-order"
              className="text-xs font-medium text-zinc-600"
            >
              Order
            </label>

            <select
              id="issue-sort-order"
              value={filters.sortOrder ?? "desc"}
              onChange={(event) =>
                onChange({
                  sortOrder: event.target
                    .value as IssueFilterState["sortOrder"],
                })
              }
              className={selectClassName}
            >
              <option value="desc">Newest first</option>

              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
