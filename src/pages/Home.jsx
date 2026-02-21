import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, ExternalLink, Sparkles, Activity, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const CALCULATORS = [
  {
    name: "ST-RADS",
    fullName: "Soft Tissue RADS",
    desc: "MRI risk stratification for soft-tissue tumors via official ACR flowcharts",
    page: "Calculator",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    textAccent: "text-blue-600 dark:text-blue-400",
    borderAccent: "border-blue-100 dark:border-blue-900/50",
  },
  {
    name: "TI-RADS",
    fullName: "Thyroid Imaging RADS",
    desc: "Thyroid nodule malignancy risk assessment from ultrasound features",
    page: "TIRADSCalculator",
    bgAccent: "bg-amber-50 dark:bg-amber-950/30",
    textAccent: "text-amber-600 dark:text-amber-400",
    borderAccent: "border-amber-100 dark:border-amber-900/50",
  },
  {
    name: "LI-RADS",
    fullName: "Liver Imaging RADS",
    desc: "Liver observation scoring for patients at risk of HCC",
    page: "LIRADSCalculator",
    bgAccent: "bg-emerald-50 dark:bg-emerald-950/30",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-emerald-100 dark:border-emerald-900/50",
  },
  {
    name: "BI-RADS",
    fullName: "Breast Imaging RADS",
    desc: "Mammography & ultrasound assessment per ACR 5th Edition",
    page: "BIRADSCalculator",
    bgAccent: "bg-pink-50 dark:bg-pink-950/30",
    textAccent: "text-pink-600 dark:text-pink-400",
    borderAccent: "border-pink-100 dark:border-pink-900/50",
  },
  {
    name: "Lung-RADS",
    fullName: "Lung Cancer Screening",
    desc: "LDCT lung nodule classification per ACR Lung-RADS v2022",
    page: "LungRADSCalculator",
    bgAccent: "bg-slate-50 dark:bg-slate-800/30",
    textAccent: "text-slate-600 dark:text-slate-400",
    borderAccent: "border-slate-200 dark:border-slate-700/50",
  },
  {
    name: "PI-RADS",
    fullName: "Prostate Imaging RADS",
    desc: "Prostate mpMRI scoring per PI-RADS v2.1 (2019)",
    page: "PIRADSCalculator",
    bgAccent: "bg-violet-50 dark:bg-violet-950/30",
    textAccent: "text-violet-600 dark:text-violet-400",
    borderAccent: "border-violet-100 dark:border-violet-900/50",
  },
  {
    name: "O-RADS",
    fullName: "Ovarian-Adnexal RADS",
    desc: "Adnexal mass US v2022 + MRI risk stratification",
    page: "ORADSCalculator",
    bgAccent: "bg-rose-50 dark:bg-rose-950/30",
    textAccent: "text-rose-600 dark:text-rose-400",
    borderAccent: "border-rose-100 dark:border-rose-900/50",
  },
];

const COMING_SOON = [];

const HOW_IT_WORKS = [
  { icon: Activity, title: "Select Features", desc: "Answer guided questions based on imaging findings", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
  { icon: Sparkles, title: "Get Classification", desc: "Instant deterministic scoring per official guidelines", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { icon: FileText, title: "Copy Report", desc: "One-click structured report for your workflow", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
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
    <div className="space-y-14 py-6 md:py-12">

      {/* ── Hero ── */}
      <motion.section
        initial="hidden" animate="visible"
        className="text-center space-y-6 max-w-3xl mx-auto px-4"
      >
        <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-900/50">
          <Clock className="w-3 h-3" /> 7 RADS systems available
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
          The <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">RADS</span> Calculator
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Evidence-based radiology risk stratification tools — step-by-step wizards, deterministic scoring, and structured reports, all in one place.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
          <Shield className="w-3 h-3" />
          No patient data stored · Rule-based · Fully deterministic
        </motion.div>
      </motion.section>

      {/* ── Calculator Cards ── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto px-4">
        {CALCULATORS.map((calc, i) => (
          <motion.div
            key={calc.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: "easeOut" }}
          >
            <Link to={createPageUrl(calc.page)} className="block group">
              <div className={`relative overflow-hidden rounded-xl border ${calc.borderAccent} ${calc.bgAccent} px-4 py-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${calc.textAccent} leading-none`}>{calc.fullName}</span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{calc.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">{calc.desc}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${calc.textAccent}`}>
                    Open <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
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
        <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-6">How it works</h2>
        <div className="grid grid-cols-3 gap-3">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-white/50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-700/20"
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${step.bg} ${step.color}`}>
                <step.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Institutional CTA ── */}
      <section className="max-w-lg mx-auto text-center space-y-4 px-4">
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
          <Heart className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-semibold">Built by a Medical Student, for the Radiology Community</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Need access for your department or residency program?
        </p>
        <Link to={createPageUrl("InstitutionalPlan")}>
          <Button variant="outline" className="rounded-full text-sm font-semibold gap-2 mt-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ExternalLink className="w-3.5 h-3.5" />
            Institutional Plans Available
          </Button>
        </Link>
      </section>

      {/* ── Foundational Research ── */}
      <section className="max-w-2xl mx-auto px-4">
        <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Built from the foundational research</h2>
        <div className="space-y-1.5">
          {PAPERS.map((paper, i) => (
            <a key={i} href={paper.url} target="_blank" rel="noopener noreferrer"
              className="block text-center text-[11px] text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors leading-snug">
              {paper.title} — <span className="font-medium">{paper.authors}</span> {paper.journal}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}