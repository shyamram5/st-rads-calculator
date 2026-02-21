import React from "react";

const BANDS = [
  { label: "< 6 mm", cat: "2", color: "bg-lime-100 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400" },
  { label: "6 – < 8 mm", cat: "3", color: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400" },
  { label: "8 – < 15 mm", cat: "4A", color: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400" },
  { label: "≥ 15 mm", cat: "4B", color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400" },
];

export default function SizeThresholdSidebar({ meanDiameter }) {
  const md = parseFloat(meanDiameter) || 0;

  function isActive(band) {
    if (!md) return false;
    if (band.label === "< 6 mm") return md < 6;
    if (band.label === "6 – < 8 mm") return md >= 6 && md < 8;
    if (band.label === "8 – < 15 mm") return md >= 8 && md < 15;
    if (band.label === "≥ 15 mm") return md >= 15;
    return false;
  }

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Baseline Solid Thresholds</p>
      {BANDS.map(band => (
        <div
          key={band.label}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isActive(band) ? `${band.color} ring-2 ring-teal-400/50 font-bold` : "bg-slate-50 dark:bg-slate-800/30 text-slate-400"
          }`}
        >
          <span>{band.label}</span>
          <span>Cat {band.cat}</span>
        </div>
      ))}
    </div>
  );
}