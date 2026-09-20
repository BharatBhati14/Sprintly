"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, ListTodo, Users, Tags, Settings } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ProjectNavigationProps {
  organizationId: string;
  projectId: string;
}

export function ProjectNavigation({
  organizationId,
  projectId,
}: ProjectNavigationProps) {
  const pathname = usePathname();

  const basePath = `/organizations/${organizationId}/projects/${projectId}`;

  const items = [
    {
      label: "Overview",
      href: basePath,
      icon: FolderKanban,
      exact: true,
    },
    {
      label: "Issues",
      href: `${basePath}/issues`,
      icon: ListTodo,
    },
    {
      label: "Members",
      href: `${basePath}/members`,
      icon: Users,
    },
    {
      label: "Labels",
      href: `${basePath}/labels`,
      icon: Tags,
    },
    {
      label: "Settings",
      href: `${basePath}/settings`,
      icon: Settings,
    },
  ];

  return (
    <nav className="border-b border-zinc-200">
      <div className="flex items-center gap-1 overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
