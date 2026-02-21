import React from "react";
import BIRADSWizardStep from "./BIRADSWizardStep";
import {
  US_ECHOTEXTURE, US_FINDING_TYPES, US_MASS_SHAPE, US_ORIENTATION, US_MARGIN,
  US_ECHO_PATTERN, US_POSTERIOR, US_ASSOCIATED_FEATURES, US_SPECIAL_CASES,
} from "./biradsRuleEngine";

function getSteps(data) {
  const steps = [];

  steps.push({
    id: "usEchotexture", field: "usEchotexture", type: "radio",
    title: "U1 — Breast Echotexture",
    description: "Select the background echotexture.",
    options: US_ECHOTEXTURE,
  });

  steps.push({
    id: "usFindingType", field: "usFindingType", type: "radio",
    title: "U2 — Finding Type",
    description: "What is the primary ultrasound finding?",
    options: US_FINDING_TYPES,
  });

  if (!data.usFindingType || data.usFindingType === "no_finding") return steps;

  // ── SPECIAL CASE ──
  if (data.usFindingType === "special_case") {
    steps.push({
      id: "usSpecialCase", field: "usSpecialCase", type: "radio",
      title: "Special Case",
      description: "Select the special case — these have pre-assigned BI-RADS categories.",
      options: US_SPECIAL_CASES,
    });
    return steps;
  }

  // ── CALCIFICATIONS / ARCHITECTURAL DISTORTION ──
  if (data.usFindingType === "calcifications" || data.usFindingType === "architectural_distortion") {
    return steps; // These are scored directly
  }

  // ── US MASS ──
  if (data.usFindingType === "mass") {
    steps.push({
      id: "usMassShape", field: "usMassShape", type: "radio",
      title: "U2a — Mass Shape", description: "Select the mass shape.", options: US_MASS_SHAPE,
    });
    if (data.usMassShape) {
      steps.push({
        id: "usOrientation", field: "usOrientation", type: "radio",
        title: "U2b — Orientation",
        description: "Select the mass orientation relative to the skin.",
        tip: "Orientation is unique to ultrasound. Non-parallel (taller-than-wide) is a suspicious feature.",
        options: US_ORIENTATION,
      });
    }
    if (data.usOrientation) {
      steps.push({
        id: "usMargin", field: "usMargin", type: "radio",
        title: "U2c — Margin", description: "Select the mass margin.", options: US_MARGIN,
      });
    }
    if (data.usMargin) {
      steps.push({
        id: "usEchoPattern", field: "usEchoPattern", type: "radio",
        title: "U2d — Echo Pattern", description: "Select the echo pattern.", options: US_ECHO_PATTERN,
      });
    }
    if (data.usEchoPattern) {
      steps.push({
        id: "usPosterior", field: "usPosterior", type: "radio",
        title: "U2e — Posterior Features", description: "Select posterior acoustic features.", options: US_POSTERIOR,
      });
    }
    if (data.usPosterior) {
      steps.push({
        id: "usAssociatedFeatures", field: "usAssociatedFeatures", type: "checkbox",
        title: "U2f — Associated Features", description: "Select all associated features that apply.", options: US_ASSOCIATED_FEATURES,
      });
    }
  }

  return steps;
}

function canCalculateUS(data) {
  if (!data.usEchotexture) return false;
  if (!data.usFindingType) return false;
  if (data.usFindingType === "no_finding") return true;
  if (data.usFindingType === "calcifications") return true;
  if (data.usFindingType === "architectural_distortion") return true;
  if (data.usFindingType === "special_case") return !!data.usSpecialCase;
  if (data.usFindingType === "mass") {
    return !!(data.usMassShape && data.usOrientation && data.usMargin && data.usEchoPattern && data.usPosterior);
  }
  return false;
}

export { getSteps as getUSSteps, canCalculateUS };

export default function USWizard({ data, currentStepIndex, onChange }) {
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