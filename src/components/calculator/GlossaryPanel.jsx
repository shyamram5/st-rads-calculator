import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GLOSSARY = [
  { term: "ST-RADS", definition: "Soft Tissue Reporting and Data System. An ACR-endorsed standardized framework for categorizing soft-tissue tumors found on MRI based on imaging features, assigning risk levels from 0 to 6.", category: "Framework" },
  { term: "ADC (Apparent Diffusion Coefficient)", definition: "A quantitative MRI parameter measured in × 10⁻³ mm²/s that reflects the degree of water molecule diffusion. Lower ADC values (< 1.0) can suggest higher cellularity and potential malignancy in soft-tissue masses.", category: "Imaging" },
  { term: "T1-Weighted Imaging", definition: "An MRI sequence where fat appears bright and water appears dark. Useful for identifying lipomatous components and hemorrhage in soft-tissue lesions.", category: "Imaging" },
  { term: "T2-Weighted Imaging", definition: "An MRI sequence where water/fluid appears bright. High T2 signal in a lesion can indicate cystic components, edema, or myxoid tissue.", category: "Imaging" },
  { term: "Lipomatous", definition: "A tissue type that is predominantly composed of fat. Lesions following fat signal on all MRI sequences without concerning features are typically classified as ST-RADS 2 (benign).", category: "Tissue Type" },
  { term: "Cyst-like", definition: "A lesion that demonstrates fluid signal characteristics on MRI, including high T2 and low T1 signal, with thin or no septations and no solid enhancing components.", category: "Tissue Type" },
  { term: "Indeterminate Solid", definition: "A soft-tissue mass that does not clearly fit lipomatous or cyst-like categories. These lesions require further characterization based on compartment, morphology, and enhancement patterns.", category: "Tissue Type" },
  { term: "Septations", definition: "Internal dividing walls within a lesion. Thin septations (< 2 mm) are generally benign features, while thick or nodular septations raise concern for malignancy.", category: "Morphology" },
  { term: "Enhancement", definition: "The degree to which a lesion takes up contrast material on post-gadolinium MRI sequences. Avid or heterogeneous enhancement may suggest more aggressive pathology.", category: "Imaging" },
  { term: "Phleboliths", definition: "Calcified thrombi within blood vessels, classically seen in venous malformations. Their presence is a reassuring finding that supports a benign vascular diagnosis.", category: "Morphology" },
  { term: "Target Sign", definition: "A characteristic MRI appearance of peripheral nerve sheath tumors, showing central low T2 signal surrounded by peripheral high T2 signal, resembling a bullseye.", category: "Morphology" },
  { term: "Ancillary Features", definition: "Additional imaging findings (e.g., perilesional edema, rapid growth, bone involvement) that may upgrade a lesion's ST-RADS category due to increased suspicion for malignancy.", category: "Framework" },
  { term: "Flow Voids", definition: "Signal-void tubular structures seen on MRI representing fast-flowing blood within a lesion, typically associated with high-flow vascular malformations.", category: "Imaging" },
  { term: "Compartment", definition: "The anatomic location of a soft-tissue mass (e.g., subcutaneous, intramuscular, intermuscular, intra-articular). Location influences the differential diagnosis and ST-RADS classification.", category: "Anatomy" },
  { term: "Hemosiderin", definition: "A breakdown product of hemoglobin that appears as low signal (dark) on T2-weighted and gradient echo MRI sequences, often seen in pigmented villonodular synovitis (PVNS).", category: "Imaging" },
  { term: "Blooming Artifact", definition: "An exaggerated area of signal loss on gradient echo (GRE) sequences caused by magnetic susceptibility effects from hemosiderin, calcium, or metal. Useful for confirming PVNS.", category: "Imaging" },
  { term: "DWI (Diffusion-Weighted Imaging)", definition: "An MRI technique that measures the random motion of water molecules. Restricted diffusion (bright on DWI, low ADC) may suggest high cellularity or malignancy.", category: "Imaging" },
  { term: "Myxoid", definition: "A type of tissue with abundant mucopolysaccharide ground substance, appearing very bright on T2-weighted images. Myxoid stroma can be seen in both benign and malignant soft-tissue tumors.", category: "Tissue Type" },
];

const CATEGORIES = ["All", "Framework", "Imaging", "Tissue Type", "Morphology", "Anatomy"];

export default function GlossaryPanel() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = GLOSSARY.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">ST-RADS Glossary</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[32px] ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <Accordion type="multiple" className="space-y-2">
        {filtered.map((item, i) => (
          <AccordionItem key={i} value={item.term} className="border border-slate-200 dark:border-slate-700 rounded-lg px-4 bg-white/50 dark:bg-slate-800/50">
            <AccordionTrigger className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:no-underline py-3">
              <div className="flex items-center gap-2 text-left">
                {item.term}
                <Badge variant="outline" className="text-[10px] font-normal">{item.category}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 pb-3 leading-relaxed">
              {item.definition}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-6">No matching terms found.</p>
      )}
    </div>
  );
}