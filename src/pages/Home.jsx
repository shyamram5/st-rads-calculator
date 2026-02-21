import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles, Activity, FileText, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const CALCULATORS = [
  {
    name: "ST-RADS",
    fullName: "Soft Tissue RADS",
    page: "Calculator",
  },
  {
    name: "TI-RADS",
    fullName: "Thyroid Imaging RADS",
    page: "TIRADSCalculator",
  },
  {
    name: "LI-RADS",
    fullName: "Liver Imaging RADS",
    page: "LIRADSCalculator",
  },
  {
    name: "BI-RADS",
    fullName: "Breast Imaging RADS",
    page: "BIRADSCalculator",
  },
  {
    name: "Lung-RADS",
    fullName: "Lung Cancer Screening",
    page: "LungRADSCalculator",
  },
  {
    name: "PI-RADS",
    fullName: "Prostate Imaging RADS",
    page: "PIRADSCalculator",
  },
  {
    name: "O-RADS",
    fullName: "Ovarian-Adnexal RADS",
    page: "ORADSCalculator",
  },
];

const COMING_SOON = [];

const HOW_IT_WORKS = [
  { icon: Activity, title: "Select Features", desc: "Answer guided questions based on imaging findings", step: "01" },
  { icon: Sparkles, title: "Get Classification", desc: "Instant deterministic scoring per official guidelines", step: "02" },
  { icon: FileText, title: "Copy Report", desc: "One-click structured report for your workflow", step: "03" },
];

const PAPERS = [
  { title: "Soft Tissue-RADS: An ACR Work-in-Progress Framework…", authors: "Chhabra, Garner, Rehman et al.", journal: "AJR 2025", url: "https://www.ajronline.org/doi/10.2214/AJR.25.34013" },
  { title: "MRI Findings for Differentiating Benign & Malignant Soft Tissue Tumors…", authors: "Wahid, Sharma, Rehman et al.", journal: "Skeletal Radiol 2026", url: "https://link.springer.com/article/10.1007/s00256-026-05155-w" },
  { title: "ACR TI-RADS White Paper", authors: "Tessler, Middleton, Grant et al.", journal: "JACR 2017", url: "https://doi.org/10.1016/j.jacr.2017.01.046" },
  { title: "ACR LI-RADS v2018 Core", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS" },
  { title: "ACR BI-RADS® Atlas, 5th Edition (2013)", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Bi-Rads" },
  { title: "ACR Lung-RADS® v2022", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Lung-RADS" },
  { title: "PI-RADS® v2.1 (2019)", authors: "ACR–ESUR–AdMeTech Foundation", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/PI-RADS" },
  { title: "ACR O-RADS™ US v2022 & O-RADS™ MRI", authors: "American College of Radiology", journal: "", url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/O-RADS" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
    };
    checkUser();
  }, []);

  return (
    <div className="space-y-16 py-8 md:py-16">

      {/* ── Hero ── */}
      <motion.section
        initial="hidden" animate="visible"
        className="text-center space-y-8 max-w-3xl mx-auto px-4"
      >
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold tracking-wide uppercase border border-indigo-100 dark:border-indigo-900/50">
            7 RADS Systems
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
          The RADS Calculator
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
          Evidence-based radiology risk stratification — step-by-step wizards, deterministic scoring, and structured reports.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> No patient data stored</span>
          <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
          <span>Rule-based</span>
          <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
          <span>Fully deterministic</span>
        </motion.div>
      </motion.section>

      {/* ── Calculator Cards ── */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CALCULATORS.map((calc, i) => (
            <motion.div
              key={calc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: "easeOut" }}
            >
              <Link to={createPageUrl(calc.page)} className="block group">
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 px-5 py-5 transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:-translate-y-0.5 cursor-pointer">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">{calc.fullName}</span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{calc.name}</h3>
                  </div>
                  <ChevronRight className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-all group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coming Soon - hidden when empty */}
      {COMING_SOON.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 -mt-8">
          {COMING_SOON.map((name) => (
            <span key={name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-xs font-medium border border-slate-200/60 dark:border-slate-700/40">
              {name}
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase">Soon</span>
            </span>
          ))}
        </div>
      )}

      {/* ── How It Works ── */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/70 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/30"
            >
              <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 tracking-widest">{step.step}</span>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400">
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Institutional CTA ── */}
      <section className="max-w-2xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">For Teams</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Need access for your department?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Institutional plans for residency programs, departments, and healthcare systems.
          </p>
          <Link to={createPageUrl("InstitutionalPlan")}>
            <Button className="rounded-full text-sm font-semibold gap-2 mt-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
              Learn More
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Foundational Research ── */}
      <section className="max-w-2xl mx-auto px-4">
        <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6 flex items-center justify-center gap-2">
          <BookOpen className="w-3.5 h-3.5" /> Foundational Research
        </h2>
        <div className="space-y-2">
          {PAPERS.map((paper, i) => (
            <a key={i} href={paper.url} target="_blank" rel="noopener noreferrer"
              className="block text-center text-[11px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-relaxed">
              {paper.title} — <span className="font-medium text-slate-500 dark:text-slate-400">{paper.authors}</span> {paper.journal && <span className="text-slate-300 dark:text-slate-600">· {paper.journal}</span>}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}