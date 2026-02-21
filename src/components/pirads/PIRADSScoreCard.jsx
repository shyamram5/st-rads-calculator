import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info, AlertTriangle } from "lucide-react";
import {
  ZONES, GLAND_REGIONS, SIDES, PZ_SUBREGIONS, TZ_SUBREGIONS, EPE_OPTIONS,
  T2W_PZ_OPTIONS, T2W_TZ_OPTIONS, DWI_OPTIONS, DCE_OPTIONS,
} from "./piradsRuleEngine";

const SCORE_COLORS = {
  1: "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
  2: "border-lime-400 bg-lime-50 dark:bg-lime-950/30 text-lime-700 dark:text-lime-300",
  3: "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300",
  4: "border-orange-400 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
  5: "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
  "X": "border-slate-400 bg-slate-100 dark:bg-slate-800/40 text-slate-500",
};

function ScoreButton({ score, label, desc, selected, onClick }) {
  const isSelected = selected === score;
  const colors = SCORE_COLORS[score] || SCORE_COLORS["X"];
  return (
    <button onClick={() => onClick(score)}
      className={`w-full text-left p-2.5 rounded-xl border-2 transition-all duration-150 ${isSelected ? `${colors} ring-1 ring-offset-1 ring-violet-400/50` : "border-slate-200 dark:border-slate-700 hover:border-violet-300 bg-white dark:bg-slate-900"}`}>
      <div className="flex items-start gap-2">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black flex-shrink-0 ${isSelected ? "bg-white/60 dark:bg-black/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          {typeof score === "number" ? score : "X"}
        </span>
        <div className="min-w-0">
          <span className="text-xs font-semibold block">{label}</span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug italic">{desc}</p>
        </div>
      </div>
    </button>
  );
}

function PillSelect({ options, value, onChange, label }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button key={typeof opt === "string" ? opt : opt.value} onClick={() => onChange(typeof opt === "string" ? opt : opt.value)}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${value === (typeof opt === "string" ? opt : opt.value)
              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
              : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300"}`}>
            {typeof opt === "string" ? opt : opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PIRADSScoreCard({ lesion, onChange, examData, liveResult }) {
  const update = (field, value) => onChange({ ...lesion, [field]: value });

  const ez = lesion.effectiveZone || lesion.zone;
  const isPZ = ez === "PZ";
  const isTZ = ez === "TZ";
  const t2wOptions = isTZ ? T2W_TZ_OPTIONS : T2W_PZ_OPTIONS;
  const dwiX = examData.dwiQuality === "X";
  const dceIsRelevant = isPZ && lesion.dwi === 3 && !dwiX;

  return (
    <div className="space-y-4">
      {/* Zone + Location */}
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Lesion Location</h3>
          <PillSelect label="Zone" options={ZONES} value={lesion.zone} onChange={v => {
            const newZone = v;
            const effective = (v === "CZ" || v === "AFMS") ? (lesion.effectiveZone || "PZ") : v === "SV" ? "PZ" : v;
            update("zone", newZone);
            onChange({ ...lesion, zone: newZone, effectiveZone: effective });
          }} />

          {(lesion.zone === "CZ" || lesion.zone === "AFMS") && (
            <PillSelect label="Score as (apparent zone of origin)" options={[{ value: "PZ", label: "PZ criteria" }, { value: "TZ", label: "TZ criteria" }]} value={lesion.effectiveZone} onChange={v => update("effectiveZone", v)} />
          )}

          {lesion.zone && (
            <div className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold ${isPZ ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"}`}>
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              {isPZ ? "DWI IS DOMINANT IN THE PZ" : "T2W IS DOMINANT IN THE TZ"}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <PillSelect label="Region" options={GLAND_REGIONS} value={lesion.region} onChange={v => update("region", v)} />
            <PillSelect label="Side" options={SIDES} value={lesion.side} onChange={v => update("side", v)} />
            <PillSelect label="Subregion" options={isPZ ? PZ_SUBREGIONS : TZ_SUBREGIONS} value={lesion.subregion} onChange={v => update("subregion", v)} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Largest dimension (mm)</label>
              <Input type="number" step="0.1" placeholder="e.g. 14" value={lesion.size || ""} onChange={e => update("size", e.target.value)} className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Measured on</label>
              <Input placeholder={isPZ ? "ADC map" : "T2W"} value={lesion.measureSequence || ""} onChange={e => update("measureSequence", e.target.value)} className="h-8 text-xs" />
            </div>
          </div>

          {parseFloat(lesion.size) >= 15 && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[11px] text-red-700 dark:text-red-300 font-medium">≥ 1.5 cm — score 4 → 5 upgrade threshold</span>
            </div>
          )}

          <PillSelect label="EPE Assessment" options={EPE_OPTIONS} value={lesion.epe} onChange={v => update("epe", v)} />
        </CardContent>
      </Card>

      {/* T2W Scoring */}
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">T2W Score{isTZ && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold">DOMINANT</span>}</h3>
          </div>
          <p className="text-[10px] text-slate-400 italic">{isTZ ? "T2W drives TZ assessment." : "T2W is supporting in PZ — DWI is dominant."}</p>
          <div className="space-y-1.5">
            {t2wOptions.map(opt => (
              <ScoreButton key={opt.value} score={opt.value} label={opt.label} desc={opt.desc} selected={lesion.t2w} onClick={v => update("t2w", v)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DWI Scoring */}
      <Card className={`border-0 shadow-md bg-white/80 dark:bg-slate-900/80 ${dwiX ? "opacity-60" : ""}`}>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">DWI / ADC Score{isPZ && !dwiX && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">DOMINANT</span>}</h3>
          </div>
          {dwiX ? (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-[11px] text-red-600 font-semibold">DWI marked inadequate — auto-assigned X. Fallback table will be used.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {DWI_OPTIONS.map(opt => (
                <ScoreButton key={opt.value} score={opt.value} label={opt.label} desc={opt.desc} selected={lesion.dwi} onClick={v => update("dwi", v)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DCE Scoring */}
      <Card className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">DCE Score</h3>
            {dceIsRelevant ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 font-bold animate-pulse">DCE IS THE TIEBREAKER HERE</span>
            ) : (
              <span className="text-[10px] text-slate-400">No effect on category</span>
            )}
          </div>
          <div className={`space-y-1.5 ${!dceIsRelevant && lesion.zone ? "opacity-50" : ""}`}>
            {DCE_OPTIONS.map(opt => (
              <ScoreButton key={opt.value} score={opt.value} label={opt.label} desc={opt.desc} selected={lesion.dce} onClick={v => update("dce", v)} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}