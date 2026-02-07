import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, AlertTriangle } from "lucide-react";
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="text-center space-y-3 pt-4">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Case Examples</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Representative cases from the ACR Soft Tissue-RADS framework (Chhabra et al., <em>AJR</em> 2025), illustrating how each ST-RADS category is applied to real clinical scenarios.
        </p>
      </header>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-5 py-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Educational Use Only:</strong> These cases are adapted from the published ACR ST-RADS manuscript for teaching purposes. They do not constitute medical advice. Always correlate with the full clinical picture and pathology.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filter by Category:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {f.value === "all" ? "All Cases" : `ST-RADS ${f.label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Cases */}
      <div className="space-y-6">
        {filteredCases.map(c => (
          <CaseCard key={c.id} caseData={c} />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No cases match the selected filter.
        </div>
      )}

      {/* Citation */}
      <div className="text-center pt-4 pb-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-lg mx-auto">
          Cases adapted from: Chhabra A, Garner HW, Rehman M, et al. Soft Tissue-RADS: An ACR Work-in-Progress Framework for Standardized Reporting of Soft-Tissue Lesions on MRI. <em>AJR</em> 2025. doi:10.2214/AJR.25.34013
        </p>
      </div>
    </div>
  );
}