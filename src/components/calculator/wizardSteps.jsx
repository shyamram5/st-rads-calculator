// Wizard step definitions for the ST-RADS Calculator
// Faithfully follows Figures 1, 2A, 2B, 2C, 2D from Chhabra et al., AJR 2025

export function getWizardSteps(caseData) {
  const steps = [];

  // ══════════════════════════════════════════════════════════════
  // STEP 1: GENERAL ALGORITHM (Figure 1)
  // ══════════════════════════════════════════════════════════════
  steps.push({
    id: "initial",
    title: "Step 1: Exam Adequacy & Known Tumor",
    description: "Determine if the MRI exam is complete and the clinical context.",
    questions: [
      {
        id: "examAdequacy",
        label: "Is the MRI examination complete?",
        tooltip: "Minimum: Axial T1W, Fluid-sensitive T2W (Fat-Sat/STIR/Dixon), and Pre/Post contrast Fat-Sat T1W.",
        type: "radio",
        options: [
          { value: "complete", label: "Yes — Complete imaging" },
          { value: "incomplete", label: "No — Incomplete imaging (leads to RADS-0)" }
        ]
      },
      ...(caseData.examAdequacy === "complete" ? [{
        id: "knownTumor",
        label: "Is this a known, previously treated soft-tissue tumor?",
        tooltip: "Category 6 is assigned directly based on clinical context.",
        type: "radio",
        options: [
          { value: "no", label: "No — New or untreated lesion" },
          { value: "yes", label: "Yes — Previously treated lesion" }
        ]
      }] : [])
    ]
  });

  // ── Category 6 Logic ──
  if (caseData.knownTumor === "yes") {
    steps.push({
      id: "known_tumor",
      title: "Step 2: Treatment Response (Category 6)",
      description: "Classify based on treatment response[cite: 182].",
      questions: [{
        id: "knownTumorStatus",
        label: "Current status of the treated lesion?",
        type: "radio",
        options: [
          { value: "no_residual", label: "6A — No residual tumor (expected post-treatment changes)" },
          { value: "residual", label: "6B — Residual tumor (≤20% increase)" },
          { value: "progressive", label: "6C — Progressive/Recurrent (>20% increase)" }
        ]
      }]
    });
    return steps;
  }

  // ── Lesion Identification (Figure 1) ──
  if (caseData.examAdequacy === "complete" && caseData.knownTumor === "no") {
    steps.push({
      id: "lesion_ident",
      title: "Step 2: Lesion Identification",
      questions: [{
        id: "lesionPresent",
        label: "Is a soft-tissue lesion identified on MRI?",
        tooltip: "If findings mimic a lesion but are not true lesions (e.g. asymmetric muscle), select No.",
        type: "radio",
        options: [
          { value: "yes", label: "Yes — Soft-tissue lesion identified" },
          { value: "no", label: "No — No soft-tissue lesion (RADS-1)" }
        ]
      }]
    });
  }

  // ── Tissue Type (Figure 1 Branching) ──
  if (caseData.lesionPresent === "yes") {
    steps.push({
      id: "tissue_type",
      title: "Step 3: Predominant Tissue Type",
      description: "Select the algorithm pathway based on signal characteristics[cite: 300].",
      questions: [{
        id: "tissueType",
        label: "What is the predominant tissue type?",
        tooltip: "Lipomatous: Macroscopic fat on T1. Cyst-like: Markedly high T2 & <20% enhancement. Solid: Everything else.",
        type: "radio",
        options: [
          { value: "lipomatous", label: "Lipomatous (Macroscopic fat on T1W)" },
          { value: "cystlike", label: "Cyst-like / High Water Content (High T2, <20% enh)" },
          { value: "indeterminate_solid", label: "Indeterminate Solid (No variable high T2 OR >20% enh)" }
        ]
      }]
    });
  }

  // ══════════════════════════════════════════════════════════════
  // FIGURE 2A: LIPOMATOUS LESIONS
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType === "lipomatous") {
    steps.push({
      id: "lip_comp",
      title: "Step 4: Lipomatous Composition",
      description: "Figure 2A: Assess fat content percentage.",
      questions: [{
        id: "lipFatContent",
        label: "Is the lesion predominantly lipomatous (>90% fat)?",
        type: "radio",
        options: [
          { value: "predominantly", label: "Yes (>90% fat)" },
          { value: "not_predominantly", label: "No (≤90% fat)" }
        ]
      }]
    });

    // Branch: Predominantly Lipomatous
    if (caseData.lipFatContent === "predominantly") {
      steps.push({
        id: "lip_sept",
        title: "Step 5: Septations & Enhancement",
        description: "Assess septation thickness and enhancement.",
        questions: [
          {
            id: "lipSeptations",
            label: "Septation characteristics",
            type: "radio",
            options: [
              { value: "thin_low_enh", label: "Thin septations (<2mm) OR Enhancement <10%" },
              { value: "thick_high_enh", label: "Thick septations (≥2mm) OR Enhancement >10% (Leads to RADS-4)" }
            ]
          },
          // Sub-branch for Thin Septations
          ...(caseData.lipSeptations === "thin_low_enh" ? [{
            id: "lipVessels",
            label: "Assessment of vessels within the lesion",
            tooltip: "Figure 2A distinguishes Lipoma (RADS-2) from Angiolipoma (RADS-3) based on vessel prominence.",
            type: "radio",
            options: [
              { value: "few", label: "Few prominent vessels (RADS-2: Lipoma)" },
              { value: "many", label: "Many prominent vessels (RADS-3: Angiolipoma)" }
            ]
          }] : [])
        ]
      });
    }

    // Branch: Not Predominantly Lipomatous
    if (caseData.lipFatContent === "not_predominantly") {
      steps.push({
        id: "lip_nodules",
        title: "Step 5: Nodule Assessment",
        questions: [{
          id: "lipNoduleFeatures",
          label: "Non-fat component features",
          type: "radio",
          options: [
            { value: "no_nodules", label: "No enhancing nodules OR proportionately larger lipomatous component (RADS-4)" },
            { value: "nodules_present", label: "Enhancing nodule(s) OR proportionately smaller lipomatous component (RADS-5)" }
          ]
        }]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FIGURE 2B: CYST-LIKE / HIGH WATER CONTENT
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType === "cystlike") {
    steps.push({
      id: "cyst_loc",
      title: "Step 4: Location & Communication",
      description: "Figure 2B: Determine anatomical location[cite: 312].",
      questions: [{
        id: "cystLocation",
        label: "Location and communication",
        type: "radio",
        options: [
          { value: "superficial_communicating", label: "Communicates with joint/tendon/bursa OR Cutaneous/Subcutaneous OR Intraneural (RADS-2)" },
          { value: "deep_non_communicating", label: "Deep (subfascial) location AND No communication" }
        ]
      }]
    });

    if (caseData.cystLocation === "deep_non_communicating") {
      steps.push({
        id: "cyst_features",
        title: "Step 5: Deep Cyst-like Features",
        questions: [
          {
            id: "cystFlow",
            label: "Predominantly flow voids or fluid-fluid levels?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes (RADS-2: Vascular malformation)" },
              { value: "no", label: "No" }
            ]
          },
          ...(caseData.cystFlow === "no" ? [{
            id: "cystHematoma",
            label: "Features suggesting hematoma?",
            tooltip: "E.g., T1 hyperintensity, history of trauma.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes (RADS-3: Hematoma)" },
              { value: "no", label: "No" }
            ]
          }] : []),
          ...(caseData.cystFlow === "no" && caseData.cystHematoma === "no" ? [{
            id: "cystSeptationNodules",
            label: "Septation and Nodule Assessment",
            tooltip: "Distinguishes between likely benign (RADS-3) and aggressive (RADS-4/5) entities.",
            type: "radio",
            options: [
              { value: "absent", label: "Absence of thick enhancing septations; small mural nodules <1 cm (RADS-3/4)" },
              { value: "present", label: "Presence of thick enhancing septations AND/OR mural nodules ≥1 cm (RADS-5)" }
            ]
          }] : [])
        ]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FIGURE 2C & 2D: INDETERMINATE SOLID LESIONS
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType === "indeterminate_solid") {
    steps.push({
      id: "solid_compartment",
      title: "Step 4: Anatomic Compartment",
      description: "Select the compartment of the epicenter[cite: 307].",
      questions: [{
        id: "compartment",
        label: "Anatomic Compartment",
        type: "radio",
        options: [
          { value: "deep_muscle", label: "Deep (subfascial) / Intramuscular" },
          { value: "intravascular", label: "Intravascular / Vessel-related" },
          { value: "intraarticular", label: "Intraarticular" },
          { value: "intraneural", label: "Intraneural / Nerve-related" },
          { value: "cutaneous", label: "Cutaneous / Subcutaneous" },
          { value: "intratendinous", label: "Intratendinous" },
          { value: "fascial", label: "Plantar / Palmar Fascial" },
          { value: "subungual", label: "Subungual" }
        ]
      }]
    });

    // ── Deep / Intramuscular (Fig 2C) ──
    // Added logic for "No Muscle Signature" which was missing in original file
    if (caseData.compartment === "deep_muscle") {
      steps.push({
        id: "deep_logic",
        title: "Step 5: Deep/Intramuscular Assessment",
        questions: [
          {
            id: "muscleSignature",
            label: "Muscle signature present?",
            tooltip: "Does the lesion retain muscle-like signal characteristics?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Muscle signature present" },
              { value: "no", label: "No — No muscle signature" }
            ]
          },
          ...(caseData.muscleSignature === "yes" ? [{
            id: "myositisTriad",
            label: "Benign Triad Check",
            tooltip: "Must have ALL three: 1. History of prior injury, 2. Peritumoral edema, 3. Mature peripheral mineralization.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — All three present (RADS-2: Myositis Ossificans)" },
              { value: "no", label: "No — One or more absent (RADS-4/5)" }
            ]
          }] : []),
          ...(caseData.muscleSignature === "no" ? [{
            id: "deepT2",
            label: "Signal Characteristics",
            tooltip: "Assess T2 signal intensity.",
            type: "radio",
            options: [
              { value: "hyperintense", label: "Hyperintense on T2W (RADS-3 Myositis or RADS-5 Sarcoma)" }
              // The flowchart implies Hyperintense T2 is the main branch here for tumors
            ]
          }] : [])
        ]
      });
    }

    // ── Intravascular (Fig 2D) ──
    if (caseData.compartment === "intravascular") {
      steps.push({
        id: "vasc_logic",
        title: "Step 5: Intravascular Assessment",
        questions: [{
          id: "vascMorphology",
          label: "Morphology and Signal",
          type: "radio",
          options: [
            { value: "phleboliths", label: "Hyperintense T2 lobules WITH phleboliths & fluid-levels (RADS-2)" },
            { value: "hyper_no_phleb", label: "Hyperintense T2 lobules WITHOUT phleboliths (RADS-4/5)" },
            { value: "calc_hypo", label: "Calcified/Ossified OR Predominantly Hypointense T2" }
          ]
        },
        ...(caseData.vascMorphology === "calc_hypo" ? [{
          id: "vascBlooming",
          label: "Hemosiderin / Blooming Artifact?",
          type: "radio",
          options: [
            { value: "blooming", label: "Hemosiderin WITH blooming (RADS-2: GCT)" },
            { value: "no_blooming", label: "Hemosiderin WITHOUT blooming (Check T2 hypointensity -> RADS-2)" }
          ]
        }] : [])
        ]
      });
    }

    // ── Intraarticular (Fig 2D) ──
    if (caseData.compartment === "intraarticular") {
      steps.push({
        id: "ia_logic",
        title: "Step 5: Intraarticular Assessment",
        questions: [{
          id: "iaSignal",
          label: "Mineralization and T2 Signal",
          type: "radio",
          options: [
            { value: "calcified_hypo", label: "Calcified/Ossified OR Predominantly Hypointense T2" },
            { value: "not_calcified_hyper", label: "Not calcified/ossified OR Predominantly Hyperintense T2" }
          ]
        },
        ...(caseData.iaSignal === "calcified_hypo" ? [{
          id: "iaBlooming",
          label: "Hemosiderin / Blooming Artifact?",
          type: "radio",
          options: [
            { value: "blooming", label: "Hemosiderin WITH blooming (RADS-2: PVNS/TGCT)" },
            { value: "no_blooming", label: "Hemosiderin WITHOUT blooming" }
          ]
        }] : []),
        ...(caseData.iaSignal === "not_calcified_hyper" ? [{
          id: "iaEnhancement",
          label: "T2 and Enhancement Pattern",
          type: "radio",
          options: [
            { value: "peripheral", label: "Hyperintense T2 and Peripheral enhancement (RADS-4)" },
            { value: "no_peripheral", label: "Hypointense T2 and No peripheral enhancement (RADS-2)" }
          ]
        }] : [])
        ]
      });
    }

    // ── Intraneural (Fig 2D) ──
    if (caseData.compartment === "intraneural") {
      steps.push({
        id: "nerve_logic",
        title: "Step 5: Intraneural Assessment",
        questions: [
          {
            id: "targetSign",
            label: "Target Sign Present?",
            tooltip: "Central T2 hypointensity with peripheral hyperintensity.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes (RADS-2: Benign PNST)" },
              { value: "no", label: "No" }
            ]
          },
          ...(caseData.targetSign === "no" ? [{
            id: "nerveADC",
            label: "ADC Value",
            tooltip: "ADC threshold is 1.1 × 10⁻³ mm²/s.",
            type: "radio",
            options: [
              { value: "low", label: "ADC ≤ 1.1 (RADS-5: Malignant PNST)" },
              { value: "high", label: "ADC > 1.1 (RADS-3/4: Cellular Schwannoma)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Cutaneous / Subcutaneous (Fig 2D) ──
    if (caseData.compartment === "cutaneous") {
      steps.push({
        id: "cut_logic",
        title: "Step 5: Cutaneous Assessment",
        questions: [
          {
            id: "growthPattern",
            label: "Growth Pattern",
            type: "radio",
            options: [
              { value: "exophytic", label: "Exophytic / Outward (RADS-4/5)" },
              { value: "endophytic", label: "Endophytic / Inward" }
            ]
          },
          ...(caseData.growthPattern === "endophytic" ? [{
            id: "cutEnhancement",
            label: "Enhancement Pattern",
            type: "radio",
            options: [
              { value: "peripheral", label: "Peripheral Enhancement (RADS-3: Granuloma)" },
              { value: "internal", label: "Internal Enhancement (RADS-4/5)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Intratendinous (Fig 2C) ──
    if (caseData.compartment === "intratendinous") {
      steps.push({
        id: "tendon_logic",
        title: "Step 5: Intratendinous Assessment",
        questions: [
          {
            id: "tendonMorph",
            label: "Tendon Morphology",
            type: "radio",
            options: [
              { value: "enlarged", label: "Enlarged tendon with calcification/cysts (RADS-3: Gout/Amyloid)" },
              { value: "normal", label: "Normal size tendon" }
            ]
          },
          ...(caseData.tendonMorph === "normal" ? [{
            id: "tendonBlooming",
            label: "Hemosiderin Staining",
            type: "radio",
            options: [
              { value: "blooming", label: "With Blooming on GRE (RADS-3: TSGCT)" },
              { value: "no_blooming", label: "Without Blooming on GRE (RADS-4/5)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Plantar / Palmar Fascial (Fig 2C) ──
    if (caseData.compartment === "fascial") {
      steps.push({
        id: "fascial_logic",
        title: "Step 5: Fascial Assessment",
        questions: [
          {
            id: "fascialSize",
            label: "Nodule Size",
            type: "radio",
            options: [
              { value: "small", label: "< 2 cm in length" },
              { value: "large", label: "≥ 2 cm in length (RADS-4)" }
            ]
          },
          ...(caseData.fascialSize === "small" ? [{
            id: "fascialMulti",
            label: "Multifocal or Conglomerate?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes (RADS-2: Fibromatosis)" },
              { value: "no", label: "No (RADS-2: Fibromatosis)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Subungual (Fig 2C) ──
    if (caseData.compartment === "subungual") {
      steps.push({
        id: "subungual_logic",
        title: "Step 5: Subungual Assessment",
        questions: [{
          id: "subungualSize",
          label: "Lesion Size",
          tooltip: "Assumes T2 Hyperintense + Diffuse Enhancement.",
          type: "radio",
          options: [
            { value: "small", label: "Small (<1 cm) (RADS-3: Glomus)" },
            { value: "large", label: "Large (≥1 cm) (RADS-4)" }
          ]
        }]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // OPTIONAL: ADC & ANCILLARY FEATURES
  // ══════════════════════════════════════════════════════════════
  if (caseData.tissueType) {
    steps.push({
      id: "ancillary",
      title: "Step 6: ADC & Ancillary Features",
      description: "Additional features that may upgrade the score[cite: 270].",
      questions: [
        {
          id: "adcValue",
          label: "Mean ADC Value (optional)",
          type: "number",
          placeholder: "× 10⁻³ mm²/s",
          unit: "× 10⁻³ mm²/s"
        },
        {
          id: "ancillaryFlags",
          label: "High Risk Features (RADS-5 Triggers)",
          type: "checkbox",
          options: [
            { value: "necrosis", label: "Internal Necrosis / Hemorrhage" },
            { value: "fascial_tail", label: "Fascial Tail Sign" },
            { value: "rapid_growth", label: "Rapid Growth" },
            { value: "metastasis", label: "Metastasis" }
          ]
        }
      ]
    });
  }

  return steps;
}