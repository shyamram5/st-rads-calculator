import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Info } from "lucide-react";
import { motion } from "framer-motion";

const colorMap = {
  gray: { bg: "bg-gray-100 dark:bg-gray-900", border: "border-gray-300 dark:border-gray-700", text: "text-gray-800 dark:text-gray-200", badge: "bg-gray-200 text-gray-700" },
  green: { bg: "bg-green-50 dark:bg-green-950/40", border: "border-green-300 dark:border-green-700", text: "text-green-800 dark:text-green-200", badge: "bg-green-100 text-green-800" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-800 dark:text-emerald-200", badge: "bg-emerald-100 text-emerald-800" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/40", border: "border-yellow-300 dark:border-yellow-700", text: "text-yellow-800 dark:text-yellow-200", badge: "bg-yellow-100 text-yellow-800" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-400 dark:border-orange-700", text: "text-orange-800 dark:text-orange-200", badge: "bg-orange-100 text-orange-800" },
  red: { bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-400 dark:border-red-700", text: "text-red-800 dark:text-red-200", badge: "bg-red-100 text-red-800" },
};

export default function AlgorithmNode({ node, onSelect }) {
  // Terminal node (result)
  if (node.terminal) {
    const colors = colorMap[node.color] || colorMap.gray;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`border-2 ${colors.border} ${colors.bg} shadow-lg`}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ring-4 ${colors.border} ${colors.bg}`}>
                <span className={`font-bold text-2xl ${colors.text}`}>{node.score}</span>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${colors.text}`}>{node.label}</h2>
                <Badge className={`${colors.badge} border-0`}>Risk: {node.risk}</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Classification</h3>
              <p className="text-sm text-slate-800 dark:text-slate-200">{node.meaning}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">Management</h3>
              <p className="text-sm text-blue-900 dark:text-blue-200">{node.management}</p>
            </div>

            {node.differentials?.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Differential Diagnoses</h3>
                <div className="flex flex-wrap gap-1.5">
                  {node.differentials.map((d, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Decision node
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 shadow-md">
        <CardContent className="p-5 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {node.figure && (
              <Badge variant="outline" className="text-xs font-mono bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                {node.figure}
              </Badge>
            )}
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{node.title}</h2>
          </div>
          {node.subtitle && (
            <div className="flex items-start gap-2 mt-1 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md border border-amber-200 dark:border-amber-800">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">{node.subtitle}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pl-4 border-l-2 border-blue-300 dark:border-blue-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{node.question}</p>
        <div className="space-y-2">
          {node.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onSelect(choice.next)}
              className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all group min-h-[52px] shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-1">
                {choice.label}
              </span>
              {choice.badge && (
                <Badge variant="outline" className="text-[10px] font-mono flex-shrink-0 bg-slate-50 dark:bg-slate-900">
                  {choice.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}