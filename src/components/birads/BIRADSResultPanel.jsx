import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, RotateCcw, AlertTriangle, ClipboardCopy, ThumbsUp, ThumbsDown } from "lucide-react";
import { BIRADS_CATEGORIES } from "./biradsRuleEngine";

export default function BIRADSResultPanel({ category, summaryLines, modality, mammoCategory, usCategory, onReset }) {
  const [copied, setCopied] = useState(false);
  const info = BIRADS_CATEGORIES[category];
  if (!info) return null;

  const gradient = info.color;

  // Build report
  const reportLines = [
    "FINDINGS:",
    ...summaryLines,
    "",
    "IMPRESSION:",
    `${info.label}: ${info.phrase}`,
    `Malignancy risk: ${info.risk}`,
    ...(modality === "both" && mammoCategory && usCategory ? [
      `Mammography assessment: BI-RADS ${mammoCategory}`,
      `Ultrasound assessment: BI-RADS ${usCategory}`,
      `Overall assessment based on most suspicious finding: ${info.label}`
    ] : []),
    `Management: ${info.management}`,
    "",
    "Disclaimer: For clinical decision support only. Based on ACR BI-RADS® Atlas, 5th Edition (2013)."
  ];
  const report = reportLines.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Category Card */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className={`bg-gradient-to-r ${gradient} p-6 text-center text-white`}>
          <div className="text-4xl font-extrabold tracking-tight">{info.label}</div>
          <div className="text-base font-semibold mt-1 opacity-95">{info.name}</div>
          <Badge className="mt-3 bg-white/20 text-white border-white/30 text-sm">
            Risk: {info.risk}
          </Badge>
          {modality === "both" && mammoCategory && usCategory && (
            <div className="mt-2 text-xs opacity-80">
              Mammo: BI-RADS {mammoCategory} · US: BI-RADS {usCategory} · Overall: {info.label}
            </div>
          )}
        </div>
        <CardContent className="p-5 space-y-4 bg-white dark:bg-slate-900">
          {/* Standard Phrase */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">ACR Standard Phrase</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">{info.phrase}</p>
          </div>

          {/* Management */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Management Recommendation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{info.management}</p>
          </div>

          {/* Findings Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Findings Summary</h3>
            <div className="space-y-1">
              {summaryLines.map((line, i) => (
                <div key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DOs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 dark:text-green-400">DO</span>
            </h3>
            <ul className="space-y-1.5">
              {info.dos.map((d, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DON'Ts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-600 dark:text-red-400">DON'T</span>
            </h3>
            <ul className="space-y-1.5">
              {info.donts.map((d, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Structured Report */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <ClipboardCopy className="w-4 h-4 text-blue-500" /> Report Language
            </CardTitle>
            <Button variant={copied ? "default" : "outline"} size="sm" onClick={handleCopy} className={`gap-2 transition-all ${copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><ClipboardCopy className="w-3.5 h-3.5" /> Copy Report</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 select-all cursor-pointer" onClick={handleCopy}>
            {report}
          </pre>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
          <strong>Disclaimer:</strong> This tool is for clinical decision support only and is not a substitute for radiologist judgment or the complete BI-RADS Atlas. Based on ACR BI-RADS® Atlas, 5th Edition (2013).
        </p>
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2 rounded-full">
          <RotateCcw className="w-4 h-4" /> New Assessment
        </Button>
      </div>
    </div>
  );
}