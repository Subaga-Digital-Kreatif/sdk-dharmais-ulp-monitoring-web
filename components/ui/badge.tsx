import * as React from "react";

import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";

type BadgeVariant = "default" | "outline" | "soft";

type BadgeProps = {
  variant?: BadgeVariant;
} & React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClass =
    variant === "outline"
      ? "border-[#C9E3FF] bg-transparent text-[#0066CC]"
      : variant === "soft"
      ? "border-transparent bg-[#E6F3FF] text-[#0B1E33]"
      : "border-transparent bg-[#0066CC] text-white";

  return (
    <div className={cn(base, variantClass, className)} {...props} />
  );
}

