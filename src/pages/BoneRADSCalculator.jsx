import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, Calculator as CalcIcon, LogIn, BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import BoneRADSWizardStep from "../components/bonerads/BoneRADSWizardStep";
import BoneRADSResultPanel from "../components/bonerads/BoneRADSResultPanel";
import BoneRADSReference from "../components/bonerads/BoneRADSReference";
import BoneRADSDifferential from "../components/bonerads/BoneRADSDifferential";
import UsageTracker from "../components/UsageTracker";
import PremiumUpgrade from "../components/PremiumUpgrade";
import { getBoneRADSWizardSteps } from "../components/bonerads/boneRadsWizardSteps";
import { calculateBoneRADS } from "../components/bonerads/boneRadsRuleEngine";

const RESET_TRIGGERS = {
  characterizable: ["patient_age", "symptoms", "known_cancer", "cancer_type", "multifocal",
    "margin_grade", "periosteal", "aggressive_pattern", "endosteal", "pathological_fracture", "soft_tissue_mass"],
  known_cancer: ["cancer_type"],
  periosteal: ["aggressive_pattern"],
};

export default function BoneRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showDifferential, setShowDifferential] = useState(false);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
      finally { setAuthLoading(false); }
    };
    checkUser();
  }, []);

  const steps = useMemo(() => getBoneRADSWizardSteps(data), [data]);
  const currentStep = steps[currentStepIndex];

  const handleChange = useCallback((questionId, value) => {
    setData(prev => {
      const next = { ...prev, [questionId]: value };
      const resetKeys = RESET_TRIGGERS[questionId] || [];
      resetKeys.forEach(k => { delete next[k]; });
      return next;
    });
    setShowResult(false);
  }, []);

  const handleReset = () => {
    setData({});
    setCurrentStepIndex(0);
    setShowResult(false);
    setShowDifferential(false);
    hasTrackedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Can calculate?
  const canCalculate = useMemo(() => {
    if (data.characterizable === "no") return true; // Bone-RADS 0
    // Need all 5 scored features answered
    return !!(
      data.characterizable === "yes" &&
      data.margin_grade &&
      data.periosteal !== undefined &&
      data.endosteal &&
      data.pathological_fracture &&
      data.soft_tissue_mass
    );
  }, [data]);

  const result = useMemo(() => {
    if (!showResult) return null;
    return calculateBoneRADS(data);
  }, [showResult, data]);

  useEffect(() => {
    if (showResult && result) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [showResult, result]);

  // Track usage
  useEffect(() => {
    if (showResult && result && user && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      const newCount = (user.bonerads_analyses_used || 0) + 1;
      User.updateMyUserData({ bonerads_analyses_used: newCount });
      setUser(prev => ({ ...prev, bonerads_analyses_used: newCount }));
    }
  }, [showResult, result]);

  const isPremium = user?.subscription_tier === "premium" || user?.subscription_tier === "institutional";
  const analysesUsed = user?.bonerads_analyses_used || 0;
  const hasReachedLimit = !isPremium && analysesUsed >= 5;

  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1;

  const currentStepAnswered = currentStep?.questions?.every(q => {
    if (q.type === "text" || q.type === "number") return true;
    return data[q.id] !== undefined && data[q.id] !== "";
  });

  // ── Loading ───────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto">
            <CalcIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign in to continue</h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Create a free account to access Bone-RADS — 5 free analyses included.</p>
          </div>
          <Button onClick={(e) => { e.preventDefault(); User.login(); }}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 h-10 rounded-lg text-sm font-medium shadow-none">
            <LogIn className="mr-2 h-4 w-4" /> Sign Up / Log In
          </Button>
        </div>
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Bone-RADS Calculator</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">You've used all 5 free analyses</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <PremiumUpgrade analysesUsed={analysesUsed} />
      </div>
    );
  }

  // ── Result view ───────────────────────────────────────────────────
  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Bone-RADS Result</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Bone Tumor Risk Stratification · Caracciolo et al. 2023</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <BoneRADSResultPanel result={result} data={data} onReset={handleReset} />

        {/* Differential Diagnosis */}
        <div className="border-t border-gray-100 dark:border-gray-900 pt-6">
          <button
            onClick={() => setShowDifferential(!showDifferential)}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Differential Diagnosis Guide
            {showDifferential ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showDifferential && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
              <BoneRADSDifferential data={data} onChange={handleChange} />
            </motion.div>
          )}
        </div>

        {/* Reference */}
        <div className="border-t border-gray-100 dark:border-gray-900 pt-6">
          <button
            onClick={() => setShowReference(!showReference)}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Quick Reference
            {showReference ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showReference && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
              <BoneRADSReference />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── Wizard view ───────────────────────────────────────────────────
  // Live point tally
  const liveResult = data.characterizable === "yes" ? calculateBoneRADS(data) : null;
  const livePoints = liveResult?.totalPoints ?? 0;
  const pointColor = livePoints <= 2 ? "text-emerald-600 dark:text-emerald-400"
    : livePoints <= 4 ? "text-lime-600 dark:text-lime-400"
    : livePoints <= 6 ? "text-orange-600 dark:text-orange-400"
    : "text-red-600 dark:text-red-400";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bone-RADS Calculator</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Bone Tumor Risk Stratification · Caracciolo et al., JACR 2023
        </p>
      </div>

      <UsageTracker user={user} analysesUsed={analysesUsed} />

      {/* Live point counter */}
      {data.characterizable === "yes" && (
        <div className="flex items-center justify-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 mr-2">Running Total</span>
            <span className={`text-xl font-black ${pointColor}`}>{livePoints}</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-1">pts</span>
          </div>
        </div>
      )}

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-[12px] text-gray-400 dark:text-gray-500 mb-2">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{currentStep?.title}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-1">
          <div className="bg-gray-900 dark:bg-white h-1 rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep?.id || currentStepIndex}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep && (
            <BoneRADSWizardStep step={currentStep} values={data} onChange={handleChange} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStepIndex(i => Math.max(i - 1, 0))}
          disabled={!canGoBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleReset} className="gap-2 text-gray-500 text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>

          {canGoNext && currentStepAnswered && !canCalculate && (
            <Button onClick={() => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1))} variant="outline" className="gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {canCalculate && (
            <Button
              onClick={() => { setShowResult(true); hasTrackedRef.current = false; }}
              className="gap-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-lg px-6 font-medium shadow-none"
            >
              <Sparkles className="w-4 h-4" /> Calculate Bone-RADS
            </Button>
          )}
        </div>
      </div>

      {/* Reference */}
      <div className="border-t border-gray-100 dark:border-gray-900 pt-6">
        <button
          onClick={() => setShowReference(!showReference)}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Quick Reference
          {showReference ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showReference && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
            <BoneRADSReference />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed pt-2">
        Based on Caracciolo et al., JACR 2023;20:1044–1058. DOI: 10.1016/j.jacr.2023.07.017. Erratum JACR 2024;21(5):700. 
        Co-endorsed by the Musculoskeletal Tumor Society. For clinical decision support only — not a substitute for radiologist judgment.
      </p>
    </div>
  );
}