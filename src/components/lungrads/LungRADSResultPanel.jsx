import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw, ExternalLink, AlertTriangle } from "lucide-react";
import { CATEGORIES, FOOTNOTES, generateReport } from "./lungRadsRuleEngine";

export default function LungRADSResultPanel({ nodule, result, onReset }) {
  const [copied, setCopied] = useState(false);
  const cat = CATEGORIES[result.category];
  if (!cat) return null;

  const reportText = generateReport(nodule, result);
  const hasSModifier = nodule.sModifier;
  const displayLabel = `Lung-RADS ${cat.label}${hasSModifier ? "S" : ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Main result card */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">{cat.label}</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{displayLabel}</h2>
                <p className="text-[12px] text-gray-500 dark:text-gray-400">{cat.name}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">
              {cat.prevalence}
            </Badge>
          </div>

          {hasSModifier && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900">
              <Badge className="bg-gray-900 dark:bg-white text-white dark:text-black text-[10px]">S</Badge>
              <span className="text-[12px] text-gray-600 dark:text-gray-400">
                Significant incidental finding — manage per ACR guidelines.
              </span>
            </div>
          )}

          <div>
            <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Management</h3>
            <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
              <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{cat.management}</p>
            </div>
          </div>

          {result.notes.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clinical Notes</h3>
              {result.notes.map((note, i) => (
                <p key={i} className="text-[12px] text-gray-500 dark:text-gray-400">• {note}</p>
              ))}
            </div>
          )}

          {(result.category === "4B" || result.category === "4X") && (
            <div className="flex items-start gap-2.5 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="text-[12px] text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-600 dark:text-gray-300">McWilliams Risk Calculator:</span> Consider the Brock University tool.{" "}
                <a href="https://brocku.ca/lung-cancer-screening-and-risk-prediction/risk-calculators/" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5 hover:text-gray-900 dark:hover:text-white">
                  brocku.ca <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report block */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Structured Report</h3>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-[13px] border-gray-200 dark:border-gray-800 shadow-none">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </Button>
          </div>
          <pre className="text-[12px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-900 font-mono">
            {reportText}
          </pre>
        </CardContent>
      </Card>

      {/* Relevant footnotes */}
      {result.appliedNotes.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
          <CardContent className="p-5 space-y-2">
            <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Relevant Lung-RADS v2022 Notes</h3>
            {result.appliedNotes.map(n => (
              <p key={n} className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                <span className="font-medium text-gray-700 dark:text-gray-300">Note {n}:</span> {FOOTNOTES[n]}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset} className="gap-2 rounded-lg border-gray-200 dark:border-gray-800 shadow-none">
          <RotateCcw className="w-4 h-4" /> New Nodule
        </Button>
      </div>
    </div>
  );
}