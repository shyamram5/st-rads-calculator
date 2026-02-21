import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TIRADSCategoryCard({ category, totalPoints }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <span className="font-semibold text-2xl text-gray-900 dark:text-white">{totalPoints}</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">points</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{category.score}</h3>
              <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">{category.label}</Badge>
            </div>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-2">{category.meaning}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">Risk: {category.risk}</Badge>
              <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">{category.fna}</Badge>
              <Badge variant="outline" className="text-[11px] border-gray-200 dark:border-gray-800">{category.followUp}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}