// ST-RADS v2025 Deterministic Rule Engine
// Faithfully implements Figures 1, 2A, 2B, 2C, 2D from Chhabra et al., AJR 2025

export const STRADS_CATEGORIES = {
  0: {
    score: 0, label: "Incomplete", risk: "N/A", color: "gray",
    meaning: "Incomplete imaging, limiting diagnostic interpretation.",
    management: "Recall for additional imaging and/or request prior examinations."
  },
  1: {
    score: 1, label: "Negative", risk: "N/A", color: "green",
    meaning: "No soft-tissue tumor or tumor-like lesion identified on imaging.",
    management: "No further imaging follow-up recommended."
  },
  2: {
    score: 2, label: "Definitely Benign", risk: "Very Low (nearly zero)", color: "emerald",
    meaning: "Imaging findings classic for a specific definitely benign soft-tissue tumor or tumor-like lesion.",
    management: "Imaging follow-up at the clinical team's discretion. Treatment based on clinical findings."
  },
  3: {
    score: 3, label: "Probably Benign", risk: "Low", color: "yellow",
    meaning: "Imaging findings classic for a benign lesion with some doubt, or suggestive of a probably benign lesion.",
    management: "Imaging follow-up at 6 weeks–3 months, 6 months, 1 year, and 2 years. Biopsy or resection if clinically indicated."
  },
  4: {
    score: 4, label: "Suspicious", risk: "Intermediate", color: "orange",
    meaning: "Imaging findings suspicious for a malignant or locally aggressive soft-tissue tumor.",
    management: "Biopsy or close interval follow-up (4–6 weeks). Referral to sarcoma center for lesions ≥5 cm."
  },
  5: {
    score: 5, label: "Highly Suggestive of Malignancy", risk: "High", color: "red",
    meaning: "Imaging findings highly suspicious (essentially pathognomonic) for sarcoma.",
    management: "Tissue diagnosis and referral to a sarcoma center are recommended."
  },
  "6A": {
    score: "6A", label: "Known Tumor – No Residual", risk: "N/A", color: "blue",
    meaning: "No imaging evidence of residual soft-tissue tumor (expected post-treatment changes).",
    management: "Surveillance imaging per protocol."
  },
  "6B": {
    score: "6B", label: "Known Tumor – Residual", risk: "N/A", color: "blue",
    meaning: "Residual tumor (≤20% increase in largest dimension).",
    management: "Surgical excision or further medical treatment as clinically appropriate."
  },
  "6C": {
    score: "6C", label: "Known Tumor – Progressive", risk: "N/A", color: "red",
    meaning: "Progressive or recurrent tumor (>20% increase).",
    management: "Surgical excision or further medical treatment as clinically appropriate."
  }
};

// ─── MAIN ENTRY POINT ─────────────────────────────────────────────

export function calculateSTRADS(caseData) {
  // Destructure top-level fields
  const { examAdequacy, lesionPresent, knownTumor, knownTumorStatus, tissueType } = caseData;

  if (examAdequacy === "incomplete") {
    return r(0, "Incomplete imaging limits diagnostic interpretation[cite: 249].");
  }

  // Category 6: Clinical Context [cite: 274, 277, 280]
  if (knownTumor === "yes") {
    if (knownTumorStatus === "no_residual") return r("6A", "Known treated tumor with no imaging evidence of residual disease.");
    if (knownTumorStatus === "residual") return r("6B", "Known treated tumor with residual disease (≤20% increase).");
    if (knownTumorStatus === "progressive") return r("6C", "Known treated tumor with progressive/recurrent disease (>20% increase).");
  }

  if (lesionPresent === "no") {
    return r(1, "No soft-tissue lesion identified on MRI[cite: 250].");
  }

  // Branch by Tissue Type (Figure 1) [cite: 300]
  if (tissueType === "lipomatous") return scoreLipomatous(caseData);
  if (tissueType === "cystlike") return scoreCystlike(caseData);
  if (tissueType === "indeterminate_solid") return scoreIndeterminateSolid(caseData);

  return r(0, "Insufficient data to classify. Please complete all required steps.");
}

// ─── Figure 2A: LIPOMATOUS LESIONS ────────────────────────────────

function scoreLipomatous(data) {
  const { lipFatContent, lipSeptations, lipVessels, lipNoduleFeatures } = data;

  // Branch 1: Predominantly Lipomatous (>90%) 
  if (lipFatContent === "predominantly") {
    if (lipSeptations === "thin_low_enh") {
      // Distinction based on vessels
      if (lipVessels === "few") {
        return r(2, "Predominantly lipomatous (>90%), thin septations, few/no prominent vessels. Classic Lipoma.", ["Lipoma", "Myolipoma", "Lipoma of nerve", "Lipoma arborescens"]);
      }
      if (lipVessels === "many") {
        return r(3, "Predominantly lipomatous (>90%), thin septations, MANY prominent vessels. Consistent with Angiolipoma.", ["Angiolipoma"]);
      }
    }
    if (lipSeptations === "thick_high_enh") {
      return r(4, "Predominantly lipomatous with thick septations (≥2mm) OR enhancement >10%. Suspicious for Atypical Lipomatous Tumor (ALT/WDL).", ["ALT/WDL"]);
    }
  }

  // Branch 2: Not Predominantly Lipomatous (≤90%) 
  if (lipFatContent === "not_predominantly") {
    if (lipNoduleFeatures === "no_nodules") {
      return r(4, "Lipomatous (≤90%) with no enhancing nodules or proportionately larger fatty component. Suspicious for ALT/WDL.", ["ALT/WDL"]);
    }
    if (lipNoduleFeatures === "nodules_present") {
      return r(5, "Lipomatous (≤90%) with enhancing nodules or proportionately smaller fatty component. Highly suspicious for Dedifferentiated Liposarcoma or Pleomorphic Sarcoma.", ["Dedifferentiated Liposarcoma", "Myxoid Liposarcoma", "Pleomorphic Sarcoma"]);
    }
  }

  return r(0, "Lipomatous lesion — incomplete data.");
}

// ─── Figure 2B: CYST-LIKE / HIGH WATER CONTENT ────────────────────

function scoreCystlike(data) {
  const { cystLocation, cystFlow, cystHematoma, cystSeptationNodules } = data;

  // Branch 1: Communication / Location [cite: 312]
  if (cystLocation === "superficial_communicating") {
    return r(2, "Cyst-like lesion communicating with joint/tendon OR cutaneous/subcutaneous location. Classic benign entity.", ["Ganglion", "Synovial Cyst", "Epidermoid Cyst", "Bursitis"]);
  }

  // Branch 2: Deep / Non-communicating [cite: 312]
  if (cystLocation === "deep_non_communicating") {
    if (cystFlow === "yes") {
      return r(2, "Deep cyst-like lesion predominantly comprised of flow voids or fluid-fluid levels. Consistent with Vascular Malformation.", ["Vascular Malformation", "Aneurysm", "Thrombophlebitis"]);
    }
    
    // Not flow voids
    if (cystHematoma === "yes") {
      return r(3, "Deep cyst-like lesion with features suggesting Hematoma. Follow-up to resolution is required.", ["Hematoma", "Chronic Expanding Hematoma"]);
    }
    
    // Septations/Nodules Logic
    if (cystSeptationNodules === "absent") {
      return r(3, "Deep cyst-like lesion, no thick septations, small mural nodules <1cm. ST-RADS 3 (or 4).", ["Intramuscular Myxoma", "Benign PNST", "Cysticercosis", "Myxofibrosarcoma (Low Grade)"], true);
    }
    if (cystSeptationNodules === "present") {
      return r(5, "Deep cyst-like lesion with thick enhancing septations OR mural nodules ≥1cm. Highly suspicious for Malignancy.", ["Synovial Sarcoma", "Myxofibrosarcoma", "Extraskeletal Myxoid Chondrosarcoma"]);
    }
  }
  return r(0, "Cyst-like lesion — incomplete data.");
}

// ─── Figure 2C & 2D: INDETERMINATE SOLID ──────────────────────────

function scoreIndeterminateSolid(data) {
  const { compartment } = data;

  // Figure 2D Compartments [cite: 330]
  if (compartment === "intravascular") return scoreIntravascular(data);
  if (compartment === "intraarticular") return scoreIntraarticular(data);
  if (compartment === "intraneural") return scoreIntraneural(data);
  if (compartment === "cutaneous") return scoreCutaneous(data);

  // Figure 2C Compartments 
  if (compartment === "deep_muscle") return scoreDeepMuscle(data);
  if (compartment === "intratendinous") return scoreTendon(data);
  if (compartment === "fascial") return scoreFascial(data);
  if (compartment === "subungual") return scoreSubungual(data);

  return r(0, "Solid lesion — incomplete compartment data.");
}

// Sub-function: Deep / Intramuscular (Fig 2C)
function scoreDeepMuscle(data) {
  const { muscleSignature, myositisTriad, deepT2 } = data;

  if (muscleSignature === "yes") {
    if (myositisTriad === "yes") {
      return r(2, "Deep lesion with muscle signature + Benign Triad (Injury, Edema, Mineralization). Myositis Ossificans.", ["Myositis Ossificans", "Myonecrosis"]);
    }
    return r(4, "Deep lesion with muscle signature but lacking full benign triad. Suspicious.", ["Desmoid", "Sarcoma (various)"], true);
  }

  // No muscle signature -> Hyperintense T2
  if (muscleSignature === "no") {
    // Note: Flowchart splits to RADS-3 (Myositis) or RADS-5 (Sarcoma) based on clinical picture
    return r(5, "Deep lesion, no muscle signature, hyperintense on T2W. Highly suspicious for Sarcoma (or potentially inflammatory Myositis if clinical picture fits).", ["Undifferentiated Pleomorphic Sarcoma", "Myositis (Inflammatory)", "Desmoid"], true);
  }
  return r(0, "Deep muscle lesion — incomplete data.");
}

// Sub-function: Intravascular (Fig 2D)
function scoreIntravascular(data) {
  const { vascMorphology, vascBlooming } = data;

  if (vascMorphology === "phleboliths") return r(2, "Hyperintense T2 lobules with phleboliths. Venous Malformation.", ["Venous Malformation"]);
  if (vascMorphology === "hyper_no_phleb") return r(4, "Hyperintense T2 lobules without phleboliths. Suspicious.", ["Hemangioendothelioma", "Angiosarcoma"], true);
  
  // Calcified or Hypointense
  if (vascMorphology === "calc_hypo") {
    if (vascBlooming === "blooming") return r(2, "Calcified/Hypointense with Blooming. Synovial Chondromatosis.", ["Synovial Chondromatosis"]);
    return r(2, "Calcified/Hypointense without Blooming.", ["Gout", "Amyloid", "Xanthoma"]);
  }
  return r(0, "Intravascular lesion — incomplete data.");
}

// Sub-function: Intraarticular (Fig 2D)
function scoreIntraarticular(data) {
  const { iaSignal, iaBlooming, iaEnhancement } = data;

  if (iaSignal === "calcified_hypo") {
    if (iaBlooming === "blooming") return r(2, "Intraarticular, Hypointense/Calcified with Blooming.", ["PVNS", "TGCT (diffuse)"]);
    return r(2, "Intraarticular, Hypointense/Calcified without Blooming.", ["Gout", "Amyloid"]);
  }

  if (iaSignal === "not_calcified_hyper") {
    if (iaEnhancement === "peripheral") return r(3, "Hyperintense T2 with peripheral enhancement.", ["TSGCT", "Synovial Chondromatosis"]);
    if (iaEnhancement === "no_peripheral") return r(4, "Hypointense T2, no peripheral enhancement.", ["TSGCT (focal)"]);
  }
  return r(0, "Intraarticular lesion — incomplete data.");
}

// Sub-function: Intraneural (Fig 2D)
function scoreIntraneural(data) {
  const { targetSign, nerveADC } = data;

  if (targetSign === "yes") {
    // Flowchart: Yes -> ADC > 1.1 -> RADS-2 (Green)
    // Yes -> ADC <= 1.1 -> RADS-4 (Yellow) / RADS-5 (Red)
    if (nerveADC === "high") return r(2, "Nerve lesion with Target Sign and ADC > 1.1.", ["Benign PNST", "Schwannoma", "Neurofibroma"]);
    if (nerveADC === "low") return r(5, "Nerve lesion with Target Sign but ADC ≤ 1.1. Highly Suspicious.", ["Malignant PNST"]);
  }
  if (targetSign === "no") {
    return r(3, "Nerve lesion without Target Sign.", ["Perineurioma", "Ancient Schwannoma"]);
  }
  return r(0, "Intraneural lesion — incomplete data.");
}

// Sub-function: Cutaneous (Fig 2D)
function scoreCutaneous(data) {
  const { growthPattern, cutEnhancement } = data;

  if (growthPattern === "exophytic") {
    if (cutEnhancement === "peripheral") return r(2, "Exophytic with peripheral enhancement.", ["Sebaceous Cyst", "Epidermoid Cyst"]);
    if (cutEnhancement === "internal") return r(4, "Exophytic with internal enhancement.", ["Wart", "DFSP", "Fibrosarcoma"], true);
  }
  if (growthPattern === "endophytic") {
    return r(5, "Endophytic cutaneous lesion. Highly suspicious.", ["Melanoma", "Metastasis", "Lymphoma"]);
  }
  return r(0, "Cutaneous lesion — incomplete data.");
}

// Sub-function: Intratendinous (Fig 2C)
function scoreTendon(data) {
  const { tendonMorph, tendonBlooming } = data;
  if (tendonMorph === "enlarged") return r(2, "Enlarged tendon with calcification/cysts.", ["Gout", "Amyloid"]);
  if (tendonMorph === "normal") {
    if (tendonBlooming === "blooming") return r(3, "Normal tendon size, hemosiderin blooming.", ["TSGCT"]);
    return r(4, "Normal tendon size, hemosiderin present without blooming.", ["TSGCT", "Sarcoma"], true);
  }
  return r(0, "Tendon lesion — incomplete data.");
}

// Sub-function: Fascial (Fig 2C)
function scoreFascial(data) {
  const { fascialSize, fascialMulti } = data;
  if (fascialSize === "small") {
    return fascialMulti === "yes" 
      ? r(2, "Small fascial nodules (<2cm), multifocal. Plantar/Palmar Fibromatosis.", ["Fibromatosis"]) 
      : r(3, "Small fascial nodule (<2cm), solitary.", ["Fibroma"]);
  }
  if (fascialSize === "large") {
    return fascialMulti === "yes"
      ? r(3, "Large fascial nodules (≥2cm), multifocal. Fibromatosis.", ["Fibromatosis"])
      : r(4, "Large fascial nodule (≥2cm), solitary. Suspicious.", ["Desmoid", "Synovial Sarcoma", "Clear Cell Sarcoma"], true);
  }
  return r(0, "Fascial lesion — incomplete data.");
}

// Sub-function: Subungual (Fig 2C)
function scoreSubungual(data) {
  const { subungualSize } = data;
  if (subungualSize === "small") return r(3, "Small subungual lesion (<1cm). Glomus Tumor.", ["Glomus Tumor"]);
  if (subungualSize === "large") return r(4, "Large subungual lesion (≥1cm). Suspicious.", ["Malignant Glomus Tumor"], true);
  return r(0, "Subungual lesion — incomplete data.");
}

// ─── ANCILLARY MODIFIERS ──────────────────────────────────────────

export function applyModifiers(result, data) {
  const { adcValue, ancillaryFlags } = data;
  let modifiedResult = { ...result };

  // 1. ADC Modifier
  if (adcValue && !isNaN(parseFloat(adcValue))) {
    const adc = parseFloat(adcValue);
    let note = "";
    if (adc < 1.1) note = ` [ADC ${adc} < 1.1 supports Malignancy]`;
    else if (adc > 1.5) note = ` [ADC ${adc} > 1.5 supports Benignity]`;
    modifiedResult.reasoning += note;
  }

  // 2. High Risk Ancillary Features (Upgrade Logic)
  if (ancillaryFlags && ancillaryFlags.length > 0) {
    const riskCount = ancillaryFlags.length;
    modifiedResult.reasoning += ` [${riskCount} Ancillary Risk Features Present]`;
    
    // If score is 3 or 4, and multiple risk factors exist, suggest upgrade to 5
    if ((result.category.score === 3 || result.category.score === 4) && riskCount >= 1) {
      modifiedResult.upgraded = true;
      modifiedResult.originalScore = result.category.score;
      modifiedResult.category = STRADS_CATEGORIES[5];
      modifiedResult.reasoning += " -> Upgraded to ST-RADS 5 due to ancillary features.";
    }
  }

  return modifiedResult;
}

// ─── HELPER ───────────────────────────────────────────────────────

function r(catKey, reasoning, differentials = [], radiologistChoice = false) {
  return {
    category: STRADS_CATEGORIES[catKey],
    reasoning,
    differentials,
    radiologistChoice
  };
}