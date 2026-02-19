// Wizard step definitions for the ST-RADS Calculator
// Faithfully follows Figures 1, 2A, 2B, 2C, 2D from Chhabra et al., AJR 2025

// Derive algorithm pathway from Figure 1's two sequential decisions (used below for branching).
function getTissueType(caseData) {
  if (caseData.macroscopicFatT1W === "yes") return "lipomatous";
  if (caseData.macroscopicFatT1W === "no" && caseData.t2EnhancementPath === "cystlike") return "cystlike";
  if (caseData.macroscopicFatT1W === "no" && caseData.t2EnhancementPath === "indeterminate_solid") return "indeterminate_solid";
  return null;
}

export function getWizardSteps(caseData) {
  const steps = [];
  const tissueType = getTissueType(caseData);

  // ══════════════════════════════════════════════════════════════
  // FIGURE 1: Suspected Soft Tissue Lesion (exact flowchart order)
  // 1) Incomplete imaging → RADS-0 | Complete imaging → 2
  // 2) No soft tissue lesion → RADS-1 | Soft tissue lesion → 3
  // 3) Macroscopic fat on T1W → Lipomatous algorithm | No macroscopic fat → 4
  // 4) No variable high T2 OR >20% enh → Indeterminate solid | Markedly high T2 AND <20% enh → Cyst-like
  // ══════════════════════════════════════════════════════════════
  steps.push({
    id: "initial",
    title: "Step 1: Imaging Completion",
    description: "Figure 1 — First decision.",
    questions: [
      {
        id: "examAdequacy",
        label: "Is the MRI examination complete?",
        tooltip: "Minimum: Axial T1W, fluid-sensitive T2W (conventional T2W / in-phase Dixon / STIR), and pre/post contrast fat-suppressed T1W sequences. Incomplete → Soft tissue RADS-0.",
        type: "radio",
        options: [
          { value: "incomplete", label: "No — Incomplete imaging (→ Soft tissue RADS-0)" },
          { value: "complete", label: "Yes — Complete imaging" }
        ]
      }
    ]
  });

  // ── Step 2: Lesion Identification (Figure 1, second decision) ──
  // No soft tissue lesion → RADS-1* | Soft tissue lesion → Step 3
  if (caseData.examAdequacy === "complete") {
    steps.push({
      id: "lesion_ident",
      title: "Step 2: Lesion Identification",
      description: "Figure 1 — Is a soft-tissue lesion identified on MRI?",
      questions: [{
        id: "lesionPresent",
        label: "Is a soft-tissue lesion identified on MRI?",
        tooltip: "Category 1 (RADS-1) is appropriate for examinations showing imaging findings that may mimic soft-tissue lesions but are not true lesions (e.g., asymmetric fatty or osseous prominence, anatomic osseous variant).",
        type: "radio",
        options: [
          { value: "no", label: "No — No soft tissue lesion (→ Soft tissue RADS-1)" },
          { value: "yes", label: "Yes — Soft tissue lesion present" }
        ]
      }]
    });
  }

  // ── Step 3: Macroscopic fat on T1W (Figure 1, third decision) ──
  // Yes → Lipomatous algorithm | No → Step 4
  if (caseData.lesionPresent === "yes") {
    steps.push({
      id: "macroscopic_fat",
      title: "Step 3: Macroscopic Fat on T1W",
      description: "Figure 1 — Third decision. Presence of internal fat on T1W that suppresses on fat-suppression sequence.",
      questions: [{
        id: "macroscopicFatT1W",
        label: "Macroscopic fat on T1W?",
        tooltip: "** Presence of internal fat on T1W that suppresses on fat-suppression sequence. Yes → Determine Soft Tissue-RADS Score by following 'Lipomatous' Soft Tissue Lesion Algorithm.",
        type: "radio",
        options: [
          { value: "yes", label: "Yes — Macroscopic fat on T1W (→ Follow Lipomatous algorithm)" },
          { value: "no", label: "No — No macroscopic fat on T1W" }
        ]
      }]
    });
  }

  // ── Step 4: T2 signal and enhancement (Figure 1, fourth decision) ──
  // Only when no macroscopic fat: No variable high T2 OR >20% enh → Indeterminate solid | Markedly high T2 AND <20% enh → Cyst-like
  if (caseData.macroscopicFatT1W === "no") {
    steps.push({
      id: "t2_enhancement",
      title: "Step 4: T2 Signal and Enhancement",
      description: "Figure 1 — Fourth decision. Determines Cyst-like vs Indeterminate solid algorithm.",
      questions: [{
        id: "t2EnhancementPath",
        label: "Which describes the lesion?",
        tooltip: "No variable high signal on T2W OR >20% enhancement on T1W+C → Indeterminate solid. Markedly high signal on T2W AND <20% enhancement on T1W+C → Cyst-like or high water content.",
        type: "radio",
        options: [
          { value: "indeterminate_solid", label: "No variable high signal on T2W OR >20% enhancement on T1W+C (→ Follow Indeterminate solid algorithm)" },
          { value: "cystlike", label: "Markedly high signal on T2W AND <20% enhancement on T1W+C (→ Follow Cyst-like or high water content algorithm)" }
        ]
      }]
    });
  }

  // ══════════════════════════════════════════════════════════════
  // FIGURE 2A: LIPOMATOUS LESIONS (exact flowchart match)
  // ══════════════════════════════════════════════════════════════
  if (tissueType === "lipomatous") {
    steps.push({
      id: "lip_comp",
      title: "Step 4: Lipomatous Composition",
      description: "Figure 2A: Predominantly lipomatous (>90%) vs not.",
      questions: [{
        id: "lipFatContent",
        label: "Is the lesion predominantly lipomatous (>90%)?",
        tooltip: "Identify and exclude common benign lesions containing macroscopic fat (elastofibroma dorsi, hemangioma, xanthoma, heterotopic ossification, lipomatosis of nerve, chondroid lipoma, hibernoma).",
        type: "radio",
        options: [
          { value: "predominantly", label: "Yes — Predominantly lipomatous (>90%)" },
          { value: "not_predominantly", label: "No — Not predominantly lipomatous (≤90%)" }
        ]
      }]
    });

    // Predominantly: first split per flowchart
    if (caseData.lipFatContent === "predominantly") {
      steps.push({
        id: "lip_first_branch",
        title: "Step 5: Septations & Nodules (Fig 2A)",
        description: "Thin septations/absence of nodules → RADS-2. Septations and presence of nodules → next question.",
        questions: [{
          id: "lipNoduleSeptation",
          label: "Which describes the lesion?",
          type: "radio",
          options: [
            { value: "thin_absence", label: "Thin septations (<2 mm) OR absence of nodules and like subcutaneous fat intensity on all sequences (→ RADS-2)" },
            { value: "septations_presence", label: "Septations and presence of nodules and like subcutaneous fat intensity on all sequences" }
          ]
        }]
      });
      // Only when "septations and presence of nodules" do we ask thin/thick and vessels
      if (caseData.lipNoduleSeptation === "septations_presence") {
        steps.push({
          id: "lip_sept",
          title: "Step 6: Septation Thickness & Enhancement",
          description: "Thick septations ≥2 mm OR enhancement >10% → RADS-4. Thin <2 mm OR enhancement <10% → vessel question → RADS-3 (Angiolipoma).",
          questions: [
            {
              id: "lipSeptations",
              label: "Septation thickness and enhancement",
              type: "radio",
              options: [
                { value: "thin_low_enh", label: "Thin septations <2 mm OR Enhancement <10%" },
                { value: "thick_high_enh", label: "Thick septations ≥2 mm OR Enhancement >10% (→ RADS-4: ALT/WDL)" }
              ]
            },
            ...(caseData.lipSeptations === "thin_low_enh" ? [{
              id: "lipVessels",
              label: "Prominent vessels?",
              tooltip: "Many or few prominent vessels both → RADS-3 (Angiolipoma) per flowchart.",
              type: "radio",
              options: [
                { value: "many", label: "Many prominent vessels (→ RADS-3: Angiolipoma)" },
                { value: "few", label: "Few prominent vessels (→ RADS-4: ALT/WDL)" }
              ]
            }] : [])
          ]
        });
      }
    }

    if (caseData.lipFatContent === "not_predominantly") {
      steps.push({
        id: "lip_nodules",
        title: "Step 5: Non-Fat Component",
        description: "No enhancing nodules or proportionately larger lipomatous → RADS-4. Enhancing nodules or proportionately smaller lipomatous → RADS-5.",
        questions: [{
          id: "lipNoduleFeatures",
          label: "Non-fat component features",
          type: "radio",
          options: [
            { value: "no_nodules", label: "No enhancing nodule(s) OR proportionately larger lipomatous component than soft tissue (→ RADS-4: ALT/WDL)" },
            { value: "nodules_present", label: "Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue (→ RADS-5)" }
          ]
        }]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FIGURE 2B: CYST-LIKE / HIGH WATER CONTENT
  // ══════════════════════════════════════════════════════════════
  if (tissueType === "cystlike") {
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
        description: "Subfascial (deeper) location. Flowchart: flow voids → then hematoma; no flow voids → hematoma → septations.",
        questions: [
          {
            id: "cystFlow",
            label: "Predominantly comprised of flow voids or fluid-fluid levels?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]
          },
          // When flow = yes: ask hematoma (yes → RADS-3, no → RADS-2). When flow = no: ask hematoma then septations.
          ...(caseData.cystFlow === "yes" ? [{
            id: "cystHematoma",
            label: "Features suggesting hematoma?",
            tooltip: "If flow voids/fluid-fluid: hematoma yes → RADS-3, no → RADS-2. If no flow voids: hematoma yes → RADS-3.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes (RADS-3: Hematoma / Chronic expanding hematoma)" },
              { value: "no", label: "No" }
            ]
          }] : []),
          ...(caseData.cystFlow === "no" ? [{
            id: "cystSeptationNodules",
            label: "Thick enhancing septations and/or mural nodules",
            tooltip: "Absence of thick septations and small nodules <1 cm → RADS-3/4. Presence of thick septations and/or nodules ≥1 cm or larger soft tissue component → RADS-5.",
            type: "radio",
            options: [
              { value: "absent", label: "Absence of thick enhancing septations and small mural nodule(s) <1 cm (RADS-3 or 4)" },
              { value: "present", label: "Presence of thick enhancing septations AND/OR mural nodule(s) ≥1 cm or larger soft tissue component (RADS-5)" }
            ]
          }] : [])
        ]
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // FIGURE 2C & 2D: INDETERMINATE SOLID LESIONS
  // ══════════════════════════════════════════════════════════════
  if (tissueType === "indeterminate_solid") {
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
          { value: "intravascular", label: "Intra-vascular / Vessel-related" },
          { value: "intraarticular", label: "Intra-articular" },
          { value: "intraneural", label: "Intra-neural / Nerve-related" },
          { value: "cutaneous", label: "Cutaneous / Subcutaneous" },
          { value: "intratendinous", label: "Intra-tendinous" },
          { value: "fascial", label: "Plantar / Palmar Fascial" },
          { value: "subungual", label: "Subungual" }
        ]
      }]
    });

    // ── Deep / Intramuscular (Fig 2C) ──
    // Muscle signature present → RADS-2 (no further question). No muscle signature → Benign triad? Yes→RADS-2, No→RADS-4/5.
    if (caseData.compartment === "deep_muscle") {
      steps.push({
        id: "deep_logic",
        title: "Step 5: Deep (subfascial) / Inter or Intra-muscular",
        questions: [
          {
            id: "muscleSignature",
            label: "Muscle signature present?",
            tooltip: "Does the lesion show muscle-like signal characteristics? If yes → RADS-2.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Muscle signature present (→ RADS-2)" },
              { value: "no", label: "No — No muscle signature" }
            ]
          },
          ...(caseData.muscleSignature === "no" ? [{
            id: "myositisTriad",
            label: "History of prior injury WITH peritumoral edema AND mature peripheral mineralization?",
            tooltip: "All three present → RADS-2 (e.g. myositis ossificans). One or more absent → RADS-4/5.",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — All three present (→ RADS-2)" },
              { value: "no", label: "No — One or more absent (→ RADS-4/5)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Intravascular (Fig 2D) ──
    // Excludes venous thrombosis, thrombophlebitis, (pseudo)aneurysm, vascular malformation.
    if (caseData.compartment === "intravascular") {
      steps.push({
        id: "vasc_logic",
        title: "Step 5: Intra-vascular or Vessel-related",
        questions: [
          {
            id: "vascMorphology",
            label: "Morphology and signal (T2W, phleboliths, fluid-fluid levels)",
            type: "radio",
            options: [
              { value: "phleboliths", label: "Hyperintense lobules or tubules on T2W WITH hypointense phleboliths WITH fluid-fluid levels (→ RADS-2: Venous/venolymphatic malformation)" },
              { value: "hyper_no_phleb", label: "Hyperintense lobules or tubules on T2W WITHOUT hypointense phleboliths WITHOUT fluid-fluid levels (→ RADS-4 or RADS-5)" }
            ]
          }
        ]
      });
    }

    // ── Intraarticular (Fig 2D) ──
    if (caseData.compartment === "intraarticular") {
      steps.push({
        id: "ia_logic",
        title: "Step 5: Intraarticular",
        questions: [
          {
            id: "iaSignal",
            label: "Calcified/ossified on XR or CT and/or predominantly hypointense foci on T2W?",
            type: "radio",
            options: [
              { value: "calcified_hypo", label: "Yes — Calcified/ossified and/or predominantly hypointense on T2W (→ RADS-2)" },
              { value: "not_calcified_hyper", label: "No — Not calcified/ossified OR predominantly hyperintense foci on T2W" }
            ]
          },
          ...(caseData.iaSignal === "not_calcified_hyper" ? [{
            id: "iaEnhancement",
            label: "T2 signal and enhancement pattern",
            type: "radio",
            options: [
              { value: "peripheral", label: "Hyperintense on T2W and peripheral enhancement (→ RADS-3: TSGCT, synovial chondromatosis)" },
              { value: "no_peripheral", label: "Hypointense on T2W and no peripheral enhancement (→ RADS-4: TSGCT)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Intraneural (Fig 2D) ──
    // Presence of tail sign and related to major named nerve. Target sign present → RADS-2 (no ADC). No target sign → ADC >1.1 → RADS-3, ADC ≤1.1 → T2/enhancement → RADS-4 or RADS-5.
    if (caseData.compartment === "intraneural") {
      steps.push({
        id: "nerve_logic",
        title: "Step 5: Intra-neural or Nerve-related",
        questions: [
          {
            id: "targetSign",
            label: "Target sign present?",
            tooltip: "Central T2 hypointensity with peripheral hyperintensity. If yes → RADS-2 (Benign PNST).",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Target sign present (→ RADS-2: Benign peripheral nerve sheath tumor)" },
              { value: "no", label: "No — Target sign absent" }
            ]
          },
          ...(caseData.targetSign === "no" ? [{
            id: "nerveADC",
            label: "ADC value (× 10⁻³ mm²/s)",
            tooltip: "ADC >1.1 → RADS-3. ADC ≤1.1 → RADS-4 or RADS-5.",
            type: "radio",
            options: [
              { value: "high", label: "ADC > 1.1 mm²/s (→ RADS-3: Perineurioma, ancient schwannoma, etc.)" },
              { value: "low", label: "ADC ≤ 1.1 mm²/s (→ RADS-4 or RADS-5: Malignant PNST)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Cutaneous / Subcutaneous (Fig 2D) ──
    // Exophytic → peripheral enhancement → RADS-2, internal enhancement → RADS-4. Endophytic → RADS-5 (no enhancement question).
    if (caseData.compartment === "cutaneous") {
      steps.push({
        id: "cut_logic",
        title: "Step 5: Cutaneous or Subcutaneous",
        questions: [
          {
            id: "growthPattern",
            label: "Growth pattern",
            type: "radio",
            options: [
              { value: "exophytic", label: "Exophytic (outward growth)" },
              { value: "endophytic", label: "Endophytic (inward/infiltrative growth) (→ RADS-5)" }
            ]
          },
          ...(caseData.growthPattern === "exophytic" ? [{
            id: "cutEnhancement",
            label: "Enhancement pattern",
            type: "radio",
            options: [
              { value: "peripheral", label: "Peripheral enhancement (→ RADS-2: Sebaceous cyst, trichilemmal cyst, epidermoid cyst, retinacular cyst)" },
              { value: "internal", label: "Internal enhancement (→ RADS-4: Wart, dermatofibrosarcoma protuberans, fibrosarcoma NOS)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Intratendinous (Fig 2C) ──
    // Enlarged tendon with calcifications/cystic change/fat/amyloidosis/autoimmune history → RADS-2. Normal tendon → ask blooming (with blooming → RADS-4, without → RADS-5).
    if (caseData.compartment === "intratendinous") {
      steps.push({
        id: "tendon_logic",
        title: "Step 5: Intra-tendinous or Tendon-related",
        questions: [
          {
            id: "tendonMorph",
            label: "Tendon morphology",
            type: "radio",
            options: [
              { value: "enlarged", label: "Enlarged tendon with calcifications, cystic change, fat, or underlying history of amyloidosis or autoimmune disease (→ RADS-2: Gout, Amyloid, Xanthoma)" },
              { value: "normal", label: "Normal size tendon without calcifications, cystic change, fat, or no underlying history of amyloidosis or autoimmune disease" }
            ]
          },
          ...(caseData.tendonMorph === "normal" ? [{
            id: "tendonBlooming",
            label: "Hemosiderin staining and blooming on GRE?",
            tooltip: "Normal tendon: with blooming → RADS-3, without → RADS-4 or RADS-5.",
            type: "radio",
            options: [
              { value: "blooming", label: "Hemosiderin staining with blooming on GRE (→ RADS-3: TSGCT)" },
              { value: "no_blooming", label: "Hemosiderin staining without blooming on GRE (→ RADS-4 or RADS-5)" }
            ]
          }] : [])
        ]
      });
    }

    // ── Plantar / Palmar Fascial (Fig 2C) ──
    // Fascial nodule <2 cm → RADS-2 (Fibroma) only. Fascial nodule ≥2 cm → Multifocal/conglomerate → RADS-3, No multifocal → RADS-4/5.
    if (caseData.compartment === "fascial") {
      steps.push({
        id: "fascial_logic",
        title: "Step 5: Plantar or Palmar Fascial",
        questions: [
          {
            id: "fascialSize",
            label: "Fascial nodule size",
            type: "radio",
            options: [
              { value: "small", label: "< 2 cm in length (→ RADS-2: Fibroma)" },
              { value: "large", label: "≥ 2 cm in length" }
            ]
          },
          ...(caseData.fascialSize === "large" ? [{
            id: "fascialMulti",
            label: "Multifocal or conglomerate fascial nodules?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — Multifocal or conglomerate (→ RADS-3: Fibromatosis)" },
              { value: "no", label: "No — Solitary (→ RADS-4/5)" }
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
  // OPTIONAL: ADC & ANCILLARY FEATURES (tissue-type specific)
  // ══════════════════════════════════════════════════════════════
  if (tissueType) {
    const ancillaryOptions = getAncillaryOptionsForType(tissueType, caseData.compartment);
    steps.push({
      id: "ancillary",
      title: "Step 6: ADC & Ancillary Features (optional)",
      description: "Per the flowchart footnotes, these ancillary features may favor upgrading to ST-RADS 5.",
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
          label: "High Risk Features — ST-RADS 5 Triggers (optional)",
          tooltip: "If any of these features are present and the current score is 3 or 4, the score will be upgraded to ST-RADS 5.",
          type: "checkbox",
          options: ancillaryOptions
        }
      ]
    });
  }

  return steps;
}

function getAncillaryOptionsForType(tissueType, compartment) {
  // Fig 2A footnote: Lipomatous ST-RADS 5 ancillary features
  if (tissueType === "lipomatous") {
    return [
      { value: "necrosis", label: "Non-enhancing areas of necrosis" },
      { value: "hemorrhage", label: "Hemorrhage" },
      { value: "peritumoral_edema", label: "Peritumoral edema" },
      { value: "low_adc", label: "Low ADC (< 1.1 × 10⁻³ mm²/s)" },
      { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
      { value: "metastasis", label: "Regional or distant metastatic lesions" }
    ];
  }
  // Fig 2B footnote: Cyst-like ST-RADS 5 ancillary features
  if (tissueType === "cystlike") {
    return [
      { value: "hemorrhage", label: "Hemorrhage" },
      { value: "peritumoral_edema", label: "Peritumoral edema" },
      { value: "fascial_tails", label: "Fascial tails" },
      { value: "intercompartmental", label: "Intercompartmental extension" },
      { value: "low_adc", label: "Low ADC (< 1.1 × 10⁻³ mm²/s) in nodule" },
      { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
      { value: "metastasis", label: "Regional or distant metastatic lesions" }
    ];
  }
  // Indeterminate solid: different footnotes for Fig 2C vs Fig 2D compartments
  const fig2dCompartments = ["intravascular", "intraarticular", "intraneural", "cutaneous"];
  if (fig2dCompartments.includes(compartment)) {
    // Fig 2D footnote
    return [
      { value: "hemorrhage", label: "Internal hemorrhage" },
      { value: "necrosis", label: "Necrosis" },
      { value: "peritumoral_edema", label: "Peritumoral edema" },
      { value: "crossing_compartments", label: "Crossing compartments" },
      { value: "low_adc", label: "Low ADC (< 1.1 × 10⁻³ mm²/s)" },
      { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
      { value: "metastasis", label: "Regional or distant metastatic lesions" }
    ];
  }
  // Fig 2C footnote (deep_muscle, intratendinous, fascial, subungual)
  return [
    { value: "solid_nodules", label: "Presence of solid enhancing nodules (> 2 cm for fascia-based)" },
    { value: "fascial_tails", label: "Fascial tails" },
    { value: "extracompartmental", label: "Extra-compartmental extension" },
    { value: "necrosis", label: "Necrosis" },
    { value: "hemorrhage", label: "Hemorrhage" },
    { value: "peritumoral_edema", label: "Peritumoral edema" },
    { value: "low_adc", label: "Low ADC (< 1.1 × 10⁻³ mm²/s)" },
    { value: "rapid_growth", label: "Rapid increase in size or symptoms" },
    { value: "metastasis", label: "Regional or distant metastasis" }
  ];
}