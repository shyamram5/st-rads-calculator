import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, LogIn, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ORADSUSModule from "../components/orads/ORADSUSModule";
import ORADSMRIModule from "../components/orads/ORADSMRIModule";
import ORADSGlossary from "../components/orads/ORADSGlossary";
import { MENOPAUSAL_OPTIONS } from "../components/orads/oradsUsRuleEngine";

const TABS = [
  { key: "us", label: "O-RADS Ultrasound", color: "from-rose-500 to-pink-600" },
  { key: "mri", label: "O-RADS MRI", color: "from-blue-500 to-indigo-600" },
  { key: "glossary", label: "Glossary & Definitions", color: "" },
];

export default function ORADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("us");
  const [menoStatus, setMenoStatus] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
      finally { setAuthLoading(false); }
    };
    checkUser();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
          <CardContent className="p-8 space-y-6">
            <Calculator className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign Up to Use the Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a free account to access the O-RADS Calculator.</p>
            <Button onClick={(e) => { e.preventDefault(); User.login(); }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-full text-lg">
              <LogIn className="mr-2 h-5 w-5" /> Sign Up / Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          <span className="bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">O-RADS™</span> Dual-Modality Calculator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ultrasound v2022 + MRI Risk Stratification · American College of Radiology
        </p>
      </div>

      {/* Menopausal status (shared) */}
      {!menoStatus ? (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Patient Menopausal Status</h3>
            <p className="text-[10px] text-slate-400 italic">Menopausal status fundamentally changes management thresholds. The same lesion may require no follow-up premenopausally but immediate referral postmenopausally.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MENOPAUSAL_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setMenoStatus(opt.value)}
                  className="text-left p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-all">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{opt.label}</span>
                  <span className="text-[10px] text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Meno banner + change */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${menoStatus?.includes("post") ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"}`}>
              {MENOPAUSAL_OPTIONS.find(m => m.value === menoStatus)?.label}
            </div>
            <button onClick={() => setMenoStatus(null)} className="text-[10px] text-slate-400 hover:text-slate-600 underline">Change</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
                {tab.key === "glossary" && <BookOpen className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
              {activeTab === "us" && (
                <ORADSUSModule menoStatus={menoStatus} onMenoStatusChange={setMenoStatus} onSwitchToMRI={() => setActiveTab("mri")} />
              )}
              {activeTab === "mri" && (
                <ORADSMRIModule menoStatus={menoStatus} />
              )}
              {activeTab === "glossary" && (
                <ORADSGlossary />
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Footer */}
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-4">
        Based on ACR O-RADS™ US v2022 (November 2022) and ACR O-RADS™ MRI Risk Stratification and Management System (© 2024 ACR).
        MRI PPV data from Thomassin-Naggara et al., JAMA Network Open, 2020.
        For clinical decision support only — not a substitute for radiologist judgment or the complete ACR O-RADS documentation.
      </p>
    </div>
  );
}