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

// ─── MAIN ENTRY POINT (Figure 1) ────────────────────────────────

export function calculateSTRADS(caseData) {
  const { examAdequacy, lesionPresent, knownTumor, knownTumorStatus, tissueType } = caseData;

  if (examAdequacy === "incomplete") {
    return r(0, "Incomplete imaging limits diagnostic interpretation.");
  }

  // Category 6 is assigned directly based on clinical context, without use of flowcharts
  if (knownTumor === "yes") {
    if (knownTumorStatus === "no_residual") return r("6A", "Known treated tumor with no imaging evidence of residual disease.");
    if (knownTumorStatus === "residual") return r("6B", "Known treated tumor with residual disease (≤20% increase in largest dimension).");
    if (knownTumorStatus === "progressive") return r("6C", "Known treated tumor with progressive or recurrent disease (>20% increase in largest dimension).");
  }

  if (lesionPresent === "no") {
    return r(1, "No soft-tissue lesion identified on MRI.");
  }

  // Figure 1 tissue-type branching:
  // Macroscopic fat on T1W → Fig 2A
  // No macroscopic fat + markedly high T2 AND <20% enhancement → Fig 2B
  // No macroscopic fat + no variable high T2 OR >20% enhancement → Fig 2C/2D
  if (tissueType === "lipomatous") return scoreLipomatous(caseData);
  if (tissueType === "cystlike") return scoreCystlike(caseData);
  if (tissueType === "indeterminate_solid") return scoreIndeterminateSolid(caseData);

  return r(0, "Insufficient data to classify. Please complete all required steps.");
}

// ═══════════════════════════════════════════════════════════════
// Figure 2A: LIPOMATOUS SOFT-TISSUE LESION
//
// Flowchart structure (from PDF page 22):
//
// Predominantly lipomatous (>90%)
//   ├── LEFT: "Thin septations (<2mm) OR absence of nodules
//   │   and like subcutaneous fat intensity on all sequences"
//   │   └── Thin septations <2mm OR Enhancement <10%
//   │       ├── Many prominent vessels → RADS-2
//   │       │   (lipoma, myolipoma, lipoma of nerve, lipoma arborescens)
//   │       └── Few prominent vessels → RADS-3 (angiolipoma)
//   │
//   ├── MIDDLE: "Septations and presence of nodules and like
//   │   subcutaneous fat intensity on all sequences"
//   │   └── SAME decision: thin sept <2mm OR enh <10% → vessels → RADS 2/3
//   │       AND: thick sept ≥2mm OR enh >10% → RADS-4 (ALT/WDL)
//   │
//   └── RIGHT (shared): Thick septations ≥2mm OR Enhancement >10%*
//       → RADS-4 (ALT/WDL)
//
// Not predominantly lipomatous (≤90%)
//   ├── No enhancing nodule(s) OR proportionately larger lipomatous → RADS-4
//   └── Enhancing nodule(s) OR proportionately smaller lipomatous → RADS-5**
//
// * Identify and exclude common benign lesions first
// ** Ancillary features may include necrosis, hemorrhage, peritumoral edema, low ADC <1.1
// ═══════════════════════════════════════════════════════════════

function scoreLipomatous(caseData) {
  const { lipFatContent, lipSeptationEnhancement, lipVessels, lipNonFatFeatures } = caseData;

  // Branch: Predominantly lipomatous (>90%)
  if (lipFatContent === "predominantly") {
    // The flowchart merges into one decision node:
    // "Thin septations <2mm OR Enhancement <10%" vs "Thick septations ≥2mm OR Enhancement >10%"
    if (lipSeptationEnhancement === "thin_or_low_enhancement") {
      // Next: many vs few prominent vessels
      if (lipVessels === "many") {
        return r(2,
          "Predominantly lipomatous (>90%) with thin septations (<2 mm) or <10% enhancement and many prominent vessels. Consider: subcutaneous, inter or intramuscular lipoma (including myolipoma), intra-neural lipoma of nerve, or intra-articular lipoma arborescens.",
          ["Lipoma", "Myolipoma", "Lipoma of nerve", "Lipoma arborescens"]);
      }
      if (lipVessels === "few") {
        return r(3,
          "Predominantly lipomatous (>90%) with thin septations (<2 mm) or <10% enhancement and few prominent vessels. Consider angiolipoma.",
          ["Angiolipoma"]);
      }
    }

    if (lipSeptationEnhancement === "thick_or_high_enhancement") {
      return r(4,
        "Predominantly lipomatous (>90%) with thick septations (≥2 mm) or >10% increase in signal intensity between precontrast and postcontrast images. Suspicious for atypical lipomatous tumor / well-differentiated liposarcoma (ALT/WDL).",
        ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
    }
  }

  // Branch: Not predominantly lipomatous (≤90%)
  if (lipFatContent === "not_predominantly") {
    if (lipNonFatFeatures === "no_enhancing_nodules") {
      return r(4,
        "Not predominantly lipomatous (≤90%) with no enhancing nodule(s) or proportionately larger lipomatous component than soft-tissue component. Suspicious for ALT/WDL.",
        ["Atypical lipomatous tumor", "Well-differentiated liposarcoma"]);
    }
    if (lipNonFatFeatures === "enhancing_nodules") {
      return r(5,
        "Not predominantly lipomatous (≤90%) with enhancing nodule(s) or proportionately smaller lipomatous component than soft-tissue component. Highly suspicious for dedifferentiated liposarcoma, myxoid liposarcoma, or pleomorphic sarcoma. Other ancillary features (necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, metastasis) may be present.",
        ["Dedifferentiated liposarcoma", "Myxoid liposarcoma", "Pleomorphic sarcoma"]);
    }
  }

  return r(0, "Lipomatous lesion — incomplete characterization.");
}

// ═══════════════════════════════════════════════════════════════
// Figure 2B: CYST-LIKE OR HIGH-WATER-CONTENT SOFT-TISSUE LESION
//
// Flowchart structure (from PDF page 23):
//
// LEFT branch: Communicates with joint/tendon sheath/bursa
//   OR Cutaneous or subcutaneous location
//   OR Intra-neural location
//   → RADS-2
//     (ganglion, synovial cyst, geyser phenomenon, tenosynovitis,
//      epidermoid cyst, bursitis, Morel-Lavallée lesion, intraneural cyst)
//
// RIGHT branch: No communication with joint/tendon sheath/bursa
//   OR deeper location (subfascial)
//   │
//   ├── Predominantly comprised of flow voids or fluid-fluid levels
//   │   → RADS-2
//   │     (low- or high-flow vascular malformation, aneurysm, thrombophlebitis)
//   │
//   └── Not predominantly comprised of flow voids/fluid-fluid levels
//       │
//       ├── Features suggesting hematoma → RADS-3
//       │   (hematoma, chronic expanding hematoma)
//       │
//       └── No hematoma features
//           ├── Absence of thick enhancing septations AND small mural nodule(s) <1 cm
//           │   → RADS-3 or RADS-4 (radiologist choice)
//           │   (intramuscular myxoma, benign PNST, cysticercosis,
//           │    hydatid cyst, myxoid liposarcoma, myxofibrosarcoma)
//           │
//           └── Presence of thick enhancing septations AND/OR mural nodule(s) ≥1 cm
//               or larger soft tissue component
//               → RADS-5*
//               (synovial sarcoma, hemangioendothelioma, angiosarcoma,
//                synovial sarcoma, extraskeletal myxoid chondrosarcoma,
//                myxoinflammatory fibroblastic sarcoma, myxofibrosarcoma)
// ═══════════════════════════════════════════════════════════════

function scoreCystlike(caseData) {
  const { cystLocationComm, cystFlowVoids, cystHematoma, cystSeptations } = caseData;

  // LEFT: Communicates OR cutaneous/subcutaneous OR intraneural
  if (cystLocationComm === "communicates_or_superficial_or_intraneural") {
    return r(2,
      "Cyst-like lesion that communicates with joint, tendon sheath, or bursa; OR is in a cutaneous/subcutaneous location; OR is in an intraneural location. Classic benign entity.",
      ["Ganglion", "Synovial cyst", "Geyser phenomenon", "Tenosynovitis", "Epidermoid cyst", "Bursitis", "Morel-Lavallée lesion", "Intraneural cyst"]);
  }

  // RIGHT: No communication, deeper (subfascial) location
  if (cystLocationComm === "no_communication_deeper") {
    // Flow voids / fluid-fluid levels
    if (cystFlowVoids === "predominantly") {
      return r(2,
        "Deep cyst-like lesion predominantly comprised of flow voids or fluid-fluid levels. Consistent with low- or high-flow vascular malformation, aneurysm, or thrombophlebitis.",
        ["Low-flow vascular malformation", "High-flow vascular malformation", "Aneurysm", "Thrombophlebitis"]);
    }

    if (cystFlowVoids === "not_predominantly") {
      // Hematoma features
      if (cystHematoma === "yes") {
        return r(3,
          "Deep cyst-like lesion with features suggesting hematoma. Follow-up to resolution is important as hematoma may mask underlying neoplasm.",
          ["Hematoma", "Chronic expanding hematoma"]);
      }

      if (cystHematoma === "no") {
        // Septations / nodules assessment
        if (cystSeptations === "absent_small") {
          // Per flowchart: yields RADS-3 or RADS-4 (radiologist's choice)
          return r(3,
            "Deep cyst-like lesion with absence of thick enhancing septations and small mural nodule(s) <1 cm. ST-RADS 3 or 4 (radiologist's judgment). Consider intramuscular myxoma, benign peripheral nerve sheath tumor, cysticercosis, hydatid cyst, myxoid liposarcoma, or myxofibrosarcoma.",
            ["Intramuscular myxoma", "Benign PNST", "Cysticercosis", "Hydatid cyst", "Myxoid liposarcoma", "Myxofibrosarcoma"],
            true); // flag: radiologist may upgrade to 4
        }
        if (cystSeptations === "thick_or_large_nodules") {
          return r(5,
            "Deep cyst-like lesion with presence of thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft-tissue component. Highly suspicious for malignancy. Ancillary features (hemorrhage, peritumoral edema, fascial tails, intercompartmental extension, necrosis, low ADC <1.1, rapid growth, metastasis) may be present.",
            ["Synovial sarcoma", "Hemangioendothelioma", "Angiosarcoma", "Extraskeletal myxoid chondrosarcoma", "Myxoinflammatory fibroblastic sarcoma", "Myxofibrosarcoma"]);
        }
      }
    }
  }

  return r(0, "Cyst-like lesion — incomplete characterization.");
}

// ═══════════════════════════════════════════════════════════════
// Figures 2C & 2D: INDETERMINATE SOLID SOFT-TISSUE LESION
// ═══════════════════════════════════════════════════════════════

function scoreIndeterminateSolid(caseData) {
  const { solidCompartment } = caseData;

  // Figure 2D compartments
  if (solidCompartment === "intravascular") return scoreIntravascular(caseData);
  if (solidCompartment === "intraarticular") return scoreIntraarticular(caseData);
  if (solidCompartment === "intraneural") return scoreIntraneural(caseData);
  if (solidCompartment === "cutaneous_subcutaneous") return scoreCutaneous(caseData);

  // Figure 2C compartments
  if (solidCompartment === "deep_intramuscular") return scoreDeep(caseData);
  if (solidCompartment === "intratendinous") return scoreTendon(caseData);
  if (solidCompartment === "plantar_palmar") return scoreFascial(caseData);
  if (solidCompartment === "subungual") return scoreSubungual(caseData);

  return r(0, "Indeterminate solid lesion — incomplete compartment data.");
}

// ─── Figure 2D: Intravascular / Vessel-Related ──────────────────
// Excludes venous thrombosis, thrombophlebitis, (pseudo)aneurysm, vascular malformation
//
// THREE columns:
// 1) Hyperintense lobules/tubules on T2W WITH hypointense phleboliths WITH fluid-fluid levels
//    → RADS-2 (venous or venolymphatic malformation)
//
// 2) Hyperintense lobules/tubules on T2W WITHOUT hypointense phleboliths WITHOUT fluid-fluid levels
//    → RADS-4 / RADS-5**
//    (hemangioendothelioma, Kaposi sarcoma, angiosarcoma, leiomyosarcoma)
//
// 3) Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W
//    ├── Hemosiderin staining with blooming on GRE → RADS-2
//    │   (synovial chondromatosis, synovial hemangioma)
//    └── Hemosiderin staining without blooming on GRE → RADS-2
//        (gout, amyloid, xanthoma)
//
// 4) Not calcified/ossified on XR or CT OR predominantly hyperintense foci on T2W
//    ├── Hyperintense on T2W and peripheral enhancement → RADS-3
//    │   (TSGCT, synovial chondromatosis)
//    └── Hypointense on T2W and no peripheral enhancement → RADS-4
//        (TSGCT)

function scoreIntravascular(caseData) {
  const { vascMorphology } = caseData;

  if (vascMorphology === "hyperintense_with_phleboliths_and_fluid") {
    return r(2,
      "Hyperintense lobules/tubules on T2W with hypointense phleboliths and fluid-fluid levels. Classic venous or venolymphatic malformation.",
      ["Venous malformation", "Venolymphatic malformation"]);
  }

  if (vascMorphology === "hyperintense_without_phleboliths") {
    return r(4,
      "Hyperintense lobules/tubules on T2W without hypointense phleboliths and without fluid-fluid levels. ST-RADS 4 or 5. Consider hemangioendothelioma, Kaposi sarcoma, angiosarcoma, or leiomyosarcoma. Features favoring RADS-5: presence of internal hemorrhage, necrosis, peritumoral edema, crossing compartments, low ADC <1.1, rapid growth, or metastasis.",
      ["Hemangioendothelioma", "Kaposi sarcoma", "Angiosarcoma", "Leiomyosarcoma"],
      true); // radiologist may upgrade to 5
  }

  if (vascMorphology === "calcified_hypointense") {
    const { vascHemosiderinBlooming } = caseData;
    if (vascHemosiderinBlooming === "hemosiderin_with_blooming") {
      return r(2,
        "Calcified/ossified on XR or CT and/or predominantly hypointense foci on T2W, with hemosiderin staining and blooming on GRE. Consider synovial chondromatosis or synovial hemangioma.",
        ["Synovial chondromatosis", "Synovial hemangioma"]);
    }
    if (vascHemosiderinBlooming === "hemosiderin_without_blooming") {
      return r(2,
        "Calcified/ossified on XR or CT and/or predominantly hypointense foci on T2W, with hemosiderin staining without blooming on GRE. Consider gout, amyloid, or xanthoma.",
        ["Gout", "Amyloid", "Xanthoma"]);
    }
  }

  if (vascMorphology === "not_calcified_hyperintense") {
    const { vascT2Enhancement } = caseData;
    if (vascT2Enhancement === "hyperintense_peripheral") {
      return r(3,
        "Not calcified/ossified, predominantly hyperintense foci on T2W with peripheral enhancement. Consider TSGCT or synovial chondromatosis.",
        ["TSGCT", "Synovial chondromatosis"]);
    }
    if (vascT2Enhancement === "hypointense_no_peripheral") {
      return r(4,
        "Not calcified/ossified, predominantly hypointense on T2W with no peripheral enhancement. Consider TSGCT.",
        ["TSGCT"]);
    }
  }

  return r(0, "Intravascular lesion — incomplete characterization.");
}

// ─── Figure 2D: Intraarticular ──────────────────────────────────
// Flowchart (from PDF page 25):
//
// Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W
//   ├── Hemosiderin staining with blooming on GRE → RADS-2
//   │   (synovial chondromatosis, synovial hemangioma)
//   └── Hemosiderin staining without blooming on GRE → RADS-2
//       (gout, amyloid, xanthoma)
//
// Not calcified/ossified OR predominantly hyperintense foci on T2W
//   ├── Hyperintense on T2W and peripheral enhancement → RADS-3
//   │   (TSGCT, synovial chondromatosis)
//   └── Hypointense on T2W and no peripheral enhancement → RADS-4
//       (TSGCT)

function scoreIntraarticular(caseData) {
  const { iaMorphology } = caseData;

  if (iaMorphology === "calcified_hypointense") {
    const { iaHemosiderinBlooming } = caseData;
    if (iaHemosiderinBlooming === "hemosiderin_with_blooming") {
      return r(2,
        "Intraarticular lesion calcified/ossified or predominantly hypointense on T2W, with hemosiderin staining and blooming on GRE. Consider synovial chondromatosis or synovial hemangioma.",
        ["Synovial chondromatosis", "Synovial hemangioma"]);
    }
    if (iaHemosiderinBlooming === "hemosiderin_without_blooming") {
      return r(2,
        "Intraarticular lesion calcified/ossified or predominantly hypointense on T2W, with hemosiderin staining without blooming on GRE. Consider gout, amyloid, or xanthoma.",
        ["Gout", "Amyloid", "Xanthoma"]);
    }
  }

  if (iaMorphology === "not_calcified_hyperintense") {
    const { iaT2Enhancement } = caseData;
    if (iaT2Enhancement === "hyperintense_peripheral") {
      return r(3,
        "Intraarticular lesion not calcified, hyperintense on T2W with peripheral enhancement. Consider TSGCT or synovial chondromatosis.",
        ["TSGCT", "Synovial chondromatosis"]);
    }
    if (iaT2Enhancement === "hypointense_no_peripheral") {
      return r(4,
        "Intraarticular lesion not calcified, hypointense on T2W with no peripheral enhancement. Consider TSGCT.",
        ["TSGCT"]);
    }
  }

  return r(0, "Intraarticular lesion — incomplete characterization.");
}

// ─── Figure 2D: Intraneural / Nerve-Related ─────────────────────
// * Presence of tail sign and related to major named nerve
//
// Target sign present
//   ├── ADC >1.1 mm²/s → RADS-2 (benign PNST)
//   └── ADC ≤1.1 mm²/s → RADS-4 / RADS-5**
//       (malignant PNST)
//
// No target sign → RADS-3
//   (perineurioma, ancient schwannoma, neurofibroma with
//    degenerative change, atypical neurofibroma)
//
// ** Features favoring RADS-5: size >4 cm, perilesional edema, necrosis,
//    absence of target sign, rapid increase in size, growth along nerve, crossing compartments

function scoreIntraneural(caseData) {
  const { nerveTargetSign, nerveADC } = caseData;

  if (nerveTargetSign === "yes") {
    if (nerveADC === "above_1_1") {
      return r(2,
        "Nerve-related lesion with target sign and ADC >1.1 × 10⁻³ mm²/s. Classic benign peripheral nerve sheath tumor.",
        ["Schwannoma", "Neurofibroma"]);
    }
    if (nerveADC === "at_or_below_1_1") {
      return r(4,
        "Nerve-related lesion with target sign but ADC ≤1.1 × 10⁻³ mm²/s. ST-RADS 4 or 5. Features favoring RADS-5: size >4 cm, perilesional edema, necrosis, absence of target sign, rapid growth, growth along nerve, or crossing compartments.",
        ["Malignant peripheral nerve sheath tumor"],
        true);
    }
    if (nerveADC === "not_available") {
      return r(2,
        "Nerve-related lesion with target sign. ADC not available. Classic for benign PNST; consider DWI/ADC for further risk stratification.",
        ["Schwannoma", "Neurofibroma"]);
    }
  }

  if (nerveTargetSign === "no") {
    return r(3,
      "Nerve-related lesion without target sign. Consider perineurioma, ancient schwannoma, neurofibroma with degenerative change, or atypical neurofibroma.",
      ["Perineurioma", "Ancient schwannoma", "Neurofibroma with degenerative change", "Atypical neurofibroma"]);
  }

  return r(0, "Nerve-related lesion — incomplete characterization.");
}

// ─── Figure 2D: Cutaneous / Subcutaneous ────────────────────────
// Exophytic
//   ├── Peripheral enhancement → RADS-2
//   │   (sebaceous cyst, trichilemmal cyst, epidermoid cyst, retinacular cyst)
//   └── Internal enhancement → RADS-4 / RADS-5**
//       (wart, dermatofibrosarcoma protuberans, fibrosarcoma NOS)
//
// Endophytic → RADS-5**
//   (T-cell lymphoma, Merkel cell tumor, melanoma, cutaneous metastasis)

function scoreCutaneous(caseData) {
  const { cutGrowthPattern, cutEnhancement } = caseData;

  if (cutGrowthPattern === "exophytic") {
    if (cutEnhancement === "peripheral") {
      return r(2,
        "Exophytic cutaneous/subcutaneous lesion with peripheral enhancement. Consider sebaceous cyst, trichilemmal cyst, epidermoid cyst, or retinacular cyst.",
        ["Sebaceous cyst", "Trichilemmal cyst", "Epidermoid cyst", "Retinacular cyst"]);
    }
    if (cutEnhancement === "internal") {
      return r(4,
        "Exophytic cutaneous/subcutaneous lesion with internal enhancement. ST-RADS 4 or 5. Consider wart, dermatofibrosarcoma protuberans, or fibrosarcoma NOS. Features favoring RADS-5: large size, rapid growth, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, or metastasis.",
        ["Wart", "Dermatofibrosarcoma protuberans", "Fibrosarcoma NOS"],
        true);
    }
  }

  if (cutGrowthPattern === "endophytic") {
    return r(5,
      "Endophytic cutaneous/subcutaneous lesion. Highly suspicious for T-cell lymphoma, Merkel cell tumor, melanoma, or cutaneous metastasis (lung, breast, renal).",
      ["T-cell lymphoma", "Merkel cell tumor", "Melanoma", "Cutaneous metastasis"]);
  }

  return r(0, "Cutaneous/subcutaneous lesion — incomplete characterization.");
}

// ─── Figure 2C: Deep (subfascial) / Intermuscular / Intramuscular ──
//
// Muscle signature present
//   ├── History of prior injury WITH peritumoral edema AND mature peripheral mineralization
//   │   → RADS-2
//   │   (hypertrophied muscle, myositis, myopathy, myonecrosis, myositis ossificans)
//   │
//   └── No history of prior injury with peritumoral edema & mature peripheral mineralization
//       → RADS-4 / RADS-5**
//       (desmoid, fibromyxoid sarcoma, fibrosarcoma NOS,
//        extraskeletal osteosarcoma, undifferentiated pleomorphic sarcoma)
//
// No muscle signature → RADS-4 / RADS-5**
//   (same differentials as above)

function scoreDeep(caseData) {
  const { deepMuscleSignature, deepBenignTriad } = caseData;

  if (deepMuscleSignature === "yes") {
    if (deepBenignTriad === "yes") {
      return r(2,
        "Deep/intramuscular lesion with muscle signature and history of prior injury with peritumoral edema and mature peripheral mineralization. Consider hypertrophied muscle, myositis, myopathy, myonecrosis, or myositis ossificans.",
        ["Hypertrophied muscle", "Myositis", "Myopathy", "Myonecrosis", "Myositis ossificans"]);
    }
    if (deepBenignTriad === "no") {
      return r(4,
        "Deep/intramuscular lesion with muscle signature but without the benign triad (history of prior injury + peritumoral edema + mature peripheral mineralization). ST-RADS 4 or 5. Features favoring RADS-5: solid enhancing nodules >2 cm for fascia-based lesions, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
        ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"],
        true);
    }
  }

  if (deepMuscleSignature === "no") {
    return r(4,
      "Deep/intramuscular lesion without muscle signature. ST-RADS 4 or 5. Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
      ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"],
      true);
  }

  return r(0, "Deep intramuscular lesion — incomplete characterization.");
}

// ─── Figure 2C: Intratendinous / Tendon-Related ─────────────────
//
// Enlarged tendon with calcifications, cystic change, fat,
// or underlying history of amyloidosis or autoimmune disease
//   → RADS-2 (gout, amyloid, xanthoma)
//
// Normal size tendon without calcifications, cystic change, fat,
// or no underlying history of amyloidosis or autoimmune disease
//   ├── Hemosiderin staining with blooming on GRE → RADS-3 (TSGCT)
//   └── Hemosiderin staining without blooming on GRE → RADS-4 / RADS-5**

function scoreTendon(caseData) {
  const { tendonMorphology, tendonHemosiderinBlooming } = caseData;

  if (tendonMorphology === "enlarged") {
    return r(2,
      "Enlarged tendon with calcifications, cystic change, fat, or underlying history of amyloidosis or autoimmune disease. Consider gout, amyloid, or xanthoma.",
      ["Gout", "Amyloid", "Xanthoma"]);
  }

  if (tendonMorphology === "normal") {
    if (tendonHemosiderinBlooming === "hemosiderin_with_blooming") {
      return r(3,
        "Normal-size tendon-related lesion with hemosiderin staining and blooming on GRE. Consider TSGCT.",
        ["TSGCT"]);
    }
    if (tendonHemosiderinBlooming === "hemosiderin_without_blooming") {
      return r(4,
        "Normal-size tendon-related lesion with hemosiderin staining without blooming on GRE. ST-RADS 4 or 5.",
        ["TSGCT"],
        true);
    }
  }

  return r(0, "Tendon-related lesion — incomplete characterization.");
}

// ─── Figure 2C: Plantar / Palmar Fascial ────────────────────────
//
// Fascial nodule <2 cm in length
//   ├── Multifocal or conglomerate fascial nodules → RADS-2 (fibroma)
//   └── No multifocal or conglomerate → RADS-3 (fibromatosis)
//
// Fascial nodule ≥2 cm in length
//   ├── Multifocal or conglomerate fascial nodules → RADS-3 (fibromatosis)
//   └── No multifocal or conglomerate → RADS-4 / RADS-5**
//       (desmoid, synovial sarcoma, epithelioid sarcoma,
//        myxoinflammatory fibroblastic sarcoma, clear cell sarcoma)

function scoreFascial(caseData) {
  const { fascialNoduleSize, fascialMultifocal } = caseData;

  if (fascialNoduleSize === "less_than_2cm") {
    if (fascialMultifocal === "yes") {
      return r(2, "Fascial nodule <2 cm with multifocal or conglomerate pattern. Classic for plantar/palmar fibroma.", ["Fibroma"]);
    }
    if (fascialMultifocal === "no") {
      return r(3, "Fascial nodule <2 cm, solitary. Consider fibromatosis.", ["Fibromatosis"]);
    }
  }

  if (fascialNoduleSize === "2cm_or_more") {
    if (fascialMultifocal === "yes") {
      return r(3, "Fascial nodule ≥2 cm with multifocal/conglomerate pattern. Consider fibromatosis.", ["Fibromatosis"]);
    }
    if (fascialMultifocal === "no") {
      return r(4,
        "Fascial nodule ≥2 cm, solitary. ST-RADS 4 or 5. Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, or metastasis.",
        ["Desmoid", "Synovial sarcoma", "Epithelioid sarcoma", "Myxoinflammatory fibroblastic sarcoma", "Clear cell sarcoma"],
        true);
    }
  }

  return r(0, "Fascial lesion — incomplete characterization.");
}

// ─── Figure 2C: Subungual ───────────────────────────────────────
// Hyperintense on T2W, diffuse enhancement on T1W + contrast
//
// Small (<1 cm) → RADS-3 / RADS-5** (glomus tumor NOS)
// Large (≥1 cm) → RADS-3 / RADS-4 (glomus tumor—malignant)

function scoreSubungual(caseData) {
  const { subungualSize } = caseData;

  if (subungualSize === "less_than_1cm") {
    return r(3,
      "Small subungual lesion (<1 cm), hyperintense on T2W with diffuse enhancement. ST-RADS 3 or 5. Consider glomus tumor NOS.",
      ["Glomus tumor NOS"],
      true);
  }
  if (subungualSize === "1cm_or_more") {
    return r(3,
      "Larger subungual lesion (≥1 cm), hyperintense on T2W with diffuse enhancement. ST-RADS 3 or 4. Consider glomus tumor—potentially malignant variant.",
      ["Glomus tumor NOS", "Glomus tumor—malignant"],
      true);
  }

  return r(0, "Subungual lesion — incomplete characterization.");
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

  const presentFeatures = ancillaryFeatures.filter(f => featureLabels[f]);
  if (presentFeatures.length === 0) return result;

  const descriptions = presentFeatures.map(f => featureLabels[f]).join(", ");
  const ancillaryNote = `Ancillary features present: ${descriptions}. These findings may support upgrading to ST-RADS 5.`;

  const currentScore = result.category.score;
  // Per manuscript: ancillary features favoring RADS-5. Upgrade from 3 or 4 if features are sufficient.
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

function r(cat, reasoning, differentials, radiologistChoice) {
  return {
    category: STRADS_CATEGORIES[cat],
    reasoning,
    differentials: differentials || [],
    radiologistChoice: radiologistChoice || false
  };
}