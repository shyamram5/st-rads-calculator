import React from "react";
import { cn } from "@/lib/utils";

// Simple vertical line between nodes
export default function VLine({ h = true, className }) {
  return (
    <div className={cn("flex justify-center py-0", className)}>
      <div className={cn(
        "w-0.5 h-4 transition-colors duration-300",
        h ? "bg-blue-400 dark:bg-blue-400" : "bg-slate-200 dark:bg-slate-700"
      )} />
    </div>
  );
}