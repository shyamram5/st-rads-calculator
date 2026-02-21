import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Copy, Check, RotateCcw } from "lucide-react";
import {
  ORADS_MRI_CATEGORIES, LESION_TYPES_MRI, FLUID_TYPES, TIC_OPTIONS,
  classifyMRI, generateMRIReport,
} from "./oradsMriRuleEngine";

function PillSelect({ options, value, onChange, label, columns }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">{label}</label>}
      <div className={`grid gap-1.5 ${columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
        {options.map(opt => {
          const v = typeof opt === "string" ? opt : opt.value;
          const l = typeof opt === "string" ? opt : opt.label;
          const d = typeof opt === "object" ? opt.desc : null;
          const active = value === v;
          return (
            <button key={v} onClick={() => onChange(v)}
              className={`text-left p-2.5 rounded-xl border-2 transition-all ${active ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-600 dark:text-slate-400"}`}>
              <span className="text-xs font-semibold block">{l}</span>
              {d && <span className="text-[10px] text-slate-400 italic block">{d}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TICSelector({ value, onChange }) {
  const curves = [
    { key: "low", label: "Type I — Low Risk", desc: "Gradual progressive", path: "M10,80 Q40,60 70,50 T130,40", color: "text-green-600" },
    { key: "intermediate", label: "Type II — Intermediate", desc: "Early enhancement + plateau", path: "M10,80 Q30,30 50,30 T130,30", color: "text-yellow-600" },
    { key: "high", label: "Type III — High Risk", desc: "Rapid rise ± washout", path: "M10,80 Q25,10 40,15 T130,50", color: "text-red-600" },
  ];
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">DCE Time-Intensity Curve (TIC)</label>
      <div className="grid grid-cols-3 gap-1.5">
        {curves.map(c => (
          <button key={c.key} onClick={() => onChange(c.key)}
            className={`p-2.5 rounded-xl border-2 text-center transition-all ${value === c.key ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700 hover:border-blue-300"}`}>
            <svg viewBox="0 0 140 90" className="w-full h-12 mb-1">
              <line x1="10" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-slate-300" />
              <line x1="10" y1="80" x2="10" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-slate-300" />
              <path d={c.path} fill="none" stroke="currentColor" strokeWidth="2.5" className={c.color} strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-bold block">{c.label}</span>
            <span className="text-[9px] text-slate-400">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MRIResultCard({ result, data }) {
  const [copied, setCopied] = useState(false);
  if (!result || result.category === undefined) return null;
  const cat = ORADS_MRI_CATEGORIES[result.category];

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMRIReport(data, result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`border-2 ${cat.borderColor} ${cat.bgColor} shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-white font-black text-base ${cat.color}`}>{cat.label}</span>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">O-RADS MRI {cat.label}</h3>
            <p className={`text-xs font-semibold ${cat.textColor}`}>{cat.name} · PPV: {cat.ppv}</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{cat.description}</p>
        <p className="text-[11px] text-slate-500 mt-1"><strong>Management:</strong> {cat.management}</p>
        {result.notes.map((n, i) => <p key={i} className="text-[10px] text-slate-500 italic mt-0.5">• {n}</p>)}
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
            {copied ? <><Check className="w-3 h-3 text-green-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Report</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ORADSMRIModule({ menoStatus }) {
  const [data, setData] = useState({ primaryFinding: null, dcePerformed: null, menoStatus });
  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  React.useEffect(() => { setData(prev => ({ ...prev, menoStatus })); }, [menoStatus]);

  const needsSolidAssessment = data.lesionType === "solid_tissue" ||
    (data.hasSolidTissue && data.lesionType !== "dark_t2_dwi");

  const result = useMemo(() => {
    if (!data.primaryFinding && !data.lesionType) return null;
    if (data.primaryFinding === "incomplete") return classifyMRI(data);
    if (data.primaryFinding === "normal") return classifyMRI(data);
    if (data.lesionType) return classifyMRI(data);
    return null;
  }, [data]);

  const handleReset = () => setData({ primaryFinding: null, dcePerformed: null, menoStatus });

  return (
    <div className="space-y-4">
      {/* DCE warning */}
      {data.dcePerformed === false && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300"><strong>DCE not performed.</strong> Time resolution ≤ 15 s required for accurate scoring. Accuracy is decreased. Fallback non-DCE rules will apply.</p>
        </div>
      )}

      {(data.peritonealNodularity || data.mesentericThickening || data.omentalNodularity) && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-bold">PERITONEAL DISEASE → O-RADS MRI 5 regardless of primary lesion.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Input */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* DCE check */}
          <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
            <CardContent className="p-4 space-y-3">
              <PillSelect label="DCE Performed (≤ 15 s time resolution)?" value={data.dcePerformed === true ? "yes" : data.dcePerformed === false ? "no" : null} onChange={v => update("dcePerformed", v === "yes")} options={[
                { value: "yes", label: "Yes" }, { value: "no", label: "No" },
              ]} columns={2} />
            </CardContent>
          </Card>

          {/* Primary finding */}
          <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Primary Finding</h3>
              <PillSelect value={data.primaryFinding || data.lesionType} onChange={v => {
                if (v === "normal" || v === "incomplete") {
                  handleReset();
                  update("primaryFinding", v);
                } else {
                  setData(prev => ({ ...prev, primaryFinding: null, lesionType: v }));
                }
              }} options={[
                { value: "normal", label: "Normal / Physiologic (premenopausal)", desc: "No lesion, follicle ≤ 3 cm, etc." },
                { value: "incomplete", label: "Cannot Characterize", desc: "Technical limitation → O-RADS MRI 0" },
                ...LESION_TYPES_MRI,
              ]} />
            </CardContent>
          </Card>

          {/* Fluid type */}
          {(data.lesionType === "unilocular" || data.lesionType === "multilocular") && (
            <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
              <CardContent className="p-4 space-y-3">
                <PillSelect label="Fluid Content" value={data.fluidType} onChange={v => update("fluidType", v)} options={FLUID_TYPES} columns={3} />
                <PillSelect label="Wall Enhancement" value={data.wallEnhancement} onChange={v => update("wallEnhancement", v)} options={[
                  { value: "none", label: "None" }, { value: "smooth", label: "Smooth enhancing" }, { value: "irregular", label: "Irregular" },
                ]} columns={3} />
                {data.lesionType === "multilocular" && (
                  <PillSelect label="Septation Enhancement" value={data.septationEnhancement} onChange={v => update("septationEnhancement", v)} options={[
                    { value: "none", label: "None" }, { value: "smooth", label: "Smooth" }, { value: "irregular", label: "Irregular" },
                  ]} columns={3} />
                )}
                <PillSelect label="Enhancing Solid Tissue Present?" value={data.hasSolidTissue === true ? "yes" : data.hasSolidTissue === false ? "no" : null} onChange={v => update("hasSolidTissue", v === "yes")} options={[
                  { value: "no", label: "No" }, { value: "yes", label: "Yes" },
                ]} columns={2} />
              </CardContent>
            </Card>
          )}

          {/* Dilated tube */}
          {data.lesionType === "dilated_tube" && (
            <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
              <CardContent className="p-4 space-y-3">
                <PillSelect label="Wall/Folds" value={data.tubeWall} onChange={v => update("tubeWall", v)} options={[
                  { value: "thin_smooth", label: "Thin, smooth" }, { value: "thick_smooth", label: "Thick, smooth" }, { value: "irregular", label: "Irregular" },
                ]} columns={3} />
                <PillSelect label="Fluid" value={data.tubeFluid} onChange={v => update("tubeFluid", v)} options={[
                  { value: "simple", label: "Simple" }, { value: "nonsimple", label: "Non-simple" },
                ]} columns={2} />
                <PillSelect label="Enhancing Solid Tissue?" value={data.hasSolidTissue === true ? "yes" : data.hasSolidTissue === false ? "no" : null} onChange={v => update("hasSolidTissue", v === "yes")} options={[
                  { value: "no", label: "No" }, { value: "yes", label: "Yes" },
                ]} columns={2} />
              </CardContent>
            </Card>
          )}

          {/* Lipid */}
          {data.lesionType === "lipid" && (
            <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
              <CardContent className="p-4 space-y-3">
                <PillSelect label="Enhancing Solid Tissue?" value={data.hasSolidTissue === true ? "yes" : data.hasSolidTissue === false ? "no" : null} onChange={v => update("hasSolidTissue", v === "yes")} options={[
                  { value: "no", label: "No" }, { value: "yes", label: "Yes" },
                ]} columns={2} />
                {data.hasSolidTissue && (
                  <PillSelect label="Solid Tissue Volume" value={data.lipidSolidVolume} onChange={v => update("lipidSolidVolume", v)} options={[
                    { value: "minimal", label: "Minimal (Rokitansky nodule)" }, { value: "large", label: "Large volume" },
                  ]} columns={2} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Solid tissue TIC / fallback */}
          {needsSolidAssessment && (
            <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Solid Tissue Assessment</h3>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 dark:text-blue-300">Solid tissue = enhancing component (papillary projection, mural nodule, irregular wall, or larger solid portions).</p>
                </div>
                {data.dcePerformed ? (
                  <TICSelector value={data.ticType} onChange={v => update("ticType", v)} />
                ) : (
                  <PillSelect label="Enhancement vs. Myometrium (at 30–40 s)" value={data.enhancementVsMyometrium} onChange={v => update("enhancementVsMyometrium", v)} options={[
                    { value: "leq", label: "≤ Myometrium", desc: "→ Intermediate risk (O-RADS MRI 4)" },
                    { value: "gt", label: "> Myometrium", desc: "→ High risk (O-RADS MRI 5)" },
                  ]} columns={2} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Peritoneal assessment */}
          <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Peritoneal / Advanced Disease</h3>
              <div className="flex flex-col gap-2">
                {[
                  { key: "peritonealNodularity", label: "Peritoneal nodularity" },
                  { key: "mesentericThickening", label: "Mesenteric thickening (irregular)" },
                  { key: "omentalNodularity", label: "Omental nodularity or cake" },
                  { key: "ascitesMri", label: "Ascites" },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!data[item.key]} onChange={e => update(item.key, e.target.checked)} className="w-4 h-4 accent-red-500" />
                    <span className="text-xs text-slate-700 dark:text-slate-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={handleReset} className="gap-1.5 text-xs rounded-full">
            <RotateCcw className="w-3.5 h-3.5" /> New Lesion
          </Button>
        </div>

        {/* Right: Live result */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            {result ? (
              <MRIResultCard result={result} data={data} />
            ) : (
              <Card className="border border-dashed border-slate-300 dark:border-slate-700">
                <CardContent className="p-4 text-center text-xs text-slate-400">
                  Select findings to see live result
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}