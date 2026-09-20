import { Card } from "@/components/ui";
import { ListTodo } from "lucide-react";

export function IssueEmptyState() {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
        <ListTodo className="h-5 w-5 text-zinc-500" />
      </div>

      <h3 className="mt-4 font-semibold text-zinc-950">No issues yet</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
        Create your first issue to start tracking work in this project.
      </p>
    </Card>
  );
}
