import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Trash2 } from "lucide-react";
import { CATEGORIES, getHighestCategory, generateReport } from "./lungRadsRuleEngine";

export default function MultiNoduleSummary({ nodules, results, onRemoveNodule }) {
  const [copied, setCopied] = useState(false);

  if (nodules.length === 0) return null;

  const categories = results.map(r => r.category);
  const highestCat = getHighestCategory(categories);
  const highestInfo = CATEGORIES[highestCat];
  const hasSModifier = nodules.some(n => n.sModifier);
  const highestIdx = results.findIndex(r => r.category === highestCat);

  // Combined report
  const combinedReport = nodules.map((n, i) => {
    const r = results[i];
    return `--- Nodule ${i + 1} ---\n${generateReport(n, r)}`;
  }).join("\n\n");

  const finalLine = `\nFINAL EXAM LUNG-RADS: ${highestCat}${hasSModifier ? "S" : ""} — ${highestInfo.name}.\nBased on Nodule ${highestIdx + 1} (highest category). All nodules described individually above.`;
  const fullReport = combinedReport + "\n" + finalLine;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Final exam category */}
      <Card className={`border-2 ${highestInfo.borderColor} ${highestInfo.bgColor} shadow-lg`}>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white font-black text-base ${highestInfo.color}`}>
              {highestInfo.label}
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Final Exam: Lung-RADS {highestInfo.label}{hasSModifier ? "S" : ""}
              </h2>
              <p className={`text-sm font-semibold ${highestInfo.textColor}`}>{highestInfo.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Based on Nodule {highestIdx + 1} · {nodules.length} nodule{nodules.length > 1 ? "s" : ""} entered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual nodules */}
      <div className="space-y-2">
        {nodules.map((n, i) => {
          const r = results[i];
          const cat = CATEGORIES[r.category];
          const typeLabels = {
            solid: "Solid", part_solid: "Part-solid", ggn: "GGN", airway: "Airway",
            cyst: "Cyst", juxtapleural: "Juxtapleural", none: "None"
          };
          return (
            <Card key={i} className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-black ${cat.color}`}>
                    {cat.label}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Nodule {i + 1}: {typeLabels[n.noduleType]} {n.meanDiameter ? `· ${n.meanDiameter} mm` : ""}
                    </p>
                    <p className="text-[11px] text-slate-500">{cat.name} {n.sModifier ? "(+S)" : ""}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveNodule(i)} className="h-8 w-8 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Combined report */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Combined Report</h3>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
            </Button>
          </div>
          <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/40 font-mono max-h-80 overflow-y-auto">
            {fullReport}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}