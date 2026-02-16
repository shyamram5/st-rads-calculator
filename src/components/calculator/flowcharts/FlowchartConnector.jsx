import React from "react";
import { cn } from "@/lib/utils";

// Vertical connector (line going down)
export function VLine({ isHighlighted, className }) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className={cn(
        "w-0.5 h-4 transition-colors duration-300",
        isHighlighted ? "bg-blue-400 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
      )} />
    </div>
  );
}

// A fork that draws: parent → vertical line down → horizontal bar across children → vertical lines down to each child
// children are rendered below each fork point
export function Fork({ isHighlighted, highlightedIndex, children, className }) {
  const childCount = React.Children.count(children);
  if (childCount === 0) return null;

  // For determining which lines to highlight: 
  // highlightedIndex can be -1 (none), or the index of the highlighted child
  // If isHighlighted is true but no specific index, highlight the trunk only
  const hIdx = highlightedIndex ?? -1;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Vertical line from parent */}
      <VLine isHighlighted={isHighlighted} />

      {/* Horizontal bar connecting all children */}
      <div className="relative flex justify-center w-full">
        {/* The horizontal line spans from center of first child to center of last child */}
        <div className="flex items-start w-full">
          {React.Children.map(children, (child, i) => {
            const isFirst = i === 0;
            const isLast = i === childCount - 1;
            const childHighlighted = hIdx === i;

            return (
              <div className="flex flex-col items-center flex-1 min-w-0">
                {/* Horizontal line segment above this child */}
                <div className="flex w-full h-[2px]">
                  {/* Left half */}
                  <div className={cn(
                    "h-full flex-1",
                    isFirst ? "bg-transparent" : (
                      // highlight if this child or any child to its left is highlighted
                      (hIdx >= 0 && (hIdx >= i || hIdx <= i - 1) && hIdx < i && hIdx >= 0)
                        ? "bg-slate-200 dark:bg-slate-700"
                        : "bg-slate-200 dark:bg-slate-700"
                    )
                  )}
                  style={{
                    background: isFirst
                      ? "transparent"
                      : (hIdx >= 0 && (hIdx === i || hIdx === i - 1))
                        ? undefined
                        : undefined
                  }}
                  />
                  {/* Right half */}
                  <div className={cn(
                    "h-full flex-1",
                    isLast ? "bg-transparent" : "bg-slate-200 dark:bg-slate-700"
                  )} />
                </div>
                {/* Vertical line down to child */}
                <VLine isHighlighted={childHighlighted} />
                {/* The child content */}
                {child}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VLine;