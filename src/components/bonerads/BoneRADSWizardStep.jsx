import React from "react";
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
        <div className="flex-1">
          <span className={`text-[13px] font-medium leading-snug ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
            {option.label}
          </span>
          {option.points !== undefined && (
            <span className={`ml-2 text-[11px] font-semibold ${isSelected ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
              ({option.points} pt{option.points !== 1 ? "s" : ""})
            </span>
          )}
          {option.desc && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{option.desc}</p>}
          {option.examples && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 italic">e.g. {option.examples}</p>}
          {option.note && <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">{option.note}</p>}
        </div>
      </div>
    </button>
  );
}

function TextInput({ question, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{question.label}</label>
      <input
        type={question.inputType || "text"}
        placeholder={question.placeholder || ""}
        value={value || ""}
        onChange={(e) => onChange(question.id, e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-[13px] text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-white focus:outline-none transition-colors min-h-[44px]"
        style={{ fontSize: "16px" }}
      />
    </div>
  );
}

export default function BoneRADSWizardStep({ step, values, onChange }) {
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
          {q.type !== "text" && q.type !== "number" && (
            <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{q.label}</label>
          )}
          {q.type === "radio" && (
            <div className="space-y-1.5">
              {q.options.map(opt => (
                <RadioOption key={opt.value} option={opt} selected={values[q.id]} onSelect={(v) => onChange(q.id, v)} />
              ))}
            </div>
          )}
          {(q.type === "text" || q.type === "number") && (
            <TextInput question={q} value={values[q.id]} onChange={onChange} />
          )}
        </div>
      ))}
    </div>
  );
}