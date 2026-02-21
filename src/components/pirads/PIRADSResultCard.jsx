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
    <Card className={`border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none ${isIndex ? "ring-1 ring-gray-400 dark:ring-gray-600" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">{cat.label}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">PI-RADS {cat.label}</h3>
              {isIndex && <Badge className="bg-gray-900 dark:bg-white text-white dark:text-black text-[9px]">INDEX</Badge>}
            </div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">{cat.name} · PPV {cat.ppv}</p>
          </div>
        </div>

        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">{cat.description}</p>
        <div className="mt-2 bg-gray-50 dark:bg-gray-950 rounded-lg p-2.5 border border-gray-100 dark:border-gray-900">
          <p className="text-[11px] text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Management:</strong> {cat.management}</p>
        </div>

        {result.notes.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {result.notes.map((n, i) => (
              <p key={i} className="text-[10px] text-gray-400 dark:text-gray-500 italic">• {n}</p>
            ))}
          </div>
        )}

        {lesion && (
          <div className="mt-3 grid grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
            {[
              { label: "T2W", val: lesion.t2w },
              { label: "DWI", val: lesion.dwi },
              { label: "DCE", val: lesion.dce },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-black p-2 text-center">
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{s.label}</p>
                <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{s.val}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}