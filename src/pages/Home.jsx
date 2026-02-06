import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ClipboardCheck, Activity, Shield, FileSearch, BookOpen, Stethoscope, Heart, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getStats } from "@/functions/getStats";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [totalAnalyses, setTotalAnalyses] = useState(0);

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

    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        if (data) {
          setTotalAnalyses(data.totalAnalyses || 0);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 space-y-24">
        
        {/* Hero Section */}
        <div className="text-center space-y-10 max-w-4xl mx-auto z-10 px-4">
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">
                    ST-RADS
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light tracking-wide max-w-2xl mx-auto">
                    Evidence-Based MRI Risk Stratification for Soft-Tissue Tumors
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    Interactive decision engine implementing the official ACR Soft Tissue-RADS v2025 framework
                </p>
             </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to={createPageUrl("Calculator")}>
                    <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                        Start Case <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link to={createPageUrl("About")}>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-14 px-8 text-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full transition-all gap-2"
                    >
                        <BookOpen className="h-5 w-5" /> Learn ST-RADS
                    </Button>
                </Link>
            </div>

            {/* Minimal Stats Pill */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-sm font-medium text-slate-600 dark:text-slate-300 animate-in fade-in delay-500 duration-1000">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>{totalAnalyses > 0 ? totalAnalyses.toLocaleString() : "..."}</span>
                <span className="opacity-70">cases analyzed</span>
            </div>

            {/* Privacy Disclaimer */}
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm animate-in fade-in delay-700 duration-1000">
                <Shield className="w-4 h-4" />
                <span>No patient data stored. Fully deterministic, rule-based classification.</span>
            </div>
        </div>

        {/* 3-Step Process */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-16 max-w-5xl mx-auto w-full px-6">
            <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl glass-panel group-hover:bg-white/50 dark:group-hover:bg-indigo-900/30 transition-colors duration-300 text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <FileSearch className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">Answer Questions</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light">Step-by-step wizard following official flowcharts</p>
                </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl glass-panel group-hover:bg-white/50 dark:group-hover:bg-blue-900/30 transition-colors duration-300 text-blue-600 dark:text-blue-400 shadow-sm">
                    <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">Get Classification</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light">ST-RADS 0–6 with risk level & differentials</p>
                </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl glass-panel group-hover:bg-white/50 dark:group-hover:bg-green-900/30 transition-colors duration-300 text-green-600 dark:text-green-400 shadow-sm">
                    <ClipboardCheck className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">Copy Report</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light">Structured report with one-click copy</p>
                </div>
            </div>
        </div>

        {/* Support Blurb */}
        <div className="max-w-2xl mx-auto w-full px-6">
            <div className="glass-panel rounded-2xl p-8 text-center space-y-5">
                <Heart className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Built by a Student, for the Community</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    This project was bootstrapped entirely on student loans — from development and hosting to design. 
                    Every Premium subscription directly supports keeping this tool free for learners and helps fund future features. 
                    If ST-RADS Calc has helped you, consider upgrading to Premium to keep it going.
                </p>
                <Link to={createPageUrl("Premium")}>
                    <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all mt-2">
                        <Crown className="mr-2 h-4 w-4" /> Support & Go Premium — $9.99/mo
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  );
}