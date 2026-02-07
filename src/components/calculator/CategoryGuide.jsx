import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ArrowRight, Shield, AlertTriangle, XCircle, CheckCircle2, HelpCircle, Microscope } from "lucide-react";

const CATEGORIES = [
  {
    score: 0, label: "Incomplete", color: "gray",
    risk: "N/A",
    icon: XCircle,
    summary: "The MRI exam is technically limited and cannot be adequately evaluated.",
    decisionPath: "The very first question in ST-RADS asks: \"Is the exam adequate for evaluation?\" If the answer is NO — for example due to motion artifact, incomplete sequences, or lack of contrast — the case is classified as ST-RADS 0.",
    keyPoints: ["Inadequate exam quality or incomplete MRI protocol", "Cannot reliably assess the soft-tissue lesion", "Repeat or additional imaging is recommended"],
    action: "Recommend repeat or additional imaging with appropriate protocol.",
  },
  {
    score: 1, label: "Normal", color: "green",
    risk: "No risk",
    icon: CheckCircle2,
    summary: "No soft-tissue lesion is identified on the MRI.",
    decisionPath: "After confirming exam adequacy, the next decision point asks: \"Is a soft-tissue lesion present?\" If NO lesion is seen, the case is ST-RADS 1 — Normal.",
    keyPoints: ["Adequate exam with no detectable soft-tissue mass", "Normal anatomic structures", "No further workup needed for soft-tissue tumor"],
    action: "Routine follow-up. No additional imaging needed for soft-tissue tumor evaluation.",
  },
  {
    score: 2, label: "Benign", color: "green",
    risk: "Very Low",
    icon: Shield,
    summary: "The lesion has classic imaging features of a definitively benign entity.",
    decisionPath: "Once a lesion is identified, you classify its tissue type (lipomatous, cyst-like, or solid). For lipomatous lesions: homogeneous fat signal without thick septations, nodularity, or enhancement → ST-RADS 2. For cyst-like lesions: simple fluid signal, no solid components → ST-RADS 2.",
    keyPoints: ["Lipomatous: homogeneous fat, no thick septations or enhancement", "Cyst-like: simple fluid, thin walls, no solid nodules", "Solid: classic benign features (e.g., nerve sheath tumor with target sign)"],
    action: "No further workup necessary. Clinical follow-up as appropriate.",
  },
  {
    score: 3, label: "Likely Benign", color: "yellow",
    risk: "Low",
    icon: HelpCircle,
    summary: "The lesion has features suggesting a benign diagnosis but with some atypical features.",
    decisionPath: "A lesion that is mostly benign-appearing but has one or more mildly atypical features — such as thin septations in a lipoma, mild enhancement in a cyst-like lesion, or a solid mass with benign morphology but slight heterogeneity.",
    keyPoints: ["Lipomatous with thin septations (< 2 mm) or minimal non-fat component", "Cyst-like with thin septations or mild wall enhancement", "Solid with mostly benign features but some mild atypicality"],
    action: "Short-interval follow-up MRI (typically 6–12 months) to confirm stability.",
  },
  {
    score: 4, label: "Suspicious", color: "orange",
    risk: "Moderate",
    icon: AlertTriangle,
    summary: "The lesion has features that are indeterminate or raise moderate concern for malignancy.",
    decisionPath: "Features that push a lesion to ST-RADS 4 include: thick septations (≥ 2 mm) or nodular enhancement in lipomatous masses, enhancing solid components in cyst-like lesions, or solid lesions without a clear benign signature.",
    keyPoints: ["Lipomatous with thick septations, non-fat nodularity, or enhancement", "Cyst-like with thick septations or solid enhancing components", "Solid mass without classic benign features"],
    action: "Referral to a sarcoma or musculoskeletal tumor center for consideration of biopsy.",
  },
  {
    score: 5, label: "Highly Suspicious", color: "red",
    risk: "High",
    icon: AlertTriangle,
    summary: "The lesion has features highly suggestive of malignancy.",
    decisionPath: "ST-RADS 5 is assigned when imaging features strongly suggest malignancy: large heterogeneous enhancing mass, areas of necrosis, aggressive perilesional features, or very low ADC values combined with ancillary high-risk findings.",
    keyPoints: ["Large heterogeneous mass with necrosis or hemorrhage", "Aggressive imaging features (bone destruction, neurovascular encasement)", "Low ADC values (< 1.0 × 10⁻³ mm²/s) with high-risk ancillary features", "May be upgraded from ST-RADS 4 based on ancillary features"],
    action: "Urgent referral to a sarcoma center. Biopsy strongly recommended before treatment.",
  },
  {
    score: 6, label: "Known Malignancy", color: "blue",
    risk: "Confirmed",
    icon: Microscope,
    summary: "A biopsy-proven or previously treated soft-tissue malignancy.",
    decisionPath: "ST-RADS 6 is reserved for known, biopsy-confirmed malignancies being followed on imaging. Subtypes: 6A = responding to treatment, 6B = stable disease, 6C = progressive disease.",
    keyPoints: ["6A: Treatment response — decreasing size or enhancement", "6B: Stable disease — no significant change", "6C: Progressive disease — increasing size, new enhancement, or new lesions"],
    action: "Continue treatment monitoring per oncology protocol.",
  },
];

export default function CategoryGuide() {
  const [selected, setSelected] = useState(null);

  const colorMap = {
    gray: "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700",
    green: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
    yellow: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
    orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700",
    red: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Microscope className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Category Decision Guide</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Tap any category to explore the decision-making process behind each ST-RADS classification.</p>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {CATEGORIES.map(cat => {
          const isSelected = selected?.score === cat.score;
          return (
            <button
              key={cat.score}
              onClick={() => setSelected(isSelected ? null : cat)}
              className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition-all min-h-[60px] ${
                isSelected
                  ? `${colorMap[cat.color]} border-current shadow-md scale-105`
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/50 dark:bg-slate-800/50"
              }`}
            >
              <span className={`text-lg font-bold ${isSelected ? "" : "text-slate-800 dark:text-slate-200"}`}>{cat.score}</span>
              <span className={`text-[10px] font-medium leading-tight text-center ${isSelected ? "" : "text-slate-500 dark:text-slate-400"}`}>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <Card className={`border-2 ${colorMap[selected.color]} transition-all animate-in fade-in slide-in-from-top-2 duration-300`}>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <selected.icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base">ST-RADS {selected.score} — {selected.label}</h4>
                <Badge variant="outline" className="mt-1 text-xs">{selected.risk} Risk</Badge>
              </div>
            </div>

            <p className="text-sm leading-relaxed">{selected.summary}</p>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Decision Path</h5>
              <div className="bg-white/40 dark:bg-black/20 rounded-lg p-3 text-sm leading-relaxed border border-current/10">
                {selected.decisionPath}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Key Criteria</h5>
              <ul className="space-y-1.5">
                {selected.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-70" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/40 dark:bg-black/20 rounded-lg p-3 border border-current/10">
              <h5 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Recommended Action</h5>
              <p className="text-sm font-medium">{selected.action}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}