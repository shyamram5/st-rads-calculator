import React from "react";
import { cn } from "@/lib/utils";

export default function FlowchartConnector({ isHighlighted, direction = "down", className }) {
  if (direction === "down") {
    return (
      <div className={cn(
        "flex justify-center",
        className
      )}>
        <div className={cn(
          "w-0.5 h-5 transition-colors duration-300",
          isHighlighted ? "bg-blue-400 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
        )} />
      </div>
    );
  }

  // horizontal fork
  return (
    <div className={cn(
      "h-0.5 transition-colors duration-300",
      isHighlighted ? "bg-blue-400 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700",
      className
    )} />
  );
}