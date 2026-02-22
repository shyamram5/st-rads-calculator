// ═══════════════════════════════════════════════════════════════════════
// MSKI-RADS Wizard Steps Configuration
// ═══════════════════════════════════════════════════════════════════════

import { NOS_ENTITIES, NF_CRITERIA, BODY_REGIONS } from "./mskiRuleEngine";

export function getMSKIWizardSteps(data) {
  const steps = [];

  // ── STEP 0: Study Completeness ────────────────────────────────────
  steps.push({
    id: "study_completeness",
    title: "Study Completeness",
    description: "Confirm the MRI sequences present in this study. All four are required for MSKI-RADS scoring.",
    tip: "Pre- and post-contrast T1W sequences must use IDENTICAL parameters in at least one plane. A common error is obtaining pre-contrast T1W without fat suppression and post-contrast T1W only with fat suppression — this prevents accurate subtraction and enhancement assessment.",
    questions: [
      {
        id: "seq_t1w",
        label: "T1W (non-fat-suppressed)",
        type: "radio",
        options: [
          { value: "present", label: "Present" },
          { value: "absent", label: "Absent" },
        ],
      },
      {
        id: "seq_fluid_sensitive",
        label: "Fluid-sensitive fat-suppressed (T2 FS or STIR)",
        type: "radio",
        options: [
          { value: "present", label: "Present" },
          { value: "absent", label: "Absent" },
        ],
      },
      {
        id: "seq_pre_contrast_t1fs",
        label: "Pre-contrast T1W fat-suppressed",
        type: "radio",
        options: [
          { value: "present", label: "Present" },
          { value: "absent", label: "Absent" },
        ],
      },
      {
        id: "seq_post_contrast_t1fs",
        label: "Post-contrast T1W fat-suppressed",
        type: "radio",
        options: [
          { value: "present", label: "Present" },
          { value: "absent", label: "Absent" },
        ],
      },
    ],
  });

  // Check if study is incomplete — if so, stop here
  const requiredSequences = ["t1w", "fluid_sensitive", "pre_contrast_t1fs", "post_contrast_t1fs"];
  const anyMissing = requiredSequences.some(s => data[`seq_${s}`] === "absent");
  if (anyMissing) {
    return steps; // MSKI-RADS 0 — incomplete
  }

  // All sequences must be answered to proceed
  const allSequencesAnswered = requiredSequences.every(s => data[`seq_${s}`] !== undefined);
  if (!allSequencesAnswered) return steps;

  // ── Additional Technique ──────────────────────────────────────────
  steps.push({
    id: "technique",
    title: "Additional Technique",
    description: "IV contrast and DWI status.",
    questions: [
      {
        id: "iv_contrast",
        label: "IV contrast administered?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No (contraindicated or not given)" },
        ],
      },
      {
        id: "dwi",
        label: "DWI performed?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
    ],
  });

  if (!data.iv_contrast || !data.dwi) return steps;

  // ── STEP 1: Clinical Context ──────────────────────────────────────
  steps.push({
    id: "clinical_context",
    title: "Clinical Context",
    description: "New presentation or known/treated infection?",
    tip: "63% of cases in the MSKI-RADS validation cohort involved the foot — diabetic foot osteomyelitis is the dominant clinical scenario.",
    questions: [
      {
        id: "presentation",
        label: "Clinical presentation",
        type: "radio",
        options: [
          { value: "new", label: "New presentation" },
          { value: "known_treated", label: "Known/previously diagnosed OM and/or SA currently under treatment" },
        ],
      },
    ],
  });

  if (!data.presentation) return steps;

  // ── Body region ───────────────────────────────────────────────────
  steps.push({
    id: "body_region",
    title: "Body Region",
    description: "Select the extremity and location.",
    questions: [
      {
        id: "extremity",
        label: "Extremity",
        type: "radio",
        options: [
          { value: "upper", label: "Upper extremity" },
          { value: "lower", label: "Lower extremity" },
        ],
      },
      {
        id: "body_region",
        label: "Specific region",
        type: "radio",
        options: data.extremity === "upper" ? BODY_REGIONS.upper : BODY_REGIONS.lower,
      },
    ],
  });

  if (!data.body_region) return steps;

  // ── Clinical details ──────────────────────────────────────────────
  steps.push({
    id: "clinical_details",
    title: "Clinical Details",
    description: "For report context (does not affect scoring).",
    questions: [
      {
        id: "diabetes",
        label: "Diabetes mellitus",
        type: "radio",
        options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
      },
      {
        id: "immunocompromised",
        label: "Immunocompromised",
        type: "radio",
        options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
      },
      {
        id: "skin_ulcer",
        label: "Skin ulcer present clinically",
        type: "radio",
        options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
      },
      {
        id: "prior_surgery",
        label: "Prior surgery or hardware at site",
        type: "radio",
        options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
      },
      {
        id: "symptom_duration",
        label: "Duration of symptoms",
        type: "radio",
        options: [
          { value: "acute", label: "Acute (< 2 weeks)" },
          { value: "subacute", label: "Subacute (2–6 weeks)" },
          { value: "chronic", label: "Chronic (> 6 weeks)" },
        ],
      },
    ],
  });

  // ── VI pathway ────────────────────────────────────────────────────
  if (data.presentation === "known_treated") {
    steps.push({
      id: "treatment_response",
      title: "Treatment Response Assessment",
      description: "Assess current MRI findings in context of known/treated OM or SA.",
      tip: "Category VI true-positive rate is 85%. When uncertain between VIa and VIb, default to VIb with follow-up imaging at 6–8 weeks. DWI may add confidence — persistent high DWI signal with low ADC favors persistent active infection.",
      questions: [
        {
          id: "treatment_response",
          label: "Treatment response",
          type: "radio",
          options: [
            { value: "no_residual", label: "VIa — No residual infection: No residual bone marrow signal changes, abscess, or active enhancement" },
            { value: "possible_persistent", label: "VIb — Possible persistent infection: Persistent but equivocal bone marrow signal changes or enhancement" },
            { value: "definite_persistent", label: "VIc — Definitely persistent or worsening: New/enlarging abscess, worsening marrow signal, new cortical destruction, or spread to new compartments" },
          ],
        },
      ],
    });
    return steps; // VI pathway complete
  }

  // ── NOS check ─────────────────────────────────────────────────────
  steps.push({
    id: "nos_check",
    title: "Infection vs Non-Infection",
    description: "Are the MRI findings suspicious for a noninfectious mimic?",
    tip: "Charcot neuroarthropathy is the most common and dangerous mimic of osteomyelitis in diabetic patients. When genuinely uncertain between NOS and MSKI-RADS IV/V, assign the higher-suspicion category and recommend multidisciplinary evaluation.",
    questions: [
      {
        id: "nos_pathway",
        label: "Noninfectious etiology suspected?",
        type: "radio",
        options: [
          { value: "no", label: "No — proceed with infection scoring" },
          { value: "yes", label: "Yes — NOS pathway (noninfectious mimic suspected)" },
        ],
      },
    ],
  });

  if (!data.nos_pathway) return steps;

  if (data.nos_pathway === "yes") {
    steps.push({
      id: "nos_entities",
      title: "NOS — Suspected Entities",
      description: "Select all suspected noninfectious diagnoses.",
      questions: [
        {
          id: "nos_entities",
          label: "Suspected entities",
          type: "checkbox",
          options: NOS_ENTITIES,
        },
      ],
    });
    return steps; // NOS pathway complete
  }

  // ── STEP 2a: No infection finding ─────────────────────────────────
  steps.push({
    id: "initial_assessment",
    title: "Initial Assessment",
    description: "Are there any infection-associated findings?",
    questions: [
      {
        id: "no_infection_finding",
        label: "Assessment",
        type: "radio",
        options: [
          { value: "yes", label: "Normal MRI or incidental bland subcutaneous edema only (no cutaneous/subcutaneous enhancement)" },
          { value: "no", label: "Infection-associated findings are present" },
        ],
      },
    ],
  });

  if (!data.no_infection_finding) return steps;
  if (data.no_infection_finding === "yes") return steps; // MSKI-RADS I

  // ── STEP 2b: Superficial findings ─────────────────────────────────
  steps.push({
    id: "superficial",
    title: "Superficial / Cutaneous-Subcutaneous",
    description: "Check all superficial findings that apply.",
    tip: "IV contrast is key — bland subcutaneous edema from non-infectious causes will NOT enhance. Cellulitis WILL show cutaneous-subcutaneous enhancement.",
    questions: [
      {
        id: "superficial_findings",
        label: "Superficial findings",
        type: "checkbox",
        options: [
          { value: "cellulitis", label: "Cutaneous-subcutaneous enhancement consistent with cellulitis" },
          { value: "skin_ulcer", label: "Skin ulceration" },
          { value: "sinus_tract", label: "Sinus tract (enhancing tract from skin surface)" },
          { value: "foreign_body", label: "Foreign body (susceptibility artifact or low-signal focus)" },
          { value: "cutaneous_abscess", label: "Cutaneous abscess (rim-enhancing fluid collection at/near skin surface)" },
          { value: "furuncle", label: "Furuncle / furunculosis" },
          { value: "superficial_gangrene", label: "Superficial gangrene (non-enhancing skin/superficial tissue)" },
        ],
      },
    ],
  });

  // ── STEP 2c: Deep soft tissue ─────────────────────────────────────
  steps.push({
    id: "deep_soft_tissue",
    title: "Deep Soft Tissue",
    description: "Subfascial, interfascial, intramuscular compartment findings.",
    questions: [
      {
        id: "deep_findings",
        label: "Deep soft tissue findings",
        type: "checkbox",
        options: [
          { value: "phlegmon", label: "Subfascial, interfascial, or intramuscular infection" },
          { value: "deep_abscess", label: "Deep soft-tissue abscess (rim-enhancing collection deep to fascia)" },
          { value: "nf", label: "Necrotizing fasciitis features" },
          { value: "myositis", label: "Myositis or pyomyositis" },
          { value: "devitalized", label: "Devitalized tissue (non-enhancing muscle/soft tissue)" },
          { value: "peritendinitis", label: "Infectious peritendinitis or paratenonitis" },
          { value: "tenosynovitis", label: "Infectious tenosynovitis" },
          { value: "bursitis", label: "Infectious bursitis" },
          { value: "fat_globules", label: "Fat globules (intramedullary or extramedullary)" },
        ],
      },
    ],
  });

  // ── NF criteria (if NF checked) ───────────────────────────────────
  const deepFindings = data.deep_findings || [];
  if (deepFindings.includes("nf")) {
    steps.push({
      id: "nf_criteria",
      title: "Necrotizing Fasciitis Criteria",
      description: "Select all NF criteria present. ≥ 2 criteria triggers NF alert.",
      tip: "NF is a clinical diagnosis. MRI findings are supportive. Absence of fascial enhancement is the most specific finding. CT fascial air is pathognomonic when present.",
      questions: [
        {
          id: "nf_criteria",
          label: "NF MRI criteria",
          type: "checkbox",
          options: NF_CRITERIA,
        },
      ],
    });
  }

  // ── STEP 3: Bone compartment ──────────────────────────────────────
  steps.push({
    id: "bone_signal",
    title: "Bone Compartment",
    description: "Are there any bone signal changes?",
    questions: [
      {
        id: "bone_signal",
        label: "Bone marrow signal",
        type: "radio",
        options: [
          { value: "no", label: "No bone signal abnormality" },
          { value: "yes", label: "Yes — bone signal changes present" },
        ],
      },
    ],
  });

  if (data.bone_signal !== "yes") return steps;

  // ── T1 marrow signal ──────────────────────────────────────────────
  steps.push({
    id: "t1_signal",
    title: "T1-Weighted Marrow Signal",
    description: "This is the single most important discriminator between categories IV and V.",
    tip: "Confluent hypointense T1 marrow signal has 95% sensitivity, 91% specificity, and 98% NPV for osteomyelitis. Category IV (edema only, no T1 change) has only a 37% true-positive rate. When in doubt between IV and V, default to IV with close follow-up.",
    questions: [
      {
        id: "t1_marrow_signal",
        label: "T1W marrow signal assessment",
        type: "radio",
        options: [
          { value: "normal", label: "Normal T1 fatty marrow signal preserved" },
          { value: "edema_only", label: "Edema-like signal only on fluid-sensitive sequences, with none or minimal cortical/subcortical T1 alteration → MSKI-RADS IV" },
          { value: "confluent_hypointensity", label: "Confluent T1 marrow hypointensity (replacement of bright fatty marrow by low signal) → MSKI-RADS V" },
        ],
      },
    ],
  });

  if (!data.t1_marrow_signal) return steps;

  // ── IV associated findings ────────────────────────────────────────
  if (data.t1_marrow_signal === "edema_only") {
    steps.push({
      id: "iv_associated",
      title: "MSKI-RADS IV — Associated Osseous Findings",
      description: "Select all associated findings in the IV (possible OM) category.",
      questions: [
        {
          id: "iv_associated",
          label: "Associated findings",
          type: "checkbox",
          options: [
            { value: "periostitis", label: "Periostitis (periosteal edema/thickening)" },
            { value: "periosteal_new_bone", label: "Periosteal new bone formation" },
            { value: "subperiosteal_abscess", label: "Subperiosteal abscess" },
            { value: "paraosseous_abscess", label: "Para-osseous abscess" },
            { value: "bone_exposure", label: "Bone exposure at ulcer" },
          ],
        },
      ],
    });
  }

  // ── V associated findings ─────────────────────────────────────────
  if (data.t1_marrow_signal === "confluent_hypointensity") {
    steps.push({
      id: "v_associated",
      title: "MSKI-RADS V — Associated Osseous Findings",
      description: "Select all findings supporting definite osteomyelitis.",
      questions: [
        {
          id: "v_associated",
          label: "Associated findings",
          type: "checkbox",
          options: [
            { value: "cortical_erosion", label: "Cortical erosion (focal cortical destruction on T1W)" },
            { value: "intraosseous_abscess", label: "Intraosseous abscess (rim-enhancing fluid within medullary cavity)" },
            { value: "paraosseous_abscess", label: "Para-osseous abscess" },
            { value: "osteonecrosis", label: "Osteonecrosis (non-enhancing bone ± T1 low signal)" },
            { value: "sequestrum", label: "Sequestrum (devitalized cortical bone — low signal, no enhancement)" },
            { value: "involucrum", label: "Involucrum (periosteal new bone surrounding sequestrum)" },
            { value: "cloaca", label: "Cloaca (cortical defect allowing pus drainage)" },
            { value: "bone_exposure", label: "Bone exposure at ulcer" },
            { value: "pathologic_fracture", label: "Pathologic fracture" },
          ],
        },
      ],
    });
  }

  // ── Joint involvement ─────────────────────────────────────────────
  steps.push({
    id: "joint_assessment",
    title: "Joint Involvement",
    description: "Are there findings suggesting septic arthritis?",
    tip: "Septic arthritis (Vb) requires thickened, enhancing synovium — joint effusion alone is non-specific. Vc (combined OM + SA) most commonly occurs in the foot at MTP joints in diabetic patients.",
    questions: [
      {
        id: "joint_findings",
        label: "Joint findings",
        type: "checkbox",
        options: [
          { value: "complex_effusion", label: "Complex joint effusion (heterogeneous, thick, or debris-containing)" },
          { value: "synovial_enhancement", label: "Synovial thickening and enhancement" },
          { value: "cartilage_erosion", label: "Articular cartilage erosions" },
          { value: "joint_space_loss", label: "Significant joint space loss" },
          { value: "none", label: "No joint involvement" },
        ],
      },
    ],
  });

  return steps;
}