import React from "react";
import { ChevronRight } from "lucide-react";
import { ALGORITHM_NODES } from "./algorithmData";

export default function BreadcrumbTrail({ history, onJumpTo }) {
  return (
    <div className="flex items-center gap-1 flex-wrap text-xs">
      {history.map((nodeId, idx) => {
        const node = ALGORITHM_NODES[nodeId];
        if (!node) return null;
        const isLast = idx === history.length - 1;
        const label = node.terminal ? node.label : (node.title || nodeId);

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />}
            <button
              onClick={() => !isLast && onJumpTo(idx)}
              disabled={isLast}
              className={`px-2 py-1 rounded-md transition-colors ${
                isLast
                  ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              }`}
            >
              {label.length > 30 ? label.substring(0, 30) + "…" : label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}