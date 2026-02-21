import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const colorMap = {
  green: { ring: "ring-green-400", text: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-950/50" },
  emerald: { ring: "ring-emerald-400", text: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
  yellow: { ring: "ring-yellow-400", text: "text-yellow-700 dark:text-yellow-300", bg: "bg-yellow-100 dark:bg-yellow-950/50" },
  orange: { ring: "ring-orange-500", text: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-950/50" },
  red: { ring: "ring-red-500", text: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-950/50" },
};

export default function TIRADSCategoryCard({ category, totalPoints }) {
  const colors = colorMap[category.color] || colorMap.green;

  return (
    <Card className="glass-panel shadow-xl border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ring-4 ${colors.ring} ${colors.bg} shadow-inner`}>
              <span className={`font-bold text-2xl ${colors.text}`}>{totalPoints}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">points</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-xl font-bold ${colors.text}`}>{category.score}</h3>
              <Badge className={`${colors.bg} ${colors.text} border-0`}>{category.label}</Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{category.meaning}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">Risk: {category.risk}</Badge>
              <Badge variant="outline">{category.fna}</Badge>
              <Badge variant="outline">{category.followUp}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}