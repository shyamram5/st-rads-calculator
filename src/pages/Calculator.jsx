import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, ChevronRight, Calculator, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import WizardStep from "../components/calculator/WizardStep";
import ResultPanel from "../components/calculator/ResultPanel";
import { getWizardSteps } from "../components/calculator/wizardSteps";
import { calculateSTRADS, applyADCModifier, applyAncillaryModifier } from "../components/calculator/stradsRuleEngine";

export default function CalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [caseData, setCaseData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

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

  const handleChange = useCallback((questionId, value) => {
    setCaseData(prev => {
      const next = { ...prev, [questionId]: value };
      const resetKeys = getDependentKeys(questionId);
      resetKeys.forEach(k => { delete next[k]; });
      return next;
    });
    setShowResult(false);
  }, []);

  const getDependentKeys = (changedKey) => {
    const deps = {
      examAdequacy: ["knownTumor", "knownTumorStatus", "lesionPresent", "tissueType", "lipFatContent", "lipSeptations", "lipEnhancement", "lipVessels", "lipNonFatFeatures", "cystCommunication", "cystLocation", "cystFlowVoids", "cystSeptations", "cystHematoma", "solidCompartment", "vascularT2", "vascularPhleboliths", "vascularFluidLevels", "iaHemosiderin", "iaBloomingGRE", "nerveTargetSign", "nerveADC", "cutGrowthPattern", "cutEnhancement", "deepMuscleSignature", "deepHistory", "deepEdema", "deepMineralization", "fascialNoduleSize", "fascialMultifocal", "subungualSize", "tendonSize", "tendonAutoimmune", "adcValue", "ancillaryFeatures"],
      knownTumor: ["knownTumorStatus", "lesionPresent", "tissueType", "lipFatContent", "lipSeptations", "lipEnhancement", "lipVessels", "lipNonFatFeatures", "cystCommunication", "cystLocation", "cystFlowVoids", "cystSeptations", "cystHematoma", "solidCompartment", "adcValue", "ancillaryFeatures"],
      lesionPresent: ["tissueType", "lipFatContent", "lipSeptations", "lipEnhancement", "lipVessels", "lipNonFatFeatures", "cystCommunication", "cystLocation", "cystFlowVoids", "cystSeptations", "cystHematoma", "solidCompartment", "adcValue", "ancillaryFeatures"],
      tissueType: ["lipFatContent", "lipSeptations", "lipEnhancement", "lipVessels", "lipNonFatFeatures", "cystCommunication", "cystLocation", "cystFlowVoids", "cystSeptations", "cystHematoma", "solidCompartment", "vascularT2", "vascularPhleboliths", "vascularFluidLevels", "iaHemosiderin", "iaBloomingGRE", "nerveTargetSign", "nerveADC", "cutGrowthPattern", "cutEnhancement", "deepMuscleSignature", "deepHistory", "deepEdema", "deepMineralization", "fascialNoduleSize", "fascialMultifocal", "subungualSize", "tendonSize", "tendonAutoimmune", "adcValue", "ancillaryFeatures"],
      lipFatContent: ["lipSeptations", "lipEnhancement", "lipVessels", "lipNonFatFeatures"],
      lipSeptations: ["lipVessels"],
      cystCommunication: ["cystLocation", "cystFlowVoids", "cystSeptations", "cystHematoma"],
      cystLocation: ["cystFlowVoids", "cystSeptations", "cystHematoma"],
      cystFlowVoids: ["cystSeptations", "cystHematoma"],
      cystHematoma: ["cystSeptations"],
      solidCompartment: ["vascularT2", "vascularPhleboliths", "vascularFluidLevels", "iaHemosiderin", "iaBloomingGRE", "nerveTargetSign", "nerveADC", "cutGrowthPattern", "cutEnhancement", "deepMuscleSignature", "deepHistory", "deepEdema", "deepMineralization", "fascialNoduleSize", "fascialMultifocal", "subungualSize", "tendonSize", "tendonAutoimmune"],
      vascularT2: ["vascularPhleboliths", "vascularFluidLevels"],
      deepMuscleSignature: ["deepHistory", "deepEdema", "deepMineralization"],
      cutGrowthPattern: ["cutEnhancement"],
    };
    return deps[changedKey] || [];
  };

  const handleCalculate = () => {
    let result = calculateSTRADS(caseData);
    if (caseData.adcValue) {
      result = applyADCModifier(result, caseData.adcValue);
    }
    if (caseData.ancillaryFeatures?.length > 0) {
      result = applyAncillaryModifier(result, caseData.ancillaryFeatures);
    }
    setShowResult(true);
    return result;
  };

  const handleReset = () => {
    setCaseData({});
    setCurrentStepIndex(0);
    setShowResult(false);
  };

  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoBack = currentStepIndex > 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Check if current step has minimum required answers
  const currentStep = steps[currentStepIndex];
  const hasRequiredAnswers = currentStep?.questions?.every(q => {
    if (q.type === "checkbox" || q.type === "number") return true; // optional
    return caseData[q.id] !== undefined && caseData[q.id] !== "";
  });

  // Can we show the calculate button?
  // Early termination: if exam is incomplete, lesion absent, or known tumor answered
  const canCalculateEarly = (
    caseData.examAdequacy === "incomplete" ||
    caseData.lesionPresent === "no" ||
    (caseData.knownTumor === "yes" && caseData.knownTumorStatus)
  );

  const result = useMemo(() => {
    if (!showResult) return null;
    let r = calculateSTRADS(caseData);
    if (caseData.adcValue) r = applyADCModifier(r, caseData.adcValue);
    if (caseData.ancillaryFeatures?.length > 0) r = applyAncillaryModifier(r, caseData.ancillaryFeatures);
    return r;
  }, [showResult, caseData]);

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
            <Calculator className="w-16 h-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign Up to Use the Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a free account to access the ST-RADS Calculator and get your first 5 analyses free.</p>
            <Button
              onClick={() => User.login()}
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
        <ResultPanel result={result} caseData={caseData} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">ST-RADS Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Interactive decision engine based on the official ACR ST-RADS v2025 framework</p>
      </div>

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

            {(canCalculateEarly || isLastStep) && hasRequiredAnswers ? (
              <Button
                onClick={() => setShowResult(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="w-4 h-4" /> Calculate ST-RADS
              </Button>
            ) : canGoNext && hasRequiredAnswers ? (
              <Button
                onClick={() => setCurrentStepIndex(i => i + 1)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button disabled className="gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}