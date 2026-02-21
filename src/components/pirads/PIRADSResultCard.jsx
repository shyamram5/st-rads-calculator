import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { CATEGORIES } from "./piradsRuleEngine";

export default function PIRADSResultCard({ result, lesion, lesionIndex, isIndex }) {
  if (!result || !result.category) return null;
  const cat = CATEGORIES[result.category];
  if (!cat) return null;

  return (
    <Card className={`border-2 ${cat.borderColor} ${cat.bgColor} shadow-lg overflow-hidden ${isIndex ? "ring-2 ring-violet-400/60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-white font-black text-base ${cat.color}`}>
            {cat.label}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">PI-RADS {cat.label}</h3>
              {isIndex && <Badge className="bg-violet-500 text-white text-[9px]">INDEX</Badge>}
            </div>
            <p className={`text-xs font-semibold ${cat.textColor}`}>{cat.name} · PPV {cat.ppv}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{cat.description}</p>
        <p className="text-[11px] text-slate-500 mt-1"><strong>Management:</strong> {cat.management}</p>

        {result.notes.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {result.notes.map((n, i) => (
              <p key={i} className="text-[10px] text-slate-500 italic">• {n}</p>
            ))}
          </div>
        )}

        {lesion && (
          <div className="mt-2 text-[10px] text-slate-400 grid grid-cols-3 gap-1">
            <span>T2W: <strong>{lesion.t2w}</strong></span>
            <span>DWI: <strong>{lesion.dwi}</strong></span>
            <span>DCE: <strong>{lesion.dce}</strong></span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}