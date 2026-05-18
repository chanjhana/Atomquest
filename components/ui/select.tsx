import * as React from "react";
import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black focus:border-[#FF3000] focus:outline-none transition-colors disabled:bg-[#F2F2F2] disabled:cursor-not-allowed",
        props.className
      )}
    />
  );
}
