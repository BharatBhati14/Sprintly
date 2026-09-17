import { User } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

function getInitials(name?: string | null) {
  if (!name) {
    return null;
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 font-medium text-zinc-600",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? "User"}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        initials
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  );
}
