// ST-RADS v2025 Deterministic Rule Engine
// Faithfully implements Figures 1, 2A, 2B, 2C, 2D from Chhabra et al., AJR 2025

export const STRADS_CATEGORIES = {
  0: {
    score: 0, label: "Incomplete", risk: "N/A", color: "gray",
    meaning: "Incomplete imaging, limiting diagnostic interpretation.",
    management: "Recall for additional imaging and/or request prior examinations. Additional imaging may include missing pre- or postcontrast MRI sequence, US to assess for vascular flow, or radiography or CT to assess for possible mineralization (e.g., heterotopic ossification or phleboliths)."
  },
  1: {
    score: 1, label: "Negative", risk: "N/A", color: "green",
    meaning: "No soft-tissue tumor or tumor-like lesion identified on imaging.",
    management: "No further imaging follow-up recommended."
  },
  2: {
    score: 2, label: "Definitely Benign", risk: "Very Low (nearly zero)", color: "emerald",
    meaning: "Imaging findings classic for a specific definitely benign soft-tissue tumor or tumor-like lesion.",
    management: "Imaging follow-up at the clinical team's discretion. Treatment of benign tumors (e.g., PNST) or tumor-like lesions is based on clinical findings. Consultation with a vascular interventionist is advised for vascular malformations."
  },
  3: {
    score: 3, label: "Probably Benign", risk: "Low", color: "yellow",
    meaning: "Imaging findings classic for a benign lesion with some doubt, or suggestive of a probably benign soft-tissue tumor or tumor-like lesion.",
    management: "Imaging follow-up can be considered at 6 weeks to 3 months, 6 months, 1 year, and 2 years, unless the lesion resolves or significantly regresses. Imaging or clinical follow-up to resolution for hematomas. Additional options include biopsy, resection, or sarcoma specialist referral."
  },
  4: {
    score: 4, label: "Suspicious", risk: "Intermediate", color: "orange",
    meaning: "Imaging findings suspicious for a malignant or locally aggressive soft-tissue tumor or tumor-like lesion.",
    management: "Follow-up options include image-guided biopsy, open biopsy, or follow-up imaging at 4–6 weeks with subsequent regular interval follow-up for up to 2 years. Tissue diagnosis or referral to a sarcoma center recommended for lesions ≥5 cm (and for smaller lesions in certain anatomic regions). Multidisciplinary review if biopsy negative."
  },
  5: {
    score: 5, label: "Highly Suggestive of Malignancy", risk: "High", color: "red",
    meaning: "Imaging findings highly suspicious (essentially pathognomonic) for a sarcoma or other malignant soft-tissue tumor.",
    management: "Tissue diagnosis and referral to a sarcoma center are recommended."
  },
  "6A": {
    score: "6A", label: "Known Tumor – No Residual", risk: "N/A", color: "blue",
    meaning: "No imaging evidence of residual soft-tissue tumor or tumor-like lesion. Expected posttreatment changes with no or diffuse edema; enhancement may be present without focal or diffuse mass or substantial diffusion restriction.",
    management: "For histologically confirmed malignant tumors: follow-up imaging at 6 weeks to 3 months, 6 months, 1 year, and 2 years. For benign lesions: follow-up if clinically symptomatic or at 6 months to 1 year intervals."
  },
  "6B": {
    score: "6B", label: "Known Tumor – Residual", risk: "N/A", color: "blue",
    meaning: "Residual soft-tissue tumor or tumor-like lesion. Focal or diffuse mass with up to 20% increase in the largest dimension since pretreatment imaging. Similar or increase in ADC compared with before treatment.",
    management: "Surgical excision or other further medical treatment as clinically appropriate. If no intervention, follow-up imaging at 6 weeks to 3 months, 6 months, 1 year, and 2 years."
  },
  "6C": {
    score: "6C", label: "Known Tumor – Progressive", risk: "N/A", color: "red",
    meaning: "Recurrent or progressive soft-tissue tumor or tumor-like lesion, with or without metastatic disease. >20% increase in largest dimension since pretreatment imaging; increase in diffusion restriction.",
    management: "Surgical excision or other further medical treatment as clinically appropriate. If no intervention, follow-up imaging at 6 weeks to 3 months, 6 months, 1 year, and 2 years."
  }
};

// ─── MAIN ENTRY POINT ───────────────────────────────────────────

export function calculateSTRADS(caseData) {
  const { examAdequacy, lesionPresent, knownTumor, knownTumorStatus, tissueType } = caseData;

  // ── Figure 1: General Algorithm ──

  // Step 1: Exam completeness
  if (examAdequacy === "incomplete") {
    return r(0, "Incomplete imaging limits diagnostic interpretation.");
  }

  // Known treated tumor → Category 6 (bypasses flowchart entirely)
  if (knownTumor === "yes") {
    if (knownTumorStatus === "no_residual") return r("6A", "Known treated tumor with no imaging evidence of residual disease.");
    if (knownTumorStatus === "residual") return r("6B", "Known treated tumor with residual disease (≤20% increase in largest dimension).");
    if (knownTumorStatus === "progressive") return r("6C", "Known treated tumor with progressive or recurrent disease (>20% increase in largest dimension).");
  }

  // Step 2: Lesion present?
  if (lesionPresent === "no") {
    return r(1, "No soft-tissue lesion identified on MRI.");
  }

  // Step 3: Tissue type branching (per Figure 1)
  // - Macroscopic fat on T1W → Lipomatous Algorithm (Fig 2A)
  // - No macroscopic fat, markedly high T2 AND <20% enhancement → Cyst-like Algorithm (Fig 2B)
  // - No macroscopic fat, no variable high T2 OR >20% enhancement → Indeterminate Solid (Fig 2C/2D)
  if (tissueType === "lipomatous") return scoreLipomatous(caseData);
  if (tissueType === "cystlike") return scoreCystlike(caseData);
  if (tissueType === "indeterminate_solid") return scoreIndeterminateSolid(caseData);

  return r(0, "Insufficient data to classify. Please complete all required steps.");
}

// ─── Figure 2A: LIPOMATOUS ALGORITHM ────────────────────────────

function scoreLipomatous(caseData) {
  const { lipFatContent, lipSeptations, lipEnhancement, lipVessels, lipNonFatFeatures } = caseData;

  // Branch 1: Predominantly lipomatous (>90%)
  if (lipFatContent === "predominantly") {

    // Sub-branch A: Thin septations (<2mm) OR absence of nodules, like subcutaneous fat on all sequences
    if (lipSeptations === "thin_or_none") {
      // Now check enhancement
      if (lipEnhancement === "less_than_10") {
        // Check vessels
        if (lipVessels === "many") {
          return r(2, "Predominantly lipomatous (>90%) with thin/no septations, <10% enhancement, and many prominent vessels. Consider subcutaneous/intramuscular lipoma (including myolipoma), intraneural lipoma of nerve, or intra-articular lipoma arborescens.",
            ["Lipoma", "Myolipoma", "Lipoma of nerve", "Lipoma arborescens"]);
        }
        // Few or no prominent vessels → Angiolipoma (RADS-3 per flowchart)
        return r(3, "Predominantly lipomatous (>90%) with thin/no septations, <10% enhancement, and few prominent vessels. Consider angiolipoma.",
          ["Angiolipoma"]);
      }
      // Enhancement ≥10% but thin septations → goes to thick septation / >10% enhancement branch → RADS-4
      if (lipEnhancement === "more_than_10") {
        return r(4, "Predominantly lipomatous (>90%) with thin septations but >10% enhancement increase. Suspicious for atypical lipomatous tumor / well-differentiated liposarcoma (ALT/WDL).",
          ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
      }
    }

    // Sub-branch B: Septations AND presence of nodules, like subcutaneous fat intensity on ALL sequences
    if (lipSeptations === "septations_with_nodules") {
      // Per flowchart: still check thin vs thick septations and enhancement
      if (lipEnhancement === "less_than_10") {
        if (lipVessels === "many") {
          return r(2, "Predominantly lipomatous (>90%) with septations and nodules showing subcutaneous fat intensity on all sequences, <10% enhancement, and many prominent vessels. Consider lipoma variants.",
            ["Lipoma", "Myolipoma", "Lipoma of nerve", "Lipoma arborescens"]);
        }
        return r(3, "Predominantly lipomatous (>90%) with septations and nodules, <10% enhancement, and few prominent vessels. Consider angiolipoma.",
          ["Angiolipoma"]);
      }
      // >10% enhancement
      return r(4, "Predominantly lipomatous (>90%) with septations, nodules, and >10% enhancement. Suspicious for ALT/WDL.",
        ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
    }

    // Sub-branch C: Thick septations (≥2mm)
    if (lipSeptations === "thick") {
      return r(4, "Predominantly lipomatous (>90%) with thick septations (≥2 mm). Suspicious for atypical lipomatous tumor / well-differentiated liposarcoma (ALT/WDL).",
        ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
    }
  }

  // Branch 2: Not predominantly lipomatous (≤90% fat)
  if (lipFatContent === "not_predominantly") {
    // No enhancing nodule(s) OR proportionately larger lipomatous component
    if (lipNonFatFeatures === "no_enhancing_nodules") {
      return r(4, "Not predominantly lipomatous (≤90%) without enhancing nodules, or with proportionately larger lipomatous component than soft-tissue component. Suspicious for ALT/WDL.",
        ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
    }
    // Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue
    if (lipNonFatFeatures === "enhancing_nodules") {
      return r(5, "Not predominantly lipomatous (≤90%) with enhancing nodule(s) or proportionately smaller lipomatous component. Highly suspicious for dedifferentiated liposarcoma, myxoid liposarcoma, or pleomorphic sarcoma. Other ancillary features (necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, metastasis) may also be present.",
        ["Dedifferentiated liposarcoma", "Myxoid liposarcoma", "Pleomorphic sarcoma"]);
    }
  }

  return r(0, "Lipomatous lesion with incomplete characterization.");
}

// ─── Figure 2B: CYST-LIKE / HIGH WATER CONTENT ALGORITHM ────────

function scoreCystlike(caseData) {
  const { cystCommunication, cystLocation, cystFlowVoids, cystHematoma, cystSeptations } = caseData;

  // LEFT branch: Communicates with joint/tendon sheath/bursa OR cutaneous/subcutaneous OR intraneural
  if (cystCommunication === "communicates" || cystLocation === "cutaneous_subcutaneous" || cystLocation === "intraneural") {
    return r(2, "Cyst-like lesion that communicates with joint, tendon sheath, or bursa; OR is in a cutaneous/subcutaneous location; OR is in an intraneural location. Classic benign entity.",
      ["Ganglion", "Synovial cyst", "Geyser phenomenon", "Tenosynovitis", "Epidermoid cyst", "Bursitis", "Morel-Lavallée lesion", "Intraneural cyst"]);
  }

  // RIGHT branch: No communication with joint/tendon/bursa AND deeper location
  if (cystLocation === "deeper" || cystCommunication === "no_communication") {
    // Check flow voids / fluid-fluid levels
    if (cystFlowVoids === "predominantly_flow_voids") {
      return r(2, "Deep cyst-like lesion predominantly comprised of flow voids or fluid-fluid levels. Consistent with low- or high-flow vascular malformation, aneurysm, or thrombophlebitis.",
        ["Low-flow vascular malformation", "High-flow vascular malformation", "Aneurysm", "Thrombophlebitis"]);
    }

    // Not predominantly flow voids → check for hematoma features
    if (cystHematoma === "yes") {
      return r(3, "Deep cyst-like lesion with features suggesting hematoma. Follow-up to resolution is important as hematoma may mask underlying neoplasm.",
        ["Hematoma", "Chronic expanding hematoma"]);
    }

    // No hematoma features → assess septations/nodules
    // Absence of thick enhancing septations and small mural nodules <1 cm
    if (cystSeptations === "absent_or_thin") {
      return r(3, "Deep cyst-like lesion without thick enhancing septations, with small mural nodules <1 cm. Consider intramuscular myxoma, benign peripheral nerve sheath tumor, cysticercosis, hydatid cyst, myxoid liposarcoma, or myxofibrosarcoma.",
        ["Intramuscular myxoma", "Benign PNST", "Cysticercosis", "Hydatid cyst", "Myxoid liposarcoma", "Myxofibrosarcoma"]);
    }

    // Small enhancing septations or small mural nodules (<1 cm) — RADS 3 or 4
    if (cystSeptations === "small_nodules") {
      return r(4, "Deep cyst-like lesion with enhancing septations and/or small mural nodules (<1 cm). Consider benign PNST with edema, cysticercosis, hydatid cyst, or low-grade myxoid sarcoma. The radiologist may assign category 3 if findings favor a benign entity.",
        ["Cystic PNST with edema", "Cysticercosis", "Hydatid cyst", "Myxoid liposarcoma", "Myxofibrosarcoma"]);
    }

    // Thick enhancing septations AND/OR mural nodule(s) ≥1 cm or larger soft tissue component → RADS-5
    if (cystSeptations === "thick_or_nodules") {
      return r(5, "Deep cyst-like lesion with thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft-tissue component. Highly suspicious for malignancy. Ancillary features (hemorrhage, peritumoral edema, fascial tails, intercompartmental extension, necrosis, low ADC <1.1, rapid growth, metastasis) may be present.",
        ["Synovial sarcoma", "Hemangioendothelioma", "Angiosarcoma", "Extraskeletal myxoid chondrosarcoma", "Myxoinflammatory fibroblastic sarcoma", "Myxofibrosarcoma"]);
    }
  }

  return r(0, "Cyst-like lesion with incomplete characterization.");
}

// ─── Figures 2C & 2D: INDETERMINATE SOLID ALGORITHM ─────────────

function scoreIndeterminateSolid(caseData) {
  const { solidCompartment } = caseData;

  // Figure 2D compartments
  if (solidCompartment === "intravascular") return scoreIntravascular(caseData);
  if (solidCompartment === "intraarticular") return scoreIntraarticular(caseData);
  if (solidCompartment === "intraneural") return scoreIntraneural(caseData);
  if (solidCompartment === "cutaneous_subcutaneous") return scoreCutaneousSubcutaneous(caseData);

  // Figure 2C compartments
  if (solidCompartment === "deep_intramuscular") return scoreDeepIntramuscular(caseData);
  if (solidCompartment === "intratendinous") return scoreIntratendinous(caseData);
  if (solidCompartment === "plantar_palmar") return scorePalmarPlantar(caseData);
  if (solidCompartment === "subungual") return scoreSubungual(caseData);

  return r(0, "Indeterminate solid lesion with incomplete compartment data.");
}

// ─── Figure 2D: Intravascular / Vessel-Related ──────────────────

function scoreIntravascular(caseData) {
  const { vascularT2, vascularPhleboliths, vascularFluidLevels } = caseData;

  // Hyperintense lobules/tubules on T2W WITH hypointense phleboliths WITH fluid-fluid levels → RADS-2
  if (vascularT2 === "hyperintense_with_phleboliths" && vascularPhleboliths === "yes" && vascularFluidLevels === "yes") {
    return r(2, "Hyperintense lobules/tubules on T2W with hypointense phleboliths and fluid-fluid levels. Classic venous or venolymphatic malformation.",
      ["Venous malformation", "Venolymphatic malformation"]);
  }

  // Hyperintense lobules/tubules WITHOUT phleboliths or WITHOUT fluid-fluid levels → RADS-4/5
  if (vascularT2 === "hyperintense_with_phleboliths" && (vascularPhleboliths === "no" || vascularFluidLevels === "no")) {
    return r(4, "Hyperintense lobules/tubules on T2W without classic phleboliths or fluid-fluid levels. Consider hemangioendothelioma, Kaposi sarcoma, angiosarcoma, or leiomyosarcoma. Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
      ["Hemangioendothelioma", "Kaposi sarcoma", "Angiosarcoma", "Leiomyosarcoma"]);
  }

  // Hyperintense lobules/tubules on T2W WITHOUT phleboliths, WITHOUT fluid-fluid levels
  if (vascularT2 === "hyperintense_no_phleboliths") {
    return r(4, "Hyperintense lobules/tubules on T2W without hypointense phleboliths and without fluid-fluid levels. Consider hemangioendothelioma, Kaposi sarcoma, angiosarcoma, or leiomyosarcoma.",
      ["Hemangioendothelioma", "Kaposi sarcoma", "Angiosarcoma", "Leiomyosarcoma"]);
  }

  // Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W → check hemosiderin
  if (vascularT2 === "calcified_hypointense") {
    const { vascHemosiderin, vascBloomingGRE } = caseData;
    // Hemosiderin staining WITH blooming on GRE → RADS-2 (synovial chondromatosis, synovial hemangioma)
    if (vascHemosiderin === "yes" && vascBloomingGRE === "yes") {
      return r(2, "Intravascular/vessel-related lesion that is calcified/ossified with hemosiderin staining and blooming on GRE. Consider synovial chondromatosis or synovial hemangioma.",
        ["Synovial chondromatosis", "Synovial hemangioma"]);
    }
    // Hemosiderin WITHOUT blooming → RADS-2 (gout, amyloid, xanthoma)
    if (vascHemosiderin === "yes" && vascBloomingGRE === "no") {
      return r(2, "Intravascular/vessel-related lesion that is calcified with hemosiderin staining but no blooming on GRE. Consider gout, amyloid, or xanthoma.",
        ["Gout", "Amyloid", "Xanthoma"]);
    }
    return r(2, "Intravascular/vessel-related lesion with calcification/ossification. Consider synovial chondromatosis or synovial hemangioma.",
      ["Synovial chondromatosis", "Synovial hemangioma"]);
  }

  // Not calcified/ossified, predominantly hyperintense foci on T2W
  if (vascularT2 === "hyperintense_foci") {
    const { vascEnhancement } = caseData;
    // Hyperintense on T2W AND peripheral enhancement → RADS-3 (TSGCT, synovial chondromatosis)
    if (vascEnhancement === "peripheral") {
      return r(3, "Intravascular lesion hyperintense on T2W with no or peripheral enhancement. Consider TSGCT or synovial chondromatosis.",
        ["TSGCT", "Synovial chondromatosis"]);
    }
    // Hypointense on T2W and no peripheral enhancement → RADS-4 (TSGCT)
    if (vascEnhancement === "none_hypointense") {
      return r(4, "Intravascular lesion with predominantly hypointense T2W signal. Consider TSGCT.",
        ["TSGCT"]);
    }
    return r(3, "Intravascular/vessel-related lesion with non-specific features. Further characterization recommended.",
      ["TSGCT", "Synovial chondromatosis"]);
  }

  return r(4, "Intravascular/vessel-related lesion requiring further characterization.");
}

// ─── Figure 2D: Intraarticular ──────────────────────────────────

function scoreIntraarticular(caseData) {
  const { iaHemosiderin, iaBloomingGRE } = caseData;

  // Hemosiderin staining WITH blooming on GRE → RADS-2
  if (iaHemosiderin === "yes" && iaBloomingGRE === "yes") {
    return r(2, "Intraarticular lesion with hemosiderin staining and blooming on GRE. Classic for TSGCT (pigmented villonodular synovitis).",
      ["TSGCT / PVNS"]);
  }
  // Hemosiderin WITHOUT blooming → RADS-3
  if (iaHemosiderin === "yes" && iaBloomingGRE === "no") {
    return r(3, "Intraarticular lesion with hemosiderin staining but without blooming on GRE. Consider TSGCT.",
      ["TSGCT"]);
  }
  // Hemosiderin staining WITHOUT blooming → RADS-4
  if (iaHemosiderin === "no" && iaBloomingGRE === "yes") {
    return r(4, "Intraarticular lesion without hemosiderin staining but with blooming on GRE. Further characterization needed.",
      ["TSGCT", "Synovial sarcoma"]);
  }
  // No hemosiderin, no blooming → RADS-4/5
  if (iaHemosiderin === "no" && iaBloomingGRE === "no") {
    return r(4, "Intraarticular lesion without hemosiderin staining or blooming on GRE. Features favoring RADS-5 include solid enhancing nodules >2 cm, fascial tails, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
      ["TSGCT", "Synovial sarcoma"]);
  }
  return r(4, "Intraarticular lesion requiring further characterization.");
}

// ─── Figure 2D: Intraneural / Nerve-Related ─────────────────────

function scoreIntraneural(caseData) {
  const { nerveTargetSign, nerveADC } = caseData;

  // Target sign present
  if (nerveTargetSign === "yes") {
    if (nerveADC === "above_1_1") {
      return r(2, "Nerve-related lesion with target sign and ADC >1.1 × 10⁻³ mm²/s. Classic benign peripheral nerve sheath tumor.",
        ["Schwannoma", "Neurofibroma"]);
    }
    if (nerveADC === "at_or_below_1_1") {
      return r(4, "Nerve-related lesion with target sign but ADC ≤1.1 × 10⁻³ mm²/s. Restricted diffusion raises concern for malignant PNST. Features favoring RADS-5 include size >4 cm, perilesional edema, necrosis, absence of target sign, rapid growth, growth along nerve, or crossing compartments.",
        ["Malignant peripheral nerve sheath tumor"]);
    }
    // ADC not available but target sign present → RADS-2
    return r(2, "Nerve-related lesion with target sign. Classic for benign peripheral nerve sheath tumor. Consider DWI/ADC for further risk stratification.",
      ["Schwannoma", "Neurofibroma"]);
  }

  // No target sign
  if (nerveTargetSign === "no") {
    return r(3, "Nerve-related lesion without target sign. Consider perineurioma, ancient schwannoma, neurofibroma with degenerative change, or atypical neurofibroma. Features favoring RADS-4/5 include size >4 cm, perilesional edema, necrosis, rapid growth, growth along nerve, or crossing compartments.",
      ["Perineurioma", "Ancient schwannoma", "Neurofibroma with degenerative change", "Atypical neurofibroma"]);
  }

  return r(3, "Nerve-related lesion requiring further characterization.");
}

// ─── Figure 2D: Cutaneous / Subcutaneous ────────────────────────

function scoreCutaneousSubcutaneous(caseData) {
  const { cutGrowthPattern, cutEnhancement } = caseData;

  if (cutGrowthPattern === "exophytic") {
    if (cutEnhancement === "peripheral") {
      return r(2, "Exophytic cutaneous/subcutaneous lesion with peripheral enhancement. Consistent with sebaceous cyst, trichilemmal cyst, epidermoid cyst, or retinacular cyst.",
        ["Sebaceous cyst", "Trichilemmal cyst", "Epidermoid cyst", "Retinacular cyst"]);
    }
    if (cutEnhancement === "internal") {
      return r(4, "Exophytic cutaneous/subcutaneous lesion with internal enhancement. Consider wart, dermatofibrosarcoma protuberans, or fibrosarcoma NOS. Features favoring RADS-5 include large size, rapid growth, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, or metastasis.",
        ["Wart", "Dermatofibrosarcoma protuberans", "Fibrosarcoma NOS"]);
    }
  }

  if (cutGrowthPattern === "endophytic") {
    return r(5, "Endophytic cutaneous/subcutaneous lesion with internal enhancement. Highly suspicious for T-cell lymphoma, Merkel cell tumor, melanoma, or cutaneous metastasis (lung, breast, renal).",
      ["T-cell lymphoma", "Merkel cell tumor", "Melanoma", "Cutaneous metastasis"]);
  }

  return r(4, "Cutaneous/subcutaneous lesion requiring further characterization.");
}

// ─── Figure 2C: Deep (subfascial) / Intermuscular / Intramuscular ──

function scoreDeepIntramuscular(caseData) {
  const { deepMuscleSignature, deepHistory, deepEdema, deepMineralization } = caseData;

  // Muscle signature present
  if (deepMuscleSignature === "muscle") {
    if (deepHistory === "prior_injury" && deepEdema === "yes" && deepMineralization === "mature") {
      return r(2, "Deep/intramuscular lesion with muscle signature, history of prior injury, peritumoral edema, and mature peripheral mineralization. Classic for hypertrophied muscle, myositis, myopathy, myonecrosis, or myositis ossificans.",
        ["Hypertrophied muscle", "Myositis", "Myopathy", "Myonecrosis", "Myositis ossificans"]);
    }
    // No history of prior injury, OR no mature mineralization → RADS-4/5
    return r(4, "Deep/intramuscular lesion with muscle signature but without classic benign triad (prior injury + peritumoral edema + mature mineralization). Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
      ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"]);
  }

  // No muscle signature
  if (deepMuscleSignature === "no_muscle") {
    return r(4, "Deep/intramuscular lesion without muscle signature. Requires further characterization. Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
      ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"]);
  }

  return r(4, "Deep intramuscular lesion requiring further characterization.");
}

// ─── Figure 2C: Intratendinous / Tendon-Related ─────────────────

function scoreIntratendinous(caseData) {
  const { tendonSize, tendonAutoimmune, tendonHemosiderin, tendonBloomingGRE } = caseData;

  // Enlarged tendon with calcifications, cystic change, fat, or underlying amyloidosis/autoimmune
  if (tendonSize === "enlarged") {
    if (tendonAutoimmune === "yes") {
      return r(2, "Enlarged tendon with calcifications, cystic change, fat, or underlying history of amyloidosis or autoimmune disease. Consider gout, amyloid, or xanthoma.",
        ["Gout", "Amyloid", "Xanthoma"]);
    }
    return r(2, "Enlarged tendon with calcifications, cystic change, or fat. Consider gout, amyloid, or xanthoma.",
      ["Gout", "Amyloid", "Xanthoma"]);
  }

  // Normal-size tendon without calcifications, fat, or no underlying history
  if (tendonSize === "normal") {
    // Check hemosiderin
    if (tendonHemosiderin === "yes" && tendonBloomingGRE === "yes") {
      return r(3, "Normal-size tendon-related lesion with hemosiderin staining and blooming on GRE. Consider TSGCT.",
        ["TSGCT"]);
    }
    if (tendonHemosiderin === "yes" && tendonBloomingGRE === "no") {
      return r(4, "Normal-size tendon-related lesion with hemosiderin staining but no blooming on GRE. Consider TSGCT or other entity.",
        ["TSGCT"]);
    }
    // Per flowchart: normal tendon, hemosiderin staining with blooming → RADS-3 (TSGCT)
    // hemosiderin without blooming → RADS-4/5
    if (tendonHemosiderin === "no") {
      return r(4, "Normal-size tendon-related lesion without hemosiderin staining. Further characterization needed.",
        ["TSGCT"]);
    }
    return r(2, "Normal-size tendon-related lesion. Consider fibroma.",
      ["Fibroma", "TSGCT"]);
  }

  return r(3, "Intratendinous/tendon-related lesion requiring further assessment.");
}

// ─── Figure 2C: Plantar / Palmar Fascial ────────────────────────

function scorePalmarPlantar(caseData) {
  const { fascialNoduleSize, fascialMultifocal } = caseData;

  if (fascialNoduleSize === "less_than_2cm") {
    // <2 cm: multifocal/conglomerate → RADS-2 (Fibroma), not multifocal → RADS-3 (Fibromatosis)
    if (fascialMultifocal === "yes") {
      return r(2, "Fascial nodule <2 cm with multifocal or conglomerate pattern. Classic for plantar/palmar fibroma.",
        ["Fibroma"]);
    }
    return r(3, "Fascial nodule <2 cm, solitary. Consider fibromatosis.",
      ["Fibromatosis"]);
  }

  if (fascialNoduleSize === "2cm_or_more") {
    // ≥2 cm: multifocal/conglomerate → RADS-3 (Fibromatosis), not multifocal → RADS-4/5
    if (fascialMultifocal === "yes") {
      return r(3, "Fascial nodule ≥2 cm with multifocal/conglomerate pattern. Consider fibromatosis.",
        ["Fibromatosis"]);
    }
    // No multifocal → RADS-4/5
    return r(4, "Fascial nodule ≥2 cm, solitary (no multifocal/conglomerate pattern). Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
      ["Desmoid", "Synovial sarcoma", "Epithelioid sarcoma", "Myxoinflammatory fibroblastic sarcoma", "Clear cell sarcoma"]);
  }

  return r(3, "Plantar/palmar fascial lesion requiring further assessment.");
}

// ─── Figure 2C: Subungual ───────────────────────────────────────

function scoreSubungual(caseData) {
  const { subungualSignal, subungualSize } = caseData;

  // Per flowchart: Hyperintense on T2W, diffuse enhancement on T1W+C
  // Small (<1 cm) → RADS-3 (glomus tumor NOS) / RADS-5 if suspicious features
  // Large (≥1 cm) → RADS-3 (glomus tumor NOS) / RADS-4 (glomus tumor—malignant)

  if (subungualSize === "less_than_1cm") {
    return r(3, "Small subungual lesion (<1 cm), hyperintense on T2W with diffuse enhancement. Consider glomus tumor NOS.",
      ["Glomus tumor NOS"]);
  }
  if (subungualSize === "1cm_or_more") {
    return r(4, "Larger subungual lesion (≥1 cm). Consider glomus tumor—potentially malignant variant.",
      ["Glomus tumor—malignant"]);
  }

  return r(3, "Subungual lesion requiring further characterization.");
}

// ─── ADC MODIFIER ───────────────────────────────────────────────

export function applyADCModifier(result, adcValue) {
  if (!adcValue || adcValue === "") return result;
  const adc = parseFloat(adcValue);
  if (isNaN(adc)) return result;

  let adcNote = "";
  if (adc > 1.5) {
    adcNote = `Mean ADC of ${adc} × 10⁻³ mm²/s (>1.5) supports a benign classification (ST-RADS 2).`;
  } else if (adc >= 1.1) {
    adcNote = `Mean ADC of ${adc} × 10⁻³ mm²/s (1.1–1.5) supports a probably benign classification (ST-RADS 3).`;
  } else {
    adcNote = `Mean ADC of ${adc} × 10⁻³ mm²/s (<1.1) is concerning for malignancy (supports ST-RADS 5).`;
  }

  return { ...result, adcNote, reasoning: result.reasoning + " " + adcNote };
}

// ─── ANCILLARY FEATURES MODIFIER ────────────────────────────────

export function applyAncillaryModifier(result, ancillaryFeatures) {
  if (!ancillaryFeatures || ancillaryFeatures.length === 0) return result;

  const cat5Features = [
    "necrosis", "hemorrhage", "peritumoral_edema", "fascial_tail",
    "crossing_compartments", "rapid_growth", "metastasis", "low_adc",
    "solid_enhancing_nodules"
  ];

  const featureLabels = {
    necrosis: "non-enhancing areas of necrosis",
    hemorrhage: "internal hemorrhage",
    peritumoral_edema: "peritumoral edema",
    fascial_tail: "fascial tail sign",
    crossing_compartments: "extra-compartmental extension / crossing fascial compartments",
    rapid_growth: "rapid increase in size or symptoms",
    metastasis: "regional or distant metastatic lesions",
    low_adc: "low ADC <1.1 × 10⁻³ mm²/s",
    solid_enhancing_nodules: "solid enhancing nodules >2 cm for fascia-based lesions"
  };

  const presentFeatures = ancillaryFeatures.filter(f => cat5Features.includes(f));
  if (presentFeatures.length === 0) return result;

  const descriptions = presentFeatures.map(f => featureLabels[f]).join(", ");
  const ancillaryNote = `Ancillary features present: ${descriptions}. These findings may support upgrading to ST-RADS 5.`;

  const currentScore = result.category.score;
  // Per manuscript: ancillary features favoring RADS-5 include the above. Upgrade if category 3 or 4 with sufficient features.
  if ((currentScore === 3 || currentScore === 4) && presentFeatures.length >= 2) {
    return {
      ...result,
      category: STRADS_CATEGORIES[5],
      reasoning: result.reasoning + " " + ancillaryNote,
      upgraded: true,
      originalScore: currentScore
    };
  }

  return { ...result, reasoning: result.reasoning + " " + ancillaryNote, ancillaryNote };
}

// ─── Helper ─────────────────────────────────────────────────────

function r(cat, reasoning, differentials) {
  return { category: STRADS_CATEGORIES[cat], reasoning, differentials: differentials || [] };
}