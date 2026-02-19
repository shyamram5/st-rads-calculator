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

// Figure 1 order: (1) Incomplete → RADS-0. (2) No soft tissue lesion → RADS-1. (3) Soft tissue lesion → Macroscopic fat on T1W? Yes → Lipomatous. (4) No macroscopic fat → T2/enhancement: Markedly high T2 AND <20% enh → Cyst-like; No variable high T2 OR >20% enh → Indeterminate solid.
export function calculateSTRADS(caseData) {
  const { examAdequacy, lesionPresent, macroscopicFatT1W, t2EnhancementPath } = caseData;

  if (examAdequacy === "incomplete") {
    return r(0, "Incomplete imaging limits diagnostic interpretation.");
  }

  if (lesionPresent === "no") {
    return r(1, "No soft-tissue lesion identified on MRI. Category 1 is appropriate for examinations showing imaging findings that may mimic soft-tissue lesions but are not true lesions (e.g., asymmetric fatty or osseous prominence).");
  }

  // Figure 1 third decision: Macroscopic fat on T1W? Yes → Lipomatous algorithm
  if (macroscopicFatT1W === "yes") return scoreLipomatous(caseData);

  // Figure 1 fourth decision (no macroscopic fat): T2/enhancement path
  if (macroscopicFatT1W === "no" && t2EnhancementPath === "cystlike") return scoreCystlike(caseData);
  if (macroscopicFatT1W === "no" && t2EnhancementPath === "indeterminate_solid") return scoreIndeterminateSolid(caseData);

  return r(0, "Insufficient data to classify. Please complete all required steps.");
}

// ─── Figure 2A: LIPOMATOUS LESIONS ────────────────────────────────
// Flowchart: Predominantly (>90%) splits into:
//   A) Thin septations (<2mm) OR absence of nodules and like subcutaneous fat on all sequences → RADS-2
//   B) Septations and presence of nodules and like subcutaneous fat → thin/thick → if thin: vessels (many→RADS-3 Angiolipoma, few→RADS-4 ALT/WDL), if thick → RADS-4

function scoreLipomatous(data) {
  const { lipFatContent, lipNoduleSeptation, lipSeptations, lipVessels, lipNoduleFeatures } = data;

  // Branch 1: Predominantly Lipomatous (>90%)
  if (lipFatContent === "predominantly") {
    // Left path: Thin septations OR absence of nodules → RADS-2 (no vessel question)
    if (lipNoduleSeptation === "thin_absence") {
      return r(2, "Predominantly lipomatous (>90%): Thin septations (<2mm) OR absence of nodules and like subcutaneous fat intensity on all sequences. Consider anatomic location.", ["Subcutaneous/inter/intramuscular: Lipoma (including myolipoma)", "Intra-neural: Lipoma of nerve", "Intra-articular: Lipoma arborescens"]);
    }
    // Right path: Septations and presence of nodules
    if (lipNoduleSeptation === "septations_presence") {
      if (lipSeptations === "thick_high_enh") {
        return r(4, "Predominantly lipomatous with thick septations (≥2mm) OR enhancement >10%. Suspicious for Atypical lipomatous tumor / well-differentiated liposarcoma (ALT/WDL).", ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
      }
      if (lipSeptations === "thin_low_enh") {
        // Many prominent vessels → RADS-3 (Angiolipoma); few → RADS-4 (ALT/WDL)
        if (lipVessels === "many") {
          return r(3, "Predominantly lipomatous with septations and nodules, thin septations <2mm OR enhancement <10%, with many prominent vessels. Angiolipoma.", ["Angiolipoma"]);
        }
        if (lipVessels === "few") {
          return r(4, "Predominantly lipomatous with septations and nodules, thin septations <2mm OR enhancement <10%, with few prominent vessels. Suspicious for ALT/WDL.", ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
        }
      }
    }
  }

  // Branch 2: Not Predominantly Lipomatous (≤90%)
  if (lipFatContent === "not_predominantly") {
    if (lipNoduleFeatures === "no_nodules") {
      return r(4, "Not predominantly lipomatous (≤90%): No enhancing nodule(s) OR proportionately larger lipomatous component. Suspicious for ALT/WDL.", ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
    }
    if (lipNoduleFeatures === "nodules_present") {
      return r(5, "Not predominantly lipomatous (≤90%): Enhancing nodule(s) OR proportionately smaller lipomatous component. Highly suspicious for malignancy.", ["Dedifferentiated liposarcoma", "Myxoid liposarcoma", "Pleomorphic sarcoma"]);
    }
  }

  return r(0, "Lipomatous lesion — incomplete data.");
}

// ─── Figure 2B: CYST-LIKE / HIGH WATER CONTENT ────────────────────
// Communicates OR cutaneous/subcutaneous OR intraneural → RADS-2.
// Deep, no communication: flow voids? → if yes, hematoma? (yes→RADS-3, no→RADS-2). If no flow voids → hematoma → septations.

function scoreCystlike(data) {
  const { cystLocation, cystFlow, cystHematoma, cystSeptationNodules } = data;

  // Branch 1: Communicates with joint/tendon/bursa OR Cutaneous/subcutaneous OR Intraneural → RADS-2
  if (cystLocation === "superficial_communicating") {
    return r(2, "Cyst-like lesion communicates with joint, tendon sheath, or bursa OR cutaneous/subcutaneous OR intraneural location. Classic benign entity.", ["Ganglion", "Synovial cyst", "Geyser phenomenon", "Tenosynovitis", "Epidermoid cyst", "Bursitis", "Morel-Lavallée lesion", "Intraneural cyst"]);
  }

  // Branch 2: Deep (subfascial), no communication
  if (cystLocation === "deep_non_communicating") {
    if (cystFlow === "yes") {
      // Predominantly flow voids/fluid-fluid: ask hematoma per flowchart
      if (cystHematoma === "yes") return r(3, "Deep cyst-like, predominantly flow voids/fluid-fluid levels with features suggesting hematoma. RADS-3.", ["Hematoma", "Chronic expanding hematoma"]);
      return r(2, "Deep cyst-like lesion predominantly comprised of flow voids or fluid-fluid levels. Consistent with vascular malformation.", ["Low- or high-flow vascular malformation", "Aneurysm", "Thrombophlebitis"]);
    }
    // Not predominantly flow voids
    if (cystHematoma === "yes") {
      return r(3, "Deep cyst-like lesion with features suggesting hematoma. Follow-up to resolution.", ["Hematoma", "Chronic expanding hematoma"]);
    }
    if (cystSeptationNodules === "absent") {
      return r(3, "Deep cyst-like: absence of thick enhancing septations and small mural nodule(s) <1 cm. ST-RADS 3 or 4 (radiologist choice).", ["Intramuscular myxoma", "Benign PNST", "Cysticercosis", "Hydatid cyst", "Myxoid liposarcoma", "Myxofibrosarcoma"], true);
    }
    if (cystSeptationNodules === "present") {
      return r(5, "Deep cyst-like: presence of thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft tissue component. Highly suspicious for malignancy.", ["Synovial sarcoma", "Hemangioendothelioma", "Angiosarcoma", "Extraskeletal myxoid chondrosarcoma", "Myxoinflammatory fibroblastic sarcoma", "Myxofibrosarcoma"]);
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
// Muscle signature PRESENT → RADS-2 (no triad question). No muscle signature → Benign triad (prior injury + edema + mineralization)? Yes→RADS-2, No→RADS-4/5.
function scoreDeepMuscle(data) {
  const { muscleSignature, myositisTriad } = data;

  if (muscleSignature === "yes") {
    return r(2, "Deep (subfascial)/inter or intramuscular lesion with muscle signature present. RADS-2.", ["Hypertrophied muscle", "Myositis", "Myopathy", "Myonecrosis", "Myositis ossificans"]);
  }
  if (muscleSignature === "no") {
    if (myositisTriad === "yes") {
      return r(2, "Deep lesion without muscle signature but with history of prior injury with peritumoral edema and mature peripheral mineralization. RADS-2.", ["Hypertrophied muscle", "Myositis", "Myopathy", "Myonecrosis", "Myositis ossificans"]);
    }
    return r(4, "Deep lesion without muscle signature and without benign triad. ST-RADS 4 or 5.", ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"], true);
  }
  return r(0, "Deep muscle lesion — incomplete data.");
}

// Sub-function: Intravascular (Fig 2D)
// Hyperintense T2 WITH phleboliths WITH fluid-fluid → RADS-2. WITHOUT phleboliths/fluid-fluid → T2/enhancement: hyperintense+peripheral→RADS-4, hypointense+no peripheral→RADS-5.
function scoreIntravascular(data) {
  const { vascMorphology, vascBlooming, vascT2Enhancement } = data;

  if (vascMorphology === "phleboliths") {
    return r(2, "Hyperintense lobules or tubules on T2W with hypointense phleboliths with fluid-fluid levels. Venous or venolymphatic malformation.", ["Venous malformation", "Venolymphatic malformation"]);
  }
  if (vascMorphology === "hyper_no_phleb") {
    return r(4, "Hyperintense lobules or tubules on T2W WITHOUT hypointense phleboliths WITHOUT fluid-fluid levels. ST-RADS 4 or 5.", ["Hemangioendothelioma", "Kaposi sarcoma", "Angiosarcoma", "Leiomyosarcoma"], true);
  }
  if (vascMorphology === "calc_hypo") {
    if (vascBlooming === "blooming") return r(2, "Calcified/ossified or predominantly hypointense T2 with hemosiderin staining and blooming on GRE. RADS-2.", ["Synovial chondromatosis", "Synovial hemangioma"]);
    return r(2, "Calcified/ossified or predominantly hypointense T2 with hemosiderin without blooming on GRE. RADS-2.", ["Gout", "Amyloid", "Xanthoma"]);
  }
  return r(0, "Intravascular lesion — incomplete data.");
}

// Sub-function: Intraarticular (Fig 2D)
// Calcified/hypointense → RADS-2. Not calcified/hyperintense → peripheral → RADS-3, no peripheral → RADS-4.
function scoreIntraarticular(data) {
  const { iaSignal, iaEnhancement } = data;

  if (iaSignal === "calcified_hypo") {
    return r(2, "Intraarticular calcified/ossified or predominantly hypointense T2. RADS-2.", ["Synovial chondromatosis", "Synovial hemangioma", "Gout", "Amyloid", "Xanthoma"]);
  }

  if (iaSignal === "not_calcified_hyper") {
    if (iaEnhancement === "peripheral") return r(3, "Intraarticular not calcified, hyperintense on T2W with peripheral enhancement. RADS-3.", ["TSGCT", "Synovial chondromatosis"]);
    if (iaEnhancement === "no_peripheral") return r(4, "Intraarticular not calcified, hypointense on T2W with no peripheral enhancement. RADS-4.", ["TSGCT"]);
  }
  return r(0, "Intraarticular lesion — incomplete data.");
}

// Sub-function: Intraneural (Fig 2D)
// Target sign PRESENT → RADS-2 (no ADC question). Target sign ABSENT → ADC >1.1 → RADS-3, ADC ≤1.1 → RADS-4/5.
function scoreIntraneural(data) {
  const { targetSign, nerveADC } = data;

  if (targetSign === "yes") {
    return r(2, "Nerve-related lesion with target sign present. Benign peripheral nerve sheath tumor.", ["Benign peripheral nerve sheath tumor"]);
  }
  if (targetSign === "no") {
    if (nerveADC === "high") {
      return r(3, "Nerve-related lesion without target sign, ADC >1.1 mm²/s. RADS-3.", ["Perineurioma", "Ancient schwannoma", "Neurofibroma with degenerative change", "Atypical neurofibroma"]);
    }
    if (nerveADC === "low") {
      return r(4, "Nerve-related lesion without target sign, ADC ≤1.1 mm²/s. ST-RADS 4 or 5.", ["Malignant peripheral nerve sheath tumor"], true);
    }
  }
  return r(0, "Intraneural lesion — incomplete data.");
}

// Sub-function: Cutaneous (Fig 2D)
// Exophytic → peripheral enhancement → RADS-2, internal enhancement → RADS-4. Endophytic → RADS-5.
function scoreCutaneous(data) {
  const { growthPattern, cutEnhancement } = data;

  if (growthPattern === "exophytic") {
    if (cutEnhancement === "peripheral") return r(2, "Exophytic cutaneous/subcutaneous lesion with peripheral enhancement. RADS-2.", ["Sebaceous cyst", "Trichilemmal cyst", "Epidermoid cyst", "Retinacular cyst"]);
    if (cutEnhancement === "internal") return r(4, "Exophytic cutaneous/subcutaneous lesion with internal enhancement. ST-RADS 4.", ["Wart", "Dermatofibrosarcoma protuberans", "Fibrosarcoma NOS"]);
  }
  if (growthPattern === "endophytic") {
    return r(5, "Endophytic cutaneous/subcutaneous lesion. Highly suspicious for malignancy. ST-RADS 5.", ["T-cell lymphoma", "Merkel cell tumor", "Melanoma", "Cutaneous metastasis (lung, breast, renal)"]);
  }
  return r(0, "Cutaneous lesion — incomplete data.");
}

// Sub-function: Intratendinous (Fig 2C)
// Enlarged tendon → hemosiderin with blooming → RADS-2, without blooming → RADS-3. Normal tendon → with blooming → RADS-4, without blooming → RADS-5.
function scoreTendon(data) {
  const { tendonMorph, tendonBlooming } = data;
  if (tendonMorph === "enlarged") {
    return r(2, "Enlarged tendon with calcifications, cystic change, fat, or amyloidosis/autoimmune history. RADS-2.", ["Gout", "Amyloid", "Xanthoma"]);
  }
  if (tendonMorph === "normal") {
    if (tendonBlooming === "blooming") return r(3, "Normal size tendon without calcifications/cysts/fat; hemosiderin staining with blooming on GRE. RADS-3.", ["TSGCT"]);
    return r(4, "Normal size tendon without calcifications/cysts/fat; hemosiderin without blooming on GRE. ST-RADS 4 or 5.", ["TSGCT", "Synovial sarcoma", "Malignant PNST"], true);
  }
  return r(0, "Tendon lesion — incomplete data.");
}

// Sub-function: Fascial (Fig 2C)
// Fascial nodule <2 cm → RADS-2 (Fibroma) only. Fascial nodule ≥2 cm → Multifocal/conglomerate → RADS-3, No multifocal → RADS-4/5.
function scoreFascial(data) {
  const { fascialSize, fascialMulti } = data;
  if (fascialSize === "small") {
    return r(2, "Fascial nodule <2 cm in length. RADS-2.", ["Fibroma"]);
  }
  if (fascialSize === "large") {
    if (fascialMulti === "yes") return r(3, "Fascial nodule ≥2 cm with multifocal or conglomerate fascial nodules. RADS-3.", ["Fibromatosis"]);
    return r(4, "Fascial nodule ≥2 cm, no multifocal or conglomerate. ST-RADS 4 or 5.", ["Desmoid", "Synovial sarcoma", "Epithelioid sarcoma", "Myxoinflammatory fibroblastic sarcoma", "Clear cell sarcoma"], true);
  }
  return r(0, "Fascial lesion — incomplete data.");
}

// Sub-function: Subungual (Fig 2C)
// Hyperintense T2, diffuse enhancement. Small <1 cm → RADS-3. Large ≥1 cm → RADS-4.
function scoreSubungual(data) {
  const { subungualSize } = data;
  if (subungualSize === "small") return r(3, "Small subungual lesion (<1 cm), hyperintense on T2W with diffuse enhancement. RADS-3.", ["Glomus tumor NOS"]);
  if (subungualSize === "large") return r(4, "Large subungual lesion (≥1 cm), hyperintense on T2W with diffuse enhancement. RADS-4.", ["Glomus tumor—malignant"]);
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
    if (adc < 1.1) note = ` [ADC ${adc} × 10⁻³ mm²/s < 1.1 supports malignancy]`;
    else if (adc > 1.5) note = ` [ADC ${adc} × 10⁻³ mm²/s > 1.5 supports benignity]`;
    modifiedResult.reasoning += note;
  }

  // 2. High Risk Ancillary Features (Upgrade to RADS-5)
  if (ancillaryFlags && ancillaryFlags.length > 0) {
    const flagLabels = ancillaryFlags.join(", ");
    modifiedResult.reasoning += ` [Ancillary risk features: ${flagLabels}]`;
    
    // Upgrade scores 3 or 4 to ST-RADS 5 when ≥1 ancillary risk feature is present
    if ((result.category.score === 3 || result.category.score === 4)) {
      modifiedResult.upgraded = true;
      modifiedResult.originalScore = result.category.score;
      modifiedResult.category = STRADS_CATEGORIES[5];
      modifiedResult.reasoning += " → Upgraded to ST-RADS 5 due to ancillary high-risk features.";
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