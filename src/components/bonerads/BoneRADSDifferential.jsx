import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getDifferentials, LOCATION_PEARLS } from "./boneRadsRuleEngine";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

const DENSITY_OPTIONS = [
  { value: "lytic", label: "Lytic (osteolytic)" },
  { value: "sclerotic", label: "Sclerotic (osteoblastic)" },
  { value: "mixed", label: "Mixed lytic and sclerotic" },
];

const MATRIX_OPTIONS = [
  { value: "none", label: "No mineralized matrix (purely lytic)" },
  { value: "osteoid", label: "Osteoid matrix (amorphous, cloudlike, fluffy)" },
  { value: "chondroid", label: 'Chondroid matrix ("rings and arcs," flocculent)' },
  { value: "ground_glass", label: "Ground glass density (fibrous dysplasia)" },
  { value: "trabeculae", label: "Coarse trabeculae (hemangioma)" },
];

const LONGITUDINAL_OPTIONS = [
  { value: "epiphyseal", label: "Epiphyseal" },
  { value: "metaphyseal", label: "Metaphyseal" },
  { value: "diaphyseal", label: "Diaphyseal" },
  { value: "epi_meta", label: "Epiphyseal-metaphyseal" },
  { value: "meta_dia", label: "Meta-diaphyseal" },
];

const TRANSVERSE_OPTIONS = [
  { value: "central", label: "Central (intramedullary)" },
  { value: "eccentric", label: "Eccentric (intramedullary)" },
  { value: "cortical", label: "Cortical / intracortical" },
  { value: "surface", label: "Surface / juxtacortical" },
  { value: "parosteal", label: "Parosteal" },
];

function SmallRadio({ options, value, onChange, label }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all min-h-[36px] ${
              value === opt.value
                ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-black"
                : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BoneRADSDifferential({ data, onChange }) {
  const [showPearls, setShowPearls] = useState(false);
  const differentials = getDifferentials(data);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-1">Differential Diagnosis Guide</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">These features do NOT affect the Bone-RADS score — they help construct a differential.</p>
      </div>

      <div className="space-y-3">
        <SmallRadio options={DENSITY_OPTIONS} value={data.density} onChange={(v) => onChange("density", v)} label="Radiographic Density" />
        <SmallRadio options={MATRIX_OPTIONS} value={data.matrix} onChange={(v) => onChange("matrix", v)} label="Matrix Mineralization" />
        <SmallRadio options={LONGITUDINAL_OPTIONS} value={data.longitudinal} onChange={(v) => onChange("longitudinal", v)} label="Longitudinal Position" />
        <SmallRadio options={TRANSVERSE_OPTIONS} value={data.transverse} onChange={(v) => onChange("transverse", v)} label="Transverse Position" />

        <div>
          <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300">Specific Bone</label>
          <input
            type="text"
            placeholder="e.g. Distal femur"
            value={data.specific_bone || ""}
            onChange={(e) => onChange("specific_bone", e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-[13px] focus:border-gray-900 dark:focus:border-white focus:outline-none"
            style={{ fontSize: "16px" }}
          />
        </div>
      </div>

      {/* Differential results */}
      {differentials.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-4 space-y-2">
            <p className="text-[12px] font-semibold text-gray-900 dark:text-white">Suggested Differentials</p>
            {differentials.map((d, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900">
                <div className="flex flex-wrap gap-1.5">
                  {d.entities.map(e => (
                    <span key={e} className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Location pearls */}
      <button
        onClick={() => setShowPearls(!showPearls)}
        className="flex items-center gap-2 text-[12px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        Location Teaching Pearls
        {showPearls ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {showPearls && (
        <ul className="space-y-1 pl-4">
          {LOCATION_PEARLS.map((p, i) => (
            <li key={i} className="text-[11px] text-gray-500 dark:text-gray-400 flex items-start gap-2">
              <span className="text-gray-300 dark:text-gray-600 mt-0.5">•</span>{p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}