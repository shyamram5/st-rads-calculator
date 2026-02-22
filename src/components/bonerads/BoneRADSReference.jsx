import React, { useState } from "react";
import {
  MARGIN_GRADES, PERIOSTEAL_OPTIONS, NONAGGRESSIVE_PATTERNS, AGGRESSIVE_PATTERNS,
  ENDOSTEAL_OPTIONS, CATEGORIES, DO_NOT_TOUCH, LOCATION_PEARLS, KEY_STATS
} from "./boneRadsRuleEngine";

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
        <span className="text-[13px] font-semibold text-gray-900 dark:text-white">{title}</span>
        <span className="text-[11px] text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-900">{children}</div>}
    </div>
  );
}

export default function BoneRADSReference() {
  return (
    <div className="space-y-3">
      {/* Point Table */}
      <Section title="Point Value Table (Table 1)" defaultOpen>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Margination (Lodwick-Madewell)</p>
            {MARGIN_GRADES.map(m => (
              <div key={m.value} className="flex items-center justify-between py-1 text-[11px]">
                <span className="text-gray-600 dark:text-gray-400">{m.label} — {m.name}</span>
                <span className="font-bold text-gray-900 dark:text-white">{m.points} pt{m.points !== 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Other Features</p>
            {[
              { label: "Periosteal reaction — Nonaggressive", pts: 2 },
              { label: "Periosteal reaction — Aggressive", pts: 4 },
              { label: "Endosteal erosion — Grade 2 (1/3–2/3)", pts: 1 },
              { label: "Endosteal erosion — Grade 3 (> 2/3)", pts: 2 },
              { label: "Pathological fracture", pts: 2 },
              { label: "Extra-osseous soft tissue mass", pts: 4 },
              { label: "Known primary cancer history", pts: 2 },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-1 text-[11px]">
                <span className="text-gray-600 dark:text-gray-400">{f.label}</span>
                <span className="font-bold text-gray-900 dark:text-white">+{f.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Score-to-Management */}
      <Section title="Score → Management (Tables 2–3)">
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div key={key} className={`p-2.5 rounded-lg ${cat.color} border ${cat.borderColor}`}>
              <p className={`text-[12px] font-bold ${cat.textColor}`}>{cat.label}: {cat.name}</p>
              <p className={`text-[11px] ${cat.textColor} opacity-70 mt-0.5`}>
                {key === "0" ? "N/A" : key === "1" ? "1–2 pts" : key === "2" ? "3–4 pts" : key === "3" ? "5–6 pts" : "≥ 7 pts"}
              </p>
              <p className={`text-[11px] ${cat.textColor} opacity-80 mt-1 leading-relaxed`}>{cat.management}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Lodwick-Madewell */}
      <Section title="Lodwick-Madewell Margin Grades">
        <div className="space-y-2">
          {MARGIN_GRADES.map(m => (
            <div key={m.value} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900">
              <p className="text-[12px] font-semibold text-gray-900 dark:text-white">{m.label} — {m.name}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{m.desc}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 italic">Risk: {m.risk} · Examples: {m.examples}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Periosteal Reaction Atlas */}
      <Section title="Periosteal Reaction Patterns">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Nonaggressive (0–2 pts)</p>
          {NONAGGRESSIVE_PATTERNS.map(p => (
            <div key={p.value} className="text-[11px] text-gray-600 dark:text-gray-400 pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
              <span className="font-medium text-gray-900 dark:text-white">{p.label}</span> — {p.desc}
            </div>
          ))}
          <p className="text-[11px] font-semibold text-red-700 dark:text-red-400 mt-3 mb-1">Aggressive (4 pts)</p>
          {AGGRESSIVE_PATTERNS.map(p => (
            <div key={p.value} className="text-[11px] text-gray-600 dark:text-gray-400 pl-3 border-l-2 border-red-300 dark:border-red-700">
              <span className="font-medium text-gray-900 dark:text-white">{p.label}</span> — {p.desc}
            </div>
          ))}
        </div>
      </Section>

      {/* Do Not Touch */}
      <Section title='"Do Not Touch" Benign Lesions'>
        <div className="space-y-1.5">
          {DO_NOT_TOUCH.map(d => (
            <div key={d.name} className="text-[11px] text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">{d.name}:</span> {d.desc}
            </div>
          ))}
        </div>
      </Section>

      {/* Location Pearls */}
      <Section title="Location-Specific Teaching Pearls">
        <ul className="space-y-1">
          {LOCATION_PEARLS.map((p, i) => (
            <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-2">
              <span className="text-gray-300 dark:text-gray-600 mt-0.5">•</span>{p}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}