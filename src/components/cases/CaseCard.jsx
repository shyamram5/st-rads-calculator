import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Stethoscope, ClipboardList, Activity, Image, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDF_URL } from "./caseExamplesData";

const categoryColors = {
  0: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", ring: "ring-slate-300 dark:ring-slate-600", badge: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300" },
  1: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-300", ring: "ring-green-300 dark:ring-green-700", badge: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  2: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-300 dark:ring-emerald-700", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  3: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-300", ring: "ring-yellow-300 dark:ring-yellow-700", badge: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" },
  4: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-300", ring: "ring-orange-300 dark:ring-orange-700", badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  5: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-300", ring: "ring-red-300 dark:ring-red-700", badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  6: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-300", ring: "ring-purple-300 dark:ring-purple-700", badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
};

export default function CaseCard({ caseData }) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[caseData.category] || categoryColors[0];

  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none overflow-hidden transition-colors">
      <CardHeader className="cursor-pointer p-5" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] font-semibold px-2 py-0.5 rounded-md">
                ST-RADS {caseData.categoryLabel}
              </Badge>
              <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">
                {caseData.riskLevel}
              </Badge>
              {caseData.diagnosis && (
                <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">
                  {caseData.diagnosis}
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              {caseData.title}
            </CardTitle>
            <p className="text-[12px] text-gray-400 dark:text-gray-500">{caseData.patient}</p>
          </div>
          <button className="mt-1 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-5 pt-0 px-5 pb-5 border-t border-gray-100 dark:border-gray-900">
              {/* Imaging Series */}
              {caseData.imageDescriptions && (
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Imaging Series ({caseData.figureRef})
                    </h4>
                    <a
                      href={PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      View in Manuscript <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                    {caseData.imageDescriptions.map((img, i) => (
                      <div
                        key={i}
                        className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 flex flex-col justify-between min-h-[80px]"
                      >
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">{img.label}</p>
                        <p className="text-[11px] text-gray-500 leading-snug">{img.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Imaging Findings */}
              <div className="space-y-2">
                <h4 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MRI Findings
                </h4>
                <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  {caseData.findings}
                </div>
              </div>

              {/* Key Features */}
              {caseData.keyFeatures && (
                <div className="space-y-2">
                  <h4 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Key Diagnostic Features
                  </h4>
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {caseData.keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-gray-950 rounded-lg px-3 py-2 text-[13px] text-gray-600 dark:text-gray-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-400 dark:bg-gray-600"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Management */}
              <div className="space-y-2">
                <h4 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Management & Outcome
                </h4>
                <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  {caseData.management}
                </div>
              </div>

              {/* Teaching Point */}
              {caseData.teachingPoint && (
                <div className="rounded-lg p-4 border-l-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
                  <p className="text-[12px] font-semibold text-gray-900 dark:text-white mb-1">Teaching Point</p>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{caseData.teachingPoint}</p>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}