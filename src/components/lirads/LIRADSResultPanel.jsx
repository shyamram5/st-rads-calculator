import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw, AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  LIRADS_CATEGORIES,
  MAJOR_FEATURES,
  ANCILLARY_FAVORING_HCC,
  ANCILLARY_FAVORING_BENIGN,
  ANCILLARY_NON_HCC_MALIGNANCY,
  applyAncillaryFeatures,
} from "./liradsRuleEngine";

const categoryColors = {
  "LR-1": "from-green-500 to-emerald-500",
  "LR-2": "from-lime-500 to-green-500",
  "LR-3": "from-yellow-500 to-amber-500",
  "LR-4": "from-orange-500 to-red-500",
  "LR-5": "from-red-600 to-red-700",
  "LR-TIV": "from-red-800 to-red-900",
  "LR-M": "from-purple-600 to-violet-700",
};

export default function LIRADSResultPanel({ result, data, onReset }) {
  const [copied, setCopied] = useState(false);
  const [showAncillary, setShowAncillary] = useState(false);
  const [ancillaryHCC, setAncillaryHCC] = useState([]);
  const [ancillaryBenign, setAncillaryBenign] = useState([]);
  const [ancillaryNonHCC, setAncillaryNonHCC] = useState([]);

  const ancillaryResult = applyAncillaryFeatures(result.category, ancillaryHCC, ancillaryBenign, ancillaryNonHCC);
  const finalCategory = ancillaryResult.adjustedCategory || result.category;
  const finalInfo = LIRADS_CATEGORIES[finalCategory] || result;
  const gradient = categoryColors[finalCategory] || "from-slate-500 to-slate-600";

  const toggleAncillary = (list, setList, val) => {
    if (list.includes(val)) setList(list.filter(v => v !== val));
    else setList([...list, val]);
  };

  // Build summary
  const summaryLines = [];
  if (data.eligibility === "cirrhosis") summaryLines.push("Patient: Cirrhosis (non-vascular)");
  if (data.eligibility === "chronic_hbv") summaryLines.push("Patient: Chronic HBV without cirrhosis");
  if (data.enhancement === "no_enhancement") summaryLines.push("Enhancement: None");
  if (data.enhancementType === "nonrim_aphe") summaryLines.push("Enhancement: Non-rim APHE");
  if (data.enhancementType === "rim_aphe_targetoid") summaryLines.push("Enhancement: Targetoid (rim APHE)");
  if (data.enhancementType === "infiltrative") summaryLines.push("Enhancement: Infiltrative");
  if (data.enhancementType === "diffusion_necrosis") summaryLines.push("Enhancement: Diffusion restriction/necrosis");
  if (data.size) {
    const sizeMap = { "<10": "< 10 mm", "10-19": "10–19 mm", ">=20": "≥ 20 mm" };
    summaryLines.push(`Size: ${sizeMap[data.size] || data.size}`);
  }
  if (data.majorFeatures?.length > 0) {
    const featureLabels = data.majorFeatures.map(f => MAJOR_FEATURES.find(mf => mf.value === f)?.label || f);
    summaryLines.push(`Major features: ${featureLabels.join(", ")}`);
  }
  if (data.tumorInVein === "yes") summaryLines.push("Tumor in vein: Yes");

  const report = [
    "LI-RADS v2018 Assessment Report",
    "================================",
    "",
    ...summaryLines,
    "",
    `Primary Category: ${result.category} — ${result.name}`,
    ...(ancillaryResult.shifted ? [`Adjusted Category: ${finalCategory} — ${finalInfo.name} (ancillary feature adjustment)`] : []),
    "",
    `Management: ${finalInfo.management}`,
    "",
    "Based on ACR LI-RADS v2018. For clinical decision support only.",
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Category Card */}
      <Card className={`border-0 shadow-xl overflow-hidden`}>
        <div className={`bg-gradient-to-r ${gradient} p-6 text-center text-white`}>
          <div className="text-5xl font-extrabold tracking-tight">{finalCategory}</div>
          <div className="text-lg font-semibold mt-1 opacity-95">{finalInfo.name}</div>
          {finalInfo.hccRisk && (
            <Badge className="mt-3 bg-white/20 text-white border-white/30 text-sm">
              HCC Risk: {finalInfo.hccRisk}
            </Badge>
          )}
          {ancillaryResult.shifted && (
            <div className="mt-2 text-xs opacity-80">
              Adjusted from {result.category} via ancillary features
            </div>
          )}
        </div>
        <CardContent className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Management Recommendation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{finalInfo.management}</p>
          </div>

          {/* Findings Summary */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Findings Summary</h3>
            <div className="space-y-1">
              {summaryLines.map((line, i) => (
                <div key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Report */}
          <Button onClick={handleCopy} variant="outline" className="w-full gap-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Report"}
          </Button>
        </CardContent>
      </Card>

      {/* Non-HCC Warning */}
      {ancillaryResult.nonHCCWarning && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <AlertTriangle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Consider LR-M Category</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Ancillary features favoring non-HCC malignancy are present. Consider biopsy and multidisciplinary discussion.
            </p>
          </div>
        </div>
      )}

      {/* Ancillary Features */}
      {result.category !== "LR-TIV" && result.category !== "LR-M" && result.category !== "LR-1" && (
        <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
          <button
            onClick={() => setShowAncillary(!showAncillary)}
            className="w-full p-5 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ancillary Features (Optional — can adjust category ±1, but NOT from LR-4 → LR-5)
              </span>
            </div>
            {showAncillary ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showAncillary && (
            <CardContent className="pt-0 pb-5 px-5 space-y-5">
              {/* Favoring HCC */}
              <div>
                <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-2">
                  Favoring HCC (can upgrade by 1)
                </h4>
                <div className="space-y-1.5">
                  {ANCILLARY_FAVORING_HCC.map(f => (
                    <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ancillaryHCC.includes(f.value)}
                        onChange={() => toggleAncillary(ancillaryHCC, setAncillaryHCC, f.value)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Favoring Benignity */}
              <div>
                <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2">
                  Favoring Benignity (can downgrade by 1)
                </h4>
                <div className="space-y-1.5">
                  {ANCILLARY_FAVORING_BENIGN.map(f => (
                    <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ancillaryBenign.includes(f.value)}
                        onChange={() => toggleAncillary(ancillaryBenign, setAncillaryBenign, f.value)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Non-HCC Malignancy */}
              <div>
                <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Favoring Non-HCC Malignancy
                </h4>
                <div className="space-y-1.5">
                  {ANCILLARY_NON_HCC_MALIGNANCY.map(f => (
                    <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ancillaryNonHCC.includes(f.value)}
                        onChange={() => toggleAncillary(ancillaryNonHCC, setAncillaryNonHCC, f.value)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{f.label}</span>
                    </label>
                  ))}
                </div>
                {ancillaryNonHCC.length > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      ⚠ Consider reclassifying as LR-M
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
          <strong>Disclaimer:</strong> This tool is for clinical decision support only — not a substitute for radiologist judgment. 
          Based on ACR LI-RADS v2018.
        </p>
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2 rounded-full">
          <RotateCcw className="w-4 h-4" /> Reset / New Observation
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
        Based on ACR LI-RADS v2018. Reference: radiologyassistant.nl/abdomen/liver/li-rads. 
        For clinical decision support only — not a substitute for radiologist judgment.
      </p>
    </div>
  );
}