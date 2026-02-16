import React from "react";
import { cn } from "@/lib/utils";

// score → tailwind color mapping
const SCORE_STYLES = {
  0: { bg: "bg-slate-200 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-200", border: "border-slate-300 dark:border-slate-600", glow: "" },
  1: { bg: "bg-blue-100 dark:bg-blue-950/50", text: "text-blue-800 dark:text-blue-200", border: "border-blue-300 dark:border-blue-700", glow: "" },
  2: { bg: "bg-emerald-100 dark:bg-emerald-950/50", text: "text-emerald-800 dark:text-emerald-200", border: "border-emerald-400 dark:border-emerald-700", glow: "" },
  3: { bg: "bg-yellow-100 dark:bg-yellow-950/50", text: "text-yellow-800 dark:text-yellow-200", border: "border-yellow-400 dark:border-yellow-600", glow: "" },
  4: { bg: "bg-orange-100 dark:bg-orange-950/50", text: "text-orange-800 dark:text-orange-200", border: "border-orange-400 dark:border-orange-600", glow: "" },
  5: { bg: "bg-red-100 dark:bg-red-950/50", text: "text-red-800 dark:text-red-200", border: "border-red-400 dark:border-red-600", glow: "" },
};

// Types: "decision" (white box), "score" (colored box), "pathway" (dashed)
export default function FlowchartNode({ label, type = "decision", score, isHighlighted, isActive, children, className }) {
  const scoreStyle = score !== undefined ? SCORE_STYLES[score] || SCORE_STYLES[0] : null;

  if (type === "score") {
    return (
      <div className={cn(
        "relative px-3 py-2 rounded-lg border-2 text-center text-xs font-bold transition-all duration-300 min-w-[80px]",
        scoreStyle?.bg, scoreStyle?.text, scoreStyle?.border,
        isActive && "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 ring-offset-white dark:ring-offset-slate-900 scale-110 shadow-lg z-10",
        isHighlighted && !isActive && "opacity-80",
        !isHighlighted && !isActive && "opacity-40",
        className
      )}>
        <div className="text-[11px] leading-tight">ST-RADS</div>
        <div className="text-base font-extrabold">{score}</div>
        {isActive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  if (type === "pathway") {
    return (
      <div className={cn(
        "px-3 py-2 rounded-lg border-2 border-dashed text-center text-[11px] font-semibold transition-all duration-300",
        isHighlighted
          ? "border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
          : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500",
        className
      )}>
        {label}
      </div>
    );
  }

  // decision node
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border text-center text-[11px] leading-tight font-medium transition-all duration-300",
      isHighlighted
        ? "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm"
        : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500",
      className
    )}>
      {label}
      {children}
    </div>
  );
}