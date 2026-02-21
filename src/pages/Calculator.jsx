import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Calculator as CalcIcon, LogIn, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import WizardStep from "../components/calculator/WizardStep";
import ResultPanel from "../components/calculator/ResultPanel";
import EducationSidebar from "../components/calculator/EducationSidebar";
import UsageTracker from "../components/UsageTracker";
import PremiumUpgrade from "../components/PremiumUpgrade";
import { getWizardSteps } from "../components/calculator/wizardSteps";
import { calculateSTRADS, applyModifiers } from "../components/calculator/stradsRuleEngine";

export default function CalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [caseData, setCaseData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const hasTrackedRef = useRef(false);
  const autoAdvanceRef = useRef(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  const steps = useMemo(() => getWizardSteps(caseData), [caseData]);

  // ─── DEPENDENCY MANAGEMENT ─────────────────────────────────────────
  // This ensures that if a user changes a parent question (e.g., changes 
  // "Tissue Type" from Lipomatous to Cystic), all the lipomatous-specific 
  // answers are cleared from the state.

  const ALL_DETAIL_KEYS = [
    // Lipomatous
    "lipFatContent", "lipSeptations", "lipVessels", "lipNoduleFeatures",
    // Cyst-like
    "cystLocation", "cystFlow", "cystHematoma", "cystSeptationNodules",
    // Solid General
    "compartment",
    // Lipomatous (Fig 2A)
    "lipNoduleSeptation",
    // Deep
    "muscleSignature", "myositisTriad",
    // Intravascular
    "vascMorphology", "vascBlooming", "vascT2Enhancement",
    // Intraarticular
    "iaSignal", "iaBlooming", "iaEnhancement",
    // Intraneural
    "targetSign", "nerveADC", "nerveT2Enhancement",
    // Cutaneous
    "growthPattern", "cutEnhancement",
    // Tendon
    "tendonMorph", "tendonBlooming",
    // Fascial
    "fascialSize", "fascialMulti",
    // Subungual
    "subungualSize",
    // Ancillary
    "adcValue", "ancillaryFlags"
  ];

  const getDependentKeys = (changedKey) => {
    const deps = {
      // Figure 1 order: exam adequacy → lesion identification → macroscopic fat → T2/enhancement path
      examAdequacy: ["lesionPresent", "macroscopicFatT1W", "t2EnhancementPath", ...ALL_DETAIL_KEYS],
      lesionPresent: ["macroscopicFatT1W", "t2EnhancementPath", ...ALL_DETAIL_KEYS],
      macroscopicFatT1W: ["t2EnhancementPath", ...ALL_DETAIL_KEYS],
      t2EnhancementPath: ALL_DETAIL_KEYS,

      // Lipomatous Branch
      lipFatContent: ["lipNoduleSeptation", "lipSeptations", "lipVessels", "lipNoduleFeatures"],
      lipNoduleSeptation: ["lipSeptations", "lipVessels"],
      lipSeptations: ["lipVessels"],

      // Cyst Branch
      cystLocation: ["cystFlow", "cystHematoma", "cystSeptationNodules"],
      cystFlow: ["cystHematoma", "cystSeptationNodules"],
      cystHematoma: ["cystSeptationNodules"],

      // Solid Compartments (Parent) — also reset ancillary since options differ per compartment
      compartment: [
        "muscleSignature", "myositisTriad",
        "vascMorphology", "vascBlooming", "vascT2Enhancement",
        "iaSignal", "iaBlooming", "iaEnhancement",
        "targetSign", "nerveADC", "nerveT2Enhancement",
        "growthPattern", "cutEnhancement",
        "tendonMorph", "tendonBlooming",
        "fascialSize", "fascialMulti",
        "subungualSize",
        "adcValue", "ancillaryFlags"
      ],

      // Solid Sub-branches
      muscleSignature: ["myositisTriad"],
      vascMorphology: ["vascBlooming", "vascT2Enhancement"],
      iaSignal: ["iaBlooming", "iaEnhancement"],
      targetSign: ["nerveADC", "nerveT2Enhancement"],
      nerveADC: ["nerveT2Enhancement"],
      growthPattern: ["cutEnhancement"],
      tendonMorph: ["tendonBlooming"],
      fascialSize: ["fascialMulti"]
    };
    return deps[changedKey] || [];
  };

  const handleChange = useCallback((questionId, value) => {
    setCaseData(prev => {
      const next = { ...prev, [questionId]: value };
      const resetKeys = getDependentKeys(questionId);
      resetKeys.forEach(k => { delete next[k]; });
      return next;
    });
    setShowResult(false);
    // Flag that user just answered a question — auto-advance effect will check
    autoAdvanceRef.current = true;
  }, []);

  // ─── CALCULATION ──────────────────────────────────────────────────

  const result = useMemo(() => {
    if (!showResult) return null;
    let r = calculateSTRADS(caseData);
    r = applyModifiers(r, caseData); 
    return r;
  }, [showResult, caseData]);

  // Scroll to top when results are shown
  useEffect(() => {
    if (showResult && result) {
      window.scrollTo(0, 0);
    }
  }, [showResult, result]);

  // Track analysis count
  useEffect(() => {
    if (showResult && result && user && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      const newCount = (user.analyses_used || 0) + 1;
      User.updateMyUserData({ analyses_used: newCount });
      setUser(prev => ({ ...prev, analyses_used: newCount }));
    }
  }, [showResult, result]);

  const isPremium = user?.subscription_tier === "premium" || user?.subscription_tier === "institutional";
  const analysesUsed = user?.analyses_used || 0;
  const hasReachedLimit = !isPremium && analysesUsed >= 5;

  const handleReset = () => {
    setCaseData({});
    setCurrentStepIndex(0);
    setShowResult(false);
    hasTrackedRef.current = false;
  };

  // ─── NAVIGATION LOGIC ─────────────────────────────────────────────

  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoBack = currentStepIndex > 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Check if current step has minimum required answers
  const currentStep = steps[currentStepIndex];
  const hasRequiredAnswers = currentStep?.questions?.every(q => {
    if (q.type === "checkbox" || q.type === "number") return true; // Optional fields
    return caseData[q.id] !== undefined && caseData[q.id] !== "";
  });

  // Early termination per Figure 1: incomplete exam → RADS-0; no soft tissue lesion → RADS-1
  const canCalculateEarly = (
    caseData.examAdequacy === "incomplete" ||
    caseData.lesionPresent === "no"
  );

  // ─── AUTO-ADVANCE EFFECT ────────────────────────────────────────────
  // After caseData updates, check if the current step is fully answered
  // with only radio questions. If so, auto-advance after a short delay.
  useEffect(() => {
    if (!autoAdvanceRef.current || showResult) return;
    autoAdvanceRef.current = false;

    const step = steps[currentStepIndex];
    if (!step) return;

    // Only auto-advance if ALL questions on this step are radio type
    const allRadio = step.questions.every(q => q.type === "radio");
    if (!allRadio) return;

    // Check all radio questions are answered
    const allAnswered = step.questions.every(q => caseData[q.id] !== undefined && caseData[q.id] !== "");
    if (!allAnswered) return;

    // Don't auto-advance on early termination steps — let user click Calculate
    const wouldTerminateEarly = (
      caseData.examAdequacy === "incomplete" ||
      caseData.lesionPresent === "no"
    );
    if (wouldTerminateEarly) return;

    const isLast = currentStepIndex === steps.length - 1;
    const canNext = currentStepIndex < steps.length - 1;

    const timer = setTimeout(() => {
      if (isLast) {
        setShowResult(true);
      } else if (canNext) {
        setCurrentStepIndex(i => i + 1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [caseData, steps, currentStepIndex, showResult]);

  // ─── RENDER ───────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
          <CardContent className="p-8 space-y-6">
            <CalcIcon className="w-16 h-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign Up to Use the Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a free account to access the ST-RADS Calculator — 5 free analyses to get started.</p>
            <Button
              onClick={(e) => { e.preventDefault(); User.login(); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full text-lg"
            >
              <LogIn className="mr-2 h-5 w-5" /> Sign Up / Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">ST-RADS Classification Result</h1>
          <p className="text-slate-600 dark:text-slate-400">Deterministic classification based on the official ST-RADS v2025 flowcharts</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <ResultPanel result={result} caseData={caseData} onReset={handleReset} isPremium={isPremium} />

        {/* Education Panel on Results Page */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <button
            onClick={() => setShowEducation(!showEducation)}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full glass-panel text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            Learn More About ST-RADS
            {showEducation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6"
            >
              <EducationSidebar />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="min-h-screen space-y-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">ST-RADS Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">You've used all 5 free analyses</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <PremiumUpgrade analysesUsed={analysesUsed} />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">ST-RADS Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Interactive decision engine based on the official ACR ST-RADS v2025 framework</p>
      </div>

      <UsageTracker user={user} analysesUsed={analysesUsed} />
      
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{currentStep?.title}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Content */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep?.id || currentStepIndex}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep && (
              <WizardStep
                title={currentStep.title}
                description={currentStep.description}
                questions={currentStep.questions}
                values={caseData}
                onChange={handleChange}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStepIndex(i => i - 1)}
            disabled={!canGoBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleReset} className="gap-2 text-slate-500">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>

            {(canCalculateEarly || isLastStep) && hasRequiredAnswers && (
              <Button
                onClick={() => setShowResult(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="w-4 h-4" /> Calculate ST-RADS
              </Button>
            )}
          </div>
        </div>

        {/* Education Toggle */}
        <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-6">
          <button
            onClick={() => setShowEducation(!showEducation)}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full glass-panel text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            Learn About ST-RADS
            {showEducation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6"
            >
              <EducationSidebar />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}