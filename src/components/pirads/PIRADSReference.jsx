import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES } from "./piradsRuleEngine";

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

export default function PIRADSReference() {
  return (
    <div className="space-y-3">
      <Section title="PI-RADS v2.1 Assessment Categories" defaultOpen>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-100 dark:bg-slate-800">
              <th className="p-2 text-left font-bold">Cat</th><th className="p-2 text-left font-bold">Name</th><th className="p-2 text-left font-bold">PPV</th><th className="p-2 text-left font-bold">Management</th>
            </tr></thead>
            <tbody>
              {Object.values(CATEGORIES).map(c => (
                <tr key={c.label} className="border-t border-slate-200/60 dark:border-slate-700/40">
                  <td className="p-2"><span className={`inline-block w-7 h-6 rounded text-center text-white text-[10px] font-black leading-6 ${c.color}`}>{c.label}</span></td>
                  <td className="p-2 font-medium text-slate-700 dark:text-slate-300">{c.name}</td>
                  <td className="p-2 text-slate-500">{c.ppv}</td>
                  <td className="p-2 text-slate-600 dark:text-slate-400">{c.management}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="PZ Scoring Table — DWI Dominant">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p><strong>DWI 1</strong> → PI-RADS 1 (any T2W, any DCE)</p>
          <p><strong>DWI 2</strong> → PI-RADS 2</p>
          <p><strong>DWI 3 + DCE –</strong> → PI-RADS 3</p>
          <p><strong>DWI 3 + DCE +</strong> → PI-RADS 4 (DCE upgrades)</p>
          <p><strong>DWI 4</strong> → PI-RADS 4</p>
          <p><strong>DWI 5</strong> → PI-RADS 5</p>
        </div>
      </Section>

      <Section title="TZ Scoring Table — T2W Dominant">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p><strong>T2W 1</strong> (BPH only) → PI-RADS 1</p>
          <p><strong>T2W 2 + DWI ≤ 3</strong> → PI-RADS 2</p>
          <p><strong>T2W 2 + DWI ≥ 4</strong> → PI-RADS 3 (DWI upgrade)</p>
          <p><strong>T2W 3 + DWI ≤ 4</strong> → PI-RADS 3</p>
          <p><strong>T2W 3 + DWI 5</strong> → PI-RADS 4 (DWI 5 upgrade)</p>
          <p><strong>T2W 4</strong> → PI-RADS 4</p>
          <p><strong>T2W 5</strong> → PI-RADS 5</p>
        </div>
      </Section>

      <Section title="Fallback — No DWI">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p><strong>T2W 1</strong> → PI-RADS 1</p>
          <p><strong>T2W 2</strong> → PI-RADS 2</p>
          <p><strong>T2W 3 + DCE –</strong> → PI-RADS 3</p>
          <p><strong>T2W 3 + DCE +</strong> → PI-RADS 4</p>
          <p><strong>T2W 4</strong> → PI-RADS 4</p>
          <p><strong>T2W 5</strong> → PI-RADS 5</p>
        </div>
      </Section>

      <Section title="Benign Findings Reference">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p><strong className="text-slate-800 dark:text-slate-200">BPH (TZ):</strong> Round/oval, encapsulated nodules — T2W score 1. Common DWI restriction does NOT trigger upgrade unless DWI ≥ 4 in an atypical (T2W 2) nodule.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Prostatitis (PZ):</strong> Wedge-shaped, band-like, or diffuse T2 hypointensity; ADC less restricted than cancer. If not rounded/focal, lower suspicion. DCE may be positive — assign negative if diffuse/non-localizing.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Hemorrhage:</strong> T1W hyperintensity post-biopsy. Consider delaying MRI ≥ 6 weeks after biopsy for staging.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Atrophy:</strong> Wedge-shaped T2 hypointensity, mild ADC reduction, contour retraction — ADC not as low as cancer.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Fibrosis:</strong> Band/wedge-shaped T2 hypointensity, no focal mass, post-inflammatory.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Cysts:</strong> Markedly T2 hyperintense, T1 dark — benign. T1 bright if hemorrhagic/proteinaceous.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Calcifications:</strong> Signal voids on all sequences.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Normal CZ:</strong> Bilateral, symmetric low T2/ADC encircling ejaculatory ducts — do NOT mistake for cancer.</p>
        </div>
      </Section>

      <Section title="Clinically Significant Cancer Definition">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Per PI-RADS v2.1: Gleason score ≥ 7 (including 3+4 with prominent but not predominant Gleason 4), AND/OR tumor volume &gt; 0.5 cc, AND/OR extraprostatic extension (EPE).
        </p>
      </Section>

      <Section title="EPE Assessment Criteria">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p>• Capsular contact length &gt; 10 mm</p>
          <p>• Capsular irregularity or bulge</p>
          <p>• Obliteration of rectoprostatic angle</p>
          <p>• Direct invasion of adjacent structures</p>
          <p>• Neurovascular bundle asymmetry/involvement</p>
          <p>• Definite EPE → automatic PI-RADS 5</p>
        </div>
      </Section>
    </div>
  );
}