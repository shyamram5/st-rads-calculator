import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { CATEGORIES, generateBoneRADSReport } from "./boneRadsRuleEngine";

export default function BoneRADSResultPanel({ result, data, onReset }) {
  const [copied, setCopied] = useState(false);
  const cat = CATEGORIES[result.score];
  const report = generateBoneRADSReport(data, result);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Score color
  const scoreColors = {
    0: "text-gray-600 dark:text-gray-400",
    1: "text-emerald-600 dark:text-emerald-400",
    2: "text-lime-600 dark:text-lime-400",
    3: "text-orange-600 dark:text-orange-400",
    4: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="space-y-5">
      {/* Alerts */}
      {result.alerts.includes("soft_tissue_mass") && (
        <div className="p-4 rounded-xl bg-orange-600 text-white flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Extra-osseous soft tissue mass identified (+4 points)</p>
            <p className="text-[13px] mt-1 text-orange-100">High suspicion for malignancy. Orthopedic oncology referral recommended.</p>
          </div>
        </div>
      )}
      {result.alerts.includes("known_cancer") && (
        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-800 dark:text-amber-200">Known primary malignancy (+2 points) — any bone lesion in this patient is intermediate risk or higher.</p>
        </div>
      )}
      {result.alerts.includes("fracture_risk") && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 dark:text-red-300">Fracture risk assessment recommended — consider Mirels scoring. Urgent orthopedic oncology consultation if impending fracture suspected.</p>
        </div>
      )}

      {/* Score Card */}
      <Card className={`border-2 ${cat.borderColor} overflow-hidden`}>
        <div className={`${cat.color} px-5 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-[11px] font-medium uppercase tracking-[0.1em] ${cat.textColor} opacity-70`}>Classification</p>
              <h2 className={`text-2xl font-bold ${cat.textColor} mt-0.5`}>{cat.label}</h2>
              <p className={`text-[13px] font-medium ${cat.textColor} mt-0.5`}>{cat.name}</p>
            </div>
            {result.totalPoints !== null && (
              <div className="text-right">
                <p className={`text-3xl font-black ${scoreColors[result.score]}`}>{result.totalPoints}</p>
                <p className={`text-[11px] ${cat.textColor} opacity-60`}>points</p>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-5 space-y-4">
          {/* Management */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Management</p>
            <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{cat.management}</p>
          </div>

          {/* Point Breakdown */}
          {result.breakdown.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Point Breakdown</p>
              <div className="space-y-1">
                {result.breakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-950 text-[12px]">
                    <span className="text-gray-600 dark:text-gray-400">{b.feature}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 dark:text-gray-400 text-[11px] max-w-[180px] text-right truncate">{b.value}</span>
                      <span className={`font-bold min-w-[28px] text-right ${b.points > 0 ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-600"}`}>
                        {b.points > 0 ? `+${b.points}` : "0"}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900 dark:bg-white text-[13px] font-bold">
                  <span className="text-white dark:text-black">Total</span>
                  <span className="text-white dark:text-black">{result.totalPoints} points → {cat.label}</span>
                </div>
              </div>
            </div>
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
          Based on Caracciolo et al., JACR 2023;20:1044–1058. Co-endorsed by the Musculoskeletal Tumor Society. 
          Individual point values established by expert consensus. For clinical decision support only — not a substitute for radiologist judgment.
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