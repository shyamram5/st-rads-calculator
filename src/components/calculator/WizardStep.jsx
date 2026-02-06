import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function WizardStep({ title, description, questions, values, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        {description && <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">{description}</p>}
      </div>
      <div className="space-y-6">
        {questions.map((q) => (
          <Card key={q.id} className="border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-2 mb-3">
                <Label className="text-base font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {q.label}
                </Label>
                {q.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" /></TooltipTrigger>
                      <TooltipContent className="max-w-xs"><p className="text-xs">{q.tooltip}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {q.type === "radio" && (
                <RadioGroup value={values[q.id] || ""} onValueChange={(v) => onChange(q.id, v)}>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer min-h-[48px]">
                        <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                        <Label htmlFor={`${q.id}-${opt.value}`} className="cursor-pointer text-sm flex-1 text-slate-700 dark:text-slate-300">{opt.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {q.type === "checkbox" && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors min-h-[48px]">
                      <Checkbox
                        id={`${q.id}-${opt.value}`}
                        checked={(values[q.id] || []).includes(opt.value)}
                        onCheckedChange={(checked) => {
                          const current = values[q.id] || [];
                          const updated = checked ? [...current, opt.value] : current.filter(v => v !== opt.value);
                          onChange(q.id, updated);
                        }}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`${q.id}-${opt.value}`} className="cursor-pointer text-sm flex-1 text-slate-700 dark:text-slate-300">{opt.label}</Label>
                    </div>
                  ))}
                </div>
              )}

              {q.type === "number" && (
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder={q.placeholder || "Enter value"}
                    value={values[q.id] || ""}
                    onChange={(e) => onChange(q.id, e.target.value)}
                    className="max-w-xs bg-white dark:bg-slate-900 min-h-[44px]"
                  />
                  {q.unit && <span className="text-sm text-slate-500">{q.unit}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}