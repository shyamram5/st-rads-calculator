import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown } from "lucide-react";

export default function UsageTracker({ user, analysesUsed }) {
  const isPremium = user?.subscription_tier === "premium";
  const remainingFree = Math.max(0, 5 - analysesUsed);
  const usagePercentage = Math.min(100, analysesUsed / 5 * 100);

  if (isPremium) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="">Premium Account</span>
            </div>);

  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Free Trial Usage
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
                <Progress
          value={usagePercentage}
          className="h-2 [&>div]:bg-blue-500" />

                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                        {analysesUsed} of 5 analyses used
                    </span>
                    <Badge variant={remainingFree > 0 ? "outline" : "destructive"} className="rounded-full">
                        {remainingFree} remaining
                    </Badge>
                </div>
            </CardContent>
        </Card>);

}