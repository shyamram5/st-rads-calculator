import React, { useState, useMemo, useEffect, useRef } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Calculator as CalcIcon, LogIn } from "lucide-react";
import TIRADSFeatureSelector from "@/components/tirads/TIRADSFeatureSelector";
import TIRADSResultPanel from "@/components/tirads/TIRADSResultPanel";
import UsageTracker from "../components/UsageTracker";
import PremiumUpgrade from "../components/PremiumUpgrade";
import {
  calculateTIRADS,
  COMPOSITION_OPTIONS,
  ECHOGENICITY_OPTIONS,
  SHAPE_OPTIONS,
  MARGIN_OPTIONS,
  ECHOGENIC_FOCI_OPTIONS,
} from "@/components/tirads/tiradsRuleEngine";

export default function TIRADSCalculatorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const hasTrackedRef = useRef(false);

  const [selections, setSelections] = useState({
    composition: "",
    echogenicity: "",
    shape: "",
    margin: "",
    echogenicFoci: [],
  });
  const [noduleSize, setNoduleSize] = useState("");
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

  const handleChange = (field, value) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
    setShowResult(false);
  };

  const handleReset = () => {
    setSelections({ composition: "", echogenicity: "", shape: "", margin: "", echogenicFoci: [] });
    setNoduleSize("");
    setShowResult(false);
    hasTrackedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasAnySelection = selections.composition || selections.echogenicity || selections.shape || selections.margin || selections.echogenicFoci.length > 0;

  const result = useMemo(() => {
    if (!showResult || !hasAnySelection) return null;
    return calculateTIRADS(selections);
  }, [selections, hasAnySelection, showResult]);

  // Track analysis count
  useEffect(() => {
    if (showResult && result && user && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      const newCount = (user.tirads_analyses_used || 0) + 1;
      User.updateMyUserData({ tirads_analyses_used: newCount });
      setUser(prev => ({ ...prev, tirads_analyses_used: newCount }));
    }
  }, [showResult, result]);

  const isPremium = user?.subscription_tier === "premium" || user?.subscription_tier === "institutional";
  const analysesUsed = user?.tirads_analyses_used || 0;
  const hasReachedLimit = !isPremium && analysesUsed >= 5;

  const handleCalculate = () => {
    setShowResult(true);
    hasTrackedRef.current = false;
    setTimeout(() => {
      document.getElementById("tirads-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

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
            <p className="text-slate-600 dark:text-slate-400">Create a free account to access the TI-RADS Calculator — 5 free analyses to get started.</p>
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

  if (hasReachedLimit) {
    return (
      <div className="min-h-screen space-y-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">TI-RADS Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">You've used all 5 free analyses</p>
        </div>
        <UsageTracker user={user} analysesUsed={analysesUsed} />
        <PremiumUpgrade analysesUsed={analysesUsed} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          ACR <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">TI-RADS</span> Calculator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Assess thyroid nodule malignancy risk based on ultrasound characteristics using the ACR TI-RADS classification system.
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Based on: Tessler FN et al. ACR TI-RADS White Paper. <em>JACR</em> 2017;14:587-595.
        </p>
      </div>

      <UsageTracker user={user} analysesUsed={analysesUsed} />

      {/* Feature Selectors */}
      <div className="space-y-4">
        <TIRADSFeatureSelector
          title="Composition"
          tooltip="Describes the internal structure of the nodule. Spongiform nodules receive 0 points total regardless of other features."
          type="radio"
          options={COMPOSITION_OPTIONS}
          value={selections.composition}
          onChange={(v) => handleChange("composition", v)}
        />

        <TIRADSFeatureSelector
          title="Echogenicity"
          tooltip="Reflectivity of the nodule relative to adjacent thyroid tissue. Very hypoechoic = more hypoechoic than strap muscles."
          type="radio"
          options={ECHOGENICITY_OPTIONS}
          value={selections.echogenicity}
          onChange={(v) => handleChange("echogenicity", v)}
        />

        <TIRADSFeatureSelector
          title="Shape"
          tooltip="Assessed on transverse image. Taller-than-wide is an insensitive but highly specific indicator of malignancy."
          type="radio"
          options={SHAPE_OPTIONS}
          value={selections.shape}
          onChange={(v) => handleChange("shape", v)}
        />

        <TIRADSFeatureSelector
          title="Margin"
          tooltip="Border between the nodule and adjacent thyroid parenchyma. If margin cannot be determined, assign 0 points."
          type="radio"
          options={MARGIN_OPTIONS}
          value={selections.margin}
          onChange={(v) => handleChange("margin", v)}
        />

        <TIRADSFeatureSelector
          title="Echogenic Foci"
          tooltip="Select all echogenic foci present. Punctate echogenic foci are highly suspicious, especially with other suspicious features."
          type="checkbox"
          options={ECHOGENIC_FOCI_OPTIONS}
          value={selections.echogenicFoci}
          onChange={(v) => handleChange("echogenicFoci", v)}
        />
      </div>

      {/* Calculate & Reset Buttons */}
      {hasAnySelection && (
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleCalculate}
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 font-semibold shadow-lg shadow-blue-500/25"
          >
            Calculate TI-RADS
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2 rounded-full">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="pt-2" id="tirads-result">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Assessment Results</h2>
          <TIRADSResultPanel
            result={result}
            selections={selections}
            noduleSize={noduleSize}
            onSizeChange={setNoduleSize}
          />
        </div>
      )}
    </div>
  );
}