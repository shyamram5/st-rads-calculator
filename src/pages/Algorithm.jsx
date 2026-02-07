import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowLeft, GitBranch, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALGORITHM_NODES } from "../components/algorithm/algorithmData";
import AlgorithmNode from "../components/algorithm/AlgorithmNode";
import BreadcrumbTrail from "../components/algorithm/BreadcrumbTrail";

export default function AlgorithmPage() {
  const [history, setHistory] = useState(["start"]);
  const currentNodeId = history[history.length - 1];
  const currentNode = ALGORITHM_NODES[currentNodeId];

  const handleSelect = useCallback((nextId) => {
    setHistory(prev => [...prev, nextId]);
  }, []);

  const handleBack = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  const handleReset = useCallback(() => {
    setHistory(["start"]);
  }, []);

  const handleJumpTo = useCallback((idx) => {
    setHistory(prev => prev.slice(0, idx + 1));
  }, []);

  // Also handle category 6 separately (it's assigned directly)
  const [showCat6, setShowCat6] = useState(false);

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GitBranch className="w-7 h-7 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">ST-RADS Flowchart Algorithm</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
          Interactive branching algorithm faithfully replicating Figures 1, 2A, 2B, 2C, and 2D from Chhabra et al. (AJR 2025). Click through each decision to arrive at a ST-RADS category.
        </p>
      </div>

      {/* Category 6 shortcut */}
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowCat6(!showCat6)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {showCat6 ? "▼" : "▶"} Known treated lesion? (Category 6 — assigned directly, not via flowcharts)
        </button>
        {showCat6 && (
          <div className="mt-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800 text-sm space-y-2">
            <p className="font-semibold text-blue-900 dark:text-blue-200">ST-RADS Category 6</p>
            <p className="text-blue-800 dark:text-blue-300">For known soft-tissue tumors that are receiving or have undergone treatment:</p>
            <ul className="list-disc ml-5 text-blue-700 dark:text-blue-300 space-y-1">
              <li><strong>6A:</strong> No residual tumor — expected posttreatment changes</li>
              <li><strong>6B:</strong> Residual tumor — ≤20% increase in largest dimension</li>
              <li><strong>6C:</strong> Progressive/recurrent — &gt;20% increase, increased diffusion restriction</li>
            </ul>
          </div>
        )}
      </div>

      {/* Breadcrumb Trail */}
      <div className="max-w-2xl mx-auto bg-white/50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
        <BreadcrumbTrail history={history} onJumpTo={handleJumpTo} />
      </div>

      {/* Current Node */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {currentNode && (
              <AlgorithmNode node={currentNode} onSelect={handleSelect} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={history.length <= 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <Button variant="ghost" onClick={handleReset} className="gap-2 text-slate-500">
            <RotateCcw className="w-4 h-4" /> Start Over
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Disclaimer:</strong> This interactive algorithm is for educational purposes only. It replicates the published ST-RADS flowcharts (Chhabra et al., AJR 2025, currently designated as an ACR work-in-progress). Not a substitute for clinical judgment. For T2 signal characterization, use fluid-sensitive sequences without fat saturation (conventional T2W, in-phase Dixon, STIR).
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Reference: Chhabra A, Garner HW, Rehman M, et al. Soft Tissue-RADS: An ACR Work-in-Progress Framework. AJR 2025.
        </p>
      </div>
    </div>
  );
}