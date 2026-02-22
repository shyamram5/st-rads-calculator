import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES, NF_CRITERIA, CHARCOT_VS_OM, DEPRECATED_TERMS, KEY_STATS, NOS_ENTITIES } from "./mskiRuleEngine";

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-900 dark:text-white">{title}</span>
        <span className="text-[11px] text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-900">{children}</div>}
    </div>
  );
}

export default function MSKIReference() {
  return (
    <div className="space-y-3">
      {/* Category Table */}
      <Section title="MSKI-RADS Categories (Table 1)" defaultOpen>
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div key={key} className={`flex items-start gap-3 p-2.5 rounded-lg ${cat.color} border ${cat.borderColor}`}>
              <span className={`text-[11px] font-bold ${cat.textColor} whitespace-nowrap min-w-[90px]`}>{cat.label}</span>
              <div>
                <p className={`text-[12px] font-medium ${cat.textColor}`}>{cat.name}</p>
                <p className={`text-[11px] ${cat.textColor} opacity-70 mt-0.5`}>{cat.management}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Key Statistics */}
      <Section title="Key Statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {KEY_STATS.map(stat => (
            <div key={stat.label} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Sequence Requirements */}
      <Section title="MRI Sequence Requirements">
        <div className="space-y-2 text-[12px] text-gray-600 dark:text-gray-400">
          <p className="font-medium text-gray-900 dark:text-white">Required (all in at least one plane):</p>
          <ul className="space-y-1 ml-3">
            <li>• T1-weighted imaging (without fat suppression)</li>
            <li>• Fluid-sensitive fat-suppressed (T2W fat-sat OR STIR)</li>
            <li>• Pre-contrast fat-suppressed T1-weighted</li>
            <li>• Post-contrast fat-suppressed T1-weighted</li>
          </ul>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Pre- and post-contrast T1W must use identical parameters. Alternatives: imaging without fat suppression using subtraction; Dixon-based sequences. DWI is optional but encouraged.
          </p>
        </div>
      </Section>

      {/* NF Criteria */}
      <Section title="Necrotizing Fasciitis MRI Criteria">
        <div className="space-y-1.5">
          {NF_CRITERIA.map(c => (
            <div key={c.value} className="flex items-start gap-2 text-[12px] text-gray-600 dark:text-gray-400">
              <span className="text-gray-300 dark:text-gray-600 mt-0.5">•</span>
              <span>{c.label}</span>
            </div>
          ))}
          <p className="text-[11px] text-red-600 dark:text-red-400 mt-2 font-medium">≥ 2 criteria = NF alert (surgical emergency)</p>
        </div>
      </Section>

      {/* Charcot vs OM */}
      <Section title="Charcot vs OM Differential">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left p-2 text-gray-500 dark:text-gray-400 font-medium">Feature</th>
                <th className="text-left p-2 text-purple-600 dark:text-purple-400 font-medium">Charcot</th>
                <th className="text-left p-2 text-red-600 dark:text-red-400 font-medium">OM</th>
              </tr>
            </thead>
            <tbody>
              {CHARCOT_VS_OM.map(row => (
                <tr key={row.feature} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-2 text-gray-700 dark:text-gray-300 font-medium">{row.feature}</td>
                  <td className="p-2 text-gray-600 dark:text-gray-400">{row.charcot}</td>
                  <td className="p-2 text-gray-600 dark:text-gray-400">{row.om}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Deprecated Terms */}
      <Section title="SSR Terminology Guide">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left p-2 text-red-500 font-medium">Avoid</th>
                <th className="text-left p-2 text-emerald-600 dark:text-emerald-400 font-medium">Use Instead</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DEPRECATED_TERMS).map(([avoid, use]) => (
                <tr key={avoid} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-2 text-gray-500 dark:text-gray-400 line-through">{avoid}</td>
                  <td className="p-2 text-gray-700 dark:text-gray-300">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* DWI */}
      <Section title="DWI in MSK Infection">
        <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Abscess:</strong> High DWI signal, low ADC = restricted diffusion. 
          Increases confidence in abscess vs. phlegmon differentiation. Optional but recommended.
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          No statistically significant incremental sensitivity/PPV/NPV over conventional MRI (p = .70, .40, .80), 
          but DWI increases confidence in abscess identification.
        </p>
      </Section>
    </div>
  );
}