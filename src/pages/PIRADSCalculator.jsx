import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, LogIn, Plus, Trash2, RotateCcw, Copy, Check, ListOrdered, BookOpen, FileText, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PIRADSExamSetup from "../components/pirads/PIRADSExamSetup";
import PIRADSScoreCard from "../components/pirads/PIRADSScoreCard";
import PIRADSResultCard from "../components/pirads/PIRADSResultCard";
import PIRADSReference from "../components/pirads/PIRADSReference";
import PIRADSStagingPanel from "../components/pirads/PIRADSStagingPanel";
import { classifyLesion, identifyIndexLesion, generatePIRADSReport, CATEGORIES } from "../components/pirads/piradsRuleEngine";

const EMPTY_LESION = { zone: "", effectiveZone: "", region: "", side: "", subregion: "", size: "", measureSequence: "", epe: "none", t2w: null, dwi: null, dce: null };

const TABS = [
  { key: "scoring", label: "Lesion Scoring", icon: Calculator },
  { key: "summary", label: "Summary", icon: ListOrdered },
  { key: "staging", label: "Staging", icon: Shield },
  { key: "reference", label: "Reference", icon: BookOpen },
];

export default function PIRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("scoring");

  // Exam setup
  const [examData, setExamData] = useState({});
  const [examSetupComplete, setExamSetupComplete] = useState(false);

  // Lesions
  const [lesions, setLesions] = useState([{ ...EMPTY_LESION }]);
  const [activeLesionIdx, setActiveLesionIdx] = useState(0);

  // Staging
  const [staging, setStaging] = useState({});

  // Report copy
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
      finally { setAuthLoading(false); }
    };
    checkUser();
  }, []);

  // Classify all lesions live
  const results = useMemo(() => {
    return lesions.map(l => {
      // Auto-assign DWI X if exam-level DWI is inadequate
      const lesionWithExam = { ...l };
      if (examData.dwiQuality === "X" && l.dwi !== "X") lesionWithExam.dwi = "X";
      if ((examData.dceQuality === "X" || examData.dceQuality === "not_performed") && !l.dce) lesionWithExam.dce = "X";

      if (!l.zone || l.t2w === null) return null;
      // Need at least T2W to classify
      const effectiveZone = l.effectiveZone || l.zone;
      const isPZ = effectiveZone === "PZ";
      if (isPZ && l.dwi === null && examData.dwiQuality !== "X") return null;
      return classifyLesion({ ...lesionWithExam, effectiveZone });
    });
  }, [lesions, examData]);

  const indexIdx = useMemo(() => {
    const validResults = results.filter(r => r && r.category);
    if (validResults.length === 0) return -1;
    return identifyIndexLesion(lesions, results);
  }, [lesions, results]);

  const updateLesion = useCallback((idx, updatedLesion) => {
    setLesions(prev => prev.map((l, i) => i === idx ? updatedLesion : l));
  }, []);

  const addLesion = () => {
    if (lesions.length >= 4) return;
    setLesions(prev => [...prev, { ...EMPTY_LESION }]);
    setActiveLesionIdx(lesions.length);
  };

  const removeLesion = (idx) => {
    if (lesions.length <= 1) return;
    setLesions(prev => prev.filter((_, i) => i !== idx));
    setActiveLesionIdx(Math.max(0, activeLesionIdx - 1));
  };

  const handleReset = () => {
    setExamData({});
    setExamSetupComplete(false);
    setLesions([{ ...EMPTY_LESION }]);
    setActiveLesionIdx(0);
    setStaging({});
    setActiveTab("scoring");
  };

  const reportText = useMemo(() => {
    if (!examSetupComplete) return "";
    return generatePIRADSReport(examData, lesions, results, indexIdx);
  }, [examData, lesions, results, indexIdx, examSetupComplete]);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auth gate
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
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Create a free account to access PI-RADS.</p>
          </div>
          <Button onClick={(e) => { e.preventDefault(); User.login(); }}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 h-10 rounded-lg text-sm font-medium shadow-none">
            <LogIn className="mr-2 h-4 w-4" /> Sign Up / Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">PI-RADS® v2.1 Calculator</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400">Prostate MRI · ACR–ESUR · 2019</p>
      </div>

      {/* Exam setup phase */}
      {!examSetupComplete ? (
        <PIRADSExamSetup examData={examData} onChange={setExamData} onComplete={() => setExamSetupComplete(true)} />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reference */}
          {activeTab === "reference" && <PIRADSReference />}

          {/* Staging */}
          {activeTab === "staging" && <PIRADSStagingPanel staging={staging} onChange={setStaging} />}

          {/* Summary / Report */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              {/* All lesion result cards */}
              {lesions.map((l, i) => {
                const r = results[i];
                return r && r.category ? (
                  <PIRADSResultCard key={i} result={r} lesion={l} lesionIndex={i} isIndex={i === indexIdx} />
                ) : (
                  <Card key={i} className="border border-dashed border-slate-300 dark:border-slate-700">
                    <CardContent className="p-4 text-center text-xs text-slate-400">Lesion {i + 1}: Incomplete — finish scoring</CardContent>
                  </Card>
                );
              })}

              {/* Summary table */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Lesion Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead><tr className="bg-slate-50 dark:bg-slate-800">
                        <th className="p-1.5 text-left font-bold">#</th><th className="p-1.5 text-left font-bold">Zone</th><th className="p-1.5 text-left font-bold">Location</th>
                        <th className="p-1.5 text-left font-bold">Size</th><th className="p-1.5 text-left font-bold">T2W</th><th className="p-1.5 text-left font-bold">DWI</th>
                        <th className="p-1.5 text-left font-bold">DCE</th><th className="p-1.5 text-left font-bold">EPE</th><th className="p-1.5 text-left font-bold">PI-RADS</th>
                      </tr></thead>
                      <tbody>
                        {lesions.map((l, i) => {
                          const r = results[i];
                          const cat = r?.category;
                          const catInfo = cat ? CATEGORIES[cat] : null;
                          return (
                            <tr key={i} className="border-t border-slate-200/60 dark:border-slate-700/40">
                              <td className="p-1.5 font-bold">{i + 1}{i === indexIdx ? " ★" : ""}</td>
                              <td className="p-1.5">{l.zone}</td>
                              <td className="p-1.5">{[l.region, l.side, l.subregion].filter(Boolean).join(" ")}</td>
                              <td className="p-1.5">{l.size ? `${l.size} mm` : "—"}</td>
                              <td className="p-1.5">{l.t2w ?? "—"}</td>
                              <td className="p-1.5">{l.dwi ?? "—"}</td>
                              <td className="p-1.5">{l.dce ?? "—"}</td>
                              <td className="p-1.5">{l.epe === "definite" ? "Definite" : l.epe === "suspected" ? "Susp." : "—"}</td>
                              <td className="p-1.5">{cat ? <span className={`inline-block px-1.5 py-0.5 rounded text-white text-[10px] font-black ${catInfo.color}`}>{cat}</span> : "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {examData.prostateVolume && (
                    <p className="text-[10px] text-slate-400 mt-2">Volume: {examData.prostateVolume} mL · PSAD: {examData.psad}</p>
                  )}
                </CardContent>
              </Card>

              {/* Report */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Structured Report</h3>
                    <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-1.5 text-xs">
                      {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Report</>}
                    </Button>
                  </div>
                  <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/40 font-mono max-h-96 overflow-y-auto">
                    {reportText}
                  </pre>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button variant="outline" onClick={handleReset} className="gap-2 rounded-full">
                  <RotateCcw className="w-4 h-4" /> New Exam
                </Button>
              </div>
            </div>
          )}

          {/* Scoring tab */}
          {activeTab === "scoring" && (
            <div className="space-y-4">
              {/* Lesion tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {lesions.map((_, i) => {
                  const r = results[i];
                  const cat = r?.category;
                  const catInfo = cat ? CATEGORIES[cat] : null;
                  return (
                    <button key={i} onClick={() => setActiveLesionIdx(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeLesionIdx === i ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" : "border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                      Lesion {i + 1}
                      {cat && <span className={`inline-block w-5 h-5 rounded text-white text-[9px] font-black flex items-center justify-center leading-5 text-center ${catInfo.color}`}>{cat}</span>}
                      {i === indexIdx && <span className="text-[9px] text-violet-500 font-bold">★</span>}
                    </button>
                  );
                })}
                {lesions.length < 4 && (
                  <Button variant="ghost" size="sm" onClick={addLesion} className="gap-1 text-xs text-violet-600 hover:text-violet-700">
                    <Plus className="w-3.5 h-3.5" /> Add Lesion
                  </Button>
                )}
                {lesions.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeLesion(activeLesionIdx)} className="gap-1 text-xs text-red-500 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </Button>
                )}
              </div>

              {lesions.length >= 4 && (
                <p className="text-[10px] text-slate-400 italic">PI-RADS v2.1: report only the 4 lesions with the highest likelihood of clinically significant cancer.</p>
              )}

              {/* Score card + live result side by side */}
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeLesionIdx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }}>
                      <PIRADSScoreCard
                        lesion={lesions[activeLesionIdx]}
                        onChange={(l) => updateLesion(activeLesionIdx, l)}
                        examData={examData}
                        liveResult={results[activeLesionIdx]}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Live result sidebar — desktop */}
                <div className="hidden lg:block w-56 flex-shrink-0">
                  <div className="sticky top-20 space-y-3">
                    {results[activeLesionIdx] && results[activeLesionIdx].category ? (
                      <PIRADSResultCard result={results[activeLesionIdx]} lesion={lesions[activeLesionIdx]} lesionIndex={activeLesionIdx} isIndex={activeLesionIdx === indexIdx} />
                    ) : (
                      <Card className="border border-dashed border-slate-300 dark:border-slate-700">
                        <CardContent className="p-4 text-center text-xs text-slate-400">
                          Complete zone + sequence scores to see result
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile result */}
              {results[activeLesionIdx] && results[activeLesionIdx].category && (
                <div className="lg:hidden">
                  <PIRADSResultCard result={results[activeLesionIdx]} lesion={lesions[activeLesionIdx]} lesionIndex={activeLesionIdx} isIndex={activeLesionIdx === indexIdx} />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-4">
        Based on PI-RADS® v2.1, ACR–ESUR–AdMeTech, 2019. For clinical decision support only — not a management recommendation.
        PI-RADS categories are based on mpMRI findings only. PI-RADS v2.1 does not address suspected recurrent prostate cancer following therapy.
      </p>
    </div>
  );
}