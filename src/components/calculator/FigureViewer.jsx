import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

// Map figure keys to uploaded manuscript images
const FIGURE_DATA = {
  "Figure 1": {
    label: "Figure 1",
    title: "Suspected Soft Tissue Lesion — Initial Triage",
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/6bc410ade_Screenshot2026-02-16at42850PM.png",
    citation: "Chhabra, Garner, Rehman et al. AJR 2025",
  },
  "Figure 2A": {
    label: "Figure 2A",
    title: "Lipomatous Soft Tissue Lesion",
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/0b126c55d_Screenshot2026-02-16at42857PM.png",
    citation: "Chhabra, Garner, Rehman et al. AJR 2025",
  },
  "Figure 2B": {
    label: "Figure 2B",
    title: "Cyst-like / High Water Content Soft Tissue Lesion",
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/cfbb8a4f6_Screenshot2026-02-16at42907PM.png",
    citation: "Chhabra, Garner, Rehman et al. AJR 2025",
  },
  "Figure 2C": {
    label: "Figure 2C",
    title: "Indeterminate Solid Soft Tissue Lesion",
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/81ab9bfac_Screenshot2026-02-16at42913PM.png",
    citation: "Chhabra, Garner, Rehman et al. AJR 2025",
  },
  "Figure 2D": {
    label: "Figure 2D",
    title: "Indeterminate Solid Soft Tissue Mass",
    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/055808623_Screenshot2026-02-16at42920PM.png",
    citation: "Chhabra, Garner, Rehman et al. AJR 2025",
  },
};

// Determine which figures were used from the decision path
function getUsedFigures(caseData) {
  const figures = new Set();
  figures.add("Figure 1"); // Always used

  const { macroscopicFatT1W, t2EnhancementPath, compartment } = caseData;

  if (macroscopicFatT1W === "yes") {
    figures.add("Figure 2A");
  } else if (macroscopicFatT1W === "no") {
    if (t2EnhancementPath === "cystlike") {
      figures.add("Figure 2B");
    } else if (t2EnhancementPath === "indeterminate_solid") {
      if (["deep_muscle", "intratendinous", "fascial", "subungual"].includes(compartment)) {
        figures.add("Figure 2C");
      } else if (["intravascular", "intraarticular", "intraneural", "cutaneous"].includes(compartment)) {
        figures.add("Figure 2D");
      } else {
        // Compartment not yet selected — show both
        figures.add("Figure 2C");
        figures.add("Figure 2D");
      }
    }
  }

  return Array.from(figures);
}

function FigureLightbox({ figure, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{figure.label}: {figure.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{figure.citation}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="overflow-auto max-h-[calc(90vh-80px)] p-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <img
            src={figure.src}
            alt={`${figure.label}: ${figure.title}`}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FigureViewer({ caseData }) {
  const [lightboxFigure, setLightboxFigure] = useState(null);
  const usedFigureKeys = getUsedFigures(caseData);
  const usedFigures = usedFigureKeys.map(k => FIGURE_DATA[k]).filter(Boolean);

  if (usedFigures.length === 0) return null;

  return (
    <>
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-500" />
            Flowchart Figures Used
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tap a figure to view full size. The highlighted figures were followed for this case.
          </p>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${usedFigures.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {usedFigures.map((fig) => (
              <button
                key={fig.label}
                onClick={() => setLightboxFigure(fig)}
                className="group relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-900 text-left"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                  <img
                    src={fig.src}
                    alt={`${fig.label}: ${fig.title}`}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded-full p-2 shadow-lg">
                      <ZoomIn className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </div>
                  </div>
                </div>
                {/* Label bar */}
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <Badge className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-0 text-[11px] font-bold">
                    {fig.label}
                  </Badge>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{fig.title}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center">
            Figures from {usedFigures[0]?.citation}. Used with reference for educational purposes.
          </p>
        </CardContent>
      </Card>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxFigure && (
          <FigureLightbox figure={lightboxFigure} onClose={() => setLightboxFigure(null)} />
        )}
      </AnimatePresence>
    </>
  );
}