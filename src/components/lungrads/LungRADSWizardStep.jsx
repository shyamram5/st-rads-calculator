import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

function RadioOption({ option, selected, onSelect }) {
  const isSelected = selected === option.value;
  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 ring-1 ring-teal-500/30"
          : "border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          isSelected ? "border-teal-500 bg-teal-500" : "border-slate-300 dark:border-slate-600"
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${isSelected ? "text-teal-700 dark:text-teal-300" : "text-slate-700 dark:text-slate-300"}`}>
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
      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
        checked
          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 ring-1 ring-teal-500/30"
          : "border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          checked ? "border-teal-500 bg-teal-500" : "border-slate-300 dark:border-slate-600"
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${checked ? "text-teal-700 dark:text-teal-300" : "text-slate-700 dark:text-slate-300"}`}>
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

export default function LungRADSWizardStep({ title, description, tip, warningTip, type, options, value, onChange, numberFields, onNumberChange, numberValues }) {
  const handleCheckboxToggle = (val) => {
    const current = Array.isArray(value) ? value : [];
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
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>

        {tip && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
            <Info className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">{tip}</p>
          </div>
        )}

        {warningTip && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{warningTip}</p>
          </div>
        )}

        {/* Number inputs */}
        {numberFields && numberFields.length > 0 && (
          <div className="space-y-3">
            {numberFields.map(field => (
              <div key={field.id}>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">{field.label}</label>
                {field.hint && <p className="text-[11px] text-slate-400 mb-1.5">{field.hint}</p>}
                <Input
                  type="number"
                  step={field.step || "0.1"}
                  min="0"
                  placeholder={field.placeholder || "Enter value"}
                  value={numberValues?.[field.id] ?? ""}
                  onChange={(e) => onNumberChange(field.id, e.target.value)}
                  className="max-w-[200px]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Radio / checkbox options */}
        {options && options.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
}