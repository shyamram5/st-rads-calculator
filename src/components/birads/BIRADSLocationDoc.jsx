import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info, MapPin } from "lucide-react";

const LATERALITY = [
  { value: "right", label: "Right" },
  { value: "left", label: "Left" },
];

const QUADRANTS = [
  { value: "UOQ", label: "Upper Outer Quadrant (UOQ)" },
  { value: "UIQ", label: "Upper Inner Quadrant (UIQ)" },
  { value: "LOQ", label: "Lower Outer Quadrant (LOQ)" },
  { value: "LIQ", label: "Lower Inner Quadrant (LIQ)" },
  { value: "central", label: "Central / Subareolar" },
  { value: "axillary_tail", label: "Axillary Tail" },
];

const DEPTH = [
  { value: "anterior", label: "Anterior third" },
  { value: "middle", label: "Middle third" },
  { value: "posterior", label: "Posterior third" },
];

export default function BIRADSLocationDoc({ location, onChange }) {
  const update = (field, value) => onChange({ ...location, [field]: value });

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Location Documentation</h2>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            When using both mammography and ultrasound, always confirm correlation between modalities. A lesion found on US is NOT automatically the same as the mammographic finding.
          </p>
        </div>

        {/* Laterality */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Laterality</label>
          <div className="flex gap-2">
            {LATERALITY.map(l => (
              <button key={l.value} onClick={() => update("laterality", l.value)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${location.laterality === l.value ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quadrant */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Quadrant</label>
          <div className="grid grid-cols-2 gap-2">
            {QUADRANTS.map(q => (
              <button key={q.value} onClick={() => update("quadrant", q.value)}
                className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${location.quadrant === q.value ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clock position */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Clock-face Position</label>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <button key={h} onClick={() => update("clock", h)}
                className={`w-9 h-9 rounded-full border-2 text-xs font-bold transition-all ${location.clock === h ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Depth */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Depth</label>
          <div className="flex gap-2">
            {DEPTH.map(d => (
              <button key={d.value} onClick={() => update("depth", d.value)}
                className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all flex-1 ${location.depth === d.value ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distance from nipple */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Distance from Nipple (cm)</label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 3.5"
            value={location.distanceFromNipple || ""}
            onChange={(e) => update("distanceFromNipple", e.target.value)}
            className="max-w-[140px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}