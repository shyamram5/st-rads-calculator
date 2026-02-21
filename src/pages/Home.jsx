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
    gradient: "from-blue-600 to-indigo-600",
    hoverGradient: "hover:from-blue-700 hover:to-indigo-700",
    shadow: "shadow-blue-500/20",
    ring: "ring-blue-500/20",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    textAccent: "text-blue-600 dark:text-blue-400",
    borderAccent: "border-blue-100 dark:border-blue-900/50",
  },
  {
    name: "TI-RADS",
    fullName: "Thyroid Imaging RADS",
    desc: "Thyroid nodule malignancy risk assessment from ultrasound features",
    page: "TIRADSCalculator",
    gradient: "from-amber-500 to-orange-500",
    hoverGradient: "hover:from-amber-600 hover:to-orange-600",
    shadow: "shadow-amber-500/20",
    ring: "ring-amber-500/20",
    bgAccent: "bg-amber-50 dark:bg-amber-950/30",
    textAccent: "text-amber-600 dark:text-amber-400",
    borderAccent: "border-amber-100 dark:border-amber-900/50",
  },
  {
    name: "LI-RADS",
    fullName: "Liver Imaging RADS",
    desc: "Liver observation scoring for patients at risk of HCC",
    page: "LIRADSCalculator",
    gradient: "from-emerald-500 to-teal-500",
    hoverGradient: "hover:from-emerald-600 hover:to-teal-600",
    shadow: "shadow-emerald-500/20",
    ring: "ring-emerald-500/20",
    bgAccent: "bg-emerald-50 dark:bg-emerald-950/30",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-emerald-100 dark:border-emerald-900/50",
  },
  {
    name: "BI-RADS",
    fullName: "Breast Imaging RADS",
    desc: "Mammography & ultrasound assessment per ACR 5th Edition",
    page: "BIRADSCalculator",
    gradient: "from-pink-500 to-rose-500",
    hoverGradient: "hover:from-pink-600 hover:to-rose-600",
    shadow: "shadow-pink-500/20",
    ring: "ring-pink-500/20",
    bgAccent: "bg-pink-50 dark:bg-pink-950/30",
    textAccent: "text-pink-600 dark:text-pink-400",
    borderAccent: "border-pink-100 dark:border-pink-900/50",
  },
];

const COMING_SOON = ["Lung-RADS", "PI-RADS", "O-RADS"];

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
    <div className="space-y-20 py-8 md:py-16">

      {/* ── Hero ── */}
      <motion.section
        initial="hidden" animate="visible"
        className="text-center space-y-6 max-w-3xl mx-auto px-4"
      >
        <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-900/50">
          <Clock className="w-3 h-3" /> 4 RADS systems · 3 more coming soon
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
      <section className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto px-4">
        {CALCULATORS.map((calc, i) => (
          <motion.div
            key={calc.name}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: "easeOut" }}
          >
            <Link to={createPageUrl(calc.page)} className="block group">
              <div className={`relative overflow-hidden rounded-2xl border ${calc.borderAccent} ${calc.bgAccent} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${calc.textAccent}`}>{calc.fullName}</span>
                    <ArrowRight className={`w-4 h-4 ${calc.textAccent} opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300`} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{calc.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{calc.desc}</p>
                </div>
                <div className="mt-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${calc.textAccent} group-hover:underline`}>
                    Open Calculator <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* ── Coming Soon ── */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        {COMING_SOON.map((name) => (
          <span key={name} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-sm font-medium border border-slate-200/60 dark:border-slate-700/40">
            {name}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold">SOON</span>
          </span>
        ))}
      </div>

      {/* ── How It Works ── */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/60 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${step.bg} ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
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