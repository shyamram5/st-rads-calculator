// ACR TI-RADS Deterministic Rule Engine
// Based on Tessler et al., JACR 2017 — ACR TI-RADS White Paper

export const TIRADS_CATEGORIES = {
  TR1: {
    score: "TR1", label: "Benign", risk: "<1%", color: "green",
    meaning: "Benign thyroid nodule. No suspicious ultrasound features.",
    fna: "No FNA",
    followUp: "No follow-up required",
  },
  TR2: {
    score: "TR2", label: "Not Suspicious", risk: "<1.5%", color: "emerald",
    meaning: "Not suspicious for malignancy. Very low risk thyroid nodule.",
    fna: "No FNA",
    followUp: "No follow-up unless clinically indicated",
  },
  TR3: {
    score: "TR3", label: "Mildly Suspicious", risk: "2–5%", color: "yellow",
    meaning: "Mildly suspicious thyroid nodule with low malignancy risk.",
    fna: "FNA if ≥ 2.5 cm",
    followUp: "Follow if ≥ 1.5 cm: 1, 3, and 5 years",
  },
  TR4: {
    score: "TR4", label: "Moderately Suspicious", risk: "5–20%", color: "orange",
    meaning: "Moderately suspicious thyroid nodule with intermediate malignancy risk.",
    fna: "FNA if ≥ 1.5 cm",
    followUp: "Follow if ≥ 1.0 cm: 1, 2, 3, and 5 years",
  },
  TR5: {
    score: "TR5", label: "Highly Suspicious", risk: ">20%", color: "red",
    meaning: "Highly suspicious thyroid nodule with high malignancy risk.",
    fna: "FNA if ≥ 1.0 cm",
    followUp: "Follow if ≥ 0.5 cm: annually for up to 5 years",
  },
};

// COMPOSITION options (Choose 1)
export const COMPOSITION_OPTIONS = [
  { value: "cystic", label: "Cystic or almost completely cystic", description: "Purely cystic nodule", points: 0 },
  { value: "spongiform", label: "Spongiform", description: "Composed predominantly (>50%) of small cystic spaces", points: 0 },
  { value: "mixed", label: "Mixed cystic and solid", description: "Assign points for predominant solid component", points: 1 },
  { value: "solid", label: "Solid or almost completely solid", description: "Composed entirely or nearly entirely of soft tissue", points: 2 },
  { value: "indeterminate", label: "Indeterminate due to calcification", description: "Composition cannot be determined because of calcification", points: 2 },
];

// ECHOGENICITY options (Choose 1)
export const ECHOGENICITY_OPTIONS = [
  { value: "anechoic", label: "Anechoic", description: "Applies to cystic or almost completely cystic nodules", points: 0 },
  { value: "hyper_iso", label: "Hyperechoic or isoechoic", description: "Compared to adjacent parenchyma", points: 1 },
  { value: "hypoechoic", label: "Hypoechoic", description: "Compared to adjacent parenchyma", points: 2 },
  { value: "very_hypoechoic", label: "Very hypoechoic", description: "More hypoechoic than strap muscles", points: 3 },
  { value: "indeterminate", label: "Cannot be determined", description: "Echogenicity cannot be assessed", points: 1 },
];

// SHAPE options (Choose 1)
export const SHAPE_OPTIONS = [
  { value: "wider", label: "Wider than tall", description: "Shape assessed on transverse image", points: 0 },
  { value: "taller", label: "Taller than wide", description: "Measurements parallel to sound beam for height", points: 3 },
];

// MARGIN options (Choose 1)
export const MARGIN_OPTIONS = [
  { value: "smooth", label: "Smooth", description: "Well-defined, curvilinear edge", points: 0 },
  { value: "ill_defined", label: "Ill-defined", description: "Border difficult to distinguish from parenchyma", points: 0 },
  { value: "lobulated_irregular", label: "Lobulated or irregular", description: "Protrusions into adjacent tissue or jagged angles", points: 2 },
  { value: "ete", label: "Extra-thyroidal extension", description: "Obvious invasion of adjacent soft tissue", points: 3 },
  { value: "indeterminate", label: "Cannot be determined", description: "Margin cannot be assessed", points: 0 },
];

// ECHOGENIC FOCI options (Choose all that apply)
export const ECHOGENIC_FOCI_OPTIONS = [
  { value: "none", label: "None or large comet-tail artifacts", description: "V-shaped, >1 mm, in cystic components", points: 0 },
  { value: "macrocalcifications", label: "Macrocalcifications", description: "Cause acoustic shadowing", points: 1 },
  { value: "peripheral", label: "Peripheral (rim) calcifications", description: "Complete or incomplete along margin", points: 2 },
  { value: "punctate", label: "Punctate echogenic foci", description: "Nonshadowing, may have small comet-tail artifacts", points: 3 },
];

/**
 * Calculate TI-RADS score from selections.
 * @param {object} selections - { composition, echogenicity, shape, margin, echogenicFoci: [] }
 * @returns {{ totalPoints, category, compositionPts, echogenicityPts, shapePts, marginPts, fociPts }}
 */
export function calculateTIRADS(selections) {
  const { composition, echogenicity, shape, margin, echogenicFoci } = selections;

  // Get points for single-select categories
  const compositionPts = COMPOSITION_OPTIONS.find(o => o.value === composition)?.points ?? 0;
  const echogenicityPts = ECHOGENICITY_OPTIONS.find(o => o.value === echogenicity)?.points ?? 0;
  const shapePts = SHAPE_OPTIONS.find(o => o.value === shape)?.points ?? 0;
  const marginPts = MARGIN_OPTIONS.find(o => o.value === margin)?.points ?? 0;

  // Echogenic foci: sum of all selected (multi-select)
  let fociPts = 0;
  const fociArr = echogenicFoci || [];
  
  // Special rule: if "none" is selected alone, 0 points
  // If specific foci are selected, sum their points (ignore "none" if also checked)
  const specificFoci = fociArr.filter(v => v !== "none");
  if (specificFoci.length > 0) {
    fociPts = specificFoci.reduce((sum, val) => {
      const opt = ECHOGENIC_FOCI_OPTIONS.find(o => o.value === val);
      return sum + (opt?.points ?? 0);
    }, 0);
  }

  // Special spongiform rule: if spongiform, do not add points for other categories
  const isSpongiform = composition === "spongiform";
  const totalPoints = isSpongiform
    ? 0
    : compositionPts + echogenicityPts + shapePts + marginPts + fociPts;

  // Determine category
  let category;
  if (totalPoints === 0) category = TIRADS_CATEGORIES.TR1;
  else if (totalPoints <= 2) category = TIRADS_CATEGORIES.TR2;
  else if (totalPoints === 3) category = TIRADS_CATEGORIES.TR3;
  else if (totalPoints >= 4 && totalPoints <= 6) category = TIRADS_CATEGORIES.TR4;
  else category = TIRADS_CATEGORIES.TR5;

  return {
    totalPoints,
    category,
    compositionPts: isSpongiform ? 0 : compositionPts,
    echogenicityPts: isSpongiform ? 0 : echogenicityPts,
    shapePts: isSpongiform ? 0 : shapePts,
    marginPts: isSpongiform ? 0 : marginPts,
    fociPts: isSpongiform ? 0 : fociPts,
    isSpongiform,
  };
}

/**
 * Get size-based recommendation
 */
export function getSizeRecommendation(category, maxDiameterCm) {
  if (!maxDiameterCm || isNaN(maxDiameterCm)) return null;
  const size = parseFloat(maxDiameterCm);

  switch (category.score) {
    case "TR1":
    case "TR2":
      return { action: "No FNA or follow-up recommended regardless of size.", level: "benign" };
    case "TR3":
      if (size >= 2.5) return { action: "FNA recommended (≥ 2.5 cm).", level: "fna" };
      if (size >= 1.5) return { action: "Follow-up recommended (≥ 1.5 cm): imaging at 1, 3, and 5 years.", level: "followup" };
      return { action: "No FNA or follow-up needed at this size.", level: "benign" };
    case "TR4":
      if (size >= 1.5) return { action: "FNA recommended (≥ 1.5 cm).", level: "fna" };
      if (size >= 1.0) return { action: "Follow-up recommended (≥ 1.0 cm): imaging at 1, 2, 3, and 5 years.", level: "followup" };
      return { action: "No FNA or follow-up needed at this size.", level: "benign" };
    case "TR5":
      if (size >= 1.0) return { action: "FNA recommended (≥ 1.0 cm).", level: "fna" };
      if (size >= 0.5) return { action: "Follow-up recommended (≥ 0.5 cm): annually for up to 5 years.", level: "followup" };
      return { action: "No FNA or follow-up needed at this size. Consider active surveillance for papillary microcarcinomas.", level: "benign" };
    default:
      return null;
  }
}