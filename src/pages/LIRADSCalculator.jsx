import React, { useState, useEffect, useRef } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator as CalcIcon, LogIn, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LIRADSWizardStep from "../components/lirads/LIRADSWizardStep";
import LIRADSResultPanel from "../components/lirads/LIRADSResultPanel";
import UsageTracker from "../components/UsageTracker";
import PremiumUpgrade from "../components/PremiumUpgrade";
import {
  calculateLIRADS,
  ELIGIBILITY_OPTIONS,
  ENHANCEMENT_OPTIONS,
  ENHANCEMENT_TYPE_OPTIONS,
  SIZE_OPTIONS,
  MAJOR_FEATURES,
} from "../components/lirads/liradsRuleEngine";

const STEPS = [
  {
    id: "eligibility",
    title: "Step 1 — Patient Eligibility",
    description: "Is this patient eligible for LI-RADS scoring?",
    tip: "LI-RADS applies to patients with cirrhosis (any cause except vascular disorders) or chronic HBV infection. It should not be used in patients < 18, with vascular-cause cirrhosis, or congenital hepatic fibrosis.",
    field: "eligibility",
    type: "radio",
    options: ELIGIBILITY_OPTIONS,
  },
  {
    id: "enhancement",
    title: "Step 2 — Observation Enhancement",
    description: "Does the observation show enhancement on contrast imaging?",
    tip: "Non-enhancing observations (cysts, hemangiomas, perfusion alterations, fat deposition, confluent fibrosis) are categorized as LR-1 (definitely benign).",
    field: "enhancement",
    type: "radio",
    options: ENHANCEMENT_OPTIONS,
  },
  {
    id: "enhancementType",
    title: "Step 3 — Enhancement Pattern",
    description: "What is the enhancement pattern?",
    tip: "Non-rim APHE: Enhancement greater than surrounding liver, not in a rim pattern. Rim-like APHE with targetoid appearance, infiltrative growth, or marked diffusion restriction/necrosis suggests LR-M (non-HCC malignancy).",
    field: "enhancementType",
    type: "radio",
    options: ENHANCEMENT_TYPE_OPTIONS,
  },
  {
    id: "size",
    title: "Step 4 — Observation Size",
    description: "What is the size of the observation?",
    tip: "Measure in the phase, sequence, or plane where margins are most clear. Avoid measuring on arterial phase or DWI (may overestimate size).",
    field: "size",
    type: "radio",
    options: SIZE_OPTIONS,
  },
  {
    id: "majorFeatures",
    title: "Step 5 — Additional Major Features",
    description: "Select all additional major features that apply.",
    tip: "These features, combined with APHE and size, determine the final LI-RADS category. Non-peripheral washout and threshold growth are the strongest indicators.",
    field: "majorFeatures",
    type: "checkbox",
    options: MAJOR_FEATURES,
  },
  {
    id: "tumorInVein",
    title: "Step 6 — Tumor in Vein",
    description: "Is there unequivocal soft tissue within a hepatic or portal vein?",
    tip: "Tumor in vein (LR-TIV) is assigned regardless of the associated parenchymal mass features. It is a contraindication to transplantation.",
    field: "tumorInVein",
    type: "radio",
    options: [
      { value: "yes", label: "Yes — unequivocal soft tissue in hepatic/portal vein" },
      { value: "no", label: "No" },
    ],
  },
];

function getVisibleSteps(data) {
  const visible = [STEPS[0]]; // Always show eligibility

  if (!data.eligibility || ["vascular", "under_18", "congenital"].includes(data.eligibility)) {
    return visible;
  }

  visible.push(STEPS[1]); // Enhancement
  if (!data.enhancement) return visible;

  if (data.enhancement === "no_enhancement") {
    return visible; // LR-1, no more steps
  }

  visible.push(STEPS[2]); // Enhancement type
  if (!data.enhancementType) return visible;

  if (["rim_aphe_targetoid", "infiltrative", "diffusion_necrosis"].includes(data.enhancementType)) {
    return visible; // LR-M, no more steps needed
  }

  visible.push(STEPS[3]); // Size
  if (!data.size) return visible;

  visible.push(STEPS[4]); // Major features

  visible.push(STEPS[5]); // Tumor in vein

  return visible;
}

function canCalculate(data) {
  if (["vascular", "under_18", "congenital"].includes(data.eligibility)) return false;
  if (!data.eligibility) return false;

  if (data.enhancement === "no_enhancement") return true;
  if (!data.enhancement) return false;

  if (["rim_aphe_targetoid", "infiltrative", "diffusion_necrosis"].includes(data.enhancementType)) return true;
  if (!data.enhancementType) return false;

  if (data.enhancementType === "nonrim_aphe") {
    if (!data.size) return false;
    // Major features can be empty (0 features), and tumorInVein must be answered
    if (data.tumorInVein === undefined || data.tumorInVein === "") return false;
    return true;
  }

  return false;
}

export default function LIRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const hasTrackedRef = useRef(false);

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

  const visibleSteps = getVisibleSteps(data);
  const currentStep = visibleSteps[currentStepIndex];
  const isIneligible = ["vascular", "under_18", "congenital"].includes(data.eligibility);

  const handleChange = (field, value) => {
    setData(prev => {
      const next = { ...prev, [field]: value };
      // Only clear dependent fields for radio steps (not checkbox like majorFeatures)
      const step = STEPS.find(s => s.field === field);
      if (step?.type !== "checkbox") {
        const fieldOrder = STEPS.map(s => s.field);
        const idx = fieldOrder.indexOf(field);
        for (let i = idx + 1; i < fieldOrder.length; i++) {
          delete next[fieldOrder[i]];
        }
      }
      return next;
    });
    setShowResult(false);
  };

  const handleReset = () => {
    setData({});
    setCurrentStepIndex(0);
    setShowResult(false);
    hasTrackedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCalculate = () => {
    setShowResult(true);
    hasTrackedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const result = showResult ? calculateLIRADS(data) : null;

  // Track usage
  useEffect(() => {
    if (showResult && result && result.category && user && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      const newCount = (user.lirads_analyses_used || 0) + 1;
      User.updateMyUserData({ lirads_analyses_used: newCount });
      setUser(prev => ({ ...prev, lirads_analyses_used: newCount }));
    }
  }, [showResult, result]);

  const isPremium = user?.subscription_tier === "premium" || user?.subscription_tier === "institutional";
  const analysesUsed = user?.lirads_analyses_used || 0;
  const hasReachedLimit = !isPremium && analysesUsed >= 5;

  // Auto-advance for radio steps
  useEffect(() => {
    if (showResult) return;
    if (!currentStep) return;
    if (currentStep.type !== "radio") return;

    const val = data[currentStep.field];
    if (!val) return;

    // Don't auto-advance if ineligible (show warning)
    if (currentStep.field === "eligibility" && ["vascular", "under_18", "congenital"].includes(val)) return;

    // Don't auto-advance on last visible step
    if (currentStepIndex >= visibleSteps.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStepIndex(i => Math.min(i + 1, visibleSteps.length - 1));
    }, 150);
    return () => clearTimeout(timer);
  }, [data, currentStep, currentStepIndex, visibleSteps.length, showResult]);

  // Loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
          <CardContent className="p-8 space-y-6">
            <CalcIcon className="w-16 h-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign Up to Use the Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a free account to access the LI-RADS Calculator — 5 free analyses to get started.</p>
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

  // Limit reached
  if (hasReachedLimit) {
    return (
      <div className="min-h-screen space-y-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">LI-RADS Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">You've used all 5 free analyses</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <PremiumUpgrade analysesUsed={analysesUsed} />
      </div>
    );
  }

  // Result view
  if (showResult && result && result.category) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">LI-RADS Classification Result</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Deterministic classification based on ACR LI-RADS v2018</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <LIRADSResultPanel result={result} data={data} onReset={handleReset} />
      </div>
    );
  }

  // Wizard
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          ACR <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">LI-RADS</span> Calculator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Liver Imaging Reporting and Data System v2018 — step-by-step scoring for liver observations in patients at risk for HCC.
        </p>
      </div>

      <UsageTracker user={user} analysesUsed={analysesUsed} />

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>Step {currentStepIndex + 1} of {visibleSteps.length}</span>
          <span>{currentStep?.title?.replace(/Step \d+ — /, "")}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / visibleSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Ineligible Warning */}
      {isIneligible && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300">LI-RADS should NOT be used in this patient</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              LI-RADS is not applicable for patients with vascular disorder–related cirrhosis, age &lt; 18, or congenital hepatic fibrosis. 
              In these patients, benign hyperplastic nodules may mimic HCC.
            </p>
          </div>
        </div>
      )}

      {/* Current Step */}
      {currentStep && !isIneligible && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LIRADSWizardStep
              title={currentStep.title}
              description={currentStep.description}
              tip={currentStep.tip}
              type={currentStep.type}
              options={currentStep.options}
              value={data[currentStep.field]}
              onChange={(val) => handleChange(currentStep.field, val)}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStepIndex(i => Math.max(i - 1, 0))}
          disabled={currentStepIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleReset} className="gap-2 text-slate-500 text-sm">
            Reset
          </Button>

          {/* Next button for checkbox steps */}
          {currentStep?.type === "checkbox" && currentStepIndex < visibleSteps.length - 1 && (
            <Button
              onClick={() => {
                if (!data[currentStep.field]) {
                  setData(prev => ({ ...prev, [currentStep.field]: [] }));
                }
                setCurrentStepIndex(i => Math.min(i + 1, visibleSteps.length - 1));
              }}
              variant="outline"
              className="gap-2 rounded-full px-6 font-semibold"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {canCalculate(data) && (
            <Button
              onClick={handleCalculate}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/25"
            >
              Calculate LI-RADS
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-4">
        Based on ACR LI-RADS v2018. Reference: radiologyassistant.nl/abdomen/liver/li-rads. 
        For clinical decision support only — not a substitute for radiologist judgment.
      </p>
    </div>
  );
}