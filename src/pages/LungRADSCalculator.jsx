import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw, Calculator, LogIn, Plus, ListOrdered, FileText, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LungRADSWizardStep from "../components/lungrads/LungRADSWizardStep";
import LungRADSResultPanel from "../components/lungrads/LungRADSResultPanel";
import LungRADSReference from "../components/lungrads/LungRADSReference";
import MultiNoduleSummary from "../components/lungrads/MultiNoduleSummary";
import SizeThresholdSidebar from "../components/lungrads/SizeThresholdSidebar";
import { getWizardSteps } from "../components/lungrads/lungRadsWizardSteps";
import { classifyNodule } from "../components/lungrads/lungRadsRuleEngine";

const TABS = [
  { key: "entry", label: "Nodule Entry", icon: Calculator },
  { key: "multi", label: "Multi-Nodule", icon: ListOrdered },
  { key: "reference", label: "Quick Reference", icon: BookOpen },
];

export default function LungRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("entry");

  // Current nodule wizard state
  const [data, setData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Multi-nodule
  const [savedNodules, setSavedNodules] = useState([]);
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
      finally { setAuthLoading(false); }
    };
    checkUser();
  }, []);

  const steps = useMemo(() => getWizardSteps(data), [data]);
  const currentStep = steps[currentStepIndex];

  // Compute mean diameters from raw inputs
  const meanDiameter = data.longAxis && data.shortAxis
    ? Math.round(((parseFloat(data.longAxis) + parseFloat(data.shortAxis)) / 2) * 10) / 10
    : null;

  const totalMeanDiameter = meanDiameter;
  const solidMeanDiameter = data.solidLongAxis && data.solidShortAxis
    ? Math.round(((parseFloat(data.solidLongAxis) + parseFloat(data.solidShortAxis)) / 2) * 10) / 10
    : null;

  // Build nodule object for classification
  const buildNodule = useCallback(() => {
    const nodule = { ...data };
    if (meanDiameter) nodule.meanDiameter = meanDiameter;
    if (totalMeanDiameter) nodule.totalMeanDiameter = totalMeanDiameter;
    if (solidMeanDiameter) nodule.solidMeanDiameter = solidMeanDiameter;
    if (data.volume) nodule.volume = parseFloat(data.volume);

    // Clean up suspicious features
    if (Array.isArray(nodule.suspiciousFeatures)) {
      nodule.suspiciousFeatures = nodule.suspiciousFeatures.filter(f => f !== "none");
    }

    return nodule;
  }, [data, meanDiameter, totalMeanDiameter, solidMeanDiameter]);

  const result = useMemo(() => {
    if (!showResult) return null;
    return classifyNodule(buildNodule());
  }, [showResult, buildNodule]);

  const handleChange = useCallback((field, value) => {
    setData(prev => {
      const next = { ...prev, [field]: value };
      // Clear downstream fields for radio steps
      const allFields = getWizardSteps(prev).map(s => s.field);
      const idx = allFields.indexOf(field);
      const step = getWizardSteps(prev).find(s => s.field === field);
      if (step?.type !== "checkbox" && step?.type !== "number") {
        for (let i = idx + 1; i < allFields.length; i++) {
          delete next[allFields[i]];
        }
      }
      return next;
    });
    setShowResult(false);
  }, []);

  const handleNumberChange = useCallback((fieldId, value) => {
    setData(prev => ({ ...prev, [fieldId]: value }));
    setShowResult(false);
  }, []);

  // Auto-advance for radio steps
  useEffect(() => {
    if (showResult) return;
    if (!currentStep || currentStep.type !== "radio") return;
    const val = data[currentStep.field];
    if (val === undefined || val === "") return;
    if (currentStepIndex >= steps.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1));
    }, 150);
    return () => clearTimeout(timer);
  }, [data, currentStep, currentStepIndex, steps.length, showResult]);

  const canCalculate = useMemo(() => {
    // Need at least exam type + nodule type
    if (!data.examType) return false;
    if (data.priorsAvailable === "being_located") return true;
    if (!data.noduleType) return false;
    if (data.noduleType === "none") return true;
    if (data.benignFeatures === "yes") return true;
    if (data.noduleType === "airway" && data.airwayLocation) return true;
    if (data.noduleType === "cyst") {
      if (data.cystType === "thin_walled") return true;
      if (data.cystType && (data.examType === "baseline" || data.cystChanging)) return true;
    }
    if (data.noduleType === "juxtapleural" && data.juxtapleuralShape === "benign_pattern" && data.longAxis && data.shortAxis) return true;
    if (data.longAxis && data.shortAxis) return true;
    return false;
  }, [data]);

  const handleCalculate = () => {
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setData({});
    setCurrentStepIndex(0);
    setShowResult(false);
    setActiveTab("entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveAndAddNodule = () => {
    if (!result) return;
    const nodule = buildNodule();
    setSavedNodules(prev => [...prev, nodule]);
    setSavedResults(prev => [...prev, result]);
    handleReset();
  };

  const handleRemoveNodule = (idx) => {
    setSavedNodules(prev => prev.filter((_, i) => i !== idx));
    setSavedResults(prev => prev.filter((_, i) => i !== idx));
  };

  // ─── Auth gate ───
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
          <CardContent className="p-8 space-y-6">
            <Calculator className="w-16 h-16 text-teal-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign Up to Use the Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400">Create a free account to access the Lung-RADS Calculator — 5 free analyses to get started.</p>
            <Button onClick={(e) => { e.preventDefault(); User.login(); }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-full text-lg">
              <LogIn className="mr-2 h-5 w-5" /> Sign Up / Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          ACR <span className="bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Lung-RADS®</span> v2022
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clinical-grade lung cancer screening CT decision support tool
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.key === "multi" && savedNodules.length > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedNodules.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reference tab */}
      {activeTab === "reference" && <LungRADSReference />}

      {/* Multi-nodule tab */}
      {activeTab === "multi" && (
        <div className="space-y-4">
          {savedNodules.length === 0 ? (
            <Card className="border border-dashed border-slate-300 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-slate-500">No nodules saved yet. Complete a nodule assessment and save it.</p>
              </CardContent>
            </Card>
          ) : (
            <MultiNoduleSummary nodules={savedNodules} results={savedResults} onRemoveNodule={handleRemoveNodule} />
          )}
        </div>
      )}

      {/* Entry tab */}
      {activeTab === "entry" && (
        <>
          {/* Result view */}
          {showResult && result ? (
            <div className="space-y-5">
              <LungRADSResultPanel nodule={buildNodule()} result={result} onReset={handleReset} />

              {savedNodules.length < 6 && (
                <div className="flex justify-center">
                  <Button onClick={handleSaveAndAddNodule} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6">
                    <Plus className="w-4 h-4" /> Save & Add Another Nodule
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span>Step {currentStepIndex + 1} of {steps.length}</span>
                  <span className="truncate ml-4">{currentStep?.title?.replace(/^Step \d+[a-z]?\s*—\s*/, "")}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
                </div>
              </div>

              {/* Two-column: wizard + sidebar */}
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  {currentStep && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <LungRADSWizardStep
                          title={currentStep.title}
                          description={currentStep.description}
                          tip={currentStep.tip}
                          warningTip={currentStep.warningTip}
                          type={currentStep.type}
                          options={currentStep.options}
                          value={data[currentStep.field]}
                          onChange={(val) => handleChange(currentStep.field, val)}
                          numberFields={currentStep.numberFields}
                          numberValues={data}
                          onNumberChange={handleNumberChange}
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Size threshold sidebar — desktop only */}
                {meanDiameter && (
                  <div className="hidden lg:block w-44 flex-shrink-0">
                    <div className="sticky top-20">
                      <SizeThresholdSidebar meanDiameter={meanDiameter} />
                      {meanDiameter && (
                        <div className="mt-3 text-center">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mean Diameter</p>
                          <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400">{meanDiameter} mm</p>
                          {data.volume && <p className="text-[11px] text-slate-500">Vol: {data.volume} mm³</p>}
                          {solidMeanDiameter && <p className="text-[11px] text-slate-500">Solid: {solidMeanDiameter} mm</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile mean diameter display */}
              {meanDiameter && (
                <div className="lg:hidden flex items-center justify-center gap-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
                  <div className="text-center">
                    <p className="text-[10px] text-teal-600 uppercase tracking-wider font-bold">Mean Ø</p>
                    <p className="text-lg font-extrabold text-teal-700 dark:text-teal-300">{meanDiameter} mm</p>
                  </div>
                  {solidMeanDiameter && (
                    <div className="text-center border-l border-teal-200 dark:border-teal-800 pl-4">
                      <p className="text-[10px] text-teal-600 uppercase tracking-wider font-bold">Solid Ø</p>
                      <p className="text-lg font-extrabold text-teal-700 dark:text-teal-300">{solidMeanDiameter} mm</p>
                    </div>
                  )}
                  {data.volume && (
                    <div className="text-center border-l border-teal-200 dark:border-teal-800 pl-4">
                      <p className="text-[10px] text-teal-600 uppercase tracking-wider font-bold">Volume</p>
                      <p className="text-lg font-extrabold text-teal-700 dark:text-teal-300">{data.volume} mm³</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStepIndex(i => Math.max(i - 1, 0))}
                  disabled={currentStepIndex === 0} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleReset} className="gap-2 text-slate-500 text-xs">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </Button>

                  {currentStep?.type === "checkbox" && currentStepIndex < steps.length - 1 && (
                    <Button onClick={() => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1))}
                      variant="outline" className="gap-2 rounded-full px-5 text-sm font-semibold">
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}

                  {currentStep?.type === "number" && currentStepIndex < steps.length - 1 && data.longAxis && data.shortAxis && (
                    <Button onClick={() => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1))}
                      variant="outline" className="gap-2 rounded-full px-5 text-sm font-semibold">
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}

                  {canCalculate && (
                    <Button onClick={handleCalculate}
                      className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-5 text-sm font-semibold shadow-lg shadow-teal-500/25">
                      <Calculator className="w-4 h-4" /> Calculate Lung-RADS
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Footer */}
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-4">
        Based on ACR Lung-RADS® v2022, released November 2022. Source: American College of Radiology. 
        For clinical decision support only — not a substitute for radiologist judgment or the complete ACR Lung-RADS v2022 document. 
        Once a patient is diagnosed with lung cancer, further imaging is performed for staging purposes and is no longer considered screening.
      </p>
    </div>
  );
}