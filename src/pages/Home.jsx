import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, Shield, FileSearch, Stethoscope, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";


const STRADS_SYSTEM = {
  id: "strads",
  label: "ST-RADS",
  fullName: "Soft Tissue RADS",
  tagline: "ACR ST-RADS v2025",
  description: "Evidence-based MRI risk stratification for soft-tissue tumors, guided step-by-step through the official flowcharts.",
  steps: [
    { icon: FileSearch, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", title: "Answer Questions", desc: "Step-by-step wizard following official flowcharts" },
    { icon: Stethoscope, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", title: "Get Classification", desc: "ST-RADS 0–6 with risk level & differentials" },
    { icon: ClipboardCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", title: "Copy Report", desc: "Structured report with one-click copy" },
  ],
};

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const current = STRADS_SYSTEM;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-16 space-y-16">
        
        {/* Hero Title */}
        <div className="text-center space-y-5 max-w-4xl mx-auto z-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                The <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">RADS</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
                Evidence-based radiology risk stratification tools — all in one place.
            </p>
        </div>

        {/* System Content */}
        <div className="w-full max-w-3xl mx-auto px-4">
            <div className="text-center space-y-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase">
                        {current.tagline}
                    </div>
                    <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        {current.description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to={createPageUrl("Calculator")}>
                        <Button size="lg" className="h-13 px-10 text-base rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.03] font-semibold">
                            Start ST-RADS Case <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    No patient data stored · Fully deterministic · Rule-based
                </div>

                {/* 3-Step Process */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto w-full pt-8">
                    {current.steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-2xl ${step.bg} blur-lg opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                                <div className={`relative w-16 h-16 flex items-center justify-center rounded-2xl ${step.bg} ${step.color} transition-transform duration-300 group-hover:scale-110`}>
                                    <step.icon className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{step.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Support Section */}
        <div className="max-w-lg mx-auto text-center space-y-4 px-4">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold">Built by a Medical Student, for the Radiology Community</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      100% free for all users. Sign up and get unlimited access to all features.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <a href="https://www.ajronline.org/doi/10.2214/AJR.25.34013" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                          <ExternalLink className="w-3.5 h-3.5" /> Chhabra et al., AJR 2025
                      </a>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
                      <a href="https://link.springer.com/article/10.1007/s00256-026-05155-w" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                          <ExternalLink className="w-3.5 h-3.5" /> Skeletal Radiology 2026
                      </a>
                  </div>
                  </div>
    </div>
  );
}