import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import CaseCard from "../components/cases/CaseCard";
import { CASE_EXAMPLES } from "../components/cases/caseExamplesData";

const CATEGORY_FILTERS = [
  { label: "All", value: "all" },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
];

export default function CaseExamplesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredCases = activeFilter === "all"
    ? CASE_EXAMPLES
    : CASE_EXAMPLES.filter(c => c.category === activeFilter);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Case Examples</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Representative ST-RADS cases from Chhabra et al., <em>AJR</em> 2025.
        </p>
      </header>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-gray-600 dark:text-gray-300">Educational Use Only.</strong> These cases are adapted from the published ACR ST-RADS manuscript. They do not constitute medical advice.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150 ${
              activeFilter === f.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            {f.value === "all" ? "All" : `ST-RADS ${f.label}`}
          </button>
        ))}
      </div>

      {/* Cases */}
      <div className="space-y-4">
        {filteredCases.map(c => (
          <CaseCard key={c.id} caseData={c} />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-16 text-[13px] text-gray-400 dark:text-gray-500">
          No cases match the selected filter.
        </div>
      )}

      {/* Citation */}
      <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-900">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed max-w-lg mx-auto">
          Cases adapted from: Chhabra A, Garner HW, Rehman M, et al. Soft Tissue-RADS: An ACR Work-in-Progress Framework. <em>AJR</em> 2025.
        </p>
      </div>
    </div>
  );
}