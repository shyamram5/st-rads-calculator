// ═══════════════════════════════════════════════════════════════════════
// MSKI-RADS Rule Engine
// Based on: Chhabra et al., Radiology 2024;312(2):e232914
// Terminology: SSR White Paper, Alaia et al., Skeletal Radiol 2021
// ═══════════════════════════════════════════════════════════════════════

// ── Category definitions ──────────────────────────────────────────────

export const CATEGORIES = {
  "0": {
    label: "MSKI-RADS 0",
    name: "Incomplete Study",
    color: "bg-gray-200 dark:bg-gray-700",
    textColor: "text-gray-800 dark:text-gray-200",
    borderColor: "border-gray-300 dark:border-gray-600",
    risk: "N/A",
    management: "Recall for additional imaging — missing sequence, IV contrast-enhanced scan, CT for fascial air, US or SPECT-CT for MRI incompatibility.",
    truePositiveRate: null,
  },
  "I": {
    label: "MSKI-RADS I",
    name: "Negative for Infection",
    color: "bg-emerald-100 dark:bg-emerald-900/40",
    textColor: "text-emerald-800 dark:text-emerald-200",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    risk: "Very Low",
    management: "No imaging follow-up for infection.",
    truePositiveRate: "Combined I+NOS: 89% true-negative",
  },
  "II": {
    label: "MSKI-RADS II",
    name: "Superficial Soft-Tissue Infection",
    color: "bg-lime-100 dark:bg-lime-900/40",
    textColor: "text-lime-800 dark:text-lime-200",
    borderColor: "border-lime-300 dark:border-lime-700",
    risk: "Cellulitis",
    management: "Antibiotics ± anti-inflammatory drugs; follow-up per clinical team.",
    truePositiveRate: null,
  },
  "III": {
    label: "MSKI-RADS III",
    name: "Deeper Soft-Tissue Infection",
    color: "bg-yellow-100 dark:bg-yellow-900/40",
    textColor: "text-yellow-800 dark:text-yellow-200",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    risk: "Deep Infection",
    management: "Antibiotics; consider drainage/debridement consultation; clinical and/or MRI follow-up to resolution.",
    truePositiveRate: null,
  },
  "IV": {
    label: "MSKI-RADS IV",
    name: "Possible Osteomyelitis",
    color: "bg-orange-100 dark:bg-orange-900/40",
    textColor: "text-orange-800 dark:text-orange-200",
    borderColor: "border-orange-300 dark:border-orange-700",
    risk: "Possible OM",
    management: "Antibiotics; consider bone biopsy consultation; MRI follow-up per clinical team. True-positive rate: 37% — closest clinical and imaging monitoring required.",
    truePositiveRate: "37%",
  },
  "Va": {
    label: "MSKI-RADS Va",
    name: "Highly Suggestive of Osteomyelitis",
    color: "bg-red-100 dark:bg-red-900/40",
    textColor: "text-red-700 dark:text-red-200",
    borderColor: "border-red-300 dark:border-red-700",
    risk: "High — Osteomyelitis",
    management: "Antibiotics; bone biopsy or surgical intervention; culture/sensitivity; MRI follow-up 6–8 weeks post-treatment.",
    truePositiveRate: "73%",
  },
  "Vb": {
    label: "MSKI-RADS Vb",
    name: "Highly Suggestive of Septic Arthritis",
    color: "bg-red-100 dark:bg-red-900/40",
    textColor: "text-red-700 dark:text-red-200",
    borderColor: "border-red-300 dark:border-red-700",
    risk: "High — Septic Arthritis",
    management: "Antibiotics; consider joint wash-out; culture/sensitivity; MRI follow-up 6–8 weeks.",
    truePositiveRate: null,
  },
  "Vc": {
    label: "MSKI-RADS Vc",
    name: "OM and Septic Arthritis",
    color: "bg-red-200 dark:bg-red-900/60",
    textColor: "text-red-800 dark:text-red-100",
    borderColor: "border-red-400 dark:border-red-600",
    risk: "High — Both OM + SA",
    management: "Full intervention pathway for both osteomyelitis and septic arthritis. Antibiotics; bone biopsy/surgical intervention; joint wash-out; culture/sensitivity; MRI follow-up 6–8 weeks.",
    truePositiveRate: null,
  },
  "VIa": {
    label: "MSKI-RADS VIa",
    name: "Known OM/SA — No Residual Infection",
    color: "bg-emerald-100 dark:bg-emerald-900/40",
    textColor: "text-emerald-800 dark:text-emerald-200",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    risk: "Resolved",
    management: "No further infection follow-up imaging recommended.",
    truePositiveRate: null,
  },
  "VIb": {
    label: "MSKI-RADS VIb",
    name: "Known OM/SA — Possible Persistent Infection",
    color: "bg-orange-100 dark:bg-orange-900/40",
    textColor: "text-orange-800 dark:text-orange-200",
    borderColor: "border-orange-300 dark:border-orange-700",
    risk: "Equivocal",
    management: "Consider MRI follow-up 6–8 weeks after continued treatment.",
    truePositiveRate: "VI overall: 85%",
  },
  "VIc": {
    label: "MSKI-RADS VIc",
    name: "Definite Persistent/Worsening Infection",
    color: "bg-red-200 dark:bg-red-900/60",
    textColor: "text-red-800 dark:text-red-100",
    borderColor: "border-red-400 dark:border-red-600",
    risk: "Active Infection",
    management: "Continue or change antibiotic treatment (based on culture/sensitivity). Consider bone biopsy or surgical intervention, joint wash-out for SA, tissue debridement. MRI follow-up 6–8 weeks after treatment.",
    truePositiveRate: "VI overall: 85%",
  },
  "NOS": {
    label: "MSKI-RADS NOS",
    name: "Noninfectious Etiology Suspected",
    color: "bg-purple-100 dark:bg-purple-900/40",
    textColor: "text-purple-800 dark:text-purple-200",
    borderColor: "border-purple-300 dark:border-purple-700",
    risk: "Non-Infectious Mimic",
    management: "Consider rheumatology consultation. Follow-up imaging with radiography or MRI as per clinical evolution of findings.",
    truePositiveRate: "Combined I+NOS: 89% true-negative",
  },
};

// ── NOS entities ──────────────────────────────────────────────────────

export const NOS_ENTITIES = [
  { value: "charcot", label: "Charcot neuroarthropathy", tip: "Periarticular bone edema, joint destruction, fragmentation without primary soft-tissue infection signs; classic midfoot in diabetics" },
  { value: "gout", label: "Crystal arthropathy (gout)", tip: "Tophaceous deposits, erosions with sclerotic margins, periarticular; serum uric acid often elevated" },
  { value: "inflammatory", label: "Collagen vascular disease / inflammatory arthropathy", tip: "Symmetric periarticular involvement, synovial thickening, no cutaneous-subcutaneous enhancement of cellulitis" },
  { value: "raynaud", label: "Raynaud phenomenon–related bone edema" },
  { value: "stress", label: "Bone stress injury / insufficiency fracture", tip: "Linear T1 hypointensity with fluid-sensitive edema; no soft-tissue infection pattern" },
  { value: "infarct", label: "Bone infarct", tip: "Serpiginous T1 hypointense margins; no enhancement" },
  { value: "degenerative", label: "Subchondral cyst / degenerative change" },
  { value: "tumor", label: "Tumor / neoplasm", tip: "Consider when bone lesion is atypical for infection" },
];

// ── NF Criteria ───────────────────────────────────────────────────────

export const NF_CRITERIA = [
  { value: "fascia_thick", label: "Deep fascia thickening ≥ 3.0 mm with T2 hyperintensity extending through deep intermuscular fascia" },
  { value: "multicompartment", label: "Multicompartment involvement" },
  { value: "absent_enhancement", label: "Focal/diffuse absence of post-contrast enhancement along fascia and perifascial soft tissues (86% NF vs 26% non-NF)" },
  { value: "emphysema", label: "Low-signal foci on all sequences suggesting soft-tissue emphysema (< 50% of NF)" },
];

// ── Deprecated terminology ────────────────────────────────────────────

export const DEPRECATED_TERMS = {
  "phlegmon": "Subfascial/intramuscular infection",
  "reactive edema": "Bone marrow edema-like signal (MSKI-RADS IV)",
  "reactive osteitis": "Bone marrow edema-like signal (MSKI-RADS IV)",
  "early osteomyelitis": "Possible osteomyelitis (MSKI-RADS IV)",
  "cannot exclude om": "Possible OM — MSKI-RADS IV with management recommendation",
  "cannot exclude osteomyelitis": "Possible OM — MSKI-RADS IV with management recommendation",
  "osteitis": "Bone marrow edema-like signal without T1 changes",
};

// ── Charcot vs OM table ───────────────────────────────────────────────

export const CHARCOT_VS_OM = [
  { feature: "Distribution", charcot: "Midfoot > forefoot", om: "Forefoot > midfoot" },
  { feature: "Skin ulcer / sinus tract", charcot: "Absent", om: "Frequently present" },
  { feature: "Enhancing abscess", charcot: "Absent", om: "May be present" },
  { feature: "Bone fragmentation", charcot: "'Bag of bones' pattern", om: "Cortical erosion, sequestrum" },
  { feature: "Joint destruction", charcot: "Prominent, organized", om: "May involve adjacent joint (Vc)" },
  { feature: "Soft-tissue infection", charcot: "Minimal or absent", om: "Cellulitis, sinus tract common" },
  { feature: "T1 marrow signal", charcot: "Variable", om: "Confluent hypointensity" },
];

// ── BODY REGIONS ──────────────────────────────────────────────────────

export const BODY_REGIONS = {
  upper: [
    { value: "shoulder", label: "Shoulder" },
    { value: "humerus", label: "Humerus" },
    { value: "elbow", label: "Elbow" },
    { value: "wrist", label: "Wrist" },
    { value: "hand_fingers", label: "Hand / Fingers" },
  ],
  lower: [
    { value: "hip", label: "Hip" },
    { value: "femur", label: "Femur" },
    { value: "knee", label: "Knee" },
    { value: "tibia_fibula", label: "Tibia / Fibula" },
    { value: "ankle", label: "Ankle" },
    { value: "foot_toes", label: "Foot / Toes" },
  ],
};

// ── KEY STATISTICS ────────────────────────────────────────────────────

export const KEY_STATS = [
  { label: "Category IV True-Positive Rate", value: "37%" },
  { label: "Category V True-Positive Rate", value: "73%" },
  { label: "Category VI True-Positive Rate", value: "85%" },
  { label: "Combined I+NOS True-Negative", value: "89%" },
  { label: "Overall MSKI-RADS Accuracy", value: "65% vs 55% free-form (p < .001)" },
];


// ═══════════════════════════════════════════════════════════════════════
// SCORING ENGINE
// ═══════════════════════════════════════════════════════════════════════

export function calculateMSKIRADS(data) {
  const findings = [];
  const caveats = [];

  // ── STEP 0: Study completeness ────────────────────────────────────
  const requiredSequences = ["t1w", "fluid_sensitive", "pre_contrast_t1fs", "post_contrast_t1fs"];
  const missingSequences = requiredSequences.filter(s => data[`seq_${s}`] !== "present");

  if (missingSequences.length > 0) {
    const seqNames = {
      t1w: "T1W (non-fat-suppressed)",
      fluid_sensitive: "Fluid-sensitive fat-suppressed (T2 FS or STIR)",
      pre_contrast_t1fs: "Pre-contrast T1W fat-suppressed",
      post_contrast_t1fs: "Post-contrast T1W fat-suppressed",
    };
    missingSequences.forEach(s => findings.push(`Missing: ${seqNames[s]}`));
    return {
      category: "0",
      findings,
      caveats: ["Incomplete study — recall for additional imaging."],
      nfAlert: false,
      contrastNote: null,
      dwiNote: null,
    };
  }

  // Contrast note
  const contrastNote = data.iv_contrast === "no"
    ? "IV contrast not administered. Limits discrimination between categories I and II and reduces confidence in abscess characterization."
    : null;

  // DWI note
  const dwiNote = data.dwi === "yes"
    ? "DWI performed — assess for restricted diffusion to support abscess identification."
    : data.dwi === "no"
    ? "DWI not performed. Optional but recommended — increases confidence in abscess identification."
    : null;

  // ── STEP 1: Known/treated → VI pathway ────────────────────────────
  if (data.presentation === "known_treated") {
    const viResponse = data.treatment_response;
    let category = "VIb"; // default
    if (viResponse === "no_residual") category = "VIa";
    else if (viResponse === "possible_persistent") category = "VIb";
    else if (viResponse === "definite_persistent") category = "VIc";

    if (viResponse === "no_residual") findings.push("No residual bone marrow signal changes, abscess, or active enhancement suggesting infection");
    if (viResponse === "possible_persistent") findings.push("Persistent but equivocal bone marrow signal changes or enhancement");
    if (viResponse === "definite_persistent") findings.push("Definite signs of ongoing or worsening infection");

    return { category, findings, caveats, contrastNote, dwiNote, nfAlert: false };
  }

  // ── NOS pathway ───────────────────────────────────────────────────
  if (data.nos_pathway === "yes") {
    const nosEntities = data.nos_entities || [];
    nosEntities.forEach(e => {
      const ent = NOS_ENTITIES.find(n => n.value === e);
      if (ent) findings.push(ent.label);
    });
    if (data.nos_note) findings.push(`Note: ${data.nos_note}`);
    return { category: "NOS", findings, caveats, contrastNote, dwiNote, nfAlert: false };
  }

  // ── Escalating severity: highest finding wins ─────────────────────
  let maxCategory = "I"; // default negative
  const categoryOrder = ["I", "II", "III", "IV", "Va", "Vb", "Vc"];

  const isHigherCategory = (a, b) => categoryOrder.indexOf(a) > categoryOrder.indexOf(b);

  // ── STEP 2a: No findings ──────────────────────────────────────────
  if (data.no_infection_finding === "yes") {
    findings.push("Normal MRI or incidental bland subcutaneous soft-tissue edema only");
    return { category: "I", findings, caveats, contrastNote, dwiNote, nfAlert: false };
  }

  // ── STEP 2b: Superficial findings ─────────────────────────────────
  const superficialFindings = data.superficial_findings || [];
  if (superficialFindings.length > 0) {
    maxCategory = "II";
    const sfLabels = {
      cellulitis: "Cutaneous-subcutaneous enhancement consistent with cellulitis",
      skin_ulcer: "Skin ulceration",
      sinus_tract: "Sinus tract (enhancing tract from skin surface)",
      foreign_body: "Foreign body",
      cutaneous_abscess: "Cutaneous abscess (rim-enhancing fluid collection)",
      furuncle: "Furuncle / furunculosis",
      superficial_gangrene: "Superficial gangrene (non-enhancing skin/superficial tissue)",
    };
    superficialFindings.forEach(f => {
      if (sfLabels[f]) findings.push(sfLabels[f]);
    });
  }

  // ── STEP 2c: Deep soft tissue ─────────────────────────────────────
  const deepFindings = data.deep_findings || [];
  if (deepFindings.length > 0) {
    if (isHigherCategory("III", maxCategory)) maxCategory = "III";
    const dfLabels = {
      phlegmon: "Subfascial, interfascial, or intramuscular infection/phlegmon",
      deep_abscess: "Deep soft-tissue abscess (rim-enhancing collection deep to fascia)",
      nf: "Necrotizing fasciitis features",
      myositis: "Myositis or pyomyositis",
      devitalized: "Devitalized tissue (non-enhancing muscle/soft tissue)",
      peritendinitis: "Infectious peritendinitis or paratenonitis",
      tenosynovitis: "Infectious tenosynovitis (enhancing fluid in tendon sheath)",
      bursitis: "Infectious bursitis (enhancing bursal fluid)",
      fat_globules: "Fat globules (intramedullary or extramedullary)",
    };
    deepFindings.forEach(f => {
      if (dfLabels[f]) findings.push(dfLabels[f]);
    });
  }

  // ── NF alert ──────────────────────────────────────────────────────
  const nfCriteria = data.nf_criteria || [];
  const nfAlert = nfCriteria.length >= 2;

  // ── STEP 3: Bone compartment ──────────────────────────────────────
  if (data.bone_signal === "yes") {
    const t1Signal = data.t1_marrow_signal;

    if (t1Signal === "edema_only") {
      // IV territory
      if (isHigherCategory("IV", maxCategory)) maxCategory = "IV";
      findings.push("Bone marrow edema-like signal on fluid-sensitive sequences WITHOUT confluent T1 marrow hypointensity");

      // IV associated findings
      const ivFindings = data.iv_associated || [];
      const ivLabels = {
        periostitis: "Periostitis",
        periosteal_new_bone: "Periosteal new bone formation",
        subperiosteal_abscess: "Subperiosteal abscess",
        paraosseous_abscess: "Para-osseous abscess",
        bone_exposure: "Bone exposure at ulcer",
      };
      ivFindings.forEach(f => { if (ivLabels[f]) findings.push(ivLabels[f]); });
    }

    if (t1Signal === "confluent_hypointensity") {
      // V territory
      findings.push("Confluent T1 marrow hypointensity (replacement of normal fatty marrow signal)");

      // V associated findings
      const vFindings = data.v_associated || [];
      const vLabels = {
        cortical_erosion: "Cortical erosion",
        intraosseous_abscess: "Intraosseous abscess",
        paraosseous_abscess: "Para-osseous abscess",
        osteonecrosis: "Osteonecrosis",
        sequestrum: "Sequestrum",
        involucrum: "Involucrum",
        cloaca: "Cloaca",
        bone_exposure: "Bone exposure at ulcer",
        pathologic_fracture: "Pathologic fracture",
      };
      vFindings.forEach(f => { if (vLabels[f]) findings.push(vLabels[f]); });

      // ── Joint assessment for Va/Vb/Vc ─────────────────────────────
      const jointFindings = data.joint_findings || [];
      const hasJointInvolvement = jointFindings.length > 0 && !jointFindings.includes("none");

      const jLabels = {
        complex_effusion: "Complex joint effusion",
        synovial_enhancement: "Synovial thickening and enhancement",
        cartilage_erosion: "Articular cartilage erosions",
        joint_space_loss: "Significant joint space loss",
      };
      jointFindings.forEach(f => { if (jLabels[f]) findings.push(jLabels[f]); });

      if (hasJointInvolvement) {
        // Both OM + SA = Vc
        maxCategory = "Vc";
      } else {
        // OM only = Va
        if (isHigherCategory("Va", maxCategory)) maxCategory = "Va";
      }
    }

    if (t1Signal === "normal") {
      findings.push("Normal T1 fatty marrow signal preserved");
      // Don't escalate bone — stay at soft tissue category
    }
  }

  // ── Special: Septic arthritis without OM (Vb) ────────────────────
  if (data.bone_signal === "no" || data.t1_marrow_signal === "normal" || data.t1_marrow_signal === "edema_only") {
    const jointFindings = data.joint_findings || [];
    const hasJointInvolvement = jointFindings.length > 0 && !jointFindings.includes("none");
    if (hasJointInvolvement && data.t1_marrow_signal !== "confluent_hypointensity") {
      // SA without definitive OM
      const jLabels = {
        complex_effusion: "Complex joint effusion",
        synovial_enhancement: "Synovial thickening and enhancement",
        cartilage_erosion: "Articular cartilage erosions",
        joint_space_loss: "Significant joint space loss",
      };
      jointFindings.forEach(f => {
        if (jLabels[f] && !findings.includes(jLabels[f])) findings.push(jLabels[f]);
      });

      // Vb if SA without OM, but check if IV is also present
      if (data.t1_marrow_signal === "edema_only") {
        // IV + SA → still Vb? Actually per the spec, Vb is "without definitive OM"
        // and IV is "possible OM" not "definitive". So Vb applies.
        // But the override rule says highest category wins.
        // Vb > IV in severity, so use Vb.
        if (isHigherCategory("Vb", maxCategory)) maxCategory = "Vb";
      } else {
        if (isHigherCategory("Vb", maxCategory)) maxCategory = "Vb";
      }
    }
  }

  // ── Override: if Vc was set for confluent + joint, keep it ────────
  // Already handled above.

  // ── Caveats ───────────────────────────────────────────────────────
  if (contrastNote) caveats.push(contrastNote);
  if (maxCategory === "IV") {
    caveats.push("Category IV true-positive rate is 37%. Close clinical and imaging follow-up is essential.");
  }

  return {
    category: maxCategory,
    findings,
    caveats,
    contrastNote,
    dwiNote,
    nfAlert,
    nfCriteriaCount: nfCriteria.length,
  };
}

// ── Structured report generator ───────────────────────────────────────

export function generateStructuredReport(data, result) {
  const cat = CATEGORIES[result.category];
  const lines = [];

  lines.push("MSKI-RADS STRUCTURED REPORT");
  lines.push("═══════════════════════════════════════");
  lines.push("");

  // Clinical context
  if (data.body_region) {
    const regionLabel = [...BODY_REGIONS.upper, ...BODY_REGIONS.lower].find(r => r.value === data.body_region)?.label || data.body_region;
    lines.push(`CLINICAL INFORMATION:`);
    lines.push(`Region: ${regionLabel}`);
    if (data.diabetes === "yes") lines.push("- Diabetes mellitus");
    if (data.immunocompromised === "yes") lines.push("- Immunocompromised");
    if (data.skin_ulcer === "yes") lines.push("- Skin ulcer present clinically");
    if (data.prior_surgery === "yes") lines.push("- Prior surgery or hardware at site");
    if (data.symptom_duration) {
      const durLabels = { acute: "Acute (< 2 weeks)", subacute: "Subacute (2–6 weeks)", chronic: "Chronic (> 6 weeks)" };
      lines.push(`- Duration: ${durLabels[data.symptom_duration] || data.symptom_duration}`);
    }
    lines.push("");
  }

  // Technique
  lines.push("TECHNIQUE:");
  lines.push("MRI of the extremity performed with:");
  lines.push("- T1-weighted imaging (non-fat-suppressed)");
  lines.push("- Fluid-sensitive fat-suppressed imaging");
  lines.push("- Pre-contrast T1-weighted fat-suppressed imaging");
  lines.push("- Post-contrast T1-weighted fat-suppressed imaging");
  if (data.iv_contrast === "no") lines.push("- IV contrast NOT administered");
  if (data.dwi === "yes") lines.push("- Diffusion-weighted imaging (DWI) performed");
  lines.push("");

  // Findings
  lines.push("FINDINGS:");
  result.findings.forEach(f => {
    lines.push(`- ${f}`);
  });
  lines.push("");

  // NF alert
  if (result.nfAlert) {
    lines.push("*** NECROTIZING FASCIITIS FEATURES PRESENT ***");
    lines.push("Urgent surgical consultation recommended.");
    lines.push("");
  }

  // Impression
  lines.push("IMPRESSION:");
  lines.push(`${cat.label}: ${cat.name}`);
  lines.push("");
  lines.push("RECOMMENDATION:");
  lines.push(cat.management);
  if (cat.truePositiveRate) {
    lines.push(`(True-positive rate: ${cat.truePositiveRate})`);
  }
  lines.push("");

  // Caveats
  if (result.caveats.length > 0) {
    lines.push("CAVEATS:");
    result.caveats.forEach(c => lines.push(`- ${c}`));
    lines.push("");
  }

  if (result.dwiNote) {
    lines.push(`DWI: ${result.dwiNote}`);
    lines.push("");
  }

  lines.push("───────────────────────────────────────");
  lines.push("Classification per MSKI-RADS (Chhabra et al., Radiology 2024)");
  lines.push("Terminology per SSR White Paper (Alaia et al., Skeletal Radiol 2021)");

  return lines.join("\n");
}