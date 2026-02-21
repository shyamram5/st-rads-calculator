import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TIRADSFeatureSelector({ title, tooltip, type, options, value, onChange }) {
  const isMulti = type === "checkbox";

  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Info className="w-4 h-4 text-slate-400" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p className="text-xs">{tooltip}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {isMulti ? "Choose all that apply" : "Choose 1"}
        </p>

        {!isMulti ? (
          <RadioGroup value={value || ""} onValueChange={onChange}>
            <div className="space-y-1">
              {options.map((opt) => (
                <div key={opt.value} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer min-h-[48px]">
                  <div className="flex items-center space-x-3 flex-1">
                    <RadioGroupItem value={opt.value} id={`${title}-${opt.value}`} />
                    <Label htmlFor={`${title}-${opt.value}`} className="cursor-pointer flex-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                      {opt.description && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</span>
                      )}
                    </Label>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                    ({opt.points} {opt.points === 1 ? "point" : "points"})
                  </span>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="space-y-1">
            {options.map((opt) => {
              const checked = (value || []).includes(opt.value);
              return (
                <div key={opt.value} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors min-h-[48px]">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      id={`${title}-${opt.value}`}
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const current = value || [];
                        let updated;
                        if (opt.value === "none") {
                          // "None" deselects everything else
                          updated = isChecked ? ["none"] : [];
                        } else {
                          // Selecting a specific foci deselects "none"
                          updated = isChecked
                            ? [...current.filter(v => v !== "none"), opt.value]
                            : current.filter(v => v !== opt.value);
                        }
                        onChange(updated);
                      }}
                      className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <Label htmlFor={`${title}-${opt.value}`} className="cursor-pointer flex-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                      {opt.description && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</span>
                      )}
                    </Label>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                    ({opt.points} {opt.points === 1 ? "point" : "points"})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}