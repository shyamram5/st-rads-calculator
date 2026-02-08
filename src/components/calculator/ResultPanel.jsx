import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Stethoscope, ClipboardCopy, RotateCcw, Crown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const scoreColors = {
  gray: { ring: "ring-gray-400", text: "text-gray-700 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-900" },
  green: { ring: "ring-green-400", text: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-950/50" },
  emerald: { ring: "ring-emerald-400", text: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
  yellow: { ring: "ring-yellow-400", text: "text-yellow-700 dark:text-yellow-300", bg: "bg-yellow-100 dark:bg-yellow-950/50" },
  orange: { ring: "ring-orange-500", text: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950/50" },
  red: { ring: "ring-red-500", text: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950/50" },
  blue: { ring: "ring-blue-400", text: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-950/50" },
};

export default function ResultPanel({ result, caseData, onReset }) {
  if (!result) return null;
  const { category, reasoning, differentials, upgraded, originalScore, adcNote, ancillaryNote } = result;
  const colors = scoreColors[category.color] || scoreColors.gray;

  const generateReportText = () => {
    const lines = [];
    lines.push("FINDINGS:");
    lines.push(`Size: ${caseData.lesionSize || "(not specified)"}`);
    lines.push(`Location and extent: ${caseData.solidCompartment || caseData.tissueType || "(not specified)"}`);
    if (caseData.adcValue) lines.push(`ADC measures: ${caseData.adcValue} × 10⁻³ mm²/s`);
    lines.push("");
    lines.push("IMPRESSION:");
    lines.push(reasoning);
    if (differentials?.length > 0) {
      lines.push(`Differential: ${differentials.join(", ")}`);
    }
    lines.push(`Soft Tissue-RADS Category ${category.score} — ${category.label} (Risk: ${category.risk})`);
    lines.push(`Recommendation: ${category.management}`);
    lines.push("");
    lines.push("Disclaimer: For educational and clinical decision support only. Not a substitute for clinical judgment.");
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
  };

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <Card className="glass-panel shadow-xl border-0">
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`relative w-28 h-28 rounded-full flex items-center justify-center ring-8 ${colors.ring} ${colors.bg} shadow-inner`}>
                <span className={`font-bold text-5xl ${colors.text}`}>{category.score}</span>
              </div>
              <h2 className={`mt-3 text-xl font-bold ${colors.text}`}>{category.label}</h2>
              <Badge className={`mt-2 ${colors.bg} ${colors.text} border-0`}>Risk: {category.risk}</Badge>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">Classification</h3>
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-sm">{category.meaning}</p>
              </div>

              {upgraded && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Upgraded from ST-RADS {originalScore}</strong> due to ancillary features suggesting malignancy.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">Management</h3>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-200">{category.management}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reasoning & Differentials */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-500" />
            Reasoning & Differentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{reasoning}</p>
          {differentials?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Differential Diagnoses:</p>
              <div className="flex flex-wrap gap-2">
                {differentials.map((d, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Structured Report */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Structured Report</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              <ClipboardCopy className="w-4 h-4" /> Copy Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {generateReportText()}
          </pre>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-lg border-l-4 border-red-500">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h3 className="font-bold text-red-800 dark:text-red-200 text-sm">Disclaimer</h3>
        </div>
        <p className="text-xs text-red-700 dark:text-red-300">
          This tool is for <strong>educational and clinical decision support only</strong>. It is not FDA approved and is not a substitute for clinical judgment. The ST-RADS framework is currently designated by the ACR as a work-in-progress.
        </p>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Start New Case
        </Button>
      </div>
    </div>
  );
}