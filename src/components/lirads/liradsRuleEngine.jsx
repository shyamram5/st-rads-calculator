/**
 * LI-RADS v2018 Rule Engine
 * Deterministic scoring based on ACR LI-RADS v2018 guidelines.
 */

export const LIRADS_CATEGORIES = {
  "LR-1": {
    label: "LR-1",
    name: "Definitely Benign",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    borderColor: "border-green-500",
    bgLight: "bg-green-50 dark:bg-green-950/30",
    risk: "Benign",
    hccRisk: null,
    management: "Routine surveillance. No additional workup needed.",
  },
  "LR-2": {
    label: "LR-2",
    name: "Probably Benign",
    color: "bg-lime-500",
    textColor: "text-lime-700 dark:text-lime-400",
    borderColor: "border-lime-500",
    bgLight: "bg-lime-50 dark:bg-lime-950/30",
    risk: "Probably Benign",
    hccRisk: "~16%",
    management: "Continue surveillance per guidelines. Diagnostic imaging as appropriate.",
  },
  "LR-3": {
    label: "LR-3",
    name: "Intermediate Probability",
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-500",
    bgLight: "bg-yellow-50 dark:bg-yellow-950/30",
    risk: "Intermediate",
    hccRisk: "~37%",
    management: "Repeat or alternative diagnostic imaging in 3–6 months. Consider multidisciplinary discussion.",
  },
  "LR-4": {
    label: "LR-4",
    name: "Probably HCC",
    color: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-400",
    borderColor: "border-orange-500",
    bgLight: "bg-orange-50 dark:bg-orange-950/30",
    risk: "Probably HCC",
    hccRisk: "~74%",
    management: "Multidisciplinary team discussion. Consider biopsy or additional imaging. Treatment may be considered.",
  },
  "LR-5": {
    label: "LR-5",
    name: "Definitely HCC",
    color: "bg-red-600",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-600",
    bgLight: "bg-red-50 dark:bg-red-950/30",
    risk: "Definitely HCC",
    hccRisk: "~95%",
    management: "Proceed with HCC treatment per guidelines. Biopsy generally not required for treatment eligibility.",
  },
  "LR-TIV": {
    label: "LR-TIV",
    name: "Tumor in Vein",
    color: "bg-red-900",
    textColor: "text-red-900 dark:text-red-300",
    borderColor: "border-red-900",
    bgLight: "bg-red-100 dark:bg-red-950/40",
    risk: "Tumor in Vein",
    hccRisk: "High",
    management: "Contraindication to transplantation. Urgent multidisciplinary team discussion required.",
  },
  "LR-M": {
    label: "LR-M",
    name: "Probable Non-HCC Malignancy",
    color: "bg-purple-600",
    textColor: "text-purple-700 dark:text-purple-400",
    borderColor: "border-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
    risk: "Non-HCC Malignancy",
    hccRisk: null,
    management: "Consider biopsy. Multidisciplinary team discussion recommended. May represent cholangiocarcinoma, combined HCC-CCA, or metastasis.",
  },
};

export const ELIGIBILITY_OPTIONS = [
  { value: "cirrhosis", label: "Cirrhosis (any cause except vascular disorders)" },
  { value: "chronic_hbv", label: "Chronic HBV infection without cirrhosis" },
  { value: "vascular", label: "Cirrhosis due to vascular disorder (Budd-Chiari, cardiac, etc.)" },
  { value: "under_18", label: "Patient age < 18 years" },
  { value: "congenital", label: "Congenital hepatic fibrosis" },
];

export const ENHANCEMENT_OPTIONS = [
  { value: "no_enhancement", label: "No enhancement (cyst, hemangioma, perfusion alteration, fat deposition, confluent fibrosis)" },
  { value: "yes", label: "Yes — observation shows enhancement" },
];

export const ENHANCEMENT_TYPE_OPTIONS = [
  { value: "nonrim_aphe", label: "Non-rim arterial phase hyperenhancement (APHE)" },
  { value: "rim_aphe_targetoid", label: "Rim-like APHE with peripheral washout and delayed central enhancement (targetoid)" },
  { value: "infiltrative", label: "Infiltrative growth pattern" },
  { value: "diffusion_necrosis", label: "Marked diffusion restriction or necrosis without typical HCC features" },
];

export const SIZE_OPTIONS = [
  { value: "<10", label: "< 10 mm" },
  { value: "10-19", label: "10–19 mm" },
  { value: ">=20", label: "≥ 20 mm" },
];

export const MAJOR_FEATURES = [
  { value: "washout", label: "Non-peripheral washout", tip: "Hypoenhancement in portal venous or delayed phase relative to liver" },
  { value: "capsule", label: "Enhancing capsule", tip: "Smooth, uniform border surrounding all or most of the observation" },
  { value: "threshold_growth", label: "Threshold growth", tip: "≥ 50% size increase in ≤ 6 months" },
];

export const ANCILLARY_FAVORING_HCC = [
  { value: "non_enhancing_capsule", label: "Non-enhancing capsule" },
  { value: "nodule_in_nodule", label: "Nodule-in-nodule architecture" },
  { value: "mosaic", label: "Mosaic architecture" },
  { value: "blood_products", label: "Blood products in mass (no biopsy/trauma history)" },
  { value: "fat_in_mass", label: "Fat in mass (more than adjacent liver)" },
  { value: "diffusion_restriction", label: "Diffusion restriction" },
];

export const ANCILLARY_FAVORING_BENIGN = [
  { value: "t2_hypointensity", label: "Definite T2 hypointensity" },
  { value: "siderotic", label: "Siderotic nodule (low T2 signal due to iron)" },
  { value: "hbp_hyperintensity", label: "Hepatobiliary phase hyperintensity" },
  { value: "follows_blood_pool", label: "Follows blood pool (hemangioma pattern)" },
  { value: "decreasing_enhancement", label: "Steadily decreasing enhancement" },
];

export const ANCILLARY_NON_HCC_MALIGNANCY = [
  { value: "marked_diffusion", label: "Marked diffusion restriction" },
  { value: "necrosis", label: "Necrosis" },
  { value: "strong_t2", label: "Strong T2 hyperintensity" },
];

/**
 * Calculate the primary LI-RADS category.
 */
export function calculateLIRADS(data) {
  const { eligibility, enhancement, enhancementType, size, majorFeatures = [], tumorInVein } = data;

  // Ineligible
  if (["vascular", "under_18", "congenital"].includes(eligibility)) {
    return { category: null, ineligible: true };
  }

  // Tumor in vein overrides everything
  if (tumorInVein === "yes") {
    return { category: "LR-TIV", ...LIRADS_CATEGORIES["LR-TIV"] };
  }

  // No enhancement
  if (enhancement === "no_enhancement") {
    return { category: "LR-1", ...LIRADS_CATEGORIES["LR-1"] };
  }

  // LR-M patterns
  if (["rim_aphe_targetoid", "infiltrative", "diffusion_necrosis"].includes(enhancementType)) {
    return { category: "LR-M", ...LIRADS_CATEGORIES["LR-M"] };
  }

  // Non-rim APHE path — count additional major features
  const featureCount = majorFeatures.length;
  let category;

  if (enhancementType === "nonrim_aphe") {
    if (size === "<10") {
      if (featureCount === 0) category = "LR-3";
      else if (featureCount === 1) category = "LR-4";
      else category = "LR-5"; // ≥ 2
    } else if (size === "10-19") {
      if (featureCount === 0) category = "LR-3";
      else if (featureCount === 1) category = "LR-4";
      else category = "LR-5"; // ≥ 2
    } else {
      // ≥ 20 mm
      if (featureCount === 0) category = "LR-4";
      else category = "LR-5"; // ≥ 1
    }
  } else {
    // Enhancement but no APHE (hypo/iso)
    category = "LR-3";
  }

  return { category, ...LIRADS_CATEGORIES[category] };
}

/**
 * Apply ancillary feature adjustments.
 * Can shift category by ±1, but CANNOT upgrade from LR-4 to LR-5.
 */
export function applyAncillaryFeatures(baseCategory, ancillaryHCC = [], ancillaryBenign = [], ancillaryNonHCC = []) {
  if (!baseCategory || baseCategory === "LR-TIV" || baseCategory === "LR-M" || baseCategory === "LR-1") {
    return { adjustedCategory: baseCategory, shifted: false, nonHCCWarning: ancillaryNonHCC.length > 0 };
  }

  const scale = ["LR-2", "LR-3", "LR-4", "LR-5"];
  let idx = scale.indexOf(baseCategory);
  if (idx === -1) return { adjustedCategory: baseCategory, shifted: false, nonHCCWarning: ancillaryNonHCC.length > 0 };

  const originalIdx = idx;

  // Upgrade by 1 if HCC-favoring features present
  if (ancillaryHCC.length > 0 && idx < scale.length - 1) {
    // Cannot upgrade from LR-4 to LR-5
    if (scale[idx] !== "LR-4") {
      idx = Math.min(idx + 1, scale.length - 1);
    }
  }

  // Downgrade by 1 if benign-favoring features present
  if (ancillaryBenign.length > 0 && idx > 0) {
    idx = Math.max(idx - 1, 0);
  }

  const adjustedCategory = scale[idx];
  return {
    adjustedCategory,
    shifted: idx !== originalIdx,
    nonHCCWarning: ancillaryNonHCC.length > 0,
    ...LIRADS_CATEGORIES[adjustedCategory],
  };
}