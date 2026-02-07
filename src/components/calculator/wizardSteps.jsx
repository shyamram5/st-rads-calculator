// Wizard step definitions for the ST-RADS Calculator
// Faithfully follows Figures 1, 2A, 2B, 2C, 2D from Chhabra et al., AJR 2025

export function getWizardSteps(caseData) {
  const steps = [];

  // ══════════════════════════════════════════════════════════════
  // STEP 1: Exam Adequacy & Known Tumor (Figure 1 top)
  // ══════════════════════════════════════════════════════════════
  steps.push({
    id: "initial",
    title: "Step 1: Exam Adequacy & Known Tumor",
    description: "Determine if the MRI exam is complete and whether this is a known treated lesion.",
    questions: [
      {
        id: "examAdequacy",
        label: "Is the MRI examination complete?",
        tooltip: "Minimum protocol: axial T1W, fluid-sensitive T2W (conventional T2W / in-phase Dixon / STIR), and pre/post contrast fat-suppressed T1W sequences.",
        type: "radio",
        options: [
          { value: "complete", label: "Yes — Complete imaging" },
          { value: "incomplete", label: "No — Incomplete imaging (missing required sequences)" }
        ]
      },
      ...(caseData.examAdequacy === "complete" ? [{
        id: "knownTumor",
        label: "Is this a known, previously treated soft-tissue tumor or tumor-like lesion?",
        tooltip: "Category 6 is assigned directly based on clinical context, without using the flowcharts.",
        type: "radio",
        options: [
          { value: "no", label: "No — New or untreated lesion" },
          { value: "yes", label: "Yes — Previously treated lesion" }
        ]
      }] : [])
    ]
  });

  // ── Category 6 substep ──
  if (caseData.knownTumor === "yes") {
    steps.push({
      id: "known_tumor",
      title: "Step 2: Treatment Response (Category 6)",
      description: "Classify the known treated lesion based on treatment response.",
      questions: [{
        id: "knownTumorStatus",
        label: "Current status of the treated lesion?",
        type: "radio",
        options: [
          { value: "no_residual", label: "6A — No residual tumor (expected posttreatment changes, no focal mass or substantial diffusion restriction)" },
          { value: "residual", label: "6B — Residual tumor (≤20% increase in largest dimension; similar or increased ADC)" },
          { value: "progressive", label: "6C — Progressive/recurrent (>20% increase in largest dimension; increased diffusion restriction)" }
        ]
      }]
    });
    return steps;
  }

  // ══════════════════════════════════════════════════════════════
  // STEP 2: Lesion Identification (Figure 1 middle)
  // ══════════════════════════════════════════════════════════════
  if (caseData.examAdequacy === "complete" && caseData.knownTumor === "no") {
    steps.push({
      id: "lesion",
      title: "Step 2: Lesion Identification",
      description: "Is a soft-tissue lesion identified on MRI?",
      questions: [{
        id: "lesionPresent",
        label: "Is a soft-tissue lesion present?",
        tooltip: "Category 1 applies to findings that mimic lesions but are not true lesions (e.g., asymmetric fatty or osseous prominence).",
        type: "radio",
        options: [
          { value: "yes", label: "Yes — Soft-tissue lesion identified" },
          { value: "no", label: "No — No soft-tissue lesion (or mimic only)" }
        ]
      }]
    });
  }

  // ══════════════════════════════════════════════════════════════
  // STEP 3: Tissue Type (Figure 1 bottom branching)
  // ══════════════════════════════════════════════════════════════
  if (caseData.lesionPresent === "yes") {
    steps.push({
      id: "tissue_type",
      title: "Step 3: Predominant Tissue Type",
      description: "Select the algorithm pathway based on the lesion's signal characteristics.",
      questions: [{
        id: "tissueType",
        label: "What is the predominant tissue type?",
        tooltip: "Macroscopic fat = T1 hyperintense that suppresses on fat-sat. Cyst-like = markedly high T2 AND <20% enhancement. Indeterminate solid = no variable high T2 OR >20% enhancement.",
        type: "radio",
        options: [
          { value: "lipomatous", label: "Lipomatous — Macroscopic fat on T1W (suppresses on fat-saturation)" },
          { value: "cystlike", label: "Cyst-like / High Water Content — Markedly high T2 AND <20% enhancement" },
          { value: "indeterminate_solid", label: "Indeterminate Solid — No variable high T2 OR >20% enhancement" }
        ]
      }]
    });
  }

  // ══════════════════════════════════════════════════════════════
  // Figure 2A: LIPOMATOUS
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType === "lipomatous") {
    steps.push({
      id: "lip_fat",
      title: "Step 4A: Lipomatous — Fat Composition (Fig 2A)",
      description: "First exclude common benign lesions containing macroscopic fat (elastofibroma dorsi, hemangioma, xanthoma, heterotopic ossification, lipomatosis of nerve, chondroid lipoma, hibernoma).",
      questions: [{
        id: "lipFatContent",
        label: "Fat composition",
        tooltip: "Predominantly lipomatous = >90% of the lesion shows fat signal intensity on all sequences.",
        type: "radio",
        options: [
          { value: "predominantly", label: "Predominantly lipomatous (>90%)" },
          { value: "not_predominantly", label: "Not predominantly lipomatous (≤90%)" }
        ]
      }]
    });

    // Predominantly lipomatous → septation/enhancement decision
    if (caseData.lipFatContent === "predominantly") {
      steps.push({
        id: "lip_sept_enh",
        title: "Step 4B: Septation & Enhancement",
        description: "Per the flowchart: thin septations (<2 mm) OR enhancement <10% leads to RADS-2/3; thick septations (≥2 mm) OR enhancement >10% leads to RADS-4.",
        questions: [
          {
            id: "lipSeptationEnhancement",
            label: "Septation and enhancement assessment",
            type: "radio",
            options: [
              { value: "thin_or_low_enhancement", label: "Thin septations (<2 mm) OR <10% enhancement increase" },
              { value: "thick_or_high_enhancement", label: "Thick septations (≥2 mm) OR >10% enhancement increase" }
            ]
          },
          ...(caseData.lipSeptationEnhancement === "thin_or_low_enhancement" ? [{
            id: "lipVessels",
            label: "Prominent vessels?",
            tooltip: "Many prominent vessels → RADS-2 (lipoma variants). Few prominent vessels → RADS-3 (angiolipoma).",
            type: "radio",
            options: [
              { value: "many", label: "Many prominent vessels" },
              { value: "few", label: "Few or no prominent vessels" }
            ]
          }] : [])
        ]
      });
    }

    // Not predominantly lipomatous → nodule assessment
    if (caseData.lipFatContent === "not_predominantly") {
      steps.push({
        id: "lip_nonfat",
        title: "Step 4B: Non-Fat Component Features",
        description: "Assess the enhancing nodules and relative proportions of lipomatous vs soft-tissue components.",
        questions: [{
          id: "lipNonFatFeatures",
          label: "Non-fat component",
          type: "radio",
          options: [
            { value: "no_enhancing_nodules", label: "No enhancing nodule(s) OR proportionately larger lipomatous component" },
            { value: "enhancing_nodules", label: "Enhancing nodule(s) OR proportionately smaller lipomatous component" }
          ]
        }]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // Figure 2B: CYST-LIKE / HIGH WATER CONTENT
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType === "cystlike") {
    steps.push({
      id: "cyst_location",
      title: "Step 4A: Cyst-like — Location & Communication (Fig 2B)",
      description: "Determine whether the lesion communicates with a joint/tendon sheath/bursa, or its location.",
      questions: [{
        id: "cystLocationComm",
        label: "Location and communication",
        type: "radio",
        options: [
          { value: "communicates_or_superficial_or_intraneural", label: "Communicates with joint/tendon sheath/bursa — OR — Cutaneous/subcutaneous — OR — Intraneural" },
          { value: "no_communication_deeper", label: "No communication with joint/tendon sheath/bursa — deeper (subfascial) location" }
        ]
      }]
    });

    if (caseData.cystLocationComm === "no_communication_deeper") {
      steps.push({
        id: "cyst_deep",
        title: "Step 4B: Deep Cyst-like Features",
        description: "Characterize the deep cyst-like lesion.",
        questions: [
          {
            id: "cystFlowVoids",
            label: "Predominantly comprised of flow voids or fluid-fluid levels?",
            type: "radio",
            options: [
              { value: "predominantly", label: "Yes — Predominantly flow voids or fluid-fluid levels" },
              { value: "not_predominantly", label: "No" }
            ]
          },
          ...(caseData.cystFlowVoids === "not_predominantly" ? [{
            id: "cystHematoma",
            label: "Features suggesting hematoma?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Features suggesting hematoma" },
              { value: "no", label: "No hematoma features" }
            ]
          }] : []),
          ...(caseData.cystFlowVoids === "not_predominantly" && caseData.cystHematoma === "no" ? [{
            id: "cystSeptations",
            label: "Thick enhancing septations and/or mural nodules",
            tooltip: "Per flowchart: absence of thick enhancing septations and small nodules <1 cm → RADS-3/4. Presence of thick septations and/or nodules ≥1 cm or larger soft tissue component → RADS-5.",
            type: "radio",
            options: [
              { value: "absent_small", label: "Absence of thick enhancing septations; small mural nodule(s) <1 cm" },
              { value: "thick_or_large_nodules", label: "Presence of thick enhancing septations AND/OR mural nodule(s) ≥1 cm or larger soft tissue component" }
            ]
          }] : [])
        ]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // Figures 2C & 2D: INDETERMINATE SOLID
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType === "indeterminate_solid") {
    steps.push({
      id: "solid_compartment",
      title: "Step 4: Anatomic Compartment (Figs 2C & 2D)",
      description: "Determine the anatomic compartment of the epicenter.",
      questions: [{
        id: "solidCompartment",
        label: "Anatomic compartment of the epicenter",
        type: "radio",
        options: [
          { value: "intravascular", label: "Intravascular or vessel-related" },
          { value: "intraarticular", label: "Intraarticular" },
          { value: "intraneural", label: "Intraneural or nerve-related" },
          { value: "cutaneous_subcutaneous", label: "Cutaneous or subcutaneous" },
          { value: "deep_intramuscular", label: "Deep (subfascial) / intermuscular / intramuscular" },
          { value: "intratendinous", label: "Intratendinous or tendon-related" },
          { value: "plantar_palmar", label: "Plantar or palmar fascial" },
          { value: "subungual", label: "Subungual" }
        ]
      }]
    });

    // ── Fig 2D: Intravascular ──
    if (caseData.solidCompartment === "intravascular") {
      steps.push({
        id: "vasc_detail",
        title: "Step 5: Intravascular/Vessel-Related (Fig 2D)",
        description: "Excludes venous thrombosis, thrombophlebitis, (pseudo)aneurysm, and vascular malformation.",
        questions: [
          {
            id: "vascMorphology",
            label: "T2 signal, phleboliths, and mineralization",
            type: "radio",
            options: [
              { value: "hyperintense_with_phleboliths_and_fluid", label: "Hyperintense lobules/tubules on T2W WITH hypointense phleboliths WITH fluid-fluid levels" },
              { value: "hyperintense_without_phleboliths", label: "Hyperintense lobules/tubules on T2W WITHOUT hypointense phleboliths, WITHOUT fluid-fluid levels" },
              { value: "calcified_hypointense", label: "Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W" },
              { value: "not_calcified_hyperintense", label: "Not calcified/ossified on XR or CT OR predominantly hyperintense foci on T2W" }
            ]
          },
          ...(caseData.vascMorphology === "calcified_hypointense" ? [{
            id: "vascHemosiderinBlooming",
            label: "Hemosiderin staining and GRE blooming?",
            type: "radio",
            options: [
              { value: "hemosiderin_with_blooming", label: "Hemosiderin staining with blooming on GRE" },
              { value: "hemosiderin_without_blooming", label: "Hemosiderin staining without blooming on GRE" }
            ]
          }] : []),
          ...(caseData.vascMorphology === "not_calcified_hyperintense" ? [{
            id: "vascT2Enhancement",
            label: "T2 signal and enhancement pattern",
            type: "radio",
            options: [
              { value: "hyperintense_peripheral", label: "Hyperintense on T2W and peripheral enhancement" },
              { value: "hypointense_no_peripheral", label: "Hypointense on T2W and no peripheral enhancement" }
            ]
          }] : [])
        ]
      });
    }

    // ── Fig 2D: Intraarticular ──
    if (caseData.solidCompartment === "intraarticular") {
      steps.push({
        id: "ia_detail",
        title: "Step 5: Intraarticular (Fig 2D)",
        questions: [
          {
            id: "iaMorphology",
            label: "T2 signal and mineralization",
            type: "radio",
            options: [
              { value: "calcified_hypointense", label: "Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W" },
              { value: "not_calcified_hyperintense", label: "Not calcified/ossified OR predominantly hyperintense foci on T2W" }
            ]
          },
          ...(caseData.iaMorphology === "calcified_hypointense" ? [{
            id: "iaHemosiderinBlooming",
            label: "Hemosiderin staining and GRE blooming?",
            type: "radio",
            options: [
              { value: "hemosiderin_with_blooming", label: "Hemosiderin staining with blooming on GRE" },
              { value: "hemosiderin_without_blooming", label: "Hemosiderin staining without blooming on GRE" }
            ]
          }] : []),
          ...(caseData.iaMorphology === "not_calcified_hyperintense" ? [{
            id: "iaT2Enhancement",
            label: "T2 signal and enhancement pattern",
            type: "radio",
            options: [
              { value: "hyperintense_peripheral", label: "Hyperintense on T2W and peripheral enhancement" },
              { value: "hypointense_no_peripheral", label: "Hypointense on T2W and no peripheral enhancement" }
            ]
          }] : [])
        ]
      });
    }

    // ── Fig 2D: Intraneural ──
    if (caseData.solidCompartment === "intraneural") {
      steps.push({
        id: "nerve_detail",
        title: "Step 5: Intraneural/Nerve-Related (Fig 2D)",
        description: "Presence of target/tail sign and relation to a major named nerve.",
        questions: [
          {
            id: "nerveTargetSign",
            label: "Target sign present?",
            tooltip: "Concentric rings on T2W — classic for benign PNST.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Target sign present" },
              { value: "no", label: "No — Absent" }
            ]
          },
          ...(caseData.nerveTargetSign === "yes" ? [{
            id: "nerveADC",
            label: "ADC value",
            type: "radio",
            options: [
              { value: "above_1_1", label: "ADC >1.1 × 10⁻³ mm²/s" },
              { value: "at_or_below_1_1", label: "ADC ≤1.1 × 10⁻³ mm²/s" },
              { value: "not_available", label: "Not available" }
            ]
          }] : [])
        ]
      });
    }

    // ── Fig 2D: Cutaneous / Subcutaneous ──
    if (caseData.solidCompartment === "cutaneous_subcutaneous") {
      steps.push({
        id: "cut_detail",
        title: "Step 5: Cutaneous/Subcutaneous (Fig 2D)",
        questions: [
          {
            id: "cutGrowthPattern",
            label: "Growth pattern",
            type: "radio",
            options: [
              { value: "exophytic", label: "Exophytic (outward growth)" },
              { value: "endophytic", label: "Endophytic (inward/infiltrative growth)" }
            ]
          },
          ...(caseData.cutGrowthPattern === "exophytic" ? [{
            id: "cutEnhancement",
            label: "Enhancement pattern",
            type: "radio",
            options: [
              { value: "peripheral", label: "Peripheral enhancement" },
              { value: "internal", label: "Internal enhancement" }
            ]
          }] : [])
        ]
      });
    }

    // ── Fig 2C: Deep / Intramuscular ──
    if (caseData.solidCompartment === "deep_intramuscular") {
      steps.push({
        id: "deep_detail",
        title: "Step 5: Deep/Intramuscular (Fig 2C)",
        questions: [
          {
            id: "deepMuscleSignature",
            label: "Muscle signature present?",
            tooltip: "Does the lesion show signal characteristics consistent with muscle tissue?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Muscle signature present" },
              { value: "no", label: "No — No muscle signature" }
            ]
          },
          ...(caseData.deepMuscleSignature === "yes" ? [{
            id: "deepBenignTriad",
            label: "History of prior injury WITH peritumoral edema AND mature peripheral mineralization?",
            tooltip: "All three must be present for RADS-2: (1) history of prior injury, (2) peritumoral edema, AND (3) mature peripheral mineralization.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — All three present" },
              { value: "no", label: "No — One or more absent" }
            ]
          }] : [])
        ]
      });
    }

    // ── Fig 2C: Intratendinous ──
    if (caseData.solidCompartment === "intratendinous") {
      steps.push({
        id: "tendon_detail",
        title: "Step 5: Intratendinous/Tendon-Related (Fig 2C)",
        questions: [
          {
            id: "tendonMorphology",
            label: "Tendon morphology",
            type: "radio",
            options: [
              { value: "enlarged", label: "Enlarged tendon with calcifications, cystic change, fat, or underlying amyloidosis/autoimmune disease" },
              { value: "normal", label: "Normal size tendon without calcifications, cystic change, fat, or no underlying amyloidosis/autoimmune" }
            ]
          },
          ...(caseData.tendonMorphology === "normal" ? [{
            id: "tendonHemosiderinBlooming",
            label: "Hemosiderin staining and GRE blooming?",
            type: "radio",
            options: [
              { value: "hemosiderin_with_blooming", label: "Hemosiderin staining with blooming on GRE" },
              { value: "hemosiderin_without_blooming", label: "Hemosiderin staining without blooming on GRE" }
            ]
          }] : [])
        ]
      });
    }

    // ── Fig 2C: Plantar / Palmar Fascial ──
    if (caseData.solidCompartment === "plantar_palmar") {
      steps.push({
        id: "fascial_detail",
        title: "Step 5: Plantar/Palmar Fascial (Fig 2C)",
        questions: [
          {
            id: "fascialNoduleSize",
            label: "Fascial nodule size",
            type: "radio",
            options: [
              { value: "less_than_2cm", label: "<2 cm in length" },
              { value: "2cm_or_more", label: "≥2 cm in length" }
            ]
          },
          {
            id: "fascialMultifocal",
            label: "Multifocal or conglomerate fascial nodules?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Multifocal/conglomerate" },
              { value: "no", label: "No — Solitary" }
            ]
          }
        ]
      });
    }

    // ── Fig 2C: Subungual ──
    if (caseData.solidCompartment === "subungual") {
      steps.push({
        id: "subungual_detail",
        title: "Step 5: Subungual (Fig 2C)",
        description: "Hyperintense on T2W, diffuse enhancement on T1W+C.",
        questions: [{
          id: "subungualSize",
          label: "Lesion size",
          type: "radio",
          options: [
            { value: "less_than_1cm", label: "Small (<1 cm)" },
            { value: "1cm_or_more", label: "Large (≥1 cm)" }
          ]
        }]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // OPTIONAL: ADC & Ancillary Features
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType) {
    steps.push({
      id: "adc_ancillary",
      title: "Optional: ADC & Ancillary Features",
      description: "Per the manuscript, ancillary features may support upgrading to ST-RADS 5.",
      questions: [
        {
          id: "adcValue",
          label: "Mean ADC value (optional)",
          tooltip: "Mean ADC in × 10⁻³ mm²/s. >1.5 supports RADS-2; 1.1–1.5 supports RADS-3; <1.1 suggests RADS-5.",
          type: "number",
          placeholder: "e.g., 1.2",
          unit: "× 10⁻³ mm²/s"
        },
        {
          id: "ancillaryFeatures",
          label: "Ancillary features favoring ST-RADS 5 (select all that apply)",
          tooltip: "Per Table 3 and flowchart footnotes.",
          type: "checkbox",
          options: [
            { value: "necrosis", label: "Non-enhancing areas of necrosis" },
            { value: "hemorrhage", label: "Internal hemorrhage" },
            { value: "peritumoral_edema", label: "Peritumoral edema" },
            { value: "fascial_tail", label: "Fascial tail sign" },
            { value: "crossing_compartments", label: "Extra-compartmental extension / crossing fascial compartments" },
            { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
            { value: "metastasis", label: "Regional or distant metastatic lesions" },
            { value: "low_adc", label: "Low ADC <1.1 × 10⁻³ mm²/s" },
            { value: "solid_enhancing_nodules", label: "Solid enhancing nodules >2 cm (for fascia-based lesions)" }
          ]
        }
      ]
    });
  }

  return steps;
}