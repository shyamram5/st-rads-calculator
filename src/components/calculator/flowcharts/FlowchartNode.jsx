import React from "react";
import { cn } from "@/lib/utils";

const SCORE_STYLES = {
  0: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", border: "border-slate-300 dark:border-slate-600", activeBg: "bg-slate-300 dark:bg-slate-600", activeText: "text-slate-900 dark:text-white", activeBorder: "border-slate-500 dark:border-slate-400", activeRing: "ring-slate-400", activeShadow: "shadow-slate-300/50 dark:shadow-slate-500/30" },
  1: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", activeBg: "bg-blue-500 dark:bg-blue-500", activeText: "text-white", activeBorder: "border-blue-600 dark:border-blue-400", activeRing: "ring-blue-400", activeShadow: "shadow-blue-400/50 dark:shadow-blue-500/40" },
  2: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", activeBg: "bg-emerald-500 dark:bg-emerald-500", activeText: "text-white", activeBorder: "border-emerald-600 dark:border-emerald-400", activeRing: "ring-emerald-400", activeShadow: "shadow-emerald-400/50 dark:shadow-emerald-500/40" },
  3: { bg: "bg-yellow-50 dark:bg-yellow-950/40", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-700", activeBg: "bg-yellow-400 dark:bg-yellow-500", activeText: "text-yellow-950 dark:text-white", activeBorder: "border-yellow-500 dark:border-yellow-400", activeRing: "ring-yellow-400", activeShadow: "shadow-yellow-400/50 dark:shadow-yellow-500/40" },
  4: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-700", activeBg: "bg-orange-500 dark:bg-orange-500", activeText: "text-white", activeBorder: "border-orange-600 dark:border-orange-400", activeRing: "ring-orange-400", activeShadow: "shadow-orange-400/50 dark:shadow-orange-500/40" },
  5: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-700", activeBg: "bg-red-500 dark:bg-red-500", activeText: "text-white", activeBorder: "border-red-600 dark:border-red-400", activeRing: "ring-red-400", activeShadow: "shadow-red-400/50 dark:shadow-red-500/40" },
};

export default function FlowchartNode({ label, type = "decision", score, isHighlighted, isActive, children, className }) {
  const s = score !== undefined ? SCORE_STYLES[score] || SCORE_STYLES[0] : null;

  if (type === "score") {
    return (
      <div className={cn(
        "rounded-xl border-2 text-center transition-all duration-300 min-w-[70px]",
        isActive
          ? cn("px-4 py-2.5 scale-110 z-10", s.activeBg, s.activeText, s.activeBorder, `ring-4 ${s.activeRing}/40`, `shadow-xl ${s.activeShadow}`)
          : cn("px-3 py-2", s.bg, s.text, s.border, isHighlighted ? "opacity-70" : "opacity-30"),
        className
      )}>
        <div className="leading-tight font-semibold text-[10px]">ST-RADS</div>
        <div className={cn("font-black", isActive ? "text-xl" : "text-base")}>{score}</div>
      </div>
    );
  }

  if (type === "pathway") {
    return (
      <div className={cn(
        "px-3 py-2 rounded-lg border-2 border-dashed text-center text-[11px] font-semibold transition-all duration-300",
        isHighlighted
          ? "border-blue-400 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
          : "border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 opacity-50",
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
        : "border-slate-200/80 dark:border-slate-700/60 bg-slate-50/40 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600 opacity-50",
      className
    )}>
      {label}
      {children}
    </div>
  );
}