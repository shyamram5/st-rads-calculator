import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ClipboardCopy, Info, CheckCircle, Ruler, Check } from "lucide-react";
import { getSizeRecommendation, COMPOSITION_OPTIONS, ECHOGENICITY_OPTIONS, SHAPE_OPTIONS, MARGIN_OPTIONS, ECHOGENIC_FOCI_OPTIONS } from "./tiradsRuleEngine";
import TIRADSCategoryCard from "./TIRADSCategoryCard";

const levelColors = {
  fna: "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200",
  followup: "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200",
  benign: "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200",
};

export default function TIRADSResultPanel({ result, selections, noduleSize, onSizeChange }) {
  const { totalPoints, category, compositionPts, echogenicityPts, shapePts, marginPts, fociPts, isSpongiform } = result;
  const [copied, setCopied] = useState(false);

  const sizeRec = getSizeRecommendation(category, noduleSize);

  const getLabel = (options, value) => options.find(o => o.value === value)?.label || "";
  const getFociLabels = (values) => {
    if (!values || values.length === 0) return "None";
    return values.map(v => ECHOGENIC_FOCI_OPTIONS.find(o => o.value === v)?.label || v).join("; ");
  };

  const generateReport = () => {
    const lines = [];
    lines.push("FINDINGS:");
    lines.push(`Composition: ${getLabel(COMPOSITION_OPTIONS, selections.composition) || "(not selected)"} (${compositionPts} pts)`);
    lines.push(`Echogenicity: ${getLabel(ECHOGENICITY_OPTIONS, selections.echogenicity) || "(not selected)"} (${echogenicityPts} pts)`);
    lines.push(`Shape: ${getLabel(SHAPE_OPTIONS, selections.shape) || "(not selected)"} (${shapePts} pts)`);
    lines.push(`Margin: ${getLabel(MARGIN_OPTIONS, selections.margin) || "(not selected)"} (${marginPts} pts)`);
    lines.push(`Echogenic Foci: ${getFociLabels(selections.echogenicFoci)} (${fociPts} pts)`);
    if (isSpongiform) lines.push("Note: Spongiform nodule — no additional points assigned per ACR TI-RADS.");
    if (noduleSize) lines.push(`Nodule Maximum Diameter: ${noduleSize} cm`);
    lines.push("");
    lines.push("IMPRESSION:");
    lines.push(`ACR TI-RADS ${category.score} — ${category.label} (Total: ${totalPoints} points)`);
    lines.push(`Malignancy Risk: ${category.risk}`);
    lines.push(`Recommendation: ${category.fna}. ${category.followUp}.`);
    if (sizeRec) {
      lines.push(`Size-Based Recommendation: ${sizeRec.action}`);
    }
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <TIRADSCategoryCard category={category} totalPoints={totalPoints} />

      {/* Point Breakdown */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Point Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {isSpongiform && (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 mb-3">
              <p className="text-[12px] text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Spongiform nodule:</strong> Total = 0 points (TR1) per ACR TI-RADS.
              </p>
            </div>
          )}
          <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
            {[
              { label: "Composition", pts: compositionPts },
              { label: "Echogenicity", pts: echogenicityPts },
              { label: "Shape", pts: shapePts },
              { label: "Margin", pts: marginPts },
              { label: "Foci", pts: fociPts },
            ].map((cat) => (
              <div key={cat.label} className="bg-white dark:bg-black p-3 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{cat.pts}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">{cat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Size-Based Recommendation */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Size-Based Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Label className="text-[13px] whitespace-nowrap">Max diameter (cm):</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 1.5"
              value={noduleSize}
              onChange={(e) => onSizeChange(e.target.value)}
              className="max-w-[120px]"
            />
          </div>
          {sizeRec && (
            <div className={`rounded-lg p-3 border text-[13px] ${levelColors[sizeRec.level]}`}>
              {sizeRec.action}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Structured Report */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Structured Report</CardTitle>
            <Button variant={copied ? "default" : "outline"} size="sm" onClick={handleCopy} className={`gap-2 shadow-none text-[13px] ${copied ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "border-gray-200 dark:border-gray-800"}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><ClipboardCopy className="w-3.5 h-3.5" /> Copy</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <pre className="text-[12px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-900 select-all cursor-pointer" onClick={handleCopy}>
            {generateReport()}
          </pre>
        </CardContent>
      </Card>

      {/* Management Reference Table */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-gray-900">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Management Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Points</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Risk</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">FNA</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: "TR1", pts: "0", risk: "<1%", fna: "No FNA", fu: "None", active: totalPoints === 0 },
                  { cat: "TR2", pts: "2", risk: "<1.5%", fna: "No FNA", fu: "None", active: totalPoints >= 1 && totalPoints <= 2 },
                  { cat: "TR3", pts: "3", risk: "2–5%", fna: "≥ 2.5 cm", fu: "≥ 1.5 cm", active: totalPoints === 3 },
                  { cat: "TR4", pts: "4–6", risk: "5–20%", fna: "≥ 1.5 cm", fu: "≥ 1.0 cm", active: totalPoints >= 4 && totalPoints <= 6 },
                  { cat: "TR5", pts: "≥ 7", risk: ">20%", fna: "≥ 1.0 cm", fu: "≥ 0.5 cm", active: totalPoints >= 7 },
                ].map((row) => (
                  <tr key={row.cat} className={`border-b border-gray-100 dark:border-gray-900 ${row.active ? "bg-gray-50 dark:bg-gray-950 font-semibold" : ""}`}>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{row.cat}</td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{row.pts}</td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{row.risk}</td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{row.fna}</td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{row.fu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-600 dark:text-gray-300">Disclaimer:</strong> Educational and clinical decision support only. Based on Tessler FN et al. ACR TI-RADS. JACR 2017.
        </p>
      </div>
    </div>
  );
}