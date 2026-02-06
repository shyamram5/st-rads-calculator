// ST-RADS v2025 Deterministic Rule Engine
// Based on Chhabra et al., AJR 2025 - Soft Tissue-RADS Framework

export const STRADS_CATEGORIES = {
  0: {
    score: 0,
    label: "Incomplete",
    risk: "N/A",
    color: "gray",
    meaning: "Incomplete imaging, limiting diagnostic interpretation",
    management: "Recall for additional imaging and/or request prior examinations. Additional imaging may include missing pre- or postcontrast MRI sequence, US to assess for vascular flow, or radiography or CT to assess for possible mineralization."
  },
  1: {
    score: 1,
    label: "Negative",
    risk: "N/A",
    color: "green",
    meaning: "No soft-tissue tumor or tumor-like lesion identified on imaging",
    management: "No further imaging follow-up recommended."
  },
  2: {
    score: 2,
    label: "Definitely Benign",
    risk: "Very Low",
    color: "emerald",
    meaning: "Imaging findings classic for a specific definitely benign soft-tissue tumor or tumor-like lesion",
    management: "Imaging follow-up at the clinical team's discretion. Treatment of benign tumors or tumor-like lesions is based on clinical findings. Consultation with a vascular interventionist is advised for vascular malformations."
  },
  3: {
    score: 3,
    label: "Probably Benign",
    risk: "Low",
    color: "yellow",
    meaning: "Imaging findings suggestive of a probably benign soft-tissue tumor or tumor-like lesion, or classic benign with some doubt",
    management: "Imaging follow-up can be considered at 6 weeks to 3 months, 6 months, 1 year, and 2 years, unless the lesion resolves or significantly regresses. Imaging or clinical follow-up to resolution for hematomas. Additional options include biopsy, resection, or sarcoma specialist referral."
  },
  4: {
    score: 4,
    label: "Suspicious",
    risk: "Intermediate",
    color: "orange",
    meaning: "Imaging findings suspicious for a malignant or locally aggressive soft-tissue tumor or tumor-like lesion",
    management: "Follow-up options include image-guided biopsy, open biopsy, or follow-up imaging at 4–6 weeks with subsequent regular interval follow-up imaging for up to 2 years. Tissue diagnosis or referral to a sarcoma center recommended for lesions ≥5 cm. Multidisciplinary review if biopsy negative."
  },
  5: {
    score: 5,
    label: "Highly Suggestive of Malignancy",
    risk: "High",
    color: "red",
    meaning: "Imaging findings highly suspicious (essentially pathognomonic) for a sarcoma or other malignant soft-tissue tumor",
    management: "Tissue diagnosis and referral to a sarcoma center are recommended."
  },
  "6A": {
    score: "6A",
    label: "Known Tumor – No Residual",
    risk: "N/A",
    color: "blue",
    meaning: "No imaging evidence of residual soft-tissue tumor or tumor-like lesion",
    management: "For malignant tumors: follow-up imaging at 6 weeks to 3 months, 6 months, 1 year, and 2 years. For benign lesions: follow-up if clinically symptomatic or at 6 months to 1 year intervals."
  },
  "6B": {
    score: "6B",
    label: "Known Tumor – Residual",
    risk: "N/A",
    color: "blue",
    meaning: "Residual soft-tissue tumor or tumor-like lesion with ≤20% increase in largest dimension",
    management: "Surgical excision or other further medical treatment as clinically appropriate. If no intervention, follow-up imaging at 6 weeks to 3 months, 6 months, 1 year, and 2 years."
  },
  "6C": {
    score: "6C",
    label: "Known Tumor – Progressive",
    risk: "N/A",
    color: "red",
    meaning: "Recurrent or progressive soft-tissue tumor or tumor-like lesion, with or without metastatic disease",
    management: "Surgical excision or other further medical treatment as clinically appropriate. If no intervention, follow-up imaging at 6 weeks to 3 months, 6 months, 1 year, and 2 years."
  }
};

/**
 * Deterministic ST-RADS scoring engine
 * Implements flowcharts from Figures 1, 2A, 2B, 2C, 2D of the manuscript
 */
export function calculateSTRADS(caseData) {
  const { examAdequacy, lesionPresent, knownTumor, knownTumorStatus, tissueType } = caseData;

  // Figure 1: General Algorithm
  // Step 1: Exam Adequacy
  if (examAdequacy === "incomplete") {
    return { category: STRADS_CATEGORIES[0], reasoning: "Incomplete imaging limits diagnostic interpretation." };
  }

  // Known tumor pathway → Category 6
  if (knownTumor === "yes") {
    if (knownTumorStatus === "no_residual") return { category: STRADS_CATEGORIES["6A"], reasoning: "Known treated tumor with no imaging evidence of residual disease." };
    if (knownTumorStatus === "residual") return { category: STRADS_CATEGORIES["6B"], reasoning: "Known treated tumor with residual disease (≤20% increase in largest dimension)." };
    if (knownTumorStatus === "progressive") return { category: STRADS_CATEGORIES["6C"], reasoning: "Known treated tumor with progressive or recurrent disease." };
  }

  // Step 2: Lesion Present?
  if (lesionPresent === "no") {
    return { category: STRADS_CATEGORIES[1], reasoning: "No soft-tissue lesion identified on MRI." };
  }

  // Step 3+: Tissue-type specific algorithms
  if (tissueType === "lipomatous") return scoreLipomatous(caseData);
  if (tissueType === "cystlike") return scoreCystlike(caseData);
  if (tissueType === "indeterminate_solid") return scoreIndeterminateSolid(caseData);

  // Fallback
  return { category: STRADS_CATEGORIES[0], reasoning: "Insufficient data to classify. Please complete all required steps." };
}

// Figure 2A: Lipomatous Lesion Algorithm
function scoreLipomatous(caseData) {
  const { lipFatContent, lipSeptations, lipEnhancement, lipVessels, lipNonFatFeatures } = caseData;

  // Predominantly lipomatous (>90%)
  if (lipFatContent === "predominantly") {
    // Thin septations (<2mm) OR no nodules, and like subcutaneous fat
    if (lipSeptations === "thin_or_none" && lipEnhancement === "less_than_10") {
      if (lipVessels === "many") {
        // Many prominent vessels → consider anatomic location
        return { category: STRADS_CATEGORIES[2], reasoning: "Predominantly lipomatous lesion (>90%) with thin/no septations, <10% enhancement, and many prominent vessels. Consider subcutaneous/intramuscular lipoma, myolipoma, intraneural lipoma, or lipoma arborescens.", differentials: ["Lipoma", "Myolipoma", "Lipoma of nerve", "Lipoma arborescens"] };
      }
      // Few prominent vessels
      return { category: STRADS_CATEGORIES[2], reasoning: "Predominantly lipomatous lesion (>90%) with thin/no septations and <10% enhancement. Classic benign lipoma.", differentials: ["Lipoma", "Angiolipoma"] };
    }
    // Septations AND nodules present, like subcutaneous fat intensity
    if (lipSeptations === "septations_with_nodules") {
      return { category: STRADS_CATEGORIES[3], reasoning: "Predominantly lipomatous lesion with septations and nodules resembling subcutaneous fat intensity on all sequences. Consider angiolipoma.", differentials: ["Angiolipoma"] };
    }
    // Thick septations (≥2mm) OR enhancement >10%
    if (lipSeptations === "thick" || lipEnhancement === "more_than_10") {
      return { category: STRADS_CATEGORIES[4], reasoning: "Predominantly lipomatous lesion with thick septations (≥2mm) or >10% enhancement increase. Suspicious for atypical lipomatous tumor / well-differentiated liposarcoma.", differentials: ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"] };
    }
  }

  // Not predominantly lipomatous (≤90%)
  if (lipFatContent === "not_predominantly") {
    // No enhancing nodules OR proportionally larger lipomatous component
    if (lipNonFatFeatures === "no_enhancing_nodules") {
      return { category: STRADS_CATEGORIES[4], reasoning: "Not predominantly lipomatous lesion (≤90%) without enhancing nodules or with proportionally larger lipomatous component. Suspicious for ALT/WDL.", differentials: ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"] };
    }
    // Enhancing nodules OR proportionally smaller lipomatous component
    if (lipNonFatFeatures === "enhancing_nodules") {
      return { category: STRADS_CATEGORIES[5], reasoning: "Not predominantly lipomatous (≤90%) with enhancing nodules or disproportionately smaller lipomatous component. Highly suspicious for dedifferentiated liposarcoma, myxoid liposarcoma, or pleomorphic sarcoma.", differentials: ["Dedifferentiated liposarcoma", "Myxoid liposarcoma", "Pleomorphic sarcoma"] };
    }
  }

  return { category: STRADS_CATEGORIES[0], reasoning: "Lipomatous lesion with incomplete characterization." };
}

// Figure 2B: Cyst-like / High Water Content Algorithm
function scoreCystlike(caseData) {
  const { cystCommunication, cystLocation, cystFlowVoids, cystSeptations, cystHematoma } = caseData;

  // Communicates with joint, tendon sheath, bursa OR cutaneous/subcutaneous OR intraneural
  if (cystCommunication === "communicates" || cystLocation === "cutaneous_subcutaneous" || cystLocation === "intraneural") {
    return { category: STRADS_CATEGORIES[2], reasoning: "Cyst-like lesion communicating with joint/tendon sheath/bursa, or in cutaneous/subcutaneous/intraneural location. Classic benign entity.", differentials: ["Ganglion", "Synovial cyst", "Geyser phenomenon", "Tenosynovitis", "Epidermoid cyst", "Bursitis", "Morel-Lavallée lesion", "Intraneural cyst"] };
  }

  // No communication, deeper location
  // Predominantly comprised of flow voids or fluid-fluid levels
  if (cystFlowVoids === "predominantly_flow_voids") {
    return { category: STRADS_CATEGORIES[2], reasoning: "Cyst-like lesion predominantly comprised of flow voids or fluid-fluid levels. Consistent with vascular malformation.", differentials: ["Low- or high-flow vascular malformation", "Aneurysm", "Thrombophlebitis"] };
  }

  // Not predominantly flow voids
  // Features suggesting hematoma
  if (cystHematoma === "yes") {
    return { category: STRADS_CATEGORIES[3], reasoning: "Cyst-like lesion with features suggesting hematoma. Follow-up to resolution is important as hematoma may mask underlying neoplasm.", differentials: ["Hematoma", "Chronic expanding hematoma"] };
  }

  // Absence of thick enhancing septations and small mural nodules (<1cm)
  if (cystSeptations === "absent_or_thin") {
    return { category: STRADS_CATEGORIES[3], reasoning: "Deep cyst-like lesion without thick enhancing septations or large mural nodules. Consider intramuscular myxoma, benign PNST, cysticercosis, hydatid cyst, or myxoid liposarcoma.", differentials: ["Intramuscular myxoma", "Benign peripheral nerve sheath tumor", "Cysticercosis", "Hydatid cyst"] };
  }

  // Thick enhancing septations and/or mural nodules ≥1cm or larger soft tissue component
  if (cystSeptations === "thick_or_nodules") {
    return { category: STRADS_CATEGORIES[5], reasoning: "Deep cyst-like lesion with thick enhancing septations and/or mural nodules ≥1 cm or larger soft tissue component. Highly suspicious for malignancy.", differentials: ["Synovial sarcoma", "Hemangioendothelioma", "Angiosarcoma", "Extraskeletal myxoid chondrosarcoma", "Myxoinflammatory fibroblastic sarcoma", "Myxofibrosarcoma"] };
  }

  // Intermediate case (3 or 4)
  if (cystSeptations === "small_nodules") {
    return { category: STRADS_CATEGORIES[4], reasoning: "Deep cyst-like lesion with small mural nodules (<1 cm) or enhancing septations. Consider biopsy or close follow-up.", differentials: ["Cystic PNST with edema", "Cysticercosis", "Hydatid cyst", "Myxoid liposarcoma", "Myxofibrosarcoma"] };
  }

  return { category: STRADS_CATEGORIES[0], reasoning: "Cyst-like lesion with incomplete characterization." };
}

// Figures 2C & 2D: Indeterminate Solid Lesion Algorithm
function scoreIndeterminateSolid(caseData) {
  const { solidCompartment } = caseData;

  if (solidCompartment === "intravascular") return scoreIntravascular(caseData);
  if (solidCompartment === "intraarticular") return scoreIntraarticular(caseData);
  if (solidCompartment === "intraneural") return scoreIntraneural(caseData);
  if (solidCompartment === "cutaneous_subcutaneous") return scoreCutaneousSubcutaneous(caseData);
  if (solidCompartment === "deep_intramuscular") return scoreDeepIntramuscular(caseData);
  if (solidCompartment === "intratendinous") return scoreIntratendinous(caseData);
  if (solidCompartment === "plantar_palmar") return scorePalmarPlantar(caseData);
  if (solidCompartment === "subungual") return scoreSubungual(caseData);

  return { category: STRADS_CATEGORIES[0], reasoning: "Indeterminate solid lesion with incomplete compartment data." };
}

// Figure 2D: Intravascular/Vessel-related
function scoreIntravascular(caseData) {
  const { vascularT2, vascularPhleboliths, vascularFluidLevels } = caseData;
  if (vascularT2 === "hyperintense_lobules" && vascularPhleboliths === "yes" && vascularFluidLevels === "yes") {
    return { category: STRADS_CATEGORIES[2], reasoning: "Hyperintense lobules/tubules on T2W with hypointense phleboliths and fluid-fluid levels. Classic venous or venolymphatic malformation.", differentials: ["Venous malformation", "Venolymphatic malformation"] };
  }
  if (vascularT2 === "hyperintense_lobules" && (vascularPhleboliths === "no" || vascularFluidLevels === "no")) {
    return { category: STRADS_CATEGORIES[4], reasoning: "Hyperintense lobules/tubules on T2W without classic phleboliths or fluid-fluid levels. May represent hemangioendothelioma, Kaposi sarcoma, angiosarcoma, or leiomyosarcoma.", differentials: ["Hemangioendothelioma", "Kaposi sarcoma", "Angiosarcoma", "Leiomyosarcoma"] };
  }
  // Calcified/ossified
  if (vascularT2 === "predominantly_hypointense") {
    return { category: STRADS_CATEGORIES[2], reasoning: "Intravascular lesion with predominantly hypointense T2 signal. Consistent with synovial chondromatosis or synovial hemangioma.", differentials: ["Synovial chondromatosis", "Synovial hemangioma"] };
  }
  // Hyperintense on T2W and peripheral enhancement
  if (vascularT2 === "hyperintense_peripheral_enhancement") {
    return { category: STRADS_CATEGORIES[3], reasoning: "Intravascular lesion hyperintense on T2W with peripheral enhancement. Consider TSGCT or synovial chondromatosis.", differentials: ["TSGCT", "Synovial chondromatosis"] };
  }
  return { category: STRADS_CATEGORIES[4], reasoning: "Intravascular/vessel-related lesion requiring further characterization." };
}

// Figure 2D: Intraarticular
function scoreIntraarticular(caseData) {
  const { iaHemosiderin, iaBloomingGRE } = caseData;
  if (iaHemosiderin === "yes" && iaBloomingGRE === "yes") {
    return { category: STRADS_CATEGORIES[2], reasoning: "Intraarticular lesion with hemosiderin staining and blooming on GRE. Classic for TSGCT (pigmented villonodular synovitis).", differentials: ["TSGCT / PVNS"] };
  }
  if (iaHemosiderin === "yes" && iaBloomingGRE === "no") {
    return { category: STRADS_CATEGORIES[3], reasoning: "Intraarticular lesion with hemosiderin staining but without blooming on GRE. Consider TSGCT.", differentials: ["TSGCT"] };
  }
  // Hypointense on T2W and no peripheral enhancement
  return { category: STRADS_CATEGORIES[4], reasoning: "Intraarticular lesion without classic features. Consider TSGCT or synovial sarcoma.", differentials: ["TSGCT", "Synovial sarcoma"] };
}

// Figure 2D: Intraneural/Nerve-related
function scoreIntraneural(caseData) {
  const { nerveTargetSign, nerveADC } = caseData;
  if (nerveTargetSign === "yes") {
    if (nerveADC === "above_1_1") {
      return { category: STRADS_CATEGORIES[2], reasoning: "Nerve-related lesion with target sign and ADC >1.1 mm²/s. Classic benign peripheral nerve sheath tumor.", differentials: ["Schwannoma", "Neurofibroma"] };
    }
    if (nerveADC === "below_1_1") {
      return { category: STRADS_CATEGORIES[4], reasoning: "Nerve-related lesion with target sign but ADC ≤1.1 mm²/s. Restricted diffusion raises concern.", differentials: ["Malignant PNST", "Atypical neurofibroma"] };
    }
  }
  if (nerveTargetSign === "no") {
    return { category: STRADS_CATEGORIES[3], reasoning: "Nerve-related lesion without target sign. Consider perineurioma, ancient schwannoma, neurofibroma with degenerative change, or atypical neurofibroma.", differentials: ["Perineurioma", "Ancient schwannoma", "Neurofibroma with degenerative change", "Atypical neurofibroma"] };
  }
  return { category: STRADS_CATEGORIES[3], reasoning: "Nerve-related lesion requiring further characterization." };
}

// Figure 2D: Cutaneous/Subcutaneous
function scoreCutaneousSubcutaneous(caseData) {
  const { cutGrowthPattern, cutEnhancement } = caseData;
  if (cutGrowthPattern === "exophytic") {
    if (cutEnhancement === "peripheral") {
      return { category: STRADS_CATEGORIES[2], reasoning: "Exophytic cutaneous/subcutaneous lesion with peripheral enhancement. Consistent with sebaceous cyst, trichilemmal cyst, epidermoid cyst, or retinacular cyst.", differentials: ["Sebaceous cyst", "Trichilemmal cyst", "Epidermoid cyst", "Retinacular cyst"] };
    }
    if (cutEnhancement === "internal") {
      return { category: STRADS_CATEGORIES[4], reasoning: "Exophytic cutaneous/subcutaneous lesion with internal enhancement. Consider wart, dermatofibrosarcoma protuberans, fibrosarcoma NOS.", differentials: ["Wart", "Dermatofibrosarcoma protuberans", "Fibrosarcoma NOS"] };
    }
  }
  if (cutGrowthPattern === "endophytic") {
    return { category: STRADS_CATEGORIES[5], reasoning: "Endophytic cutaneous/subcutaneous lesion. Highly suspicious for T-cell lymphoma, Merkel cell tumor, melanoma, or cutaneous metastasis.", differentials: ["T-cell lymphoma", "Merkel cell tumor", "Melanoma", "Cutaneous metastasis"] };
  }
  return { category: STRADS_CATEGORIES[4], reasoning: "Cutaneous/subcutaneous lesion requiring further characterization." };
}

// Figure 2C: Deep (subfascial)/Intermuscular/Intramuscular
function scoreDeepIntramuscular(caseData) {
  const { deepMuscleSignature, deepHistory, deepEdema, deepMineralization } = caseData;
  if (deepMuscleSignature === "muscle") {
    // Muscle signature present
    if (deepHistory === "prior_injury" && deepEdema === "yes" && deepMineralization === "mature") {
      return { category: STRADS_CATEGORIES[2], reasoning: "Deep/intramuscular lesion with muscle signature, history of prior injury, peritumoral edema, and mature peripheral mineralization. Classic for heterotopic ossification or myositis ossificans.", differentials: ["Hypertrophied muscle", "Myositis", "Myopathy", "Myonecrosis", "Myositis ossificans"] };
    }
    if (deepHistory !== "prior_injury" || deepMineralization !== "mature") {
      return { category: STRADS_CATEGORIES[4], reasoning: "Deep/intramuscular lesion with muscle signature but without classic benign features. Consider desmoid, fibromyxoid sarcoma, fibrosarcoma NOS, extraskeletal osteosarcoma, or undifferentiated pleomorphic sarcoma.", differentials: ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"] };
    }
  }
  if (deepMuscleSignature === "no_muscle") {
    return { category: STRADS_CATEGORIES[4], reasoning: "Deep/intramuscular lesion without muscle signature. Requires further characterization—consider biopsy or sarcoma center referral.", differentials: ["Desmoid", "Fibromyxoid sarcoma", "Extraskeletal osteosarcoma"] };
  }
  return { category: STRADS_CATEGORIES[4], reasoning: "Deep intramuscular lesion requiring further characterization." };
}

// Figure 2C: Intratendinous/Tendon-related
function scoreIntratendinous(caseData) {
  const { tendonSize, tendonCalcifications, tendonAutoimmune } = caseData;
  if (tendonSize === "enlarged" && (tendonCalcifications === "yes" || tendonAutoimmune === "yes")) {
    return { category: STRADS_CATEGORIES[2], reasoning: "Enlarged tendon with calcifications, cystic change, fat, or underlying history of amyloidosis or autoimmune disease. Consider gout, amyloid, or xanthoma.", differentials: ["Gout", "Amyloid", "Xanthoma"] };
  }
  if (tendonSize === "normal") {
    // Normal size tendon with hemosiderin
    return { category: STRADS_CATEGORIES[2], reasoning: "Normal-size tendon-related lesion. Consider fibroma or TSGCT based on hemosiderin staining.", differentials: ["Fibroma", "TSGCT"] };
  }
  return { category: STRADS_CATEGORIES[3], reasoning: "Intratendinous/tendon-related lesion requiring further assessment." };
}

// Figure 2C: Plantar/Palmar Fascial
function scorePalmarPlantar(caseData) {
  const { fascialNoduleSize, fascialMultifocal } = caseData;
  if (fascialNoduleSize === "less_than_2cm") {
    if (fascialMultifocal === "yes") {
      return { category: STRADS_CATEGORIES[2], reasoning: "Fascial nodule <2 cm in length, multifocal or conglomerate. Classic for fibroma or fibromatosis.", differentials: ["Fibroma", "Fibromatosis"] };
    }
    return { category: STRADS_CATEGORIES[3], reasoning: "Fascial nodule <2 cm, not multifocal. Probably benign—consider fibromatosis.", differentials: ["Fibromatosis"] };
  }
  if (fascialNoduleSize === "2cm_or_more") {
    if (fascialMultifocal === "no") {
      return { category: STRADS_CATEGORIES[4], reasoning: "Fascial nodule ≥2 cm without multifocal pattern. Consider desmoid, synovial sarcoma, epithelioid sarcoma, myxoinflammatory fibroblastic sarcoma, or clear cell sarcoma.", differentials: ["Desmoid", "Synovial sarcoma", "Epithelioid sarcoma", "Myxoinflammatory fibroblastic sarcoma", "Clear cell sarcoma"] };
    }
    return { category: STRADS_CATEGORIES[3], reasoning: "Fascial nodule ≥2 cm with multifocal/conglomerate pattern. Consider fibromatosis.", differentials: ["Fibromatosis"] };
  }
  return { category: STRADS_CATEGORIES[3], reasoning: "Plantar/palmar fascial lesion requiring further assessment." };
}

// Figure 2C: Subungual
function scoreSubungual(caseData) {
  const { subungualSize } = caseData;
  if (subungualSize === "less_than_1cm") {
    return { category: STRADS_CATEGORIES[3], reasoning: "Small subungual lesion (<1 cm). Consider glomus tumor NOS.", differentials: ["Glomus tumor NOS"] };
  }
  if (subungualSize === "1cm_or_more") {
    return { category: STRADS_CATEGORIES[4], reasoning: "Larger subungual lesion (≥1 cm). Consider glomus tumor—malignant variant.", differentials: ["Glomus tumor—malignant"] };
  }
  return { category: STRADS_CATEGORIES[3], reasoning: "Subungual lesion requiring further characterization." };
}

/**
 * Apply ADC modifier
 * ADC >1.5 → supports STRADS 2
 * ADC 1.1–1.5 → supports STRADS 3
 * ADC <1.1 → supports STRADS 5
 */
export function applyADCModifier(result, adcValue) {
  if (!adcValue || adcValue === "") return result;
  const adc = parseFloat(adcValue);
  if (isNaN(adc)) return result;

  let adcNote = "";
  if (adc > 1.5) {
    adcNote = `Mean ADC of ${adc} × 10⁻³ mm²/s (>1.5) supports a benign classification (ST-RADS 2).`;
  } else if (adc >= 1.1 && adc <= 1.5) {
    adcNote = `Mean ADC of ${adc} × 10⁻³ mm²/s (1.1–1.5) supports a probably benign classification (ST-RADS 3).`;
  } else if (adc < 1.1) {
    adcNote = `Mean ADC of ${adc} × 10⁻³ mm²/s (<1.1) is concerning for malignancy (supports ST-RADS 5).`;
  }

  return {
    ...result,
    adcNote,
    reasoning: result.reasoning + " " + adcNote
  };
}

/**
 * Apply ancillary features modifier for potential upgrade to STRADS 5
 */
export function applyAncillaryModifier(result, ancillaryFeatures) {
  if (!ancillaryFeatures || ancillaryFeatures.length === 0) return result;

  const cat5Features = [
    "necrosis", "hemorrhage", "peritumoral_edema", "fascial_tail",
    "crossing_compartments", "rapid_growth", "metastasis"
  ];

  const presentFeatures = ancillaryFeatures.filter(f => cat5Features.includes(f));
  if (presentFeatures.length === 0) return result;

  const featureLabels = {
    necrosis: "non-enhancing areas of necrosis",
    hemorrhage: "internal hemorrhage",
    peritumoral_edema: "peritumoral edema",
    fascial_tail: "fascial tail sign",
    crossing_compartments: "crossing fascial compartments",
    rapid_growth: "rapid increase in size or symptoms",
    metastasis: "regional or distant metastatic lesions"
  };

  const descriptions = presentFeatures.map(f => featureLabels[f]).join(", ");
  const ancillaryNote = `Ancillary features present: ${descriptions}. These findings may support upgrading to ST-RADS 5.`;

  // If current score is 3 or 4 and multiple high-risk features, suggest upgrade
  const currentScore = result.category.score;
  if ((currentScore === 3 || currentScore === 4) && presentFeatures.length >= 2) {
    return {
      ...result,
      category: STRADS_CATEGORIES[5],
      reasoning: result.reasoning + " " + ancillaryNote,
      upgraded: true,
      originalScore: currentScore
    };
  }

  return {
    ...result,
    reasoning: result.reasoning + " " + ancillaryNote,
    ancillaryNote
  };
}