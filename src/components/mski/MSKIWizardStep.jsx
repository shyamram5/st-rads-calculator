import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

function RadioOption({ option, selected, onSelect }) {
  const isSelected = selected === option.value;
  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 min-h-[48px] ${
        isSelected
          ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-900/20 dark:ring-white/20"
          : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-black"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          isSelected ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white" : "border-gray-300 dark:border-gray-600"
        }`}>
          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />}
        </div>
        <div>
          <span className={`text-[13px] font-medium leading-snug ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
            {option.label}
          </span>
          {option.tip && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{option.tip}</p>}
        </div>
      </div>
    </button>
  );
}

function CheckboxOption({ option, checked, onToggle }) {
  return (
    <button
      onClick={() => onToggle(option.value)}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 min-h-[48px] ${
        checked
          ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-900/20 dark:ring-white/20"
          : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-black"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-4 h-4 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          checked ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white" : "border-gray-300 dark:border-gray-600"
        }`}>
          {checked && (
            <svg className="w-2.5 h-2.5 text-white dark:text-black" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div>
          <span className={`text-[13px] font-medium leading-snug ${checked ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
            {option.label}
          </span>
          {option.tip && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{option.tip}</p>}
        </div>
      </div>
    </button>
  );
}

export default function MSKIWizardStep({ step, values, onChange }) {
  const handleCheckboxToggle = (questionId, val) => {
    const current = values[questionId] || [];
    // Handle "none" as exclusive option
    if (val === "none") {
      onChange(questionId, ["none"]);
      return;
    }
    const withoutNone = current.filter(v => v !== "none");
    if (withoutNone.includes(val)) {
      onChange(questionId, withoutNone.filter(v => v !== val));
    } else {
      onChange(questionId, [...withoutNone, val]);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h2>
        {step.description && <p className="text-[13px] text-gray-500 dark:text-gray-400">{step.description}</p>}
      </div>

      {step.tip && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{step.tip}</p>
        </div>
      )}

      {step.questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{q.label}</label>
          <div className="space-y-1.5">
            {q.type === "radio" && q.options.map(opt => (
              <RadioOption key={opt.value} option={opt} selected={values[q.id]} onSelect={(v) => onChange(q.id, v)} />
            ))}
            {q.type === "checkbox" && q.options.map(opt => (
              <CheckboxOption
                key={opt.value}
                option={opt}
                checked={(values[q.id] || []).includes(opt.value)}
                onToggle={(v) => handleCheckboxToggle(q.id, v)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}