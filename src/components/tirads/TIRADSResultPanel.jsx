import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ClipboardCopy, Info, CheckCircle, Ruler } from "lucide-react";
import { getSizeRecommendation } from "./tiradsRuleEngine";
import TIRADSCategoryCard from "./TIRADSCategoryCard";

const levelColors = {
  fna: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  followup: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  benign: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
};

export default function TIRADSResultPanel({ result, selections, noduleSize, onSizeChange }) {
  const { totalPoints, category, compositionPts, echogenicityPts, shapePts, marginPts, fociPts, isSpongiform } = result;

  const sizeRec = getSizeRecommendation(category, noduleSize);

  const generateReport = () => {
    const lines = [];
    lines.push("ACR TI-RADS ASSESSMENT");
    lines.push("======================");
    lines.push("");
    lines.push("FINDINGS:");
    lines.push(`Composition: ${compositionPts} pts | Echogenicity: ${echogenicityPts} pts | Shape: ${shapePts} pts | Margin: ${marginPts} pts | Echogenic Foci: ${fociPts} pts`);
    if (isSpongiform) lines.push("Note: Spongiform nodule — no additional points assigned per ACR TI-RADS.");
    lines.push(`Total Points: ${totalPoints}`);
    if (noduleSize) lines.push(`Nodule Maximum Diameter: ${noduleSize} cm`);
    lines.push("");
    lines.push("IMPRESSION:");
    lines.push(`ACR TI-RADS ${category.score} — ${category.label}`);
    lines.push(`Malignancy Risk: ${category.risk}`);
    lines.push(`FNA Recommendation: ${category.fna}`);
    lines.push(`Follow-up: ${category.followUp}`);
    if (sizeRec) {
      lines.push("");
      lines.push(`Size-Based Recommendation: ${sizeRec.action}`);
    }
    lines.push("");
    lines.push("Reference: Tessler FN et al. ACR TI-RADS White Paper. JACR 2017;14:587-595.");
    lines.push("Disclaimer: For educational and clinical decision support only.");
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReport());
  };

  return (
    <div className="space-y-4">
      <TIRADSCategoryCard category={category} totalPoints={totalPoints} />

      {/* Point Breakdown */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" /> Point Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSpongiform && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Spongiform nodule:</strong> Do not add points for other categories per ACR TI-RADS guidelines. Total = 0 points (TR1).
              </p>
            </div>
          )}
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: "Composition", pts: compositionPts },
              { label: "Echogenicity", pts: echogenicityPts },
              { label: "Shape", pts: shapePts },
              { label: "Margin", pts: marginPts },
              { label: "Foci", pts: fociPts },
            ].map((cat) => (
              <div key={cat.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{cat.pts}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{cat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Size-Based Recommendation */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-500" /> Size-Based Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Label className="text-sm whitespace-nowrap">Max diameter (cm):</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 1.5"
              value={noduleSize}
              onChange={(e) => onSizeChange(e.target.value)}
              className="max-w-[120px] bg-white dark:bg-slate-900"
            />
          </div>
          {sizeRec && (
            <div className={`rounded-lg p-3 border text-sm ${levelColors[sizeRec.level]}`}>
              {sizeRec.action}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Reference Table */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Management Guidelines</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              <ClipboardCopy className="w-3.5 h-3.5" /> Copy Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">Category</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">Points</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">Risk</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">FNA</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">Follow-up</th>
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
                  <tr key={row.cat} className={`border-b border-slate-100 dark:border-slate-800 ${row.active ? "bg-blue-50 dark:bg-blue-950/30 font-semibold" : ""}`}>
                    <td className="py-2 px-2">{row.cat}</td>
                    <td className="py-2 px-2">{row.pts}</td>
                    <td className="py-2 px-2">{row.risk}</td>
                    <td className="py-2 px-2">{row.fna}</td>
                    <td className="py-2 px-2">{row.fu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-lg border-l-4 border-red-500">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h3 className="font-bold text-red-800 dark:text-red-200 text-sm">Disclaimer</h3>
        </div>
        <p className="text-xs text-red-700 dark:text-red-300">
          This tool is for <strong>educational and clinical decision support only</strong>. Not a substitute for clinical judgment. Based on: Tessler FN et al. ACR TI-RADS White Paper. JACR 2017;14:587-595.
        </p>
      </div>
    </div>
  );
}