// Wizard step definitions for the ST-RADS Calculator

export function getWizardSteps(caseData) {
  const steps = [];

  // Step 1: Exam Adequacy & Lesion Presence
  steps.push({
    id: "initial",
    title: "Step 1: Exam Adequacy & Known Tumor",
    description: "Determine if the MRI exam is complete and whether this is a known treated lesion.",
    questions: [
      {
        id: "examAdequacy",
        label: "Is the MRI examination complete?",
        tooltip: "Minimum protocol: T1W sequence, fluid-sensitive T2W sequence, and pre/post contrast fat-suppressed T1W sequences in the axial plane.",
        type: "radio",
        options: [
          { value: "complete", label: "Yes — Complete imaging (minimum sequences present)" },
          { value: "incomplete", label: "No — Incomplete imaging (missing required sequences)" }
        ]
      },
      ...(caseData.examAdequacy === "complete" ? [{
        id: "knownTumor",
        label: "Is this a known, previously treated soft-tissue tumor or tumor-like lesion?",
        tooltip: "Category 6 applies to lesions with known diagnosis that are receiving or have received treatment.",
        type: "radio",
        options: [
          { value: "no", label: "No — New or untreated lesion" },
          { value: "yes", label: "Yes — Previously treated lesion" }
        ]
      }] : [])
    ]
  });

  // Step 1b: Known tumor subtype
  if (caseData.knownTumor === "yes") {
    steps.push({
      id: "known_tumor",
      title: "Step 2: Treatment Response Assessment",
      description: "Classify the known treated lesion based on treatment response.",
      questions: [{
        id: "knownTumorStatus",
        label: "What is the current status of the treated lesion?",
        type: "radio",
        options: [
          { value: "no_residual", label: "6A — No residual tumor (expected posttreatment changes, no focal mass)" },
          { value: "residual", label: "6B — Residual tumor (≤20% increase in largest dimension, similar or increased ADC)" },
          { value: "progressive", label: "6C — Progressive/recurrent (>20% increase, increased diffusion restriction, possible metastasis)" }
        ]
      }]
    });
    return steps;
  }

  // Step 2: Lesion Presence
  if (caseData.examAdequacy === "complete" && caseData.knownTumor === "no") {
    steps.push({
      id: "lesion",
      title: "Step 2: Lesion Identification",
      description: "Is a soft-tissue lesion identified on the MRI?",
      questions: [{
        id: "lesionPresent",
        label: "Is a soft-tissue lesion present?",
        tooltip: "Category 1 can be applied to findings that may mimic soft-tissue lesions but are not true lesions (e.g., asymmetric fatty prominence, anatomic variant).",
        type: "radio",
        options: [
          { value: "yes", label: "Yes — Soft-tissue lesion identified" },
          { value: "no", label: "No — No soft-tissue lesion (or mimic only)" }
        ]
      }]
    });
  }

  // Step 3: Tissue Type
  if (caseData.lesionPresent === "yes") {
    steps.push({
      id: "tissue_type",
      title: "Step 3: Predominant Tissue Type",
      description: "Determine the predominant or distinguishing signal characteristics to select the appropriate algorithm.",
      questions: [{
        id: "tissueType",
        label: "What is the predominant tissue type?",
        tooltip: "Based on the lesion's predominant signal on T1W and T2W sequences. Macroscopic fat = T1 hyperintense that suppresses on fat-suppressed sequences.",
        type: "radio",
        options: [
          { value: "lipomatous", label: "Lipomatous — Macroscopic fat on T1W (suppresses on fat-sat)" },
          { value: "cystlike", label: "Cyst-like / High Water Content — Markedly high T2 signal AND <20% enhancement" },
          { value: "indeterminate_solid", label: "Indeterminate Solid — No variable high T2 OR >20% enhancement" }
        ]
      }]
    });
  }

  // Step 4: Tissue-specific questions
  if (caseData.tissueType === "lipomatous") {
    steps.push({
      id: "lipomatous_detail",
      title: "Step 4: Lipomatous Lesion Features",
      description: "Follow the lipomatous soft-tissue lesion algorithm (Figure 2A).",
      questions: [
        {
          id: "lipFatContent",
          label: "Fat composition",
          tooltip: "Assess the proportion of the lesion that demonstrates fat signal intensity.",
          type: "radio",
          options: [
            { value: "predominantly", label: "Predominantly lipomatous (>90% fat signal)" },
            { value: "not_predominantly", label: "Not predominantly lipomatous (≤90% fat signal)" }
          ]
        },
        ...(caseData.lipFatContent === "predominantly" ? [
          {
            id: "lipSeptations",
            label: "Septation and nodule assessment",
            type: "radio",
            options: [
              { value: "thin_or_none", label: "Thin septations (<2mm) OR absence of nodules, like subcutaneous fat" },
              { value: "septations_with_nodules", label: "Septations with nodules, like subcutaneous fat intensity on all sequences" },
              { value: "thick", label: "Thick septations (≥2mm)" }
            ]
          },
          {
            id: "lipEnhancement",
            label: "Enhancement (% signal increase pre→post contrast)",
            type: "radio",
            options: [
              { value: "less_than_10", label: "< 10% increase" },
              { value: "more_than_10", label: "> 10% increase" }
            ]
          },
          ...(caseData.lipSeptations === "thin_or_none" && caseData.lipEnhancement === "less_than_10" ? [{
            id: "lipVessels",
            label: "Prominent vessels?",
            type: "radio",
            options: [
              { value: "many", label: "Many prominent vessels" },
              { value: "few", label: "Few or no prominent vessels" }
            ]
          }] : [])
        ] : []),
        ...(caseData.lipFatContent === "not_predominantly" ? [{
          id: "lipNonFatFeatures",
          label: "Non-fat component features",
          type: "radio",
          options: [
            { value: "no_enhancing_nodules", label: "No enhancing nodules OR proportionately larger lipomatous component" },
            { value: "enhancing_nodules", label: "Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue" }
          ]
        }] : [])
      ]
    });
  }

  if (caseData.tissueType === "cystlike") {
    steps.push({
      id: "cystlike_detail",
      title: "Step 4: Cyst-like / High Water Content Features",
      description: "Follow the cyst-like or high water content soft-tissue lesion algorithm (Figure 2B).",
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
        ...(caseData.cystCommunication === "communicates" ? [] : [
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
                { value: "not_predominantly", label: "No" }
              ]
            },
            ...(caseData.cystFlowVoids === "not_predominantly" ? [
              {
                id: "cystHematoma",
                label: "Features suggesting hematoma?",
                type: "radio",
                options: [
                  { value: "yes", label: "Yes — Features suggesting hematoma" },
                  { value: "no", label: "No" }
                ]
              },
              ...(caseData.cystHematoma === "no" ? [{
                id: "cystSeptations",
                label: "Septation and nodule assessment",
                type: "radio",
                options: [
                  { value: "absent_or_thin", label: "Absent/thin septations, small mural nodules (<1 cm)" },
                  { value: "small_nodules", label: "Small enhancing septations or small mural nodules (<1 cm)" },
                  { value: "thick_or_nodules", label: "Thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft tissue component" }
                ]
              }] : [])
            ] : [])
          ] : [])
        ])
      ]
    });
  }

  if (caseData.tissueType === "indeterminate_solid") {
    steps.push({
      id: "solid_compartment",
      title: "Step 4: Anatomic Compartment",
      description: "Determine the anatomic compartment for the indeterminate solid lesion (Figures 2C & 2D).",
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

    // Compartment-specific sub-questions
    if (caseData.solidCompartment === "intravascular") {
      steps.push({
        id: "intravascular_detail",
        title: "Step 5: Intravascular/Vessel-Related Features",
        description: "Characterize the intravascular or vessel-related lesion.",
        questions: [
          { id: "vascularT2", label: "T2 signal and morphology", type: "radio", options: [
            { value: "hyperintense_lobules", label: "Hyperintense lobules/tubules on T2W" },
            { value: "predominantly_hypointense", label: "Calcified/ossified, predominantly hypointense on T2W" },
            { value: "hyperintense_peripheral_enhancement", label: "Hyperintense on T2W with peripheral enhancement" }
          ]},
          ...(caseData.vascularT2 === "hyperintense_lobules" ? [
            { id: "vascularPhleboliths", label: "Hypointense phleboliths present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]},
            { id: "vascularFluidLevels", label: "Fluid-fluid levels present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]}
          ] : [])
        ]
      });
    }

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

    if (caseData.solidCompartment === "intraneural") {
      steps.push({
        id: "intraneural_detail",
        title: "Step 5: Intraneural/Nerve-Related Features",
        questions: [
          { id: "nerveTargetSign", label: "Target sign present?", tooltip: "Concentric rings on T2W images — classic for benign peripheral nerve sheath tumors.", type: "radio", options: [
            { value: "yes", label: "Yes — Target sign present" }, { value: "no", label: "No — Absent" }
          ]},
          { id: "nerveADC", label: "ADC value", type: "radio", options: [
            { value: "above_1_1", label: "ADC >1.1 × 10⁻³ mm²/s" },
            { value: "below_1_1", label: "ADC ≤1.1 × 10⁻³ mm²/s" },
            { value: "not_available", label: "Not available" }
          ]}
        ]
      });
    }

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
              { value: "prior_injury", label: "Yes" }, { value: "no_injury", label: "No" }
            ]},
            { id: "deepEdema", label: "Peritumoral edema present?", type: "radio", options: [
              { value: "yes", label: "Yes" }, { value: "no", label: "No" }
            ]},
            { id: "deepMineralization", label: "Mature peripheral mineralization?", type: "radio", options: [
              { value: "mature", label: "Yes — Mature peripheral mineralization" },
              { value: "absent", label: "No" }
            ]}
          ] : [])
        ]
      });
    }

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
            { value: "yes", label: "Yes" }, { value: "no", label: "No" }
          ]}
        ]
      });
    }

    if (caseData.solidCompartment === "subungual") {
      steps.push({
        id: "subungual_detail",
        title: "Step 5: Subungual Features",
        questions: [
          { id: "subungualSize", label: "Lesion size", type: "radio", options: [
            { value: "less_than_1cm", label: "<1 cm" },
            { value: "1cm_or_more", label: "≥1 cm" }
          ]}
        ]
      });
    }

    if (caseData.solidCompartment === "intratendinous") {
      steps.push({
        id: "tendon_detail",
        title: "Step 5: Intratendinous/Tendon-Related Features",
        questions: [
          { id: "tendonSize", label: "Tendon size", type: "radio", options: [
            { value: "enlarged", label: "Enlarged tendon with calcifications, cystic change, or fat" },
            { value: "normal", label: "Normal-size tendon" }
          ]},
          { id: "tendonAutoimmune", label: "Underlying amyloidosis or autoimmune disease?", type: "radio", options: [
            { value: "yes", label: "Yes" }, { value: "no", label: "No" }
          ]}
        ]
      });
    }
  }

  // ADC Value (optional, for any tissue type)
  if (caseData.tissueType) {
    steps.push({
      id: "adc_ancillary",
      title: "Optional: ADC & Ancillary Features",
      description: "Provide ADC value and select any ancillary features that may influence classification.",
      questions: [
        {
          id: "adcValue",
          label: "Mean ADC value (optional)",
          tooltip: "Mean ADC value in × 10⁻³ mm²/s. >1.5 supports benign; 1.1–1.5 supports probably benign; <1.1 suggests malignancy.",
          type: "number",
          placeholder: "e.g., 1.2",
          unit: "× 10⁻³ mm²/s"
        },
        {
          id: "ancillaryFeatures",
          label: "Ancillary features (select all that apply)",
          tooltip: "High-risk features that may upgrade classification to ST-RADS 5.",
          type: "checkbox",
          options: [
            { value: "necrosis", label: "Non-enhancing areas of necrosis" },
            { value: "hemorrhage", label: "Internal hemorrhage" },
            { value: "peritumoral_edema", label: "Peritumoral edema" },
            { value: "fascial_tail", label: "Fascial tail sign" },
            { value: "crossing_compartments", label: "Crossing fascial compartments" },
            { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
            { value: "metastasis", label: "Regional or distant metastatic lesions" }
          ]
        }
      ]
    });
  }

  return steps;
}