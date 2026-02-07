import React, { useState } from "react";
import { BookOpen, Microscope, FileText } from "lucide-react";
import GlossaryPanel from "./GlossaryPanel";
import CategoryGuide from "./CategoryGuide";
import LiteratureReferences from "./LiteratureReferences";

const TABS = [
  { id: "glossary", label: "Glossary", icon: BookOpen },
  { id: "guide", label: "Categories", icon: Microscope },
  { id: "literature", label: "Literature", icon: FileText },
];

export default function EducationSidebar() {
  const [activeTab, setActiveTab] = useState("glossary");

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all min-h-[40px] ${
                isActive
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "glossary" && <GlossaryPanel />}
      {activeTab === "guide" && <CategoryGuide />}
      {activeTab === "literature" && <LiteratureReferences />}
    </div>
  );
}