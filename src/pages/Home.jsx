import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, ExternalLink, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const CALCULATORS = [
  { name: "ST-RADS", fullName: "Soft Tissue RADS", desc: "MRI risk stratification for soft-tissue tumors via ACR flowcharts", page: "Calculator" },
  { name: "TI-RADS", fullName: "Thyroid Imaging RADS", desc: "Thyroid nodule risk assessment from ultrasound features", page: "TIRADSCalculator" },
  { name: "LI-RADS", fullName: "Liver Imaging RADS", desc: "Liver observation scoring for patients at risk of HCC", page: "LIRADSCalculator" },
  { name: "BI-RADS", fullName: "Breast Imaging RADS", desc: "Mammography & ultrasound assessment per ACR 5th Edition", page: "BIRADSCalculator" },
  { name: "Lung-RADS", fullName: "Lung Cancer Screening RADS", desc: "LDCT lung nodule classification per ACR v2022", page: "LungRADSCalculator" },
  { name: "PI-RADS", fullName: "Prostate Imaging RADS", desc: "Prostate mpMRI scoring per PI-RADS v2.1", page: "PIRADSCalculator" },
  { name: "O-RADS", fullName: "Ovarian-Adnexal RADS", desc: "Adnexal mass US & MRI risk stratification", page: "ORADSCalculator" },
];

const PAPERS = [
  { title: "Soft Tissue-RADS: An ACR Work-in-Progress Framework", authors: "Chhabra, Garner, Rehman et al.", journal: "AJR 2025", url: "https://www.ajronline.org/doi/10.2214/AJR.25.34013" },
  { title: "MRI Findings for Differentiating Benign & Malignant Soft Tissue Tumors", authors: "Wahid, Sharma, Rehman et al.", journal: "Skeletal Radiol 2026", url: "https://link.springer.com/article/10.1007/s00256-026-05155-w" },
  { title: "ACR TI-RADS White Paper", authors: "Tessler, Middleton, Grant et al.", journal: "JACR 2017", url: "https://doi.org/10.1016/j.jacr.2017.01.046" },
  { title: "ACR LI-RADS v2018 Core", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS" },
  { title: "ACR BI-RADS® Atlas, 5th Edition (2013)", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Bi-Rads" },
  { title: "ACR Lung-RADS® v2022", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Lung-RADS" },
  { title: "PI-RADS® v2.1 (2019)", authors: "ACR–ESUR–AdMeTech Foundation", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/PI-RADS" },
  { title: "ACR O-RADS™ US v2022 & O-RADS™ MRI", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/O-RADS" },
];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
    };
    checkUser();
  }, []);

  return (
    <div className="space-y-0">

      {/* ── Hero ── */}
      <section className="py-12 md:py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto text-center px-4 space-y-5">
          <motion.h1 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            RADS Calculator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed"
          >
            Evidence-based radiology risk stratification — step-by-step scoring wizards with structured reports aligned to current ACR guidelines.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-500"
          >
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> No patient data stored</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Rule-based & deterministic</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>7 systems</span>
          </motion.div>
        </div>
      </section>

      {/* ── Calculator List ── */}
      <section className="py-10 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Reporting & Data Systems</h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/50">
            {CALCULATORS.map((calc, i) => (
              <motion.div
                key={calc.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
              >
                <Link to={createPageUrl(calc.page)} className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-16 sm:w-20 flex-shrink-0">
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{calc.name}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{calc.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional CTA ── */}
      <section className="py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Need access for your department or residency program?
          </p>
          <Link to={createPageUrl("InstitutionalPlan")}>
            <Button variant="outline" className="rounded-lg text-sm font-semibold gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <ExternalLink className="w-3.5 h-3.5" />
              Institutional Plans
            </Button>
          </Link>
        </div>
      </section>

      {/* ── References ── */}
      <section className="py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> References
          </h2>
          <ol className="space-y-2 list-decimal list-inside">
            {PAPERS.map((paper, i) => (
              <li key={i} className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {paper.title}
                </a>
                {paper.authors && <span className="text-slate-400 dark:text-slate-600"> — {paper.authors}</span>}
                {paper.journal && <span className="text-slate-400 dark:text-slate-600"> ({paper.journal})</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}