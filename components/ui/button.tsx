import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-black text-white hover:bg-[#FF3000]",
        variant === "secondary" && "border-2 border-black bg-white text-black hover:bg-black hover:text-white",
        variant === "ghost" && "text-black hover:bg-[#F2F2F2]",
        variant === "danger" && "bg-[#FF3000] text-white hover:bg-black",
        className
      )}
      {...props}
    />
  );
}
