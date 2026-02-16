import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, GitBranch } from "lucide-react";

const QUESTION_LABELS = {
  examAdequacy: { label: "Exam Adequacy", fig: "Figure 1", values: { complete: "Complete/Adequate", incomplete: "Incomplete" } },
  lesionPresent: { label: "Soft-Tissue Lesion Present?", fig: "Figure 1", values: { yes: "Yes", no: "No" } },
  macroscopicFatT1W: { label: "Macroscopic Fat on T1W?", fig: "Figure 1", values: { yes: "Yes → Lipomatous pathway", no: "No → Evaluate T2/Enhancement" } },
  t2EnhancementPath: { label: "T2 Signal / Enhancement Pattern", fig: "Figure 1", values: { cystlike: "Markedly high T2 AND <20% enhancement → Cyst-like pathway", indeterminate_solid: "Variable T2 OR >20% enhancement → Indeterminate solid pathway" } },

  // Lipomatous (Fig 2A)
  lipFatContent: { label: "Fat Content", fig: "Figure 2A", values: { predominantly: "Predominantly lipomatous (>90%)", not_predominantly: "Not predominantly lipomatous (≤90%)" } },
  lipNoduleSeptation: { label: "Septation / Nodule Pattern", fig: "Figure 2A", values: { thin_absence: "Thin septations (<2mm) OR absence of nodules", septations_presence: "Septations AND presence of nodules" } },
  lipSeptations: { label: "Septation Thickness / Enhancement", fig: "Figure 2A", values: { thick_high_enh: "Thick septations (≥2mm) OR enhancement >10%", thin_low_enh: "Thin septations (<2mm) OR enhancement <10%" } },
  lipVessels: { label: "Vessel Prominence", fig: "Figure 2A", values: { many: "Many prominent vessels", few: "Few prominent vessels" } },
  lipNoduleFeatures: { label: "Enhancing Nodule(s)", fig: "Figure 2A", values: { no_nodules: "No enhancing nodule(s) / larger lipomatous component", nodules_present: "Enhancing nodule(s) / smaller lipomatous component" } },

  // Cyst-like (Fig 2B)
  cystLocation: { label: "Location / Communication", fig: "Figure 2B", values: { superficial_communicating: "Communicates with joint/tendon/bursa OR cutaneous/subcutaneous OR intraneural", deep_non_communicating: "Deep (subfascial), no communication" } },
  cystFlow: { label: "Predominantly Flow Voids / Fluid-Fluid?", fig: "Figure 2B", values: { yes: "Yes", no: "No" } },
  cystHematoma: { label: "Hematoma Features?", fig: "Figure 2B", values: { yes: "Yes", no: "No" } },
  cystSeptationNodules: { label: "Thick Septations / Mural Nodules ≥1 cm?", fig: "Figure 2B", values: { present: "Present", absent: "Absent" } },

  // Solid - Compartment
  compartment: { label: "Anatomic Compartment", fig: "Figure 2C/2D", values: {
    deep_muscle: "Deep (subfascial) / Intramuscular → Fig 2C",
    intratendinous: "Intratendinous → Fig 2C",
    fascial: "Fascial → Fig 2C",
    subungual: "Subungual → Fig 2C",
    intravascular: "Intravascular → Fig 2D",
    intraarticular: "Intraarticular → Fig 2D",
    intraneural: "Intraneural → Fig 2D",
    cutaneous: "Cutaneous/Subcutaneous → Fig 2D"
  }},

  // Deep Muscle (Fig 2C)
  muscleSignature: { label: "Muscle Signature Present?", fig: "Figure 2C", values: { yes: "Yes", no: "No" } },
  myositisTriad: { label: "Benign Triad (injury + edema + mineralization)?", fig: "Figure 2C", values: { yes: "Yes", no: "No" } },

  // Intravascular (Fig 2D)
  vascMorphology: { label: "Vascular Morphology", fig: "Figure 2D", values: { phleboliths: "Phleboliths with fluid-fluid levels", hyper_no_phleb: "Hyperintense without phleboliths", calc_hypo: "Calcified/ossified or predominantly hypointense T2" } },
  vascBlooming: { label: "Hemosiderin Blooming on GRE?", fig: "Figure 2D", values: { blooming: "Yes — blooming present", no_blooming: "No blooming" } },
  vascT2Enhancement: { label: "T2 Signal / Enhancement", fig: "Figure 2D", values: { hyperintense_peripheral: "Hyperintense T2 + peripheral enhancement", hypointense_no_peripheral: "Hypointense T2 + no peripheral enhancement" } },

  // Intraarticular (Fig 2D)
  iaSignal: { label: "Signal Characteristics", fig: "Figure 2D", values: { calcified_hypo: "Calcified/ossified or predominantly hypointense T2", not_calcified_hyper: "Not calcified, hyperintense on T2W" } },
  iaBlooming: { label: "Hemosiderin Blooming on GRE?", fig: "Figure 2D", values: { blooming: "Yes — blooming present", no_blooming: "No blooming" } },
  iaEnhancement: { label: "Enhancement Pattern", fig: "Figure 2D", values: { peripheral: "Peripheral enhancement", no_peripheral: "No peripheral enhancement" } },

  // Intraneural (Fig 2D)
  targetSign: { label: "Target Sign Present?", fig: "Figure 2D", values: { yes: "Yes", no: "No" } },
  nerveADC: { label: "ADC Value", fig: "Figure 2D", values: { high: ">1.1 × 10⁻³ mm²/s", low: "≤1.1 × 10⁻³ mm²/s" } },
  nerveT2Enhancement: { label: "T2 Signal / Enhancement", fig: "Figure 2D", values: { hyperintense_peripheral: "Hyperintense T2 + peripheral enhancement", hypointense_no_peripheral: "Hypointense T2 + no peripheral enhancement" } },

  // Cutaneous (Fig 2D)
  growthPattern: { label: "Growth Pattern", fig: "Figure 2D", values: { exophytic: "Exophytic", endophytic: "Endophytic" } },
  cutEnhancement: { label: "Enhancement Pattern", fig: "Figure 2D", values: { peripheral: "Peripheral enhancement", internal: "Internal enhancement" } },

  // Tendon (Fig 2C)
  tendonMorph: { label: "Tendon Morphology", fig: "Figure 2C", values: { enlarged: "Enlarged tendon with calcifications/cysts/fat", normal: "Normal size tendon without calcifications/cysts/fat" } },
  tendonBlooming: { label: "Hemosiderin Blooming on GRE?", fig: "Figure 2C", values: { blooming: "Yes — blooming present", no_blooming: "No blooming" } },

  // Fascial (Fig 2C)
  fascialSize: { label: "Fascial Nodule Size", fig: "Figure 2C", values: { small: "<2 cm", large: "≥2 cm" } },
  fascialMulti: { label: "Multifocal / Conglomerate?", fig: "Figure 2C", values: { yes: "Yes", no: "No" } },

  // Subungual (Fig 2C)
  subungualSize: { label: "Subungual Lesion Size", fig: "Figure 2C", values: { small: "<1 cm", large: "≥1 cm" } },

  // Ancillary
  adcValue: { label: "ADC Value (× 10⁻³ mm²/s)", fig: "Ancillary", values: {} },
  ancillaryFlags: { label: "High-Risk Ancillary Features", fig: "Ancillary", values: {} },
};

// Order in which decisions are made through the flowchart
const DECISION_ORDER = [
  "examAdequacy", "lesionPresent", "macroscopicFatT1W", "t2EnhancementPath",
  // Lipomatous
  "lipFatContent", "lipNoduleSeptation", "lipSeptations", "lipVessels", "lipNoduleFeatures",
  // Cyst-like
  "cystLocation", "cystFlow", "cystHematoma", "cystSeptationNodules",
  // Solid compartment
  "compartment",
  // Deep muscle
  "muscleSignature", "myositisTriad",
  // Intravascular
  "vascMorphology", "vascBlooming", "vascT2Enhancement",
  // Intraarticular
  "iaSignal", "iaBlooming", "iaEnhancement",
  // Intraneural
  "targetSign", "nerveADC", "nerveT2Enhancement",
  // Cutaneous
  "growthPattern", "cutEnhancement",
  // Tendon
  "tendonMorph", "tendonBlooming",
  // Fascial
  "fascialSize", "fascialMulti",
  // Subungual
  "subungualSize",
  // Ancillary
  "adcValue", "ancillaryFlags",
];

function buildPath(caseData) {
  const path = [];
  for (const key of DECISION_ORDER) {
    const val = caseData[key];
    if (val === undefined || val === "" || val === null) continue;

    const meta = QUESTION_LABELS[key];
    if (!meta) continue;

    let displayValue;
    if (key === "adcValue") {
      displayValue = `${val} × 10⁻³ mm²/s`;
    } else if (key === "ancillaryFlags" && Array.isArray(val)) {
      if (val.length === 0) continue;
      displayValue = val.join(", ");
    } else {
      displayValue = meta.values[val] || val;
    }

    path.push({ key, label: meta.label, figure: meta.fig, value: displayValue });
  }
  return path;
}

export default function DecisionPathTrace({ caseData, result }) {
  const path = buildPath(caseData);
  if (path.length === 0) return null;

  // Group steps by figure
  let currentFigure = null;

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-500" />
          Decision Path Trace
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Step-by-step path through the ST-RADS flowcharts that produced this classification
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {path.map((step, i) => {
            const showFigureHeader = step.figure !== currentFigure;
            currentFigure = step.figure;
            const isLast = i === path.length - 1;

            return (
              <div key={step.key}>
                {showFigureHeader && (
                  <div className="flex items-center gap-2 mt-3 mb-2 first:mt-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      {step.figure}
                    </span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  </div>
                )}
                <div className="flex items-start gap-3 ml-1">
                  {/* Vertical connector */}
                  <div className="flex flex-col items-center pt-1">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isLast ? "bg-blue-600 ring-2 ring-blue-300 dark:ring-blue-800" : "bg-slate-300 dark:bg-slate-600"}`} />
                    {!isLast && <div className="w-px flex-1 min-h-[20px] bg-slate-200 dark:bg-slate-700" />}
                  </div>
                  {/* Content */}
                  <div className={`pb-3 ${isLast ? "pb-0" : ""}`}>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{step.label}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ChevronRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <p className="text-sm text-slate-800 dark:text-slate-200">{step.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final score callout */}
        {result?.category && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Final Classification →</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              ST-RADS {result.category.score} — {result.category.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}