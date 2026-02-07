import React from "react";
import { ExternalLink, FileText, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REFERENCES = [
  {
    title: "ACR Soft Tissue-RADS (ST-RADS): A Framework for Risk Stratification of Soft-Tissue Tumors",
    authors: "Fields BKK, Demirjian NL, Cen SY, et al.",
    journal: "Journal of the American College of Radiology",
    year: 2025,
    type: "Primary Guideline",
    url: "https://doi.org/10.1016/j.jacr.2024.08.023",
    description: "The foundational publication defining the ACR ST-RADS classification system for MRI-based risk stratification of soft-tissue tumors."
  },
  {
    title: "Soft-Tissue Masses: Systematic Imaging Approach and Differential Diagnosis",
    authors: "Walker EA, Petscavage JM, Brian PL, et al.",
    journal: "RadioGraphics",
    year: 2017,
    type: "Review Article",
    url: "https://doi.org/10.1148/rg.2017160084",
    description: "Comprehensive review of the systematic approach to imaging soft-tissue masses, including MRI characterization and differential diagnosis strategies."
  },
  {
    title: "WHO Classification of Tumours of Soft Tissue and Bone (5th Edition)",
    authors: "WHO Classification of Tumours Editorial Board",
    journal: "IARC Press",
    year: 2020,
    type: "Reference Textbook",
    url: "https://publications.iarc.fr/588",
    description: "The gold standard classification for soft-tissue tumors, providing histologic criteria and prognostic information for all tumor types."
  },
  {
    title: "The Role of DWI and ADC in Characterization of Soft-Tissue Tumors",
    authors: "Robba T, Chianca V, Albano D, et al.",
    journal: "European Journal of Radiology",
    year: 2021,
    type: "Research Article",
    url: "https://doi.org/10.1016/j.ejrad.2021.109709",
    description: "Explores the diagnostic utility of diffusion-weighted imaging and ADC values in differentiating benign from malignant soft-tissue masses."
  },
  {
    title: "Lipomatous Soft-Tissue Tumors: Imaging Appearance and Differential Diagnosis",
    authors: "Brisson M, Kashima T, Delaney D, et al.",
    journal: "Skeletal Radiology",
    year: 2013,
    type: "Review Article",
    url: "https://doi.org/10.1007/s00256-012-1465-0",
    description: "Detailed overview of imaging features that differentiate simple lipomas from atypical lipomatous tumors and liposarcomas."
  },
  {
    title: "ACR Appropriateness Criteria: Soft-Tissue Masses",
    authors: "American College of Radiology",
    journal: "ACR Appropriateness Criteria",
    year: 2023,
    type: "Clinical Guideline",
    url: "https://acsearch.acr.org/docs/69434/Narrative/",
    description: "ACR evidence-based guidelines on the appropriate use of imaging modalities for evaluating soft-tissue masses."
  },
];

const typeColors = {
  "Primary Guideline": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  "Review Article": "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  "Reference Textbook": "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  "Research Article": "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  "Clinical Guideline": "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
};

export default function LiteratureReferences() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-purple-500" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Key Literature & Guidelines</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Essential references supporting the ST-RADS framework and soft-tissue tumor imaging.</p>

      <div className="space-y-3">
        {REFERENCES.map((ref, i) => (
          <a
            key={i}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`text-[10px] border-0 ${typeColors[ref.type] || "bg-slate-100 text-slate-600"}`}>
                    {ref.type}
                  </Badge>
                  <span className="text-[11px] text-slate-400">{ref.year}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ref.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{ref.authors}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">{ref.journal}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{ref.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}