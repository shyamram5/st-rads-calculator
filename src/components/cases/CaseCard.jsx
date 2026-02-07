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
    <Card className={`shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl ${colors.bg}`}>
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Badge className={`${colors.badge} font-bold text-sm px-3 py-1`}>
                ST-RADS {caseData.categoryLabel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {caseData.riskLevel}
              </Badge>
              {caseData.diagnosis && (
                <Badge variant="outline" className="text-xs font-medium">
                  {caseData.diagnosis}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
              {caseData.title}
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{caseData.patient}</p>
          </div>
          <button className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-5 pt-0">
              {/* Imaging Series */}
              {caseData.imageDescriptions && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      <Image className="w-4 h-4" /> Imaging Series ({caseData.figureRef})
                    </h4>
                    <a
                      href={PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      View in Manuscript <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {caseData.imageDescriptions.map((img, i) => (
                      <div
                        key={i}
                        className="bg-slate-900 dark:bg-black rounded-lg p-3 flex flex-col justify-between min-h-[90px]"
                      >
                        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wide mb-1">{img.label}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{img.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Imaging Findings */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> MRI Findings
                </h4>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {caseData.findings}
                </div>
              </div>

              {/* Key Features */}
              {caseData.keyFeatures && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <Stethoscope className="w-4 h-4" /> Key Diagnostic Features
                  </h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {caseData.keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white/60 dark:bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${colors.badge}`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Management */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <ClipboardList className="w-4 h-4" /> Management & Outcome
                </h4>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {caseData.management}
                </div>
              </div>

              {/* Teaching Point */}
              {caseData.teachingPoint && (
                <div className={`rounded-lg p-4 border-l-4 ${colors.ring.replace('ring', 'border')} bg-white/40 dark:bg-slate-900/40`}>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Teaching Point</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{caseData.teachingPoint}</p>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}