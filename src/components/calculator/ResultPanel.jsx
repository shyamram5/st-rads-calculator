import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ClipboardCopy, RotateCcw, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ResultPanel({ result, caseData, onReset, isPremium }) {
  if (!result) return null;
  const { category, reasoning, differentials, upgraded, originalScore, adcNote, ancillaryNote } = result;

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
    <div className="space-y-4">
      {/* Score Display */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <span className="font-semibold text-4xl text-gray-900 dark:text-white">{category.score}</span>
              </div>
              <h2 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{category.label}</h2>
              <Badge variant="outline" className="mt-1 text-[11px] border-gray-200 dark:border-gray-800">Risk: {category.risk}</Badge>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Classification</h3>
                <p className="text-[13px] text-gray-700 dark:text-gray-300">{category.meaning}</p>
              </div>

              {upgraded && (
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-[13px] text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Upgraded from ST-RADS {originalScore}</strong> due to ancillary features.
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Management</h3>
                <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                  <p className="text-[13px] text-gray-700 dark:text-gray-300">{category.management}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Report */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Structured Report</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 border-gray-200 dark:border-gray-800 shadow-none text-[13px]">
              <ClipboardCopy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <pre className="text-[12px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-900">
            {generateReportText()}
          </pre>
        </CardContent>
      </Card>

      {/* Reasoning & Differentials */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
            Reasoning & Differentials
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">{reasoning}</p>
          {differentials?.length > 0 && (
            <div>
              <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-2">Differential Diagnoses</p>
              <div className="flex flex-wrap gap-1.5">
                {differentials.map((d, i) => (
                  <Badge key={i} variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">{d}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-600 dark:text-gray-300">Disclaimer:</strong> Educational and clinical decision support only. Not FDA approved. Not a substitute for clinical judgment.
        </p>
      </div>

      {!isPremium && (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 text-center space-y-3">
          <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
            Enjoying RADS Calculator?
          </p>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Premium gives you unlimited analyses for $9.99/mo.
          </p>
          <Link to={createPageUrl("Premium")}>
            <Button className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-lg shadow-none text-[13px] font-medium mt-1">
              <Crown className="mr-2 h-3.5 w-3.5" /> Go Premium
            </Button>
          </Link>
        </div>
      )}

      <div className="text-center">
        <Button variant="outline" onClick={onReset} className="gap-2 border-gray-200 dark:border-gray-800 shadow-none rounded-lg">
          <RotateCcw className="w-4 h-4" /> Start New Case
        </Button>
      </div>
    </div>
  );
}