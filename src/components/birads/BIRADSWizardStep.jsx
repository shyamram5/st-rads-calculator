import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

function RadioOption({ option, selected, onSelect }) {
  const isSelected = selected === option.value;
  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500/30"
          : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-600"
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>
            {option.label}
          </span>
          {option.tip && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{option.tip}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function CheckboxOption({ option, checked, onToggle }) {
  return (
    <button
      onClick={() => onToggle(option.value)}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
        checked
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500/30"
          : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          checked ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-600"
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${checked ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>
            {option.label}
          </span>
          {option.tip && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{option.tip}</p>
          )}
        </div>
      </div>
    </button>
  );
}

export default function BIRADSWizardStep({ title, description, tip, type, options, value, onChange, infoBox }) {
  const handleCheckboxToggle = (val) => {
    const current = Array.isArray(value) ? value : [];
    // "None" logic
    if (val === "none") {
      onChange(current.includes("none") ? [] : ["none"]);
      return;
    }
    const withoutNone = current.filter(v => v !== "none");
    if (withoutNone.includes(val)) {
      onChange(withoutNone.filter(v => v !== val));
    } else {
      onChange([...withoutNone, val]);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>

        {tip && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{tip}</p>
          </div>
        )}

        {infoBox && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{infoBox}</p>
          </div>
        )}

        <div className="space-y-2">
          {type === "radio" && options.map(opt => (
            <RadioOption key={opt.value} option={opt} selected={value} onSelect={onChange} />
          ))}
          {type === "checkbox" && options.map(opt => (
            <CheckboxOption
              key={opt.value}
              option={opt}
              checked={Array.isArray(value) && value.includes(opt.value)}
              onToggle={handleCheckboxToggle}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}