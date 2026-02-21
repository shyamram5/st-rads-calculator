import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle } from "lucide-react";

const INDICATIONS = [
  { value: "diagnostic", label: "Diagnostic (pre-biopsy)" },
  { value: "surveillance", label: "Active surveillance" },
  { value: "staging", label: "Staging" },
  { value: "recurrence", label: "Suspected recurrence" },
];

const QUALITY_OPTIONS = [
  { value: "diagnostic", label: "Diagnostic quality" },
  { value: "X", label: "Technically inadequate (X)" },
];

const DCE_QUALITY = [
  { value: "diagnostic", label: "Performed & diagnostic" },
  { value: "not_performed", label: "Not performed" },
  { value: "X", label: "Technically inadequate (X)" },
];

export default function PIRADSExamSetup({ examData, onChange, onComplete }) {
  const update = (field, value) => onChange({ ...examData, [field]: value });

  // Auto-calculate volume & PSAD
  const dim1 = parseFloat(examData.dim1) || 0;
  const dim2 = parseFloat(examData.dim2) || 0;
  const dim3 = parseFloat(examData.dim3) || 0;
  const volume = dim1 && dim2 && dim3 ? Math.round(dim1 * dim2 * dim3 * 0.52 * 10) / 10 : null;
  const psa = parseFloat(examData.psa) || 0;
  const psad = volume && psa ? Math.round((psa / volume) * 1000) / 1000 : null;

  React.useEffect(() => {
    if (volume !== examData.prostateVolume || psad !== examData.psad) {
      onChange({ ...examData, prostateVolume: volume, psad });
    }
  }, [volume, psad]);

  const dwiX = examData.dwiQuality === "X";
  const dceX = examData.dceQuality === "X" || examData.dceQuality === "not_performed";

  const canProceed = examData.t2wQuality && examData.dwiQuality && examData.dceQuality;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <Info className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
          <strong>Critical:</strong> PI-RADS Assessment Categories must be assigned based on mpMRI findings ONLY. Do NOT incorporate PSA, DRE, clinical history, or planned treatment into the PI-RADS score.
        </p>
      </div>

      {/* Clinical context */}
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Patient Clinical Context</h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">For display only — NOT used in PI-RADS scoring</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">PSA (ng/mL)</label>
              <Input type="number" step="0.01" placeholder="e.g. 6.5" value={examData.psa || ""} onChange={e => update("psa", e.target.value)} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Dim 1 (cm)</label>
              <Input type="number" step="0.1" placeholder="AP" value={examData.dim1 || ""} onChange={e => update("dim1", e.target.value)} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Dim 2 (cm)</label>
              <Input type="number" step="0.1" placeholder="TR" value={examData.dim2 || ""} onChange={e => update("dim2", e.target.value)} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Dim 3 (cm)</label>
              <Input type="number" step="0.1" placeholder="CC" value={examData.dim3 || ""} onChange={e => update("dim3", e.target.value)} className="h-9" />
            </div>
          </div>

          {volume && (
            <div className="flex items-center gap-4 text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-500">Volume: <strong className="text-slate-800 dark:text-slate-200">{volume} mL</strong></span>
              {psad && <span className="text-slate-500">PSAD: <strong className={`${psad >= 0.15 ? "text-orange-600" : "text-slate-800 dark:text-slate-200"}`}>{psad} ng/mL²</strong></span>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">MRI Indication</label>
              <div className="flex flex-wrap gap-1.5">
                {INDICATIONS.map(opt => (
                  <button key={opt.value} onClick={() => update("indication", opt.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${examData.indication === opt.value ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Prior Biopsy</label>
              <div className="flex gap-1.5">
                {["no", "yes"].map(v => (
                  <button key={v} onClick={() => update("priorBiopsy", v)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${examData.priorBiopsy === v ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {examData.priorBiopsy === "yes" && (
                <Input placeholder="Gleason score" value={examData.gleasonScore || ""} onChange={e => update("gleasonScore", e.target.value)} className="h-8 mt-1.5 text-xs" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Field Strength</label>
              <div className="flex gap-1.5">
                {["1.5T", "3T"].map(v => (
                  <button key={v} onClick={() => update("fieldStrength", v)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${examData.fieldStrength === v ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Endorectal Coil</label>
              <div className="flex gap-1.5">
                {["Yes", "No"].map(v => (
                  <button key={v} onClick={() => update("erc", v)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${examData.erc === v ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sequence quality */}
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sequence Quality Check</h3>
          {[
            { key: "t2wQuality", label: "T2W", options: QUALITY_OPTIONS },
            { key: "dwiQuality", label: "DWI / ADC", options: QUALITY_OPTIONS },
            { key: "dceQuality", label: "DCE", options: DCE_QUALITY },
          ].map(seq => (
            <div key={seq.key} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-20">{seq.label}</span>
              <div className="flex gap-1.5 flex-wrap">
                {seq.options.map(opt => (
                  <button key={opt.value} onClick={() => update(seq.key, opt.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${examData[seq.key] === opt.value
                      ? opt.value === "X" || opt.value === "not_performed" ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600" : "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {dwiX && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-700 dark:text-red-300 leading-relaxed">
                <strong>DWI unavailable.</strong> DWI is the dominant sequence for PZ. Fallback T2W-only tables will be applied. Repeat DWI if cause can be remedied.
              </p>
            </div>
          )}
          {dwiX && dceX && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-700 dark:text-red-300 leading-relaxed">
                <strong>Both DWI and DCE unavailable.</strong> Assessment limited to staging for EPE determination. PI-RADS scoring is substantially limited.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onComplete} disabled={!canProceed}
          className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-full px-6 text-sm font-semibold shadow-lg shadow-violet-500/25">
          Begin Lesion Scoring →
        </Button>
      </div>
    </div>
  );
}