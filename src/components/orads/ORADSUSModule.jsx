import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import {
  ORADS_US_CATEGORIES, MENOPAUSAL_OPTIONS, COLOR_SCORES, CLASSIC_BENIGN,
  classifyUS, generateUSReport,
} from "./oradsUsRuleEngine";

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
              className={`text-left p-2.5 rounded-xl border-2 transition-all ${active ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300" : "border-slate-200 dark:border-slate-700 hover:border-rose-300 text-slate-600 dark:text-slate-400"}`}>
              <span className="text-xs font-semibold block">{l}</span>
              {d && <span className="text-[10px] text-slate-400 italic block">{d}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColorScoreSelector({ value, onChange }) {
  const patterns = [
    { cs: 1, label: "CS 1", desc: "No flow", dots: 0 },
    { cs: 2, label: "CS 2", desc: "Minimal (1–3 vessels)", dots: 2 },
    { cs: 3, label: "CS 3", desc: "Moderate", dots: 5 },
    { cs: 4, label: "CS 4", desc: "Very strong", dots: 9 },
  ];
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Color Score (Doppler Vascularity)</label>
      <div className="grid grid-cols-4 gap-1.5">
        {patterns.map(p => (
          <button key={p.cs} onClick={() => onChange(p.cs)}
            className={`p-2 rounded-xl border-2 text-center transition-all ${value === p.cs ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30" : "border-slate-200 dark:border-slate-700 hover:border-rose-300"}`}>
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center mb-1">
              {Array.from({ length: p.dots }).map((_, i) => (
                <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-blue-500"
                  style={{ top: `${20 + Math.random() * 50}%`, left: `${15 + Math.random() * 60}%` }} />
              ))}
              {p.dots === 0 && <span className="text-[9px] text-slate-400">—</span>}
            </div>
            <span className="text-[10px] font-bold block">{p.label}</span>
            <span className="text-[9px] text-slate-400">{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ result, data }) {
  const [copied, setCopied] = useState(false);
  if (!result || result.category === undefined) return null;
  const cat = ORADS_US_CATEGORIES[result.category];

  const handleCopy = () => {
    navigator.clipboard.writeText(generateUSReport(data, result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`border-2 ${cat.borderColor} ${cat.bgColor} shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-white font-black text-base ${cat.color}`}>{cat.label}</span>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">O-RADS {cat.label}</h3>
            <p className={`text-xs font-semibold ${cat.textColor}`}>{cat.name} · Risk: {cat.risk}</p>
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

export default function ORADSUSModule({ menoStatus, onMenoStatusChange, onSwitchToMRI }) {
  const [data, setData] = useState({ primaryFinding: null, menoStatus });
  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  React.useEffect(() => { setData(prev => ({ ...prev, menoStatus })); }, [menoStatus]);

  const result = useMemo(() => {
    if (!data.primaryFinding) return null;
    return classifyUS(data);
  }, [data]);

  const showMRISuggestion = result && (result.category === 3 || result.category === 4) && (data.composition === "cystic_solid" || data.composition === "solid");

  const handleReset = () => setData({ primaryFinding: null, menoStatus });

  return (
    <div className="space-y-4">
      {/* Menopausal banner */}
      <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${menoStatus?.includes("post") ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 border border-amber-200 dark:border-amber-800" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 border border-emerald-200 dark:border-emerald-800"}`}>
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        {MENOPAUSAL_OPTIONS.find(m => m.value === menoStatus)?.label || "Set menopausal status"} — management thresholds adjusted accordingly
      </div>

      {(data.ascites || data.peritonealNodules) && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-bold">ASCITES / PERITONEAL NODULES → O-RADS 5 regardless of other features. Confirm not due to other etiologies.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Input */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Step 1: Primary Finding */}
          <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Primary Finding</h3>
              <PillSelect value={data.primaryFinding} onChange={v => { handleReset(); update("primaryFinding", v); }} options={[
                { value: "normal", label: "No ovarian lesion / Physiologic", desc: "Normal, follicle ≤ 3 cm, corpus luteum" },
                { value: "classic_benign", label: "Classic Benign Lesion", desc: "Hemorrhagic cyst, dermoid, endometrioma, etc." },
                { value: "lesion", label: "Lesion Requiring Characterization", desc: "Morphologic assessment needed" },
                { value: "incomplete", label: "Cannot Characterize", desc: "Technical factors limit assessment → O-RADS 0" },
              ]} />
            </CardContent>
          </Card>

          {/* Classic Benign */}
          {data.primaryFinding === "classic_benign" && (
            <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Classic Benign Type</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {CLASSIC_BENIGN.map(cb => (
                    <button key={cb.value} onClick={() => update("classicType", cb.value)}
                      className={`text-left p-2.5 rounded-xl border-2 transition-all ${data.classicType === cb.value ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30" : "border-slate-200 dark:border-slate-700 hover:border-rose-300"}`}>
                      <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">{cb.label}</span>
                      <span className="text-[9px] text-slate-400 italic">{cb.desc}</span>
                    </button>
                  ))}
                </div>
                {data.classicType && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Size (cm)</label>
                    <Input type="number" step="0.1" placeholder="e.g. 4.5" value={data.sizeCm || ""} onChange={e => update("sizeCm", e.target.value)} className="h-8 text-xs max-w-[120px]" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lesion characterization */}
          {data.primaryFinding === "lesion" && (
            <>
              <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Composition</h3>
                  <PillSelect value={data.composition} onChange={v => update("composition", v)} options={[
                    { value: "cystic", label: "Purely Cystic", desc: "No solid components" },
                    { value: "cystic_solid", label: "Cystic + Solid", desc: "Solid component(s) present" },
                    { value: "solid", label: "Solid (≥ 80%)", desc: "Excludes blood/dermoid content" },
                  ]} columns={3} />
                </CardContent>
              </Card>

              {(data.composition === "cystic" || data.composition === "cystic_solid") && (
                <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
                  <CardContent className="p-4 space-y-3">
                    <PillSelect label="Number of Locules" value={data.locules} onChange={v => update("locules", v)} options={[
                      { value: "unilocular", label: "Unilocular (1)" },
                      { value: "bilocular", label: "Bilocular (2)" },
                      { value: "multilocular", label: "Multilocular (≥ 3)" },
                    ]} columns={3} />
                    <PillSelect label="Inner Wall / Septation" value={data.wallCharacter} onChange={v => update("wallCharacter", v)} options={[
                      { value: "smooth", label: "Smooth", desc: "Smooth inner wall and septations" },
                      { value: "irregular", label: "Irregular", desc: "Protrusions < 3 mm height" },
                    ]} columns={2} />
                  </CardContent>
                </Card>
              )}

              {data.composition === "cystic_solid" && (
                <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Solid Component Details</h3>
                    {data.locules === "unilocular" && (
                      <div>
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Number of papillary projections</label>
                        <div className="flex gap-1.5">
                          {["0", "1", "2", "3", "≥ 4"].map(v => (
                            <button key={v} onClick={() => update("ppCount", v)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.ppCount === v ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-500 hover:border-rose-300"}`}>{v}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 italic">Solid component ≥ 3 mm height protruding into cyst lumen. Papillary projection = surrounded by fluid on 3 sides.</p>
                  </CardContent>
                </Card>
              )}

              {data.composition === "solid" && (
                <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
                  <CardContent className="p-4 space-y-3">
                    <PillSelect label="Outer Contour" value={data.wallCharacter} onChange={v => update("wallCharacter", v)} options={[
                      { value: "smooth", label: "Smooth" },
                      { value: "irregular", label: "Irregular" },
                    ]} columns={2} />
                    <PillSelect label="Acoustic Shadowing (diffuse/broad)" value={data.hasShadowing === true ? "yes" : data.hasShadowing === false ? "no" : null} onChange={v => update("hasShadowing", v === "yes")} options={[
                      { value: "yes", label: "Yes — diffuse/broad" },
                      { value: "no", label: "No shadowing" },
                    ]} columns={2} />
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Size (cm, mean largest dimensions)</label>
                    <Input type="number" step="0.1" placeholder="e.g. 5.2" value={data.sizeCm || ""} onChange={e => update("sizeCm", e.target.value)} className="h-8 text-xs max-w-[120px]" />
                  </div>
                  <ColorScoreSelector value={data.colorScore} onChange={v => update("colorScore", v)} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Associated Findings</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!data.ascites} onChange={e => update("ascites", e.target.checked)} className="w-4 h-4 accent-red-500" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">Ascites (not due to other etiologies)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!data.peritonealNodules} onChange={e => update("peritonealNodules", e.target.checked)} className="w-4 h-4 accent-red-500" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">Peritoneal nodules</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-1.5 text-xs rounded-full">
              <RotateCcw className="w-3.5 h-3.5" /> New Lesion
            </Button>
          </div>
        </div>

        {/* Right: Live result */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-20 space-y-3">
            {result ? (
              <>
                <ResultCard result={result} data={data} />
                {showMRISuggestion && (
                  <Button onClick={onSwitchToMRI} className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-semibold">
                    Score with O-RADS MRI <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </>
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