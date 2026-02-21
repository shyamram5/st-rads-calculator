import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES, FOOTNOTES } from "./lungRadsRuleEngine";

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

export default function LungRADSReference() {
  return (
    <div className="space-y-3">
      <Section title="Lung-RADS v2022 Category Table" defaultOpen>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="p-2 text-left font-bold text-slate-600 dark:text-slate-300">Cat</th>
                <th className="p-2 text-left font-bold text-slate-600 dark:text-slate-300">Name</th>
                <th className="p-2 text-left font-bold text-slate-600 dark:text-slate-300">Prev.</th>
                <th className="p-2 text-left font-bold text-slate-600 dark:text-slate-300">Management</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(CATEGORIES).map(cat => (
                <tr key={cat.label} className="border-t border-slate-200/60 dark:border-slate-700/40">
                  <td className="p-2 align-top">
                    <span className={`inline-block w-8 h-6 rounded text-center text-white text-[10px] font-black leading-6 ${cat.color}`}>{cat.label}</span>
                  </td>
                  <td className="p-2 align-top font-medium text-slate-700 dark:text-slate-300">{cat.name}</td>
                  <td className="p-2 align-top text-slate-500">{cat.prevalence}</td>
                  <td className="p-2 align-top text-slate-600 dark:text-slate-400 leading-relaxed">{cat.management}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Size Thresholds — Baseline">
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200">Solid:</p>
          <ul className="ml-3 space-y-0.5 list-disc">
            <li>&lt; 6 mm → Cat 2</li>
            <li>6 – &lt; 8 mm → Cat 3</li>
            <li>8 – &lt; 15 mm → Cat 4A</li>
            <li>≥ 15 mm → Cat 4B</li>
          </ul>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2">Part-solid:</p>
          <ul className="ml-3 space-y-0.5 list-disc">
            <li>Total &lt; 6 mm → Cat 2</li>
            <li>Total ≥ 6 mm, solid &lt; 6 mm → Cat 3</li>
            <li>Total ≥ 6 mm, solid 6 – &lt; 8 mm → Cat 4A</li>
            <li>Solid ≥ 8 mm → Cat 4B</li>
          </ul>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2">GGN:</p>
          <ul className="ml-3 space-y-0.5 list-disc">
            <li>&lt; 30 mm → Cat 2</li>
            <li>≥ 30 mm → Cat 3</li>
          </ul>
        </div>
      </Section>

      <Section title="Size Thresholds — New Nodule (Follow-up)">
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200">New Solid:</p>
          <ul className="ml-3 space-y-0.5 list-disc">
            <li>&lt; 4 mm → Cat 2</li>
            <li>4 – &lt; 6 mm → Cat 3</li>
            <li>6 – &lt; 8 mm → Cat 4A</li>
            <li>≥ 8 mm → Cat 4B</li>
          </ul>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2">New Part-solid:</p>
          <ul className="ml-3 space-y-0.5 list-disc">
            <li>Total &lt; 6 mm → Cat 3</li>
            <li>Solid &lt; 4 mm → Cat 4A</li>
            <li>Solid ≥ 4 mm → Cat 4B</li>
          </ul>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2">New GGN:</p>
          <ul className="ml-3 space-y-0.5 list-disc">
            <li>Any size → Cat 3</li>
          </ul>
        </div>
      </Section>

      <Section title="Growth Definition">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Growth = increase in mean diameter &gt; 1.5 mm (&gt; 2 mm³ in volume) within a 12-month interval. When a nodule crosses a new size threshold upon growth, reclassify based on the new size category.
        </p>
      </Section>

      <Section title="Cyst Classification Guide">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <p><strong className="text-slate-800 dark:text-slate-200">Thin-walled:</strong> &lt; 2 mm, unilocular, uniform wall → Benign, NOT in Lung-RADS.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Thick-walled:</strong> ≥ 2 mm, unilocular, asymmetric/nodular wall → Cat 4A baseline.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Multilocular:</strong> Internal septations → Cat 4A baseline.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Cavitary:</strong> Wall thickening dominant → manage as solid nodule by total mean diameter.</p>
          <p><strong className="text-slate-800 dark:text-slate-200">Growing/worsening:</strong> → Cat 4B on follow-up.</p>
        </div>
      </Section>

      <Section title="Volume Conversion Reference">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
          <p>4 mm diameter ≈ 34 mm³</p>
          <p>6 mm diameter ≈ 113 mm³</p>
          <p>8 mm diameter ≈ 268 mm³</p>
          <p>15 mm diameter ≈ 1,767 mm³</p>
        </div>
      </Section>

      <Section title="All 16 ACR Footnotes">
        <div className="space-y-2">
          {Object.entries(FOOTNOTES).map(([num, text]) => (
            <p key={num} className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">Note {num}:</span> {text}
            </p>
          ))}
        </div>
      </Section>
    </div>
  );
}