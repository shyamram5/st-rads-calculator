import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, Shield, FileSearch, BookOpen, Stethoscope, Heart, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-16 space-y-20">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto z-10 px-4">
             <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-2">
                    ACR ST-RADS v2025
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                    Soft Tissue<br className="hidden sm:block" /> <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">RADS Calculator</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-normal max-w-xl mx-auto leading-relaxed">
                    Evidence-based MRI risk stratification for soft-tissue tumors, guided step-by-step through the official flowcharts.
                </p>
             </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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

            {/* Privacy Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium animate-in fade-in delay-500 duration-1000">
                <Shield className="w-3.5 h-3.5" />
                No patient data stored · Fully deterministic · Rule-based
            </div>
        </div>

        {/* 3-Step Process */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto w-full px-6">
            {[
              { icon: FileSearch, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", title: "Answer Questions", desc: "Step-by-step wizard following official flowcharts" },
              { icon: Stethoscope, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", title: "Get Classification", desc: "ST-RADS 0–6 with risk level & differentials" },
              { icon: ClipboardCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", title: "Copy Report", desc: "Structured report with one-click copy" },
            ].map((step, i) => (
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