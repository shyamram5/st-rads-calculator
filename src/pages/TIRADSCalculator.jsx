import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import TIRADSFeatureSelector from "@/components/tirads/TIRADSFeatureSelector";
import TIRADSResultPanel from "@/components/tirads/TIRADSResultPanel";
import {
  calculateTIRADS,
  COMPOSITION_OPTIONS,
  ECHOGENICITY_OPTIONS,
  SHAPE_OPTIONS,
  MARGIN_OPTIONS,
  ECHOGENIC_FOCI_OPTIONS,
} from "@/components/tirads/tiradsRuleEngine";

export default function TIRADSCalculatorPage() {
  const [selections, setSelections] = useState({
    composition: "",
    echogenicity: "",
    shape: "",
    margin: "",
    echogenicFoci: [],
  });
  const [noduleSize, setNoduleSize] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleChange = (field, value) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
    setShowResult(false);
  };

  const handleReset = () => {
    setSelections({ composition: "", echogenicity: "", shape: "", margin: "", echogenicFoci: [] });
    setNoduleSize("");
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasAnySelection = selections.composition || selections.echogenicity || selections.shape || selections.margin || selections.echogenicFoci.length > 0;

  const result = useMemo(() => {
    if (!showResult || !hasAnySelection) return null;
    return calculateTIRADS(selections);
  }, [selections, hasAnySelection, showResult]);

  const handleCalculate = () => {
    setShowResult(true);
    setTimeout(() => {
      document.getElementById("tirads-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

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