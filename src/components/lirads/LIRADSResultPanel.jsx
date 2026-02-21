import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw, AlertTriangle, ChevronDown, ChevronUp, Info, ClipboardCopy } from "lucide-react";
import { Card as CardFull, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LIRADS_CATEGORIES,
  MAJOR_FEATURES,
  ANCILLARY_FAVORING_HCC,
  ANCILLARY_FAVORING_BENIGN,
  ANCILLARY_NON_HCC_MALIGNANCY,
  applyAncillaryFeatures,
} from "./liradsRuleEngine";

// Minimal category labels for display

export default function LIRADSResultPanel({ result, data, onReset }) {
  const [copied, setCopied] = useState(false);
  const [showAncillary, setShowAncillary] = useState(false);
  const [ancillaryHCC, setAncillaryHCC] = useState([]);
  const [ancillaryBenign, setAncillaryBenign] = useState([]);
  const [ancillaryNonHCC, setAncillaryNonHCC] = useState([]);

  const ancillaryResult = applyAncillaryFeatures(result.category, ancillaryHCC, ancillaryBenign, ancillaryNonHCC);
  const finalCategory = ancillaryResult.adjustedCategory || result.category;
  const finalInfo = LIRADS_CATEGORIES[finalCategory] || result;

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

  // Build ancillary feature labels for report
  const ancillaryHCCLabels = ancillaryHCC.map(v => ANCILLARY_FAVORING_HCC.find(f => f.value === v)?.label || v);
  const ancillaryBenignLabels = ancillaryBenign.map(v => ANCILLARY_FAVORING_BENIGN.find(f => f.value === v)?.label || v);
  const ancillaryNonHCCLabels = ancillaryNonHCC.map(v => ANCILLARY_NON_HCC_MALIGNANCY.find(f => f.value === v)?.label || v);

  const report = [
    "FINDINGS:",
    ...summaryLines,
    ...(data.majorFeatures?.length === 0 ? ["Major features: None"] : []),
    ...(data.tumorInVein === "no" ? ["Tumor in vein: No"] : []),
    ...(ancillaryHCCLabels.length > 0 ? [`Ancillary features favoring HCC: ${ancillaryHCCLabels.join(", ")}`] : []),
    ...(ancillaryBenignLabels.length > 0 ? [`Ancillary features favoring benignity: ${ancillaryBenignLabels.join(", ")}`] : []),
    ...(ancillaryNonHCCLabels.length > 0 ? [`Ancillary features favoring non-HCC malignancy: ${ancillaryNonHCCLabels.join(", ")}`] : []),
    "",
    "IMPRESSION:",
    `ACR LI-RADS Category: ${finalCategory} — ${finalInfo.name}`,
    ...(finalInfo.hccRisk ? [`HCC Risk: ${finalInfo.hccRisk}`] : []),
    ...(ancillaryResult.shifted ? [`(Adjusted from ${result.category} via ancillary features)`] : []),
    `Recommendation: ${finalInfo.management}`,
    "",
    "Disclaimer: For clinical decision support only. Not a substitute for radiologist judgment. Based on ACR LI-RADS v2018.",
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Category Card */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <span className="font-semibold text-lg text-gray-900 dark:text-white">{finalCategory}</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{finalInfo.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {finalInfo.hccRisk && (
                  <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">HCC Risk: {finalInfo.hccRisk}</Badge>
                )}
                {ancillaryResult.shifted && (
                  <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">Adjusted from {result.category}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Management</h3>
              <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                <p className="text-[13px] text-gray-700 dark:text-gray-300">{finalInfo.management}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Findings</h3>
              <div className="space-y-1">
                {summaryLines.map((line, i) => (
                  <div key={i} className="text-[12px] text-gray-500 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-gray-300 dark:text-gray-600 mt-0.5">•</span>
                    <span>{line}</span>
                  </div>
                ))}
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
            <Button variant={copied ? "default" : "outline"} size="sm" onClick={handleCopy} className={`gap-2 shadow-none text-[13px] ${copied ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "border-gray-200 dark:border-gray-800"}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><ClipboardCopy className="w-3.5 h-3.5" /> Copy</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <pre className="text-[12px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-900 select-all cursor-pointer" onClick={handleCopy}>
            {report}
          </pre>
        </CardContent>
      </Card>

      {/* Non-HCC Warning */}
      {ancillaryResult.nonHCCWarning && (
        <div className="flex items-start gap-2.5 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-gray-900 dark:text-white">Consider LR-M Category</p>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              Ancillary features favoring non-HCC malignancy present. Consider biopsy and MDT discussion.
            </p>
          </div>
        </div>
      )}

      {/* Ancillary Features */}
      {result.category !== "LR-TIV" && result.category !== "LR-M" && result.category !== "LR-1" && (
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
          <button
            onClick={() => setShowAncillary(!showAncillary)}
            className="w-full p-5 flex items-center justify-between text-left"
          >
            <span className="text-[13px] font-medium text-gray-900 dark:text-white">
              Ancillary Features (Optional)
            </span>
            {showAncillary ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showAncillary && (
            <CardContent className="pt-0 pb-5 px-5 space-y-5 border-t border-gray-100 dark:border-gray-900">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-3">Can adjust category ±1, but NOT from LR-4 → LR-5</p>
              <div>
                <h4 className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Favoring HCC (upgrade by 1)</h4>
                <div className="space-y-2">
                  {ANCILLARY_FAVORING_HCC.map(f => (
                    <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={ancillaryHCC.includes(f.value)} onChange={() => toggleAncillary(ancillaryHCC, setAncillaryHCC, f.value)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700" />
                      <span className="text-[13px] text-gray-600 dark:text-gray-400">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Favoring Benignity (downgrade by 1)</h4>
                <div className="space-y-2">
                  {ANCILLARY_FAVORING_BENIGN.map(f => (
                    <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={ancillaryBenign.includes(f.value)} onChange={() => toggleAncillary(ancillaryBenign, setAncillaryBenign, f.value)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700" />
                      <span className="text-[13px] text-gray-600 dark:text-gray-400">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Favoring Non-HCC Malignancy</h4>
                <div className="space-y-2">
                  {ANCILLARY_NON_HCC_MALIGNANCY.map(f => (
                    <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={ancillaryNonHCC.includes(f.value)} onChange={() => toggleAncillary(ancillaryNonHCC, setAncillaryNonHCC, f.value)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700" />
                      <span className="text-[13px] text-gray-600 dark:text-gray-400">{f.label}</span>
                    </label>
                  ))}
                </div>
                {ancillaryNonHCC.length > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-900">
                    <p className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">⚠ Consider reclassifying as LR-M</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-600 dark:text-gray-300">Disclaimer:</strong> Clinical decision support only. Based on ACR LI-RADS v2018.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2 rounded-lg border-gray-200 dark:border-gray-800 shadow-none">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </div>
  );
}