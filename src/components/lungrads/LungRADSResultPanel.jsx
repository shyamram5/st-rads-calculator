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
    <div className="space-y-5">
      {/* Main result card */}
      <Card className={`border-2 ${cat.borderColor} ${cat.bgColor} shadow-xl overflow-hidden`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white font-black text-lg ${cat.color}`}>
                  {cat.label}
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{displayLabel}</h2>
                  <p className={`text-sm font-semibold ${cat.textColor}`}>{cat.name}</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">
              {cat.prevalence}
            </Badge>
          </div>

          {hasSModifier && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <Badge className="bg-purple-500 text-white text-xs">S</Badge>
              <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                Significant incidental finding — manage per ACR Incidental Findings guidelines.
              </span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Management</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{cat.management}</p>
          </div>

          {result.notes.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinical Notes</h3>
              {result.notes.map((note, i) => (
                <p key={i} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">• {note}</p>
              ))}
            </div>
          )}

          {(result.category === "4B" || result.category === "4X") && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-300">
                <span className="font-semibold">McWilliams Risk Calculator:</span> Consider using the Brock University assessment tool to estimate malignancy probability.{" "}
                <a href="https://brocku.ca/lung-cancer-screening-and-risk-prediction/risk-calculators/" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">
                  brocku.ca <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report block */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Structured Report</h3>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Report</>}
            </Button>
          </div>
          <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/40 font-mono">
            {reportText}
          </pre>
        </CardContent>
      </Card>

      {/* Relevant footnotes */}
      {result.appliedNotes.length > 0 && (
        <Card className="border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Relevant Lung-RADS v2022 Notes</h3>
            {result.appliedNotes.map(n => (
              <p key={n} className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Note {n}:</span> {FOOTNOTES[n]}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset} className="gap-2 rounded-full">
          <RotateCcw className="w-4 h-4" /> New Nodule / New Exam
        </Button>
      </div>
    </div>
  );
}