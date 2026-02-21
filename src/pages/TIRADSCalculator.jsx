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
            <CalcIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign in to continue</h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Create a free account to access TI-RADS — 5 free analyses included.</p>
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ACR TI-RADS Calculator
        </h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Thyroid nodule risk assessment · ACR TI-RADS 2017
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
            className="gap-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-lg px-8 font-medium shadow-none"
          >
            Calculate TI-RADS
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2 rounded-lg border-gray-200 dark:border-gray-800">
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