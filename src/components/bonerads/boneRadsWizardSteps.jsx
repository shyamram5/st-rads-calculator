// ═══════════════════════════════════════════════════════════════════════
// Bone-RADS Wizard Steps Configuration
// ═══════════════════════════════════════════════════════════════════════

import { MARGIN_GRADES, ENDOSTEAL_OPTIONS } from "./boneRadsRuleEngine";

export function getBoneRADSWizardSteps(data) {
  const steps = [];

  // ── STEP 0: Characterizability ────────────────────────────────────
  steps.push({
    id: "characterizable",
    title: "Lesion Visibility",
    description: "Can the key risk features (margins, periosteal reaction, cortical involvement) be adequately evaluated on the available radiographs?",
    tip: "Bone-RADS 0 is not a risk category — it acknowledges insufficient radiographs for risk stratification. A lesion that appears benign on a single view but cannot have its margins and cortical integrity assessed should be Bone-RADS 0. CT is preferred for cortical detail; MRI adds marrow characterization.",
    questions: [
      {
        id: "characterizable",
        label: "Lesion characterizability",
        type: "radio",
        options: [
          { value: "yes", label: "Yes — lesion is sufficiently visible for risk assessment" },
          { value: "no", label: "No — poorly visualized or incompletely evaluated → Bone-RADS 0" },
        ],
      },
    ],
  });

  if (data.characterizable === "no" || !data.characterizable) return steps;

  // ── STEP 1: Clinical Context ──────────────────────────────────────
  steps.push({
    id: "clinical_context",
    title: "Patient Clinical Context",
    description: "Age, symptoms, and cancer history.",
    tip: "Known primary cancer adds 2 points to any bone lesion — even a geographic, well-defined lesion that would otherwise score Bone-RADS 1 or 2 now reaches the Bone-RADS 3 threshold.",
    questions: [
      {
        id: "patient_age",
        label: "Patient age (years)",
        type: "number",
        placeholder: "e.g. 45",
        inputType: "number",
      },
      {
        id: "symptoms",
        label: "Symptoms",
        type: "radio",
        options: [
          { value: "asymptomatic", label: "Asymptomatic (incidental finding)" },
          { value: "symptomatic", label: "Symptomatic (pain, swelling, functional limitation)" },
        ],
      },
      {
        id: "known_cancer",
        label: "Known history of primary malignancy?",
        type: "radio",
        options: [
          { value: "no", label: "No", points: 0 },
          { value: "yes", label: "Yes (+2 points)", points: 2 },
        ],
      },
    ],
  });

  if (!data.symptoms) return steps;

  // Cancer type if applicable
  if (data.known_cancer === "yes") {
    steps.push({
      id: "cancer_details",
      title: "Primary Malignancy Details",
      questions: [
        {
          id: "cancer_type",
          label: "Primary cancer type",
          type: "radio",
          options: [
            { value: "breast", label: "Breast" },
            { value: "lung", label: "Lung" },
            { value: "prostate", label: "Prostate" },
            { value: "renal", label: "Renal" },
            { value: "thyroid", label: "Thyroid" },
            { value: "myeloma", label: "Multiple myeloma" },
            { value: "other", label: "Other" },
          ],
        },
        {
          id: "multifocal",
          label: "Bone involvement",
          type: "radio",
          options: [
            { value: "solitary", label: "Solitary lesion" },
            { value: "multifocal", label: "Multifocal / polyostotic" },
          ],
        },
      ],
    });
  } else {
    steps.push({
      id: "distribution",
      title: "Lesion Distribution",
      questions: [
        {
          id: "multifocal",
          label: "Bone involvement",
          type: "radio",
          options: [
            { value: "solitary", label: "Solitary lesion" },
            { value: "multifocal", label: "Multifocal / polyostotic" },
          ],
        },
      ],
    });
  }

  if (!data.multifocal) return steps;

  // ── STEP 2: Margination ───────────────────────────────────────────
  steps.push({
    id: "margins",
    title: "Feature 1 — Lesion Margination",
    description: "Modified Lodwick-Madewell grading system. Select the HIGHEST (worst) grade present anywhere in the lesion.",
    tip: "The most important principle: assign the HIGHEST grade present anywhere. If a lesion has even a focal area of ill-defined margins alongside a well-defined zone, assign Grade II or IIIA. Never average margin grades.",
    questions: [
      {
        id: "margin_grade",
        label: "Margin grade",
        type: "radio",
        options: MARGIN_GRADES.map(m => ({
          value: m.value,
          label: `${m.label} — ${m.name}`,
          points: m.points,
          desc: m.desc,
          examples: m.examples,
        })),
      },
    ],
  });

  if (!data.margin_grade) return steps;

  // ── STEP 3: Periosteal Reaction ───────────────────────────────────
  const periQuestions = [
    {
      id: "periosteal",
      label: "Periosteal reaction",
      type: "radio",
      options: [
        { value: "none", label: "No periosteal reaction or remodeling", points: 0 },
        { value: "remodeling", label: "Cortical remodeling only (neocortex replacing original cortex)", points: 0, note: "Does NOT add points — this is NOT periosteal reaction" },
        { value: "nonaggressive", label: "Nonaggressive periosteal reaction (smooth solid)", points: 2 },
        { value: "aggressive", label: "Aggressive periosteal reaction", points: 4 },
      ],
    },
  ];

  // If aggressive selected, show pattern subquestion
  if (data.periosteal === "aggressive") {
    periQuestions.push({
      id: "aggressive_pattern",
      label: "Aggressive periosteal reaction pattern",
      type: "radio",
      options: [
        { value: "lamellated", label: 'Lamellated / "onion-skin"', desc: "Concentric layers — benign aggressive (LCH) or malignant (Ewing sarcoma)" },
        { value: "parallel_spiculated", label: 'Parallel spiculated / "hair-on-end"', desc: "Perpendicular spicules — strongly associated with osteosarcoma" },
        { value: "divergent_spiculated", label: 'Divergent spiculated / "sunburst"', desc: "Radiating spicules — classic for osteosarcoma" },
        { value: "codman", label: "Codman's angle", desc: "Elevated periosteum at shoulder of extra-osseous mass" },
        { value: "complex", label: "Complex / combined patterns", desc: "Lamellated + spiculated — variable growth rate" },
        { value: "interrupted", label: "Interrupted periosteum", desc: "Cortical breakthrough with periosteal disruption" },
      ],
    });
  }

  steps.push({
    id: "periosteal",
    title: "Feature 2 — Periosteal Reaction",
    description: "Classify as none, cortical remodeling, nonaggressive, or aggressive.",
    tip: "Periosteal reaction should be classified as indolent or aggressive — NOT benign or malignant. Osteomyelitis can produce lamellated periosteal reaction indistinguishable from Ewing sarcoma. Takes 10 days to 3 weeks to become visible on radiographs.",
    questions: periQuestions,
  });

  if (!data.periosteal) return steps;

  // ── STEP 4: Endosteal Erosion ─────────────────────────────────────
  steps.push({
    id: "endosteal",
    title: "Feature 3 — Endosteal Erosion",
    description: "Depth of endosteal scalloping relative to cortical thickness.",
    tip: "Always measured RELATIVE to adjacent cortical thickness. Grade the most severe area. Deep erosion (> 2/3) suggests high biologic activity and increases fracture risk. Enchondromas cause mild scalloping; deep scalloping → consider low-grade chondrosarcoma.",
    questions: [
      {
        id: "endosteal",
        label: "Endosteal erosion grade",
        type: "radio",
        options: ENDOSTEAL_OPTIONS.map(e => ({
          value: e.value,
          label: e.label,
          points: e.points,
        })),
      },
    ],
  });

  if (!data.endosteal) return steps;

  // ── STEP 5: Pathological Fracture ─────────────────────────────────
  steps.push({
    id: "fracture",
    title: "Feature 4 — Pathological Fracture",
    description: "Is a pathological fracture (completed or impending) present?",
    tip: "Pathological fracture carries 2 points. It can elevate a Bone-RADS 2 lesion (IB, 3 pts) to Bone-RADS 3 (5 pts total). In primary bone malignancy, pathological fracture is associated with higher rates of local recurrence.",
    questions: [
      {
        id: "pathological_fracture",
        label: "Pathological fracture",
        type: "radio",
        options: [
          { value: "no", label: "No pathological fracture", points: 0 },
          { value: "yes", label: "Yes — pathological fracture present", points: 2 },
        ],
      },
    ],
  });

  if (!data.pathological_fracture) return steps;

  // ── STEP 6: Soft Tissue Mass ──────────────────────────────────────
  steps.push({
    id: "soft_tissue",
    title: "Feature 5 — Extra-osseous Soft Tissue Mass",
    description: "Is there cortical breakthrough with an associated extra-osseous soft tissue mass?",
    tip: "4 points — the single highest-weighted feature. Even a Bone-RADS 1 lesion (IA, 1 pt) with a soft tissue mass scores 5 pts = Bone-RADS 3. A Grade IB lesion (3 pts) + soft tissue mass = 7 pts = Bone-RADS 4 immediately.",
    questions: [
      {
        id: "soft_tissue_mass",
        label: "Extra-osseous soft tissue mass",
        type: "radio",
        options: [
          { value: "no", label: "No soft tissue mass", points: 0 },
          { value: "yes", label: "Yes — extra-osseous soft tissue mass present", points: 4 },
        ],
      },
    ],
  });

  return steps;
}