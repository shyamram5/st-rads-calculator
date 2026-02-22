import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { CATEGORIES, generateStructuredReport, DEPRECATED_TERMS } from "./mskiRuleEngine";

export default function MSKIResultPanel({ result, data, onReset }) {
  const [copied, setCopied] = useState(false);
  const cat = CATEGORIES[result.category];

  const report = generateStructuredReport(data, result);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* NF Alert Banner */}
      {result.nfAlert && (
        <div className="p-4 rounded-xl bg-red-600 text-white flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">⚠ NECROTIZING FASCIITIS FEATURES PRESENT</p>
            <p className="text-[13px] mt-1 text-red-100 leading-relaxed">
              This is a surgical emergency. NF is a clinical diagnosis; MRI findings are supportive. 
              Urgent surgical consultation recommended. Consider CT if MRI cannot be performed urgently 
              (CT demonstrates fascial air in approximately 50% of cases). Assign MSKI-RADS III with NF features noted.
            </p>
          </div>
        </div>
      )}

      {/* Category Card */}
      <Card className={`border-2 ${cat.borderColor} overflow-hidden`}>
        <div className={`${cat.color} px-5 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-[11px] font-medium uppercase tracking-[0.1em] ${cat.textColor} opacity-70`}>Classification</p>
              <h2 className={`text-2xl font-bold ${cat.textColor} mt-0.5`}>{cat.label}</h2>
              <p className={`text-[13px] font-medium ${cat.textColor} mt-0.5`}>{cat.name}</p>
            </div>
            <Badge className={`${cat.color} ${cat.textColor} border ${cat.borderColor} text-[11px] font-semibold`}>
              {cat.risk}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5 space-y-4">
          {/* Management */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Management</p>
            <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{cat.management}</p>
          </div>

          {/* True-positive rate */}
          {cat.truePositiveRate && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                True-positive rate: <span className="text-gray-900 dark:text-white font-semibold">{cat.truePositiveRate}</span>
              </span>
            </div>
          )}

          {/* Findings */}
          {result.findings.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Findings</p>
              <ul className="space-y-1">
                {result.findings.map((f, i) => (
                  <li key={i} className="text-[13px] text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-gray-300 dark:text-gray-600 mt-1">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Caveats */}
          {result.caveats.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Caveats</p>
              {result.caveats.map((c, i) => (
                <p key={i} className="text-[12px] text-orange-600 dark:text-orange-400 leading-relaxed">{c}</p>
              ))}
            </div>
          )}

          {/* DWI note */}
          {result.dwiNote && (
            <p className="text-[12px] text-gray-500 dark:text-gray-400 italic">{result.dwiNote}</p>
          )}
        </CardContent>
      </Card>

      {/* Structured Report */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Structured Report</p>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 h-8 text-[12px] border-gray-200 dark:border-gray-800">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Report"}
            </Button>
          </div>
          <pre className="text-[11px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-100 dark:border-gray-900 max-h-80 overflow-y-auto">
            {report}
          </pre>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900">
        <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
          Based on MSKI-RADS: Chhabra et al., Radiology 2024;312(2):e232914. Terminology per SSR White Paper: Alaia et al., 
          Skeletal Radiol 2021;50(12):2319–2347. For clinical decision support only — not a substitute for radiologist judgment. 
          Validated for peripheral extremity infections in adults; not validated for spinal infections, pediatric patients, 
          or non-MSK fellowship–trained readers.
        </p>
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2 rounded-lg border-gray-200 dark:border-gray-800">
          <RotateCcw className="w-4 h-4" /> New Case
        </Button>
      </div>
    </div>
  );
}