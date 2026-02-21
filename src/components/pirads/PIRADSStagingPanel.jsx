import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function PillSelect({ options, value, onChange, label }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${value === opt ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PIRADSStagingPanel({ staging, onChange }) {
  const update = (field, value) => onChange({ ...staging, [field]: value });

  const epe = staging.capsularContact > 10 || staging.capsularBulge === "Yes" || staging.rectoprostatic === "Yes" || staging.directInvasion === "Yes";
  const svi = staging.sviStatus === "Definite";
  const t4 = staging.directInvasion === "Yes";
  const stage = t4 ? "T4" : svi ? "T3b" : epe ? "T3a" : "T2";

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">EPE Assessment</h3>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Capsular contact length (mm)</label>
            <Input type="number" step="1" placeholder="mm" value={staging.capsularContact || ""} onChange={e => update("capsularContact", parseFloat(e.target.value) || 0)} className="h-8 text-xs max-w-[120px]" />
          </div>

          <PillSelect label="Capsular irregularity/bulge" options={["No", "Yes"]} value={staging.capsularBulge} onChange={v => update("capsularBulge", v)} />
          <PillSelect label="Obliteration of rectoprostatic angle" options={["No", "Yes"]} value={staging.rectoprostatic} onChange={v => update("rectoprostatic", v)} />
          <PillSelect label="Direct invasion (rectum, bladder, levator, sphincter)" options={["No", "Yes"]} value={staging.directInvasion} onChange={v => update("directInvasion", v)} />
          <PillSelect label="Neurovascular bundle involvement" options={["No", "Right (5 o'clock)", "Left (7 o'clock)", "Bilateral"]} value={staging.nvb} onChange={v => update("nvb", v)} />

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Seminal Vesicle Invasion</h4>
            <PillSelect label="" options={["None", "Suspected", "Definite"]} value={staging.sviStatus} onChange={v => update("sviStatus", v)} />
          </div>

          <div className="mt-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-center">
            <p className="text-[10px] text-violet-500 uppercase tracking-wider font-bold">Clinical Stage</p>
            <p className="text-2xl font-extrabold text-violet-700 dark:text-violet-300">{stage}</p>
            <p className="text-[11px] text-violet-500">
              {stage === "T2" && "Organ-confined"}
              {stage === "T3a" && "Extraprostatic extension"}
              {stage === "T3b" && "Seminal vesicle invasion"}
              {stage === "T4" && "Adjacent organ invasion"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}