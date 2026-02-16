import React from "react";
import { cn } from "@/lib/utils";

// Renders a proper tree fork: a parent node, a vertical stem, a horizontal bar, 
// and vertical stems down to each child. Properly connects branches with lines.
export function TreeFork({ children, parentHighlighted, className }) {
  const items = React.Children.toArray(children);
  const count = items.length;
  if (count === 0) return null;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Vertical stem down from parent */}
      <Stem h={parentHighlighted} />

      {/* Horizontal rail + child stems + children */}
      <div className="relative flex">
        {items.map((child, i) => {
          const isFirst = i === 0;
          const isLast = i === count - 1;

          return (
            <div key={i} className="flex flex-col items-center min-w-0 px-1.5 md:px-2">
              {/* Horizontal rail segment: half-left + half-right above each child */}
              {count > 1 && (
                <div className="flex w-full h-[2px]">
                  <div className={cn("flex-1 h-full", isFirst ? "" : "bg-slate-300 dark:bg-slate-600")} />
                  <div className={cn("flex-1 h-full", isLast ? "" : "bg-slate-300 dark:bg-slate-600")} />
                </div>
              )}
              {/* Vertical stem down to child */}
              {count > 1 && <Stem h={false} />}
              {/* Child node / subtree */}
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Short vertical line
export function Stem({ h, className }) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className={cn(
        "w-0.5 h-3.5 transition-colors duration-300",
        h ? "bg-blue-400 dark:bg-blue-400" : "bg-slate-300 dark:bg-slate-600"
      )} />
    </div>
  );
}