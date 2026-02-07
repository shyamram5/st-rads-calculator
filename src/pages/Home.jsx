import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, Shield, FileSearch, BookOpen, Stethoscope, Heart, Crown, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";

const RADS_SYSTEMS = [
  {
    id: "strads",
    label: "ST-RADS",
    fullName: "Soft Tissue RADS",
    tagline: "ACR ST-RADS v2025",
    available: true,
    color: "blue",
    description: "Evidence-based MRI risk stratification for soft-tissue tumors, guided step-by-step through the official flowcharts.",
    steps: [
      { icon: FileSearch, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", title: "Answer Questions", desc: "Step-by-step wizard following official flowcharts" },
      { icon: Stethoscope, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", title: "Get Classification", desc: "ST-RADS 0–6 with risk level & differentials" },
      { icon: ClipboardCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", title: "Copy Report", desc: "Structured report with one-click copy" },
    ],
  },
  {
    id: "lirads",
    label: "LI-RADS",
    fullName: "Liver Imaging RADS",
    tagline: "ACR LI-RADS",
    available: false,
    color: "emerald",
    description: "Standardized reporting for liver observations in patients at risk for hepatocellular carcinoma. Coming soon.",
  },
  {
    id: "birads",
    label: "BI-RADS",
    fullName: "Breast Imaging RADS",
    tagline: "ACR BI-RADS",
    available: false,
    color: "rose",
    description: "Standardized breast imaging assessment categories for mammography, ultrasound, and MRI. Coming soon.",
  },
];

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [activeSystem, setActiveSystem] = useState("strads");

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

  const current = RADS_SYSTEMS.find(s => s.id === activeSystem);

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

        {/* System Tabs */}
        <div className="w-full max-w-3xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
                {RADS_SYSTEMS.map(sys => (
                    <button
                        key={sys.id}
                        onClick={() => setActiveSystem(sys.id)}
                        className={`relative flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            activeSystem === sys.id
                                ? sys.color === "blue"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                    : sys.color === "emerald"
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                                    : "bg-rose-600 text-white shadow-lg shadow-rose-500/25"
                                : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        {sys.label}
                        {!sys.available && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-white/20 text-white border-0 dark:bg-white/10" style={{
                                ...(activeSystem !== sys.id && { background: "rgb(241 245 249)", color: "rgb(100 116 139)" })
                            }}>
                                Soon
                            </Badge>
                        )}
                    </button>
                ))}
            </div>

            {/* Active System Content */}
            {current.available ? (
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
                                Start a Case <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to={createPageUrl("About")}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-13 px-8 text-base font-semibold rounded-full transition-all gap-2 border-slate-300 dark:border-slate-700"
                            >
                                <BookOpen className="h-4 w-4" /> Learn ST-RADS
                            </Button>
                        </Link>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        No patient data stored · Fully deterministic · Rule-based
                    </div>

                    {/* 3-Step Process */}
                    <div className="grid md:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto w-full pt-4">
                        {current.steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-3 group">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${step.bg} ${step.color} transition-transform duration-300 group-hover:scale-110`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-0.5">{step.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-6 py-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                        current.color === "emerald" 
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" 
                            : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                    }`}>
                        <Clock className="w-8 h-8" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{current.fullName}</h2>
                        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            {current.description}
                        </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${
                        current.color === "emerald"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    }`}>
                        <Clock className="w-4 h-4" />
                        Coming Soon
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        We're actively developing this module. Stay tuned!
                    </p>
                </div>
            )}
        </div>

        {/* Support Section */}
        <div className="max-w-lg mx-auto text-center space-y-4 px-4">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold">Built by a Student, for the Community</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                This project was bootstrapped entirely on student loans. Every Premium subscription directly supports keeping this tool free and funds future features.
            </p>
            <Link to={createPageUrl("Premium")}>
                <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 shadow-md hover:shadow-lg transition-all mt-2">
                    <Crown className="mr-2 h-4 w-4" /> Support & Go Premium — $9.99/mo
                </Button>
            </Link>
        </div>
    </div>
  );
}