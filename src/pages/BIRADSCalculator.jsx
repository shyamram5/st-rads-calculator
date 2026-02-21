import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw, Calculator, Info, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MammoWizard, { getMammoSteps, canCalculateMammo } from "../components/birads/MammoWizard";
import USWizard, { getUSSteps, canCalculateUS } from "../components/birads/USWizard";
import BIRADSResultPanel from "../components/birads/BIRADSResultPanel";
import BIRADSLocationDoc from "../components/birads/BIRADSLocationDoc";
import BIRADSReference from "../components/birads/BIRADSReference";
import { scoreMammography, scoreUltrasound, combinedAssessment } from "../components/birads/biradsRuleEngine";
import { buildMammoSummary, buildUSSummary, buildLocationSummary } from "../components/birads/buildSummary";

const MODALITY_OPTIONS = [
  { value: "mammo", label: "Mammography Only", icon: "📷" },
  { value: "us", label: "Ultrasound Only", icon: "🔊" },
  { value: "both", label: "Both Mammography + Ultrasound", icon: "📷+🔊" },
];

export default function BIRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [modality, setModality] = useState(null);
  const [mammoData, setMammoData] = useState({});
  const [usData, setUSData] = useState({});
  const [mammoStep, setMammoStep] = useState(0);
  const [usStep, setUSStep] = useState(0);
  const [activeTab, setActiveTab] = useState("mammo"); // mammo | us | location | reference
  const [location, setLocation] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

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

  // Dynamic steps
  const mammoSteps = getMammoSteps(mammoData);
  const usSteps = getUSSteps(usData);

  const mammoReady = canCalculateMammo(mammoData);
  const usReady = canCalculateUS(usData);

  const canCalculate = () => {
    if (modality === "mammo") return mammoReady;
    if (modality === "us") return usReady;
    if (modality === "both") return mammoReady && usReady;
    return false;
  };

  // Field change handlers that clear dependent fields
  const handleMammoChange = useCallback((field, value) => {
    setMammoData(prev => {
      const next = { ...prev, [field]: value };
      const fields = mammoSteps.map(s => s.field);
      const idx = fields.indexOf(field);
      // For checkbox fields, don't clear dependents
      const step = mammoSteps.find(s => s.field === field);
      if (step?.type !== "checkbox") {
        for (let i = idx + 1; i < fields.length; i++) {
          delete next[fields[i]];
        }
      }
      return next;
    });
    setShowResult(false);
  }, [mammoSteps]);

  const handleUSChange = useCallback((field, value) => {
    setUSData(prev => {
      const next = { ...prev, [field]: value };
      const fields = usSteps.map(s => s.field);
      const idx = fields.indexOf(field);
      const step = usSteps.find(s => s.field === field);
      if (step?.type !== "checkbox") {
        for (let i = idx + 1; i < fields.length; i++) {
          delete next[fields[i]];
        }
      }
      return next;
    });
    setShowResult(false);
  }, [usSteps]);

  // Auto-advance for radio steps
  useEffect(() => {
    if (showResult) return;
    if (activeTab === "mammo") {
      const step = mammoSteps[mammoStep];
      if (!step || step.type !== "radio") return;
      const val = mammoData[step.field];
      if (!val) return;
      if (mammoStep >= mammoSteps.length - 1) return;
      const timer = setTimeout(() => setMammoStep(i => Math.min(i + 1, mammoSteps.length - 1)), 150);
      return () => clearTimeout(timer);
    }
    if (activeTab === "us") {
      const step = usSteps[usStep];
      if (!step || step.type !== "radio") return;
      const val = usData[step.field];
      if (!val) return;
      if (usStep >= usSteps.length - 1) return;
      const timer = setTimeout(() => setUSStep(i => Math.min(i + 1, usSteps.length - 1)), 150);
      return () => clearTimeout(timer);
    }
  }, [mammoData, usData, mammoStep, usStep, activeTab, showResult, mammoSteps, usSteps]);

  const handleCalculate = () => {
    setShowResult(true);
    setShowLocationPrompt(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setModality(null);
    setMammoData({});
    setUSData({});
    setMammoStep(0);
    setUSStep(0);
    setLocation({});
    setShowResult(false);
    setShowLocationPrompt(false);
    setActiveTab("mammo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Compute results
  let mammoCategory = null, usCategory = null, finalCategory = null;
  if (showResult) {
    if (modality === "mammo" || modality === "both") mammoCategory = scoreMammography(mammoData);
    if (modality === "us" || modality === "both") usCategory = scoreUltrasound(usData);
    if (modality === "mammo") finalCategory = mammoCategory;
    else if (modality === "us") finalCategory = usCategory;
    else if (modality === "both") finalCategory = combinedAssessment(mammoCategory, usCategory);
  }

  // Summary lines
  const summaryLines = [];
  if (modality === "mammo" || modality === "both") {
    summaryLines.push("— MAMMOGRAPHY —");
    summaryLines.push(...buildMammoSummary(mammoData));
  }
  if (modality === "us" || modality === "both") {
    summaryLines.push("— ULTRASOUND —");
    summaryLines.push(...buildUSSummary(usData));
  }
  const locLines = buildLocationSummary(location);
  if (locLines.length > 0) {
    summaryLines.push("— LOCATION —");
    summaryLines.push(...locLines);
  }

  // Need biopsy/follow-up?
  const needsLocation = finalCategory && !["0", "1", "2"].includes(finalCategory);

  // ═══════════════════════════════════════
  // AUTH GATES
  // ═══════════════════════════════════════
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto">
            <Calculator className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign in to continue</h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Create a free account to access BI-RADS — 5 free analyses included.</p>
          </div>
          <Button onClick={(e) => { e.preventDefault(); User.login(); }}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 h-10 rounded-lg text-sm font-medium shadow-none">
            <LogIn className="mr-2 h-4 w-4" /> Sign Up / Log In
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // MODALITY SELECTION
  // ═══════════════════════════════════════
  if (!modality) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">ACR BI-RADS® Calculator</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Breast Imaging · 5th Edition (2013)</p>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 0 — Modality Selection</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Which modality are you reporting?</p>
            <div className="space-y-2">
              {MODALITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setModality(opt.value);
                    setActiveTab(opt.value === "us" ? "us" : "mammo");
                  }}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-600 bg-white dark:bg-slate-900 transition-all"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt.icon} {opt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/50">
              <Info className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-pink-700 dark:text-pink-300 leading-relaxed">
                When both modalities are performed, the final overall BI-RADS assessment must be based on the most suspicious finding — i.e., the highest likelihood of malignancy between the two studies.
              </p>
            </div>
          </CardContent>
        </Card>

        <BIRADSReference />

        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-4">
          Based on ACR BI-RADS® Atlas, 5th Edition (2013). For clinical decision support only — not a substitute for radiologist judgment.
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // RESULT VIEW
  // ═══════════════════════════════════════
  if (showResult && finalCategory) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">BI-RADS Assessment Result</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">ACR BI-RADS® 5th Edition (2013)</p>
        </div>

        <BIRADSResultPanel
          category={finalCategory}
          summaryLines={summaryLines}
          modality={modality}
          mammoCategory={mammoCategory}
          usCategory={usCategory}
          onReset={handleReset}
        />

        {/* Location documentation for biopsy/follow-up findings */}
        {needsLocation && (
          <BIRADSLocationDoc location={location} onChange={setLocation} />
        )}

        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
          Based on ACR BI-RADS® Atlas, 5th Edition (2013). Reference: radiologyassistant.nl/breast/bi-rads. For clinical decision support only.
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // WIZARD VIEW
  // ═══════════════════════════════════════
  const currentSteps = activeTab === "mammo" ? mammoSteps : usSteps;
  const currentIdx = activeTab === "mammo" ? mammoStep : usStep;
  const setCurrentIdx = activeTab === "mammo" ? setMammoStep : setUSStep;
  const currentStep = currentSteps[currentIdx];

  const tabs = [];
  if (modality === "mammo" || modality === "both") tabs.push({ key: "mammo", label: "Mammography", ready: mammoReady });
  if (modality === "us" || modality === "both") tabs.push({ key: "us", label: "Ultrasound", ready: usReady });
  tabs.push({ key: "reference", label: "Reference" });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">ACR BI-RADS® Calculator</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {modality === "mammo" ? "Mammography" : modality === "us" ? "Ultrasound" : "Mammography + Ultrasound"} · 5th Edition (2013)
        </p>
      </div>

      {/* Tab Bar */}
      {tabs.length > 1 && (
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
              {tab.ready !== undefined && (
                <span className={`ml-1.5 w-2 h-2 rounded-full inline-block ${tab.ready ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Reference Tab */}
      {activeTab === "reference" ? (
        <BIRADSReference />
      ) : (
        <>
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Step {currentIdx + 1} of {currentSteps.length}</span>
              <span className="truncate ml-4">{currentStep?.title?.replace(/^[MU]\d+[a-z]?\s*—\s*/, "")}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-pink-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentIdx + 1) / currentSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Wizard Step */}
          {currentStep && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentStep.id}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "mammo" ? (
                  <MammoWizard data={mammoData} currentStepIndex={currentIdx} onChange={handleMammoChange} />
                ) : (
                  <USWizard data={usData} currentStepIndex={currentIdx} onChange={handleUSChange} />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentIdx(i => Math.max(i - 1, 0))}
              disabled={currentIdx === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleReset} className="gap-2 text-slate-500 text-xs">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>

              {/* Next for checkbox steps */}
              {currentStep?.type === "checkbox" && currentIdx < currentSteps.length - 1 && (
                <Button
                  onClick={() => setCurrentIdx(i => Math.min(i + 1, currentSteps.length - 1))}
                  variant="outline" className="gap-2 rounded-full px-5 text-sm font-semibold"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              )}

              {canCalculate() && (
                <Button onClick={handleCalculate}
                  className="gap-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-lg px-5 text-sm font-medium shadow-none">
                  <Calculator className="w-4 h-4" /> Calculate BI-RADS
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-2">
        Based on ACR BI-RADS® Atlas, 5th Edition (2013). Reference: radiologyassistant.nl/breast/bi-rads/bi-rads-for-mammography-and-ultrasound-2013. For clinical decision support only — not a substitute for radiologist judgment or the complete BI-RADS Atlas.
      </p>
    </div>
  );
}