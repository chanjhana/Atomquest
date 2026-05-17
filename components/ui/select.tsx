import * as React from "react";
import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn("focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm", props.className)}
    />
  );
}
