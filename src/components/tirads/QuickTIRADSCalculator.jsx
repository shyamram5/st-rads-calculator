import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Calculator, ChevronRight, Copy, Check } from "lucide-react";
import {
  calculateTIRADS,
  getSizeRecommendation,
  COMPOSITION_OPTIONS,
  ECHOGENICITY_OPTIONS,
  SHAPE_OPTIONS,
  MARGIN_OPTIONS,
  ECHOGENIC_FOCI_OPTIONS,
} from "@/components/tirads/tiradsRuleEngine";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CATEGORY_COLORS = {
  green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
};

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value === value ? "" : opt.value)}
            className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
              value === opt.value
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            {opt.label} <span className="opacity-60">(+{opt.points})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, value, onChange }) {
  const toggle = (val) => {
    if (val === "none") {
      onChange(value.includes("none") ? [] : ["none"]);
      return;
    }
    const withoutNone = value.filter(v => v !== "none");
    onChange(withoutNone.includes(val) ? withoutNone.filter(v => v !== val) : [...withoutNone, val]);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
              value.includes(opt.value)
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            {opt.label} <span className="opacity-60">(+{opt.points})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function QuickTIRADSCalculator() {
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState({
    composition: "", echogenicity: "", shape: "", margin: "", echogenicFoci: [],
  });
  const [copied, setCopied] = useState(false);

  const hasAnySelection = selections.composition || selections.echogenicity || selections.shape || selections.margin || selections.echogenicFoci.length > 0;

  const result = useMemo(() => {
    if (!hasAnySelection) return null;
    return calculateTIRADS(selections);
  }, [selections, hasAnySelection]);

  const handleReset = () => {
    setSelections({ composition: "", echogenicity: "", shape: "", margin: "", echogenicFoci: [] });
    setCopied(false);
  };

  const generateReport = () => {
    if (!result) return "";
    const cat = result.category;
    const lines = [
      "ACR TI-RADS Assessment",
      "═══════════════════════",
      "",
      `Category: ${cat.score} — ${cat.label}`,
      `Malignancy Risk: ${cat.risk}`,
      `Total Points: ${result.totalPoints}`,
      "",
      "Point Breakdown:",
      `  Composition: ${result.compositionPts}`,
      `  Echogenicity: ${result.echogenicityPts}`,
      `  Shape: ${result.shapePts}`,
      `  Margin: ${result.marginPts}`,
      `  Echogenic Foci: ${result.fociPts}`,
      "",
      `Recommendation: ${cat.fna}`,
      `Follow-up: ${cat.followUp}`,
      "",
      "Disclaimer: Educational tool only. Not a diagnostic device.",
    ];
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 px-10 text-base rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-[1.04] font-semibold ring-1 ring-amber-500/20">
          <Calculator className="mr-2 h-5 w-5" /> Quick TI-RADS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">ACR TI-RADS Calculator</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <RadioGroup label="Composition" options={COMPOSITION_OPTIONS} value={selections.composition} onChange={(v) => setSelections(p => ({...p, composition: v}))} />
          <RadioGroup label="Echogenicity" options={ECHOGENICITY_OPTIONS} value={selections.echogenicity} onChange={(v) => setSelections(p => ({...p, echogenicity: v}))} />
          <RadioGroup label="Shape" options={SHAPE_OPTIONS} value={selections.shape} onChange={(v) => setSelections(p => ({...p, shape: v}))} />
          <RadioGroup label="Margin" options={MARGIN_OPTIONS} value={selections.margin} onChange={(v) => setSelections(p => ({...p, margin: v}))} />
          <CheckboxGroup label="Echogenic Foci" options={ECHOGENIC_FOCI_OPTIONS} value={selections.echogenicFoci} onChange={(v) => setSelections(p => ({...p, echogenicFoci: v}))} />
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-4 p-4 rounded-xl border-2 ${CATEGORY_COLORS[result.category.color]}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-2xl font-extrabold">{result.category.score}</span>
                <span className="ml-2 text-sm font-semibold">{result.category.label}</span>
              </div>
              <Badge variant="outline" className="text-xs">{result.totalPoints} pts</Badge>
            </div>
            <p className="text-xs mb-1"><strong>Risk:</strong> {result.category.risk}</p>
            <p className="text-xs mb-1"><strong>FNA:</strong> {result.category.fna}</p>
            <p className="text-xs"><strong>Follow-up:</strong> {result.category.followUp}</p>

            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={handleCopy} className="text-xs gap-1.5">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy Report"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          {hasAnySelection && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          )}
          <Link to={createPageUrl("TIRADSCalculator")} className="ml-auto">
            <Button variant="link" size="sm" className="text-xs gap-1">
              Full Calculator <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}