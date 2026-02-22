import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Shield, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const CALCULATORS = [
  { name: "ST-RADS", fullName: "Soft Tissue", page: "Calculator" },
  { name: "TI-RADS", fullName: "Thyroid", page: "TIRADSCalculator" },
  { name: "LI-RADS", fullName: "Liver", page: "LIRADSCalculator" },
  { name: "BI-RADS", fullName: "Breast", page: "BIRADSCalculator" },
  { name: "Lung-RADS", fullName: "Lung", page: "LungRADSCalculator" },
  { name: "PI-RADS", fullName: "Prostate", page: "PIRADSCalculator" },
  { name: "O-RADS", fullName: "Ovarian", page: "ORADSCalculator" },
  { name: "MSKI-RADS", fullName: "MSK Infection", page: "MSKIRADSCalculator" },
  { name: "Bone-RADS", fullName: "Bone Tumor", page: "BoneRADSCalculator" },
];

const STEPS = [
  { num: "1", title: "Select findings", desc: "Answer guided questions from imaging features" },
  { num: "2", title: "Get classification", desc: "Deterministic scoring per official ACR guidelines" },
  { num: "3", title: "Copy report", desc: "One-click structured report for your workflow" },
];

const PAPERS = [
  { title: "Soft Tissue-RADS: An ACR Work-in-Progress Framework", authors: "Chhabra et al.", journal: "AJR 2025", url: "https://www.ajronline.org/doi/10.2214/AJR.25.34013" },
  { title: "MRI Findings for Differentiating Soft Tissue Tumors", authors: "Wahid et al.", journal: "Skeletal Radiol 2026", url: "https://link.springer.com/article/10.1007/s00256-026-05155-w" },
  { title: "ACR TI-RADS White Paper", authors: "Tessler et al.", journal: "JACR 2017", url: "https://doi.org/10.1016/j.jacr.2017.01.046" },
  { title: "ACR LI-RADS v2018 Core", authors: "ACR", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS" },
  { title: "ACR BI-RADS® Atlas, 5th Edition", authors: "ACR", journal: "2013", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Bi-Rads" },
  { title: "ACR Lung-RADS® v2022", authors: "ACR", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Lung-RADS" },
  { title: "PI-RADS® v2.1", authors: "ACR–ESUR", journal: "2019", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/PI-RADS" },
  { title: "ACR O-RADS™ US v2022 & MRI", authors: "ACR", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/O-RADS" },
  { title: "MSKI-RADS for Extremity Infection", authors: "Chhabra et al.", journal: "Radiology 2024", url: "https://doi.org/10.1148/radiol.232914" },
  { title: "SSR White Paper: MSK Infection Terminology", authors: "Alaia et al.", journal: "Skeletal Radiol 2021", url: "https://doi.org/10.1007/s00256-021-03898-y" },
  { title: "Bone-RADS: Bone Tumor Risk Stratification Consensus Guideline", authors: "Caracciolo et al.", journal: "JACR 2023", url: "https://doi.org/10.1016/j.jacr.2023.07.017" },
];

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
    };
    checkUser();
  }, []);

  return (
    <div className="py-6 md:py-10">

      {/* ── Hero ── */}
      <section className="text-center max-w-3xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            9 RADS systems available
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.1] text-gray-900 dark:text-white">
            The RADS Calculator
          </h1>

          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Evidence-based radiology risk stratification.
            <br className="hidden sm:block" />
            Step-by-step wizards. Deterministic scoring. Structured reports.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 text-[12px] text-gray-400 dark:text-gray-500 font-medium">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> No patient data stored</span>
            <span className="text-gray-200 dark:text-gray-800">·</span>
            <span>Rule-based</span>
            <span className="text-gray-200 dark:text-gray-800">·</span>
            <span>Fully deterministic</span>
          </div>
        </motion.div>
      </section>

      {/* ── Calculator Grid ── */}
      <section className="max-w-3xl mx-auto px-4 mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {CALCULATORS.map((calc, i) => (
            <motion.div
              key={calc.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
            >
              <Link to={createPageUrl(calc.page)} className="group block bg-white dark:bg-black px-5 py-5 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors duration-150 h-full">
                <div className="flex flex-col justify-between h-full min-h-[80px]">
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mb-1">{calc.fullName}</p>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">{calc.name}</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150 mt-3 self-end" />
                </div>
              </Link>
            </motion.div>
          ))}
          {/* Fill remaining cell for even grid */}
          <div className="bg-white dark:bg-black hidden lg:block" />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-3xl mx-auto px-4 mb-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-6 text-center">How it works</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className="space-y-3"
            >
              <span className="mono text-[11px] font-medium text-gray-300 dark:text-gray-600">0{step.num}</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Institutional CTA ── */}
      <section className="max-w-3xl mx-auto px-4 mb-14">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">For Teams</p>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Need access for your department?</h3>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">Institutional plans for programs, departments, and health systems.</p>
          </div>
          <Link to={createPageUrl("InstitutionalPlan")}>
            <Button variant="outline" className="shrink-0 h-9 px-5 rounded-lg text-[13px] font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 gap-2 shadow-none">
              Learn More
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Research ── */}
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-6 text-center flex items-center justify-center gap-2">
          <BookOpen className="w-3.5 h-3.5" /> References
        </p>
        <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-900">
          {PAPERS.map((paper, i) => (
            <a key={i} href={paper.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 py-3 text-[12px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="leading-relaxed">
                {paper.title} <span className="text-gray-400 dark:text-gray-500">— {paper.authors}</span> {paper.journal && <span className="text-gray-300 dark:text-gray-600">{paper.journal}</span>}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}