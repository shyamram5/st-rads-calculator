// ═══════════════════════════════════════════════════════════════════
// Lung-RADS v2022 — Dynamic Wizard Step Definitions
// ═══════════════════════════════════════════════════════════════════

export function getWizardSteps(data) {
  const steps = [];

  // ── STEP 0: Exam Context ──
  steps.push({
    id: "examType",
    title: "Step 0 — Exam Context",
    description: "Is this a baseline (first) screening exam or a follow-up screening exam?",
    tip: "Each exam is coded 0–4 based on the nodule with the HIGHEST degree of suspicion. All follow-up timing is calculated from the date of the exam being interpreted, not the prior exam.",
    field: "examType",
    type: "radio",
    options: [
      { value: "baseline", label: "Baseline (first) screening exam" },
      { value: "followup", label: "Follow-up screening exam" },
    ],
  });

  if (!data.examType) return steps;

  if (data.examType === "followup") {
    steps.push({
      id: "priorsAvailable",
      title: "Step 0b — Prior Comparison",
      description: "Are prior chest CT examinations available for comparison?",
      field: "priorsAvailable",
      type: "radio",
      options: [
        { value: "yes", label: "Yes — priors available for comparison" },
        { value: "being_located", label: "No — priors being located", tip: "Classification will be Lung-RADS 0 pending comparison." },
        { value: "no_priors", label: "No prior exams exist" },
      ],
    });
    if (!data.priorsAvailable) return steps;
    if (data.priorsAvailable === "being_located") return steps; // Cat 0
  }

  // ── STEP 1: Nodule Type ──
  steps.push({
    id: "noduleType",
    title: "Step 1 — Primary Nodule Type",
    description: "What is the dominant nodule type?",
    tip: "Thin-walled unilocular cysts with uniform wall thickness < 2 mm are benign and NOT classified in Lung-RADS. Only atypical cysts (thick-walled ≥2mm, multilocular, or with associated nodule) enter the algorithm.",
    field: "noduleType",
    type: "radio",
    options: [
      { value: "none", label: "No lung nodule detected" },
      { value: "solid", label: "Solid nodule", tip: "Entirely soft tissue attenuation" },
      { value: "part_solid", label: "Part-solid nodule", tip: "Contains both ground glass AND solid component" },
      { value: "ggn", label: "Non-solid / Ground Glass Nodule (GGN)", tip: "Pure ground glass, no solid component" },
      { value: "airway", label: "Airway nodule", tip: "Endotracheal or endobronchial lesion" },
      { value: "cyst", label: "Atypical pulmonary cyst", tip: "Thick-walled, multilocular, or cyst with nodule" },
      { value: "juxtapleural", label: "Juxtapleural nodule", tip: "Pleural-based solid nodule" },
    ],
  });

  if (!data.noduleType) return steps;
  if (data.noduleType === "none") {
    // Check benign → Cat 1
    return steps;
  }

  // ── Benign features check ──
  steps.push({
    id: "benignFeatures",
    title: "Step 1b — Benign Features",
    description: "Does this nodule have definitively benign features?",
    field: "benignFeatures",
    type: "radio",
    options: [
      { value: "yes", label: "Yes — benign calcification or fat", tip: "Complete, central, popcorn, concentric ring calcifications or fat-containing → Lung-RADS 1" },
      { value: "no", label: "No — no definitively benign features" },
    ],
  });

  if (!data.benignFeatures) return steps;
  if (data.benignFeatures === "yes") return steps; // Cat 1

  // ── JUXTAPLEURAL BRANCH ──
  if (data.noduleType === "juxtapleural") {
    steps.push({
      id: "juxtapleuralShape",
      title: "Step 5 — Juxtapleural Nodule Assessment",
      description: "Does this nodule have ALL of the following: smooth margins, oval/lentiform/triangular shape, solid, < 10 mm?",
      tip: "Juxtapleural nodules meeting all four criteria represent intrapulmonary lymph nodes → Category 2.",
      field: "juxtapleuralShape",
      type: "radio",
      options: [
        { value: "benign_pattern", label: "Yes — smooth, oval/lentiform/triangular, solid" },
        { value: "not_benign", label: "No — does not meet all criteria (evaluate as solid)" },
      ],
    });
    if (!data.juxtapleuralShape) return steps;
    if (data.juxtapleuralShape === "benign_pattern") {
      // Need size for < 10 mm check
      steps.push({
        id: "measurements",
        title: "Step 2 — Nodule Measurement",
        description: "Enter long and short axis measurements.",
        tip: "Mean diameter = (long axis + short axis) ÷ 2. Spiculations should not be included.",
        field: "measurements",
        type: "number",
        numberFields: [
          { id: "longAxis", label: "Long axis (mm)", step: "0.1", placeholder: "e.g. 8.5" },
          { id: "shortAxis", label: "Short axis (mm)", step: "0.1", placeholder: "e.g. 6.2" },
        ],
      });
      return steps;
    }
    // Falls through to measurement + standard solid path below
  }

  // ── AIRWAY BRANCH ──
  if (data.noduleType === "airway") {
    steps.push({
      id: "airwayLocation",
      title: "Step 5 — Airway Nodule Location",
      description: "Where is the airway abnormality?",
      tip: "Subsegmental or multiple tubular findings favor infectious process. Segmental or proximal lesions require further evaluation.",
      field: "airwayLocation",
      type: "radio",
      options: [
        { value: "subsegmental", label: "Subsegmental or multiple tubular", tip: "Favors infectious/inflammatory process → Category 2" },
        { value: "segmental_baseline", label: "Segmental or more proximal — baseline", tip: "Referral for bronchoscopy consideration → Category 4A" },
        { value: "segmental_followup", label: "Segmental or more proximal — stable/growing on follow-up", tip: "Category 4B" },
      ],
    });
    return steps; // No measurement needed for airway
  }

  // ── CYST BRANCH ──
  if (data.noduleType === "cyst") {
    steps.push({
      id: "cystType",
      title: "Step 5 — Cyst Classification",
      description: "What type of pulmonary cyst?",
      tip: "Cavitary nodules where wall thickening is the dominant feature → manage as solid nodule by total mean diameter.",
      field: "cystType",
      type: "radio",
      options: [
        { value: "thin_walled", label: "Thin-walled (< 2 mm, unilocular, uniform)", tip: "Benign — NOT classified in Lung-RADS" },
        { value: "thick_walled", label: "Thick-walled (≥ 2 mm, asymmetric/nodular wall)" },
        { value: "multilocular", label: "Multilocular (internal septations)" },
        { value: "became_multilocular", label: "Thin/thick-walled cyst that became multilocular" },
      ],
    });
    if (!data.cystType) return steps;
    if (data.cystType === "thin_walled") return steps; // Benign

    if (data.examType === "followup") {
      steps.push({
        id: "cystChanging",
        title: "Step 5b — Cyst Follow-up",
        description: "Is the cyst changing?",
        field: "cystChanging",
        type: "radio",
        options: [
          { value: "stable", label: "Stable" },
          { value: "growing_wall", label: "Growing wall thickness/nodularity" },
          { value: "growing_multilocular", label: "Growing multilocular cyst" },
          { value: "increased_opacity", label: "Increased loculation or new opacity" },
          { value: "growing_cystic_component", label: "Growing cystic component (mean diameter)" },
        ],
      });
      if (!data.cystChanging) return steps;
    }

    steps.push({
      id: "cystAssociatedNodule",
      title: "Step 5c — Associated Nodule?",
      description: "Is there an associated endophytic or exophytic nodule?",
      tip: "If yes, manage based on the MOST concerning feature.",
      field: "cystAssociatedNodule",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    });

    // Skip to modifiers
    return addModifierSteps(steps, data);
  }

  // ── MEASUREMENT STEP ──
  const measureNumberFields = [
    { id: "longAxis", label: "Long axis (mm)", step: "0.1", placeholder: "e.g. 12.3" },
    { id: "shortAxis", label: "Short axis (mm)", step: "0.1", placeholder: "e.g. 9.1" },
  ];

  if (data.noduleType === "part_solid") {
    measureNumberFields.push(
      { id: "solidLongAxis", label: "Solid component — long axis (mm)", step: "0.1", placeholder: "e.g. 5.0" },
      { id: "solidShortAxis", label: "Solid component — short axis (mm)", step: "0.1", placeholder: "e.g. 3.8" },
    );
  }

  measureNumberFields.push(
    { id: "volume", label: "Volume (mm³, optional)", step: "1", placeholder: "e.g. 268", hint: "Enter if volumetry is available" },
  );

  steps.push({
    id: "measurements",
    title: "Step 2 — Nodule Measurement",
    description: "Enter long and short axis measurements.",
    tip: "Measure long and short axis in any plane that best reflects true nodule size. Mean diameter = (long + short) ÷ 2. Do NOT include ground glass when measuring the solid component of a part-solid nodule. Spiculations should not be included.",
    field: "measurements",
    type: "number",
    numberFields: measureNumberFields,
  });

  // Check if measurements are entered
  if (!data.longAxis || !data.shortAxis) return steps;

  // ── STEP 3: Nodule Status (follow-up only) ──
  if (data.examType === "followup") {
    steps.push({
      id: "noduleStatus",
      title: "Step 3 — Nodule Status",
      description: "What is the nodule's status on this follow-up exam?",
      warningTip: "Growth = increase in mean diameter > 1.5 mm (> 2 mm³ in volume) within a 12-month interval.",
      field: "noduleStatus",
      type: "radio",
      options: [
        { value: "new", label: "New nodule (not previously seen)", tip: "New nodule thresholds are LOWER than baseline." },
        { value: "existing", label: "Previously seen nodule" },
      ],
    });
    if (!data.noduleStatus) return steps;

    if (data.noduleStatus === "existing") {
      steps.push({
        id: "noduleBehavior",
        title: "Step 3b — Nodule Behavior",
        description: "Compared to the prior exam, what is the nodule's behavior?",
        tip: "A solid or part-solid nodule demonstrating slow growth may be classified as 4B. Slow-growing nodules may not show increased PET activity — biopsy or surgical evaluation may be preferred.",
        field: "noduleBehavior",
        type: "radio",
        options: [
          { value: "stable", label: "Stable (no significant change)" },
          { value: "growing", label: "Growing (> 1.5 mm increase in 12-month interval)" },
          { value: "decreased", label: "Decreased in size" },
          { value: "slow_growing", label: "Slow growing (growth over multiple exams, < 1.5 mm per 12 months)" },
        ],
      });
      if (!data.noduleBehavior) return steps;

      // Prior category downgrade check
      if (data.noduleBehavior === "stable" || data.noduleBehavior === "decreased") {
        steps.push({
          id: "priorCategory",
          title: "Step 6 — Prior Category Downgrade",
          description: "What was this nodule's prior Lung-RADS category?",
          tip: "Cat 3 stable at 6 mo → Cat 2. Cat 4A stable at 3 mo (non-airway) → Cat 3. Cat 4B proven benign → Cat 2.",
          field: "priorCategory",
          type: "radio",
          options: [
            { value: "none", label: "No prior category / not applicable" },
            { value: "3", label: "Previously Category 3" },
            { value: "4A", label: "Previously Category 4A" },
            { value: "4B", label: "Previously Category 4B" },
          ],
        });
        if (!data.priorCategory) return steps;

        if (data.priorCategory === "4B") {
          steps.push({
            id: "provenBenign",
            title: "Step 6b — Proven Benign?",
            description: "Has this 4B nodule been proven benign following diagnostic workup?",
            field: "provenBenign",
            type: "radio",
            options: [
              { value: "yes", label: "Yes — proven benign" },
              { value: "no", label: "No" },
            ],
          });
          if (!data.provenBenign) return steps;
        }
      }
    }
  }

  return addModifierSteps(steps, data);
}

function addModifierSteps(steps, data) {
  // ── STEP 7: 4X check ──
  steps.push({
    id: "suspiciousFeatures",
    title: "Step 7 — Additional Malignancy Features (4X)",
    description: "Are there additional imaging features that INCREASE suspicion for lung cancer beyond nodule size alone?",
    warningTip: "4X is a DISTINCT Lung-RADS category — it is NOT a modifier appended to another category. If criteria are met, the final category IS 4X.",
    field: "suspiciousFeatures",
    type: "checkbox",
    options: [
      { value: "none", label: "None" },
      { value: "spiculation", label: "Spiculation" },
      { value: "lymphadenopathy", label: "Mediastinal or hilar lymphadenopathy" },
      { value: "metastatic", label: "Frank metastatic disease pattern" },
      { value: "ggn_doubling", label: "GGN that doubled in size within 1 year" },
      { value: "other", label: "Other features raising malignancy concern" },
    ],
  });

  // ── STEP 8: S modifier ──
  steps.push({
    id: "sModifier",
    title: "Step 8 — S Modifier (Incidental Findings)",
    description: "Are there clinically significant findings unrelated to lung cancer?",
    tip: "Examples: coronary artery calcification, aortic aneurysm, pleural effusion, emphysema, hepatic lesions, adrenal nodules, bone lesions. Findings already known and under evaluation do NOT require an S modifier.",
    field: "sModifier",
    type: "radio",
    options: [
      { value: true, label: "Yes — significant incidental finding(s)" },
      { value: false, label: "No" },
    ],
  });

  // ── STEP 9: Inflammatory check ──
  steps.push({
    id: "inflammatoryProcess",
    title: "Step 9 — Inflammatory / Infectious Process",
    description: "Are there findings suggesting an indeterminate infectious or inflammatory process?",
    tip: "Segmental/lobar consolidation, > 6 new nodules, large solid nodules ≥ 8 mm appearing in short interval, new nodules in immunocompromised patient.",
    field: "inflammatoryProcess",
    type: "radio",
    options: [
      { value: "no", label: "No" },
      { value: "yes_infection", label: "Yes — features more consistent with infection", tip: "Consider Lung-RADS 0 with 1–3 month LDCT follow-up" },
      { value: "yes_malignancy", label: "Yes — but imaging features more concerning for malignancy" },
    ],
  });

  return steps;
}