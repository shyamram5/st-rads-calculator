import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, Calculator as CalcIcon, LogIn, BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MSKIWizardStep from "../components/mski/MSKIWizardStep";
import MSKIResultPanel from "../components/mski/MSKIResultPanel";
import MSKIReference from "../components/mski/MSKIReference";
import UsageTracker from "../components/UsageTracker";
import PremiumUpgrade from "../components/PremiumUpgrade";
import { getMSKIWizardSteps } from "../components/mski/mskiWizardSteps";
import { calculateMSKIRADS } from "../components/mski/mskiRuleEngine";

// Keys that, when changed, should clear dependent downstream answers
const RESET_TRIGGERS = {
  presentation: ["treatment_response", "nos_pathway", "nos_entities", "no_infection_finding",
    "superficial_findings", "deep_findings", "nf_criteria", "bone_signal", "t1_marrow_signal",
    "iv_associated", "v_associated", "joint_findings"],
  nos_pathway: ["nos_entities", "no_infection_finding", "superficial_findings", "deep_findings",
    "nf_criteria", "bone_signal", "t1_marrow_signal", "iv_associated", "v_associated", "joint_findings"],
  no_infection_finding: ["superficial_findings", "deep_findings", "nf_criteria", "bone_signal",
    "t1_marrow_signal", "iv_associated", "v_associated", "joint_findings"],
  bone_signal: ["t1_marrow_signal", "iv_associated", "v_associated", "joint_findings"],
  t1_marrow_signal: ["iv_associated", "v_associated", "joint_findings"],
  extremity: ["body_region"],
};

export default function MSKIRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
      finally { setAuthLoading(false); }
    };
    checkUser();
  }, []);

  const steps = useMemo(() => getMSKIWizardSteps(data), [data]);
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
    hasTrackedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Can we calculate?
  const canCalculate = useMemo(() => {
    // Incomplete study
    const requiredSeqs = ["t1w", "fluid_sensitive", "pre_contrast_t1fs", "post_contrast_t1fs"];
    const anyMissing = requiredSeqs.some(s => data[`seq_${s}`] === "absent");
    const allSeqsAnswered = requiredSeqs.every(s => data[`seq_${s}`] !== undefined);
    if (anyMissing && allSeqsAnswered) return true; // MSKI-RADS 0

    // VI pathway
    if (data.presentation === "known_treated" && data.treatment_response) return true;

    // NOS pathway
    if (data.nos_pathway === "yes") return true;

    // No infection
    if (data.no_infection_finding === "yes") return true;

    // Must have gone through findings steps
    if (data.no_infection_finding === "no") {
      // If bone_signal is "no" → can calculate (II or III based on soft tissue)
      if (data.bone_signal === "no") return true;
      // If bone has signal and t1 assessed
      if (data.bone_signal === "yes" && data.t1_marrow_signal) {
        if (data.t1_marrow_signal === "normal") return true;
        if (data.t1_marrow_signal === "edema_only") return true; // IV
        if (data.t1_marrow_signal === "confluent_hypointensity") return true; // V
      }
    }

    return false;
  }, [data]);

  const result = useMemo(() => {
    if (!showResult) return null;
    return calculateMSKIRADS(data);
  }, [showResult, data]);

  // Track usage
  useEffect(() => {
    if (showResult && result && user && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      const newCount = (user.mski_analyses_used || 0) + 1;
      User.updateMyUserData({ mski_analyses_used: newCount });
      setUser(prev => ({ ...prev, mski_analyses_used: newCount }));
    }
  }, [showResult, result]);

  useEffect(() => {
    if (showResult && result) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [showResult, result]);

  const isPremium = user?.subscription_tier === "premium" || user?.subscription_tier === "institutional";
  const analysesUsed = user?.mski_analyses_used || 0;
  const hasReachedLimit = !isPremium && analysesUsed >= 5;

  // Navigation
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Check if all required radio questions on current step are answered
  const currentStepAnswered = currentStep?.questions?.every(q => {
    if (q.type === "checkbox") return true;
    return data[q.id] !== undefined && data[q.id] !== "";
  });

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
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Create a free account to access MSKI-RADS — 5 free analyses included.</p>
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">MSKI-RADS Calculator</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">You've used all 5 free analyses</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <PremiumUpgrade analysesUsed={analysesUsed} />
      </div>
    );
  }

  // Result view
  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">MSKI-RADS Result</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Musculoskeletal Infection · Chhabra et al. 2024</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <MSKIResultPanel result={result} data={data} onReset={handleReset} />

        {/* Reference toggle */}
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
              <MSKIReference />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Wizard view
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">MSKI-RADS Calculator</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Musculoskeletal Infection Reporting · Chhabra et al., Radiology 2024
        </p>
      </div>

      <UsageTracker user={user} analysesUsed={analysesUsed} />

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
            <MSKIWizardStep step={currentStep} values={data} onChange={handleChange} />
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

          {/* Next for checkbox steps */}
          {canGoNext && currentStep?.questions?.some(q => q.type === "checkbox") && (
            <Button
              onClick={() => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1))}
              variant="outline"
              className="gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {/* Next for fully-answered radio steps */}
          {canGoNext && currentStepAnswered && !canCalculate && currentStep?.questions?.every(q => q.type === "radio") && (
            <Button
              onClick={() => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1))}
              variant="outline"
              className="gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {canCalculate && (
            <Button
              onClick={() => { setShowResult(true); hasTrackedRef.current = false; }}
              className="gap-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-lg px-6 font-medium shadow-none"
            >
              <Sparkles className="w-4 h-4" /> Calculate MSKI-RADS
            </Button>
          )}
        </div>
      </div>

      {/* Reference toggle */}
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
            <MSKIReference />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed pt-2">
        Based on MSKI-RADS: Chhabra et al., Radiology 2024;312(2):e232914. DOI: 10.1148/radiol.232914. 
        Terminology per SSR White Paper: Alaia et al., Skeletal Radiol 2021;50(12):2319–2347. 
        For clinical decision support only — not a substitute for radiologist judgment.
      </p>
    </div>
  );
}