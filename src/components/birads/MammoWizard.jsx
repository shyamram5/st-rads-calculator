import React from "react";
import BIRADSWizardStep from "./BIRADSWizardStep";
import {
  MAMMO_COMPOSITION, MAMMO_FINDING_TYPES, MASS_SHAPE, MASS_MARGIN, MASS_DENSITY,
  MAMMO_ASSOCIATED_FEATURES, ASYMMETRY_TYPES, CALC_MORPHOLOGY, CALC_DISTRIBUTION,
} from "./biradsRuleEngine";

function getSteps(data) {
  const steps = [];

  steps.push({
    id: "mammoComposition", field: "mammoComposition", type: "radio",
    title: "M1 — Breast Composition",
    description: "Select the breast composition category per BI-RADS 2013.",
    tip: "BI-RADS 2013 discourages the use of density percentages. Category (c) applies when fibroglandular tissue is sufficiently dense to obscure small masses — regardless of overall volume.",
    options: MAMMO_COMPOSITION,
  });

  steps.push({
    id: "findingType", field: "findingType", type: "radio",
    title: "M2 — Primary Finding Type",
    description: "What is the primary mammographic finding?",
    options: MAMMO_FINDING_TYPES,
  });

  if (!data.findingType || data.findingType === "no_finding" || data.findingType === "known_malignancy") return steps;

  // ── MASS path ──
  if (data.findingType === "mass") {
    steps.push({
      id: "massShape", field: "massShape", type: "radio",
      title: "M2a — Mass Shape", description: "Select the mass shape.", options: MASS_SHAPE,
    });
    if (data.massShape) {
      steps.push({
        id: "massMargin", field: "massMargin", type: "radio",
        title: "M2b — Mass Margin", description: "Select the mass margin.",
        tip: "Circumscribed = benign feature. Microlobulated/Indistinct = suspicious. Spiculated = highly suspicious.",
        options: MASS_MARGIN,
      });
    }
    if (data.massMargin) {
      steps.push({
        id: "massDensity", field: "massDensity", type: "radio",
        title: "M2c — Mass Density", description: "Select the mass density.",
        tip: "High density is associated with malignancy. Fat-containing masses are typically benign. It is extremely rare for breast cancer to be low density.",
        options: MASS_DENSITY,
      });
    }
    if (data.massDensity) {
      steps.push({
        id: "associatedFeatures", field: "associatedFeatures", type: "checkbox",
        title: "M2d — Associated Features", description: "Select all associated features that apply.",
        options: MAMMO_ASSOCIATED_FEATURES,
      });
    }
  }

  // ── ARCHITECTURAL DISTORTION ──
  if (data.findingType === "architectural_distortion") {
    steps.push({
      id: "distortionPriorScar", field: "distortionPriorScar", type: "radio",
      title: "Architectural Distortion — Prior Surgical Scar?",
      description: "Is there a prior surgical scar at this location?",
      infoBox: "Architectural distortion = normal architecture distorted with no definite mass. Thin straight lines or spiculations radiating from a point. DDx: scar tissue vs. carcinoma.",
      options: [
        { value: "yes", label: "Yes — known prior surgical scar at this location" },
        { value: "no", label: "No — no prior surgery" },
        { value: "unknown", label: "Unknown" },
      ],
    });
  }

  // ── ASYMMETRY ──
  if (data.findingType === "asymmetry") {
    steps.push({
      id: "asymmetryType", field: "asymmetryType", type: "radio",
      title: "Asymmetry Type",
      description: "What type of asymmetry is present?",
      options: ASYMMETRY_TYPES,
    });
    if (data.asymmetryType) {
      steps.push({
        id: "asymmetryAssociatedFeatures", field: "asymmetryAssociatedFeatures", type: "radio",
        title: "Associated Features Present?",
        description: "Are there associated features (skin thickening, nipple retraction, thickened septa)?",
        options: [
          { value: "yes", label: "Yes — associated features present" },
          { value: "no", label: "No" },
        ],
      });
    }
  }

  // ── CALCIFICATIONS ──
  if (data.findingType === "calcifications") {
    steps.push({
      id: "calcMorphology", field: "calcMorphology", type: "radio",
      title: "Calcification Morphology",
      description: "Select the calcification morphology.",
      options: CALC_MORPHOLOGY,
    });
    if (data.calcMorphology === "typically_benign") {
      steps.push({
        id: "calcBenignException", field: "calcBenignException", type: "radio",
        title: "Exception Check",
        description: "Is this an isolated new/increasing group of punctate calcifications, or adjacent to a known cancer?",
        tip: "If yes, these typically benign calcifications warrant further evaluation.",
        options: [
          { value: "yes", label: "Yes — new/increasing or adjacent to known cancer" },
          { value: "no", label: "No" },
        ],
      });
    }
    if (data.calcMorphology && data.calcMorphology !== "typically_benign") {
      steps.push({
        id: "calcDistribution", field: "calcDistribution", type: "radio",
        title: "Calcification Distribution",
        description: "Select the distribution of calcifications.",
        options: CALC_DISTRIBUTION,
      });
    }
    // Also show distribution for benign exception = yes
    if (data.calcMorphology === "typically_benign" && data.calcBenignException === "yes") {
      steps.push({
        id: "calcDistribution", field: "calcDistribution", type: "radio",
        title: "Calcification Distribution",
        description: "Select the distribution of calcifications.",
        options: CALC_DISTRIBUTION,
      });
    }
  }

  return steps;
}

function canCalculateMammo(data) {
  if (!data.mammoComposition) return false;
  if (!data.findingType) return false;
  if (data.findingType === "no_finding") return true;
  if (data.findingType === "known_malignancy") return true;
  if (data.findingType === "mass") return !!(data.massShape && data.massMargin && data.massDensity);
  if (data.findingType === "architectural_distortion") return !!data.distortionPriorScar;
  if (data.findingType === "asymmetry") return !!(data.asymmetryType && data.asymmetryAssociatedFeatures);
  if (data.findingType === "calcifications") {
    if (data.calcMorphology === "typically_benign") {
      if (data.calcBenignException === "no") return true;
      if (data.calcBenignException === "yes") return !!data.calcDistribution;
      return false;
    }
    return !!(data.calcMorphology && data.calcDistribution);
  }
  return false;
}

export { getSteps as getMammoSteps, canCalculateMammo };

export default function MammoWizard({ data, currentStepIndex, onChange }) {
  const steps = getSteps(data);
  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  return (
    <BIRADSWizardStep
      title={currentStep.title}
      description={currentStep.description}
      tip={currentStep.tip}
      infoBox={currentStep.infoBox}
      type={currentStep.type}
      options={currentStep.options}
      value={data[currentStep.field]}
      onChange={(val) => onChange(currentStep.field, val)}
    />
  );
}