import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { BIRADS_CATEGORIES } from "./biradsRuleEngine";

const MAMMO_LEXICON = [
  { heading: "Breast Composition", items: ["(a) Almost entirely fatty", "(b) Scattered fibroglandular density", "(c) Heterogeneously dense", "(d) Extremely dense"] },
  { heading: "Mass — Shape", items: ["Oval", "Round", "Irregular"] },
  { heading: "Mass — Margin", items: ["Circumscribed", "Obscured", "Microlobulated", "Indistinct", "Spiculated"] },
  { heading: "Mass — Density", items: ["High density", "Equal density", "Low density", "Fat-containing"] },
  { heading: "Calcification — Typically Benign Morphology", items: ["Skin", "Vascular", "Coarse / popcorn-like", "Large rod-like", "Round/punctate", "Rim / eggshell", "Dystrophic", "Milk of calcium", "Suture"] },
  { heading: "Calcification — Suspicious Morphology", items: ["Amorphous", "Coarse heterogeneous", "Fine pleomorphic", "Fine linear / fine-linear branching"] },
  { heading: "Calcification — Distribution", items: ["Diffuse", "Regional", "Grouped / Clustered", "Linear", "Segmental"] },
  { heading: "Asymmetry", items: ["Asymmetry (one view)", "Focal asymmetry (two views)", "Global asymmetry", "Developing asymmetry"] },
  { heading: "Associated Features", items: ["Skin retraction", "Nipple retraction", "Skin thickening", "Trabecular thickening", "Axillary adenopathy", "Architectural distortion", "Calcifications"] },
];

const US_LEXICON = [
  { heading: "Mass — Shape", items: ["Oval", "Round", "Irregular"] },
  { heading: "Mass — Orientation", items: ["Parallel (wider than tall)", "Not parallel (taller than wide)"] },
  { heading: "Mass — Margin", items: ["Circumscribed", "Not circumscribed: Indistinct", "Not circumscribed: Angular", "Not circumscribed: Microlobulated", "Not circumscribed: Spiculated"] },
  { heading: "Mass — Echo Pattern", items: ["Anechoic", "Hypoechoic", "Isoechoic", "Hyperechoic", "Heterogeneous", "Complex cystic and solid"] },
  { heading: "Mass — Posterior Features", items: ["No posterior features", "Enhancement", "Shadowing", "Combined pattern"] },
  { heading: "Associated Features", items: ["Architectural distortion", "Duct changes", "Skin thickening", "Edema", "Vascularity", "Elasticity assessment"] },
  { heading: "Special Cases", items: ["Simple cyst", "Complicated cyst", "Clustered microcysts", "Intramammary lymph node", "Fat necrosis", "Post-surgical fluid collection", "Skin lesion", "Foreign body"] },
];

function LexiconSection({ title, data }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-3">
          {data.map((section, i) => (
            <div key={i}>
              <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">{section.heading}</h4>
              <ul className="space-y-0.5">
                {section.items.map((item, j) => (
                  <li key={j} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryReference() {
  const [open, setOpen] = useState(false);
  const categories = Object.entries(BIRADS_CATEGORIES);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assessment Categories</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {categories.map(([key, cat]) => (
            <div key={key} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cat.badgeColor}`}>{cat.label}</span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{cat.risk} · {cat.management.substring(0, 80)}…</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BIRADSReference() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Quick Reference — BI-RADS® 2013 Lexicon
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <CategoryReference />
        <LexiconSection title="Mammography Lexicon" data={MAMMO_LEXICON} />
        <LexiconSection title="Ultrasound Lexicon" data={US_LEXICON} />
        <div className="p-3">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Size Measurement Guidance</h4>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>• <strong>Mass:</strong> longest axis + perpendicular measurement. Do NOT include spiculations in measurement.</li>
            <li>• <strong>Architectural distortion / Asymmetry:</strong> greatest linear dimension approximation.</li>
            <li>• <strong>Calcification distribution:</strong> greatest linear dimension of the distribution.</li>
            <li>• <strong>Lymph node:</strong> short axis on mammography; cortical thickness on ultrasound.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}