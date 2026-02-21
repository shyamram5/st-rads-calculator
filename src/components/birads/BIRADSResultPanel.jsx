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
    <div className="space-y-4">
      {/* Category Card */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <span className="font-semibold text-lg text-gray-900 dark:text-white">{info.label}</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{info.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">Risk: {info.risk}</Badge>
                {modality === "both" && mammoCategory && usCategory && (
                  <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">Mammo {mammoCategory} · US {usCategory}</Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">ACR Standard Phrase</h3>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 italic">{info.phrase}</p>
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Management</h3>
            <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
              <p className="text-[13px] text-gray-700 dark:text-gray-300">{info.management}</p>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Findings</h3>
            <div className="space-y-1">
              {summaryLines.map((line, i) => (
                <div key={i} className="text-[12px] text-gray-500 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0">•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Do</h3>
              <ul className="space-y-1.5">
                {info.dos.map((d, i) => (
                  <li key={i} className="text-[12px] text-gray-500 dark:text-gray-400 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Don't</h3>
              <ul className="space-y-1.5">
                {info.donts.map((d, i) => (
                  <li key={i} className="text-[12px] text-gray-500 dark:text-gray-400 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Report */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Report Language</CardTitle>
            <Button variant={copied ? "default" : "outline"} size="sm" onClick={handleCopy} className={`gap-2 shadow-none text-[13px] ${copied ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "border-gray-200 dark:border-gray-800"}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><ClipboardCopy className="w-3.5 h-3.5" /> Copy</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <pre className="text-[12px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-900 select-all cursor-pointer" onClick={handleCopy}>
            {report}
          </pre>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-600 dark:text-gray-300">Disclaimer:</strong> Clinical decision support only. Based on ACR BI-RADS® Atlas, 5th Edition (2013).
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2 rounded-lg border-gray-200 dark:border-gray-800 shadow-none">
          <RotateCcw className="w-4 h-4" /> New Assessment
        </Button>
      </div>
    </div>
  );
}