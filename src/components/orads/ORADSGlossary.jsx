import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

function Section({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-3 border-t border-slate-200/60 dark:border-slate-700/40">{children}</div>}
    </div>
  );
}

const DEFINITIONS = [
  { term: "Solid component", def: "Protrudes ≥ 3 mm height into cyst lumen off wall or septation" },
  { term: "Papillary projection (pp)", def: "Solid component surrounded by fluid on 3 sides" },
  { term: "Solid lesion", def: "≥ 80% solid; excludes blood products and dermoid contents" },
  { term: "Shadowing", def: "Must be diffuse or broad; refractive artifact at lesion edge excluded" },
  { term: "Irregular (cystic)", def: "Inner wall protrusions < 3 mm height (below solid component threshold)" },
  { term: "Irregular (solid)", def: "Refers to outer contour" },
  { term: "Color Score 1", def: "No flow detected" },
  { term: "Color Score 2", def: "Minimal flow (1–3 vessels or sparse signal)" },
  { term: "Color Score 3", def: "Moderate flow" },
  { term: "Color Score 4", def: "Very strong, confluent flow" },
  { term: "Bilocular", def: "Exactly 2 locules — lower risk regardless of size or CS" },
  { term: "Multilocular", def: "≥ 3 locules" },
  { term: "Postmenopausal", def: "≥ 1 year amenorrhea; use age > 50 if uterus absent" },
  { term: "Early postmenopausal", def: "< 5 years amenorrhea (or age > 50 but < 55)" },
  { term: "Late postmenopausal", def: "≥ 5 years amenorrhea (or age ≥ 55)" },
  { term: "Dark T2/Dark DWI (MRI)", def: "Homogeneously hypointense on BOTH T2W and DWI — reassuring for benignity" },
  { term: "DCE", def: "Dynamic contrast enhancement with time resolution ≤ 15 seconds" },
  { term: "Low risk TIC", def: "Gradual progressive enhancement — type I curve" },
  { term: "Intermediate risk TIC", def: "Early enhancement with plateau — type II curve" },
  { term: "High risk TIC", def: "Rapid intense enhancement ± washout — type III curve" },
];

const CLASSIC_BENIGN_REF = [
  { name: "Hemorrhagic Cyst", features: "Unilocular, no vascularity, reticular pattern or retractile clot", mgmt: "Pre ≤ 5 cm: no f/u. Pre > 5 cm: f/u 2–3 mo. Early post < 10 cm: f/u 2–3 mo or MRI. Late post: re-characterize." },
  { name: "Dermoid Cyst", features: "≤ 3 locules, no vascularity, hyperechoic + shadowing / lines & dots / floating spheres", mgmt: "≤ 3 cm: consider f/u 12 mo. > 3 cm: f/u 12 mo if not excised." },
  { name: "Endometrioma", features: "≤ 3 locules, no vascularity, ground glass echoes, smooth walls", mgmt: "Pre < 10 cm: f/u 12 mo. Post < 10 cm: f/u 2–3 mo then 12 mo. Increased vigilance post-menopause." },
  { name: "Paraovarian Cyst", features: "Simple cyst separate from ovary", mgmt: "No imaging follow-up." },
  { name: "Peritoneal Inclusion Cyst", features: "Fluid conforming to pelvic organs with ovary at margin", mgmt: "No imaging follow-up." },
  { name: "Hydrosalpinx", features: "Anechoic tubular structure ± folds", mgmt: "No imaging follow-up." },
];

export default function ORADSGlossary() {
  return (
    <div className="space-y-3">
      <Section title="O-RADS Key Definitions" defaultOpen>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 dark:bg-slate-800">
              <th className="p-2 text-left font-bold w-1/3">Term</th>
              <th className="p-2 text-left font-bold">Definition</th>
            </tr></thead>
            <tbody>
              {DEFINITIONS.map((d, i) => (
                <tr key={i} className="border-t border-slate-200/60 dark:border-slate-700/40">
                  <td className="p-2 font-semibold text-slate-700 dark:text-slate-300">{d.term}</td>
                  <td className="p-2 text-slate-500">{d.def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Classic Benign Lesions — Quick Reference">
        <div className="space-y-3">
          {CLASSIC_BENIGN_REF.map((cb, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{cb.name}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5"><strong>Features:</strong> {cb.features}</p>
              <p className="text-[10px] text-slate-500 mt-0.5"><strong>Management:</strong> {cb.mgmt}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="O-RADS US Follow-Up Behavior">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <p><strong>Smaller (≥ 10–15% decrease):</strong> No further surveillance.</p>
          <p><strong>Stable:</strong> Follow-up US at 24 months from initial exam.</p>
          <p><strong>Enlarging (≥ 10–15% increase):</strong> Follow-up at 12 and 24 months, then per gynecology.</p>
          <p><strong>Changing morphology:</strong> Reassess with O-RADS lexicon — may require category upgrade.</p>
        </div>
      </Section>

      <Section title="O-RADS US Scoring Summary">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p><strong>O-RADS 0:</strong> Incomplete — repeat US or MRI</p>
          <p><strong>O-RADS 1:</strong> Normal — no follow-up</p>
          <p><strong>O-RADS 2:</strong> Almost certainly benign (&lt; 1%) — per lesion-specific rules</p>
          <p><strong>O-RADS 3:</strong> Low risk (1–&lt; 10%) — f/u US ~6 mo; gynecologist</p>
          <p><strong>O-RADS 4:</strong> Intermediate (10–&lt; 50%) — MRI or gyn-oncologist consult</p>
          <p><strong>O-RADS 5:</strong> High risk (≥ 50%) — gyn-oncologist referral</p>
        </div>
      </Section>

      <Section title="O-RADS MRI Scoring Summary">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p><strong>O-RADS MRI 0:</strong> Incomplete</p>
          <p><strong>O-RADS MRI 1:</strong> Normal (PPV: N/A)</p>
          <p><strong>O-RADS MRI 2:</strong> Almost certainly benign (PPV &lt; 0.5%)</p>
          <p><strong>O-RADS MRI 3:</strong> Low risk (PPV ~5%)</p>
          <p><strong>O-RADS MRI 4:</strong> Intermediate (PPV ~50%)</p>
          <p><strong>O-RADS MRI 5:</strong> High risk (PPV ~90%)</p>
        </div>
      </Section>
    </div>
  );
}