// Wizard step definitions for the ST-RADS Calculator
// Faithfully follows Figures 1, 2A, 2B, 2C, 2D from Chhabra et al., AJR 2025

export function getWizardSteps(caseData) {
  const steps = [];

  // ── Step 1: Exam Adequacy & Known Tumor (Figure 1 top) ──
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
          { value: "complete", label: "Yes — Complete imaging (minimum sequences present)" },
          { value: "incomplete", label: "No — Incomplete imaging (missing required sequences)" }
        ]
      },
      ...(caseData.examAdequacy === "complete" ? [{
        id: "knownTumor",
        label: "Is this a known, previously treated soft-tissue tumor or tumor-like lesion?",
        tooltip: "Category 6 applies to lesions with a known diagnosis that are receiving or have received treatment. Category 6 is assigned directly based on clinical context, without using the flowcharts.",
        type: "radio",
        options: [
          { value: "no", label: "No — New or untreated lesion" },
          { value: "yes", label: "Yes — Previously treated lesion" }
        ]
      }] : [])
    ]
  });

  // ── Step 1b: Known tumor subtype (Category 6) ──
  if (caseData.knownTumor === "yes") {
    steps.push({
      id: "known_tumor",
      title: "Step 2: Treatment Response Assessment",
      description: "Classify the known treated lesion based on treatment response (Category 6).",
      questions: [{
        id: "knownTumorStatus",
        label: "What is the current status of the treated lesion?",
        type: "radio",
        options: [
          { value: "no_residual", label: "6A — No residual tumor (expected posttreatment changes, no focal/diffuse mass or substantial diffusion restriction)" },
          { value: "residual", label: "6B — Residual tumor (≤20% increase in largest dimension; similar or increased ADC vs. pretreatment)" },
          { value: "progressive", label: "6C — Progressive/recurrent (>20% increase in largest dimension; increased diffusion restriction; possible metastasis)" }
        ]
      }]
    });
    return steps;
  }

  // ── Step 2: Lesion Identification (Figure 1 middle) ──
  if (caseData.examAdequacy === "complete" && caseData.knownTumor === "no") {
    steps.push({
      id: "lesion",
      title: "Step 2: Lesion Identification",
      description: "Is a soft-tissue lesion identified on the MRI?",
      questions: [{
        id: "lesionPresent",
        label: "Is a soft-tissue lesion present?",
        tooltip: "Category 1 can be applied if findings mimic soft-tissue lesions but are not true lesions (e.g., asymmetric fatty or osseous prominence, anatomic osseous variant).",
        type: "radio",
        options: [
          { value: "yes", label: "Yes — Soft-tissue lesion identified" },
          { value: "no", label: "No — No soft-tissue lesion (or mimic only)" }
        ]
      }]
    });
  }

  // ── Step 3: Tissue Type (Figure 1 bottom branching) ──
  if (caseData.lesionPresent === "yes") {
    steps.push({
      id: "tissue_type",
      title: "Step 3: Predominant Tissue Type",
      description: "Based on the lesion's signal characteristics on T1W and T2W, select the appropriate algorithm pathway.",
      questions: [{
        id: "tissueType",
        label: "What is the predominant tissue type?",
        tooltip: "Macroscopic fat = T1 hyperintense that suppresses on fat-suppressed sequences. Cyst-like = markedly high signal on T2W AND <20% enhancement on T1W+C. Indeterminate solid = no variable high T2 signal OR >20% enhancement.",
        type: "radio",
        options: [
          { value: "lipomatous", label: "Lipomatous — Macroscopic fat on T1W (suppresses on fat-saturation)" },
          { value: "cystlike", label: "Cyst-like / High Water Content — Markedly high T2 signal AND <20% enhancement on T1W+C" },
          { value: "indeterminate_solid", label: "Indeterminate Solid — No variable high T2 signal OR >20% enhancement on T1W+C" }
        ]
      }]
    });
  }

  // ─────────────────────────────────────────────────────────────
  // ── Figure 2A: LIPOMATOUS SOFT-TISSUE LESION ────────────────
  // ─────────────────────────────────────────────────────────────
  if (caseData.tissueType === "lipomatous") {
    steps.push({
      id: "lipomatous_detail",
      title: "Step 4: Lipomatous Lesion Features (Fig 2A)",
      description: "First exclude common benign lesions containing macroscopic fat (e.g., elastofibroma dorsi, hemangioma, xanthoma, heterotopic ossification, lipomatosis of nerve, chondroid lipoma, hibernoma).",
      questions: [
        {
          id: "lipFatContent",
          label: "Fat composition",
          tooltip: "Predominantly lipomatous = >90% of the lesion shows fat signal intensity on all sequences.",
          type: "radio",
          options: [
            { value: "predominantly", label: "Predominantly lipomatous (>90% fat signal)" },
            { value: "not_predominantly", label: "Not predominantly lipomatous (≤90% fat signal)" }
          ]
        },
        // ── Predominantly lipomatous (>90%) branch ──
        ...(caseData.lipFatContent === "predominantly" ? [
          {
            id: "lipSeptations",
            label: "Septation and nodule assessment",
            tooltip: "Thin septations <2 mm with no nodules is typical of benign lipoma. Septations with nodules showing subcutaneous fat intensity on ALL sequences suggests angiolipoma variants.",
            type: "radio",
            options: [
              { value: "thin_or_none", label: "Thin septations (<2 mm) OR absence of nodules, like subcutaneous fat intensity on all sequences" },
              { value: "septations_with_nodules", label: "Septations with nodules present, like subcutaneous fat intensity on all sequences" },
              { value: "thick", label: "Thick septations (≥2 mm)" }
            ]
          },
          // For thin_or_none and septations_with_nodules, ask about enhancement
          ...(caseData.lipSeptations === "thin_or_none" || caseData.lipSeptations === "septations_with_nodules" ? [
            {
              id: "lipEnhancement",
              label: "Enhancement (% signal increase pre→post contrast)",
              tooltip: "Measure the percent increase in signal intensity between precontrast and postcontrast images.",
              type: "radio",
              options: [
                { value: "less_than_10", label: "<10% increase in signal intensity" },
                { value: "more_than_10", label: "≥10% increase in signal intensity" }
              ]
            }
          ] : []),
          // If thin septations AND <10% enhancement → ask about vessels
          ...((caseData.lipSeptations === "thin_or_none" || caseData.lipSeptations === "septations_with_nodules") && caseData.lipEnhancement === "less_than_10" ? [
            {
              id: "lipVessels",
              label: "Prominent vessels?",
              tooltip: "Many prominent vessels → consider lipoma variants (RADS-2). Few prominent vessels → consider angiolipoma (RADS-3).",
              type: "radio",
              options: [
                { value: "many", label: "Many prominent vessels" },
                { value: "few", label: "Few or no prominent vessels" }
              ]
            }
          ] : [])
        ] : []),
        // ── Not predominantly lipomatous (≤90%) branch ──
        ...(caseData.lipFatContent === "not_predominantly" ? [{
          id: "lipNonFatFeatures",
          label: "Non-fat component features",
          tooltip: "Enhancing nodules or disproportionately smaller lipomatous component suggests higher-grade liposarcoma.",
          type: "radio",
          options: [
            { value: "no_enhancing_nodules", label: "No enhancing nodule(s) OR proportionately larger lipomatous component" },
            { value: "enhancing_nodules", label: "Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue" }
          ]
        }] : [])
      ]
    });
  }

  // ─────────────────────────────────────────────────────────────
  // ── Figure 2B: CYST-LIKE / HIGH WATER CONTENT ───────────────
  // ─────────────────────────────────────────────────────────────
  if (caseData.tissueType === "cystlike") {
    steps.push({
      id: "cystlike_detail",
      title: "Step 4: Cyst-like / High Water Content Features (Fig 2B)",
      description: "Follow the cyst-like or high-water-content soft-tissue lesion algorithm.",
      questions: [
        {
          id: "cystCommunication",
          label: "Does the lesion communicate with a joint, tendon sheath, or bursa?",
          type: "radio",
          options: [
            { value: "communicates", label: "Yes — Communicates with joint/tendon sheath/bursa" },
            { value: "no_communication", label: "No communication" }
          ]
        },
        ...(caseData.cystCommunication === "no_communication" ? [
          {
            id: "cystLocation",
            label: "Lesion location",
            type: "radio",
            options: [
              { value: "cutaneous_subcutaneous", label: "Cutaneous or subcutaneous" },
              { value: "intraneural", label: "Intraneural" },
              { value: "deeper", label: "Deeper location (subfascial)" }
            ]
          },
          ...(caseData.cystLocation === "deeper" ? [
            {
              id: "cystFlowVoids",
              label: "Is the lesion predominantly comprised of flow voids or fluid-fluid levels?",
              type: "radio",
              options: [
                { value: "predominantly_flow_voids", label: "Yes — Predominantly flow voids or fluid-fluid levels" },
                { value: "not_predominantly", label: "No — Not predominantly comprised of flow voids/fluid levels" }
              ]
            },
            ...(caseData.cystFlowVoids === "not_predominantly" ? [
              {
                id: "cystHematoma",
                label: "Features suggesting hematoma?",
                type: "radio",
                options: [
                  { value: "yes", label: "Yes — Features suggesting hematoma" },
                  { value: "no", label: "No — No hematoma features" }
                ]
              },
              ...(caseData.cystHematoma === "no" ? [{
                id: "cystSeptations",
                label: "Septation and nodule assessment",
                tooltip: "Thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft-tissue component → RADS-5. Absent/thin septations and small nodules (<1 cm) → RADS-3.",
                type: "radio",
                options: [
                  { value: "absent_or_thin", label: "Absence of thick enhancing septations; small mural nodules (<1 cm)" },
                  { value: "small_nodules", label: "Enhancing septations and/or small mural nodules (<1 cm) — Borderline (RADS-3 or 4)" },
                  { value: "thick_or_nodules", label: "Thick enhancing septations AND/OR mural nodule(s) ≥1 cm or larger soft-tissue component" }
                ]
              }] : [])
            ] : [])
          ] : [])
        ] : [])
      ]
    });
  }

  // ─────────────────────────────────────────────────────────────
  // ── Figures 2C & 2D: INDETERMINATE SOLID ────────────────────
  // ─────────────────────────────────────────────────────────────
  if (caseData.tissueType === "indeterminate_solid") {
    steps.push({
      id: "solid_compartment",
      title: "Step 4: Anatomic Compartment (Figs 2C & 2D)",
      description: "Determine the anatomic compartment of the epicenter of the indeterminate solid lesion.",
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

    // ── Intravascular / Vessel-related (Fig 2D) ──
    if (caseData.solidCompartment === "intravascular") {
      steps.push({
        id: "intravascular_detail",
        title: "Step 5: Intravascular/Vessel-Related Features",
        description: "Excludes venous thrombosis, thrombophlebitis, (pseudo)aneurysm, and vascular malformation.",
        questions: [
          { id: "vascularT2", label: "T2 signal and morphology", type: "radio", options: [
            { value: "hyperintense_with_phleboliths", label: "Hyperintense lobules/tubules on T2W" },
            { value: "calcified_hypointense", label: "Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W" },
            { value: "hyperintense_foci", label: "Not calcified/ossified on XR/CT OR predominantly hyperintense foci on T2W" }
          ]},
          ...(caseData.vascularT2 === "hyperintense_with_phleboliths" ? [
            { id: "vascularPhleboliths", label: "Hypointense phleboliths present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]},
            { id: "vascularFluidLevels", label: "Fluid-fluid levels present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]}
          ] : []),
          ...(caseData.vascularT2 === "hyperintense_foci" ? [
            { id: "vascEnhancement", label: "Enhancement and T2 signal", type: "radio", options: [
              { value: "peripheral", label: "Hyperintense on T2W and peripheral enhancement" },
              { value: "none_hypointense", label: "Hypointense on T2W and no peripheral enhancement" }
            ]}
          ] : [])
        ]
      });
    }

    // ── Intraarticular (Fig 2D) ──
    if (caseData.solidCompartment === "intraarticular") {
      steps.push({
        id: "intraarticular_detail",
        title: "Step 5: Intraarticular Features",
        questions: [
          { id: "iaHemosiderin", label: "Hemosiderin staining present?", type: "radio", options: [
            { value: "yes", label: "Yes" }, { value: "no", label: "No" }
          ]},
          { id: "iaBloomingGRE", label: "Blooming on GRE sequences?", type: "radio", options: [
            { value: "yes", label: "Yes" }, { value: "no", label: "No" }
          ]}
        ]
      });
    }

    // ── Intraneural / Nerve-related (Fig 2D) ──
    if (caseData.solidCompartment === "intraneural") {
      steps.push({
        id: "intraneural_detail",
        title: "Step 5: Intraneural/Nerve-Related Features",
        description: "Presence of tail sign and relation to a major named nerve.",
        questions: [
          { id: "nerveTargetSign", label: "Target sign present?", tooltip: "Concentric rings on T2W images — classic for benign PNST (schwannoma, neurofibroma).", type: "radio", options: [
            { value: "yes", label: "Yes — Target sign present" }, { value: "no", label: "No — Absent" }
          ]},
          ...(caseData.nerveTargetSign === "yes" ? [
            { id: "nerveADC", label: "ADC value", type: "radio", options: [
              { value: "above_1_1", label: "ADC >1.1 × 10⁻³ mm²/s" },
              { value: "at_or_below_1_1", label: "ADC ≤1.1 × 10⁻³ mm²/s" },
              { value: "not_available", label: "Not available" }
            ]}
          ] : [])
        ]
      });
    }

    // ── Cutaneous / Subcutaneous (Fig 2D) ──
    if (caseData.solidCompartment === "cutaneous_subcutaneous") {
      steps.push({
        id: "cutaneous_detail",
        title: "Step 5: Cutaneous/Subcutaneous Features",
        questions: [
          { id: "cutGrowthPattern", label: "Growth pattern", type: "radio", options: [
            { value: "exophytic", label: "Exophytic (outward growth)" },
            { value: "endophytic", label: "Endophytic (inward/infiltrative growth)" }
          ]},
          ...(caseData.cutGrowthPattern === "exophytic" ? [{
            id: "cutEnhancement", label: "Enhancement pattern", type: "radio", options: [
              { value: "peripheral", label: "Peripheral enhancement" },
              { value: "internal", label: "Internal enhancement" }
            ]
          }] : [])
        ]
      });
    }

    // ── Deep (subfascial) / Intermuscular / Intramuscular (Fig 2C) ──
    if (caseData.solidCompartment === "deep_intramuscular") {
      steps.push({
        id: "deep_detail",
        title: "Step 5: Deep/Intramuscular Features",
        questions: [
          { id: "deepMuscleSignature", label: "Muscle signature present?", tooltip: "Does the lesion show signal characteristics consistent with muscle tissue?", type: "radio", options: [
            { value: "muscle", label: "Yes — Muscle signature present" },
            { value: "no_muscle", label: "No — No muscle signature" }
          ]},
          ...(caseData.deepMuscleSignature === "muscle" ? [
            { id: "deepHistory", label: "History of prior injury at this site?", type: "radio", options: [
              { value: "prior_injury", label: "Yes — History of prior injury" }, { value: "no_injury", label: "No prior injury" }
            ]},
            { id: "deepEdema", label: "Peritumoral edema present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]},
            { id: "deepMineralization", label: "Mature peripheral mineralization?", type: "radio", options: [
              { value: "mature", label: "Yes — Mature peripheral mineralization" },
              { value: "absent", label: "No — Absent or immature" }
            ]}
          ] : [])
        ]
      });
    }

    // ── Intratendinous / Tendon-related (Fig 2C) ──
    if (caseData.solidCompartment === "intratendinous") {
      steps.push({
        id: "tendon_detail",
        title: "Step 5: Intratendinous/Tendon-Related Features",
        questions: [
          { id: "tendonSize", label: "Tendon size and features", type: "radio", options: [
            { value: "enlarged", label: "Enlarged tendon with calcifications, cystic change, fat, or underlying amyloidosis/autoimmune disease" },
            { value: "normal", label: "Normal-size tendon without calcifications, cystic change, fat, or no underlying history" }
          ]},
          ...(caseData.tendonSize === "enlarged" ? [
            { id: "tendonAutoimmune", label: "Underlying amyloidosis or autoimmune disease?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]}
          ] : []),
          ...(caseData.tendonSize === "normal" ? [
            { id: "tendonHemosiderin", label: "Hemosiderin staining present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]},
            ...(caseData.tendonHemosiderin === "yes" ? [
              { id: "tendonBloomingGRE", label: "Blooming on GRE sequences?", type: "radio", options: [
                { value: "yes", label: "Yes" }, { value: "no", label: "No" }
              ]}
            ] : [])
          ] : [])
        ]
      });
    }

    // ── Plantar / Palmar Fascial (Fig 2C) ──
    if (caseData.solidCompartment === "plantar_palmar") {
      steps.push({
        id: "fascial_detail",
        title: "Step 5: Plantar/Palmar Fascial Features",
        questions: [
          { id: "fascialNoduleSize", label: "Fascial nodule size", type: "radio", options: [
            { value: "less_than_2cm", label: "<2 cm in length" },
            { value: "2cm_or_more", label: "≥2 cm in length" }
          ]},
          { id: "fascialMultifocal", label: "Multifocal or conglomerate fascial nodules?", type: "radio", options: [
            { value: "yes", label: "Yes — Multifocal/conglomerate" }, { value: "no", label: "No — Solitary" }
          ]}
        ]
      });
    }

    // ── Subungual (Fig 2C) ──
    if (caseData.solidCompartment === "subungual") {
      steps.push({
        id: "subungual_detail",
        title: "Step 5: Subungual Features",
        description: "Hyperintense on T2W, diffuse enhancement on T1W+C.",
        questions: [
          { id: "subungualSize", label: "Lesion size", type: "radio", options: [
            { value: "less_than_1cm", label: "<1 cm" },
            { value: "1cm_or_more", label: "≥1 cm" }
          ]}
        ]
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ── OPTIONAL: ADC & Ancillary Features ──────────────────────
  // ─────────────────────────────────────────────────────────────
  if (caseData.tissueType) {
    steps.push({
      id: "adc_ancillary",
      title: "Optional: ADC & Ancillary Features",
      description: "Provide ADC value and select any ancillary features. Per the manuscript, ancillary features may support upgrading to ST-RADS 5.",
      questions: [
        {
          id: "adcValue",
          label: "Mean ADC value (optional)",
          tooltip: "Mean ADC in × 10⁻³ mm²/s. >1.5 supports benign (RADS-2); 1.1–1.5 supports probably benign (RADS-3); <1.1 suggests malignancy (RADS-5).",
          type: "number",
          placeholder: "e.g., 1.2",
          unit: "× 10⁻³ mm²/s"
        },
        {
          id: "ancillaryFeatures",
          label: "Ancillary features favoring ST-RADS 5 (select all that apply)",
          tooltip: "Per Table 3 and flowchart footnotes: the presence of these features may support upgrading to ST-RADS 5.",
          type: "checkbox",
          options: [
            { value: "necrosis", label: "Non-enhancing areas of necrosis" },
            { value: "hemorrhage", label: "Internal hemorrhage" },
            { value: "peritumoral_edema", label: "Peritumoral edema" },
            { value: "fascial_tail", label: "Fascial tail sign" },
            { value: "crossing_compartments", label: "Extra-compartmental extension / crossing fascial compartments" },
            { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
            { value: "metastasis", label: "Regional or distant metastatic lesions" },
            { value: "solid_enhancing_nodules", label: "Solid enhancing nodules >2 cm (for fascia-based lesions)" }
          ]
        }
      ]
    });
  }

  return steps;
}