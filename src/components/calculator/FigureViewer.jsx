import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitFork, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Figure1Chart from "./flowcharts/Figure1Chart";
import Figure2AChart from "./flowcharts/Figure2AChart";
import Figure2BChart from "./flowcharts/Figure2BChart";
import Figure2CChart from "./flowcharts/Figure2CChart";
import Figure2DChart from "./flowcharts/Figure2DChart";

const FIGURE_META = {
  "Figure 1": { label: "Figure 1", title: "Suspected Soft Tissue Lesion — Initial Triage", Component: Figure1Chart },
  "Figure 2A": { label: "Figure 2A", title: "Lipomatous Soft Tissue Lesion", Component: Figure2AChart },
  "Figure 2B": { label: "Figure 2B", title: "Cyst-like / High Water Content Soft Tissue Lesion", Component: Figure2BChart },
  "Figure 2C": { label: "Figure 2C", title: "Indeterminate Solid — Deep, Tendon, Fascial, Subungual", Component: Figure2CChart },
  "Figure 2D": { label: "Figure 2D", title: "Indeterminate Solid — Vascular, Articular, Neural, Cutaneous", Component: Figure2DChart },
};

function getUsedFigures(caseData) {
  const figures = ["Figure 1"];
  const { macroscopicFatT1W, t2EnhancementPath, compartment } = caseData;

  if (macroscopicFatT1W === "yes") {
    figures.push("Figure 2A");
  } else if (macroscopicFatT1W === "no") {
    if (t2EnhancementPath === "cystlike") {
      figures.push("Figure 2B");
    } else if (t2EnhancementPath === "indeterminate_solid") {
      if (["deep_muscle", "intratendinous", "fascial", "subungual"].includes(compartment)) {
        figures.push("Figure 2C");
      } else if (["intravascular", "intraarticular", "intraneural", "cutaneous"].includes(compartment)) {
        figures.push("Figure 2D");
      } else {
        figures.push("Figure 2C");
        figures.push("Figure 2D");
      }
    }
  }
  return figures;
}

function FigureAccordion({ figKey, caseData, finalScore, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const meta = FIGURE_META[figKey];
  if (!meta) return null;
  const { label, title, Component } = meta;

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white/60 dark:bg-slate-900/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Badge className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-0 text-[11px] font-bold shrink-0">
            {label}
          </Badge>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-2 overflow-x-auto">
              <div className="min-w-[500px]">
                <Component caseData={caseData} finalScore={finalScore} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FigureViewer({ caseData, result }) {
  const usedFigureKeys = getUsedFigures(caseData);
  const finalScore = result?.category?.score;

  if (usedFigureKeys.length === 0) return null;

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GitFork className="w-5 h-5 text-emerald-500" />
          Flowchart Figures
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Interactive flowcharts showing the decision path. The active branch is highlighted; the final score node pulses blue.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {usedFigureKeys.map((key, i) => (
          <FigureAccordion
            key={key}
            figKey={key}
            caseData={caseData}
            finalScore={finalScore}
            defaultOpen={i === usedFigureKeys.length - 1}
          />
        ))}
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-1">
          Based on Chhabra, Garner, Rehman et al. AJR 2025. For educational purposes.
        </p>
      </CardContent>
    </Card>
  );
}