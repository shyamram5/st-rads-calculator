/**
 * BI-RADS® 5th Edition (2013) Rule Engine
 * Clinical-grade deterministic scoring for mammography and ultrasound.
 */

// ═══════════════════════════════════════════════════════
// CATEGORY DEFINITIONS
// ═══════════════════════════════════════════════════════
export const BIRADS_CATEGORIES = {
  "0": {
    label: "BI-RADS 0",
    name: "Incomplete — Need Additional Imaging Evaluation",
    phrase: "Need additional imaging evaluation and/or prior mammograms for comparison.",
    color: "from-slate-400 to-slate-500",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    risk: "N/A",
    management: "Recall for additional imaging (spot compression, magnification views, ultrasound, or prior comparisons). Assign a final assessment after workup is complete.",
    dos: [
      "Use when additional imaging is needed to render a final assessment",
      "Use when prior comparisons are required and not yet available",
      "Use for screening callbacks that need diagnostic workup"
    ],
    donts: [
      "Do NOT use if priors are simply unavailable but not needed to render a final assessment",
      "Do NOT use when findings are already clearly suspicious — assign BI-RADS 4 or 5 and recommend biopsy",
      "Do NOT use BI-RADS 0 on ultrasound performed as part of the same diagnostic workup"
    ]
  },
  "1": {
    label: "BI-RADS 1",
    name: "Negative",
    phrase: "Negative. No mammographic/sonographic finding to report. Routine screening recommended.",
    color: "from-green-500 to-emerald-500",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    risk: "Essentially 0%",
    management: "Routine annual screening mammography. No additional workup needed.",
    dos: [
      "Use when imaging is entirely normal — symmetric, no mass, no distortion, no suspicious calcifications",
      "May still be used if a patient has a palpable finding but imaging is negative — add a sentence recommending clinical correlation or surgical consultation"
    ],
    donts: [
      "Do NOT use if any finding is described in the report — use BI-RADS 2 instead",
      "Do NOT use if additional imaging is still needed — use BI-RADS 0"
    ]
  },
  "2": {
    label: "BI-RADS 2",
    name: "Benign",
    phrase: "Benign finding(s). Routine screening recommended.",
    color: "from-lime-500 to-green-500",
    badgeColor: "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
    risk: "Essentially 0%",
    management: "Routine annual screening mammography. No additional workup needed.",
    dos: [
      "Use when a finding is present but definitively benign (involuting fibroadenoma, vascular calcifications, intramammary lymph node, implants, fat-containing lesions, simple cyst, post-surgical scar)",
      "Use after attempted excision with positive margins but no imaging correlate of residual disease"
    ],
    donts: [
      "Do NOT recommend MRI to evaluate a benign finding",
      "Do NOT use if you see a benign finding but choose not to describe it — use BI-RADS 1 instead",
      "Do NOT use for complicated cysts — those are BI-RADS 3"
    ]
  },
  "3": {
    label: "BI-RADS 3",
    name: "Probably Benign",
    phrase: "Probably benign. Short-interval follow-up recommended.",
    color: "from-yellow-400 to-amber-500",
    badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    risk: "< 2%",
    management: "Short-interval follow-up: unilateral mammogram at 6 months → bilateral at 12 months → follow-up at 24 months. If stable at 24 months, upgrade to BI-RADS 2. If lesion increases ≥ 20% in longest dimension on US, upgrade to BI-RADS 4.",
    dos: [
      "Use for non-calcified circumscribed solid mass on baseline exam (unless proven cyst/lymph node)",
      "Use for focal asymmetry that becomes less dense on spot compression",
      "Use for solitary group of punctate calcifications",
      "Use for typical fibroadenoma on US, isolated complicated cyst, or clustered microcysts",
      "If patient/clinician prefer biopsy, add: 'Tissue diagnosis will be performed due to patient/referring clinician concern'"
    ],
    donts: [
      "Do NOT use BI-RADS 3 in a screening exam — it is a diagnostic assessment only",
      "Do NOT use if additional imaging is still needed — complete workup first",
      "You CANNOT recommend MRI to further evaluate a probably benign finding",
      "Do NOT use for a finding with any suspicious feature — use BI-RADS 4"
    ]
  },
  "4A": {
    label: "BI-RADS 4A",
    name: "Suspicious — Low Suspicion for Malignancy",
    phrase: "Suspicious. Low suspicion for malignancy. Tissue sampling recommended.",
    color: "from-orange-300 to-orange-400",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    risk: "~2–10% PPV",
    management: "Tissue sampling (percutaneous biopsy) recommended. A benign concordant result is expected and appropriate at this level of suspicion.",
    dos: [
      "Use for partially circumscribed solid mass suggestive of fibroadenoma or atypical fibroadenoma",
      "Use for palpable solitary complex cystic-and-solid mass",
      "Use for probable abscess",
      "Use for amorphous calcifications in a grouped distribution"
    ],
    donts: [
      "Do NOT use if features are clearly benign — use BI-RADS 2 or 3",
      "Do NOT skip subcategorization — it informs shared decision-making"
    ]
  },
  "4B": {
    label: "BI-RADS 4B",
    name: "Suspicious — Moderate Suspicion for Malignancy",
    phrase: "Suspicious. Moderate suspicion for malignancy. Tissue sampling recommended.",
    color: "from-orange-400 to-orange-500",
    badgeColor: "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    risk: "~10–50% PPV",
    management: "Tissue sampling (percutaneous biopsy) recommended. A benign result requires close radiologic–pathologic correlation.",
    dos: [
      "Use for group of amorphous or fine pleomorphic calcifications",
      "Use for nondescript solid mass with indistinct margins",
      "Use for coarse heterogeneous calcifications"
    ],
    donts: [
      "Do NOT underestimate indistinct margins — they carry moderate suspicion",
      "A benign pathology result at 4B requires careful radiologic–pathologic concordance assessment"
    ]
  },
  "4C": {
    label: "BI-RADS 4C",
    name: "Suspicious — High Suspicion for Malignancy",
    phrase: "Suspicious. High suspicion for malignancy. Tissue sampling strongly recommended.",
    color: "from-orange-500 to-red-500",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    risk: "~50–95% PPV",
    management: "Tissue sampling (percutaneous biopsy) strongly recommended. A benign pathology result at this level of suspicion is DISCORDANT and requires re-evaluation (repeat biopsy or excision).",
    dos: [
      "Use for new group of fine linear calcifications",
      "Use for new indistinct irregular solid mass",
      "Use for fine linear/branching calcifications in grouped or regional distribution",
      "Use for a single highly suspicious feature (e.g., spiculated margin alone)"
    ],
    donts: [
      "Do NOT assign BI-RADS 5 for a single suspicious feature — use 4C instead",
      "A benign biopsy result at 4C is automatically discordant — do not dismiss it"
    ]
  },
  "5": {
    label: "BI-RADS 5",
    name: "Highly Suggestive of Malignancy",
    phrase: "Highly suggestive of malignancy. Tissue sampling required. Non-malignant result is automatically discordant.",
    color: "from-red-600 to-red-700",
    badgeColor: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
    risk: "> 95% PPV",
    management: "Tissue sampling required. Any non-malignant percutaneous tissue diagnosis is automatically discordant and requires surgical excision or repeat biopsy. One-step treatment is appropriate if supported by clinical/imaging findings.",
    dos: [
      "Use for spiculated, irregular, HIGH-density mass",
      "Use for fine linear calcifications in segmental or linear distribution",
      "Use for irregular spiculated mass WITH associated pleomorphic calcifications",
      "Requires a COMBINATION of highly suspicious features — not a single feature alone"
    ],
    donts: [
      "Do NOT assign BI-RADS 5 for a single suspicious feature alone (e.g., spiculation alone = 4C, not 5)",
      "Do NOT delay biopsy — any non-malignant result is discordant by definition"
    ]
  },
  "6": {
    label: "BI-RADS 6",
    name: "Known Biopsy-Proven Malignancy",
    phrase: "Known biopsy-proven malignancy. Imaging performed for treatment planning/monitoring.",
    color: "from-red-800 to-red-900",
    badgeColor: "bg-red-300 text-red-900 dark:bg-red-950 dark:text-red-200",
    risk: "Known malignancy",
    management: "Continue treatment per multidisciplinary team. Used for imaging during neoadjuvant therapy or after incomplete excision with known residual tumor on imaging.",
    dos: [
      "Use for imaging performed during neoadjuvant chemotherapy to assess response",
      "Use after incomplete excision with imaging correlate of residual tumor"
    ],
    donts: [
      "Do NOT use after attempted excision with positive margins but NO imaging correlate — use BI-RADS 2 and state absence of mammographic correlate",
      "Do NOT use if additional suspicious findings are present beyond the known cancer — assign those separately as BI-RADS 4 or 5"
    ]
  }
};

// ═══════════════════════════════════════════════════════
// MAMMOGRAPHY OPTIONS
// ═══════════════════════════════════════════════════════
export const MAMMO_COMPOSITION = [
  { value: "a", label: "(a) Almost entirely fatty", tip: "Mammography is highly sensitive in fatty breasts." },
  { value: "b", label: "(b) Scattered areas of fibroglandular density", tip: "Some dense tissue but mammography still performs well." },
  { value: "c", label: "(c) Heterogeneously dense", tip: "May obscure small masses. BI-RADS 2013 discourages density percentages — category c applies when fibroglandular tissue is sufficiently dense to obscure small masses." },
  { value: "d", label: "(d) Extremely dense", tip: "Lowers sensitivity of mammography. Consider supplemental screening (US or MRI) in high-risk patients." },
];

export const MAMMO_FINDING_TYPES = [
  { value: "mass", label: "Mass" },
  { value: "architectural_distortion", label: "Architectural Distortion" },
  { value: "asymmetry", label: "Asymmetry" },
  { value: "calcifications", label: "Calcifications" },
  { value: "no_finding", label: "No significant finding" },
  { value: "known_malignancy", label: "Known biopsy-proven malignancy (monitoring)" },
];

export const MASS_SHAPE = [
  { value: "oval", label: "Oval (including 2–3 gentle lobulations)", tip: "Oval = benign feature. Includes up to 2–3 gentle lobulations." },
  { value: "round", label: "Round", tip: "Round shape is non-specific — less suspicious than irregular but less reassuring than oval." },
  { value: "irregular", label: "Irregular", tip: "Irregular shape = suspicious. Highly associated with malignancy." },
];

export const MASS_MARGIN = [
  { value: "circumscribed", label: "Circumscribed", tip: "Sharply defined, abrupt transition to surrounding tissue — a benign feature." },
  { value: "obscured", label: "Obscured", tip: "Margin hidden by overlying tissue. Not inherently suspicious but needs further evaluation." },
  { value: "microlobulated", label: "Microlobulated", tip: "Small undulations along the margin — suspicious for malignancy." },
  { value: "indistinct", label: "Indistinct", tip: "Poor definition due to infiltration — suspicious for malignancy." },
  { value: "spiculated", label: "Spiculated", tip: "Radiating lines from the mass — classic for invasive carcinoma. Do NOT use BI-RADS 5 for spiculation alone without other high-suspicion features." },
];

export const MASS_DENSITY = [
  { value: "high", label: "High density", tip: "Higher attenuation than expected — associated with malignancy." },
  { value: "equal", label: "Equal density", tip: "Same attenuation as fibroglandular tissue — non-specific." },
  { value: "low", label: "Low density", tip: "Lower attenuation — extremely rare for breast cancer to be low density." },
  { value: "fat_containing", label: "Fat-containing", tip: "Contains fat (hamartoma, lipoma, oil cyst, galactocele) — typically benign." },
];

export const MAMMO_ASSOCIATED_FEATURES = [
  { value: "skin_thickening", label: "Skin thickening" },
  { value: "skin_retraction", label: "Skin retraction / nipple retraction" },
  { value: "trabecular_thickening", label: "Trabecular thickening" },
  { value: "associated_calcs", label: "Associated calcifications" },
  { value: "architectural_distortion_assoc", label: "Architectural distortion" },
  { value: "axillary_adenopathy", label: "Axillary adenopathy" },
  { value: "none", label: "None" },
];

export const ASYMMETRY_TYPES = [
  { value: "single_projection", label: "Asymmetry (single projection only)", tip: "Likely superimposition — usually not a true finding. Often dismissed after additional views." },
  { value: "focal", label: "Focal asymmetry (visible on two views)", tip: "Real finding — must differentiate from a mass. Concave outward borders, interspersed with fat." },
  { value: "global", label: "Global asymmetry (≥ one quarter of breast)", tip: "Usually a normal variant, but check for associated features." },
  { value: "developing", label: "Developing asymmetry (new/larger/more conspicuous vs. prior)", tip: "Most suspicious type of asymmetry — new, larger, or more conspicuous compared to prior exams." },
];

export const CALC_MORPHOLOGY = [
  { value: "typically_benign", label: "Typically benign (skin, vascular, coarse popcorn, large rod-like, round/punctate >1mm, rim/eggshell, dystrophic, milk of calcium, suture)", tip: "Generally BI-RADS 2 unless isolated new/increasing group or adjacent to known cancer." },
  { value: "amorphous", label: "Amorphous (so small/hazy that shape cannot be determined)", tip: "Suspicious morphology — signals BI-RADS 4B." },
  { value: "coarse_heterogeneous", label: "Coarse heterogeneous (irregular, 0.5–1mm, tend to coalesce)", tip: "Suspicious morphology — signals BI-RADS 4B." },
  { value: "fine_pleomorphic", label: "Fine pleomorphic (discrete shapes, no linear/branching, usually <0.5mm)", tip: "Suspicious morphology — signals BI-RADS 4B." },
  { value: "fine_linear", label: "Fine linear or fine-linear branching (thin, irregular, may be discontinuous, <0.5mm)", tip: "Highly suspicious morphology — signals BI-RADS 4C. Suggests DCIS or invasive cancer." },
];

export const CALC_DISTRIBUTION = [
  { value: "diffuse", label: "Diffuse (random throughout breast)", tip: "Less suspicious — scattered throughout, less likely focal neoplasm." },
  { value: "regional", label: "Regional (large volume >2cm, not following a duct)", tip: "Intermediate suspicion." },
  { value: "grouped", label: "Grouped / Clustered (≥5 calcifications within 1cm, or larger number within 2cm)", tip: "Intermediate suspicion — the most common distribution for DCIS." },
  { value: "linear", label: "Linear (arranged in a line — suggests duct)", tip: "More suspicious — suggests intraductal process." },
  { value: "segmental", label: "Segmental (duct and branches — most suspicious distribution)", tip: "Most suspicious distribution — strongly suggests DCIS or invasive cancer following a ductal segment." },
];

// ═══════════════════════════════════════════════════════
// ULTRASOUND OPTIONS
// ═══════════════════════════════════════════════════════
export const US_ECHOTEXTURE = [
  { value: "fat", label: "Homogeneous — fat" },
  { value: "fibroglandular", label: "Homogeneous — fibroglandular" },
  { value: "heterogeneous", label: "Heterogeneous" },
];

export const US_FINDING_TYPES = [
  { value: "mass", label: "Mass (solid, cystic, or complex)" },
  { value: "calcifications", label: "Calcifications (echogenic foci)" },
  { value: "architectural_distortion", label: "Architectural distortion" },
  { value: "special_case", label: "Special case" },
  { value: "no_finding", label: "No significant finding" },
];

export const US_MASS_SHAPE = [
  { value: "oval", label: "Oval", tip: "Benign morphology — ellipsoidal, may include 2–3 gentle lobulations." },
  { value: "round", label: "Round", tip: "Non-specific shape." },
  { value: "irregular", label: "Irregular", tip: "Suspicious for malignancy — shape is neither round nor oval." },
];

export const US_ORIENTATION = [
  { value: "parallel", label: "Parallel (wider than tall)", tip: "Benign orientation — wider-than-tall or parallel to skin." },
  { value: "not_parallel", label: "Not parallel / Anti-parallel (taller than wide)", tip: "Suspicious — taller-than-wide orientation is associated with malignancy. Unique to ultrasound." },
];

export const US_MARGIN = [
  { value: "circumscribed", label: "Circumscribed", tip: "Sharply defined — benign feature." },
  { value: "not_circumscribed", label: "Not circumscribed (indistinct, angular, microlobulated, or spiculated)", tip: "Suspicious — includes indistinct, angular, microlobulated, and spiculated margins." },
];

export const US_ECHO_PATTERN = [
  { value: "anechoic", label: "Anechoic", tip: "No internal echoes — characteristic of simple cysts." },
  { value: "hypoechoic", label: "Hypoechoic", tip: "Lower echogenicity than fat — most solid masses are hypoechoic." },
  { value: "isoechoic", label: "Isoechoic", tip: "Same echogenicity as fat — may be difficult to identify." },
  { value: "hyperechoic", label: "Hyperechoic", tip: "Higher echogenicity than fat — uncommon for malignancy." },
  { value: "heterogeneous", label: "Heterogeneous", tip: "Mixed echo pattern — may represent mixed solid/necrotic components." },
  { value: "complex", label: "Complex cystic and solid", tip: "Both cystic and solid components — requires biopsy unless clearly benign etiology." },
];

export const US_POSTERIOR = [
  { value: "none", label: "No posterior features", tip: "Non-specific." },
  { value: "enhancement", label: "Enhancement (posterior)", tip: "Typical of cysts and some solid lesions — not inherently suspicious." },
  { value: "shadowing", label: "Shadowing", tip: "May indicate dense fibrosis or malignancy — context dependent." },
  { value: "combined", label: "Combined pattern", tip: "Mixed posterior features." },
];

export const US_ASSOCIATED_FEATURES = [
  { value: "architectural_distortion", label: "Architectural distortion" },
  { value: "duct_changes", label: "Duct changes" },
  { value: "skin_thickening", label: "Skin thickening / skin changes" },
  { value: "edema", label: "Edema" },
  { value: "vascularity", label: "Vascularity (increased)" },
  { value: "elasticity", label: "Elasticity abnormality" },
  { value: "none", label: "None" },
];

export const US_SPECIAL_CASES = [
  { value: "simple_cyst", label: "Simple cyst", tip: "Anechoic, circumscribed, posterior enhancement, no internal echoes. → BI-RADS 2", category: "2" },
  { value: "complicated_cyst", label: "Complicated cyst (homogeneous low-level internal echoes)", tip: "Isolated complicated cyst → BI-RADS 3", category: "3" },
  { value: "clustered_microcysts", label: "Clustered microcysts", tip: "→ BI-RADS 3", category: "3" },
  { value: "intramammary_ln", label: "Intramammary lymph node (reniform, hyperechoic hilum)", tip: "→ BI-RADS 2", category: "2" },
  { value: "fat_necrosis", label: "Fat necrosis", tip: "→ BI-RADS 2", category: "2" },
  { value: "postsurgical_fluid", label: "Post-surgical fluid collection", tip: "→ BI-RADS 2", category: "2" },
];

// ═══════════════════════════════════════════════════════
// SCORING ENGINE — MAMMOGRAPHY
// ═══════════════════════════════════════════════════════
export function scoreMammography(data) {
  const { findingType, massShape, massMargin, massDensity, associatedFeatures = [],
    asymmetryType, asymmetryAssociatedFeatures,
    calcMorphology, calcDistribution, calcBenignException,
    distortionPriorScar } = data;

  // No finding
  if (findingType === "no_finding") return "1";

  // Known malignancy
  if (findingType === "known_malignancy") return "6";

  // ── MASS ──
  if (findingType === "mass") {
    return scoreMammoMass(massShape, massMargin, massDensity, associatedFeatures);
  }

  // ── ARCHITECTURAL DISTORTION ──
  if (findingType === "architectural_distortion") {
    if (distortionPriorScar === "yes") return "2"; // Known surgical scar
    // No prior scar or unknown — suspicious
    return "4B";
  }

  // ── ASYMMETRY ──
  if (findingType === "asymmetry") {
    return scoreAsymmetry(asymmetryType, asymmetryAssociatedFeatures);
  }

  // ── CALCIFICATIONS ──
  if (findingType === "calcifications") {
    return scoreCalcifications(calcMorphology, calcDistribution, calcBenignException);
  }

  return "0";
}

function scoreMammoMass(shape, margin, density, associatedFeatures) {
  // Fat-containing → benign
  if (density === "fat_containing") return "2";

  const hasAssociatedFeatures = associatedFeatures.length > 0 && !associatedFeatures.includes("none");
  const hasSuspiciousAssociated = associatedFeatures.some(f =>
    ["skin_retraction", "trabecular_thickening", "axillary_adenopathy"].includes(f)
  );

  // Count suspicious features for BI-RADS 5 determination
  const suspiciousFeatureCount = [
    shape === "irregular",
    ["spiculated", "indistinct", "microlobulated"].includes(margin),
    density === "high",
    associatedFeatures.includes("associated_calcs"),
    hasSuspiciousAssociated,
  ].filter(Boolean).length;

  // BI-RADS 5: combination of multiple highly suspicious features
  // Spiculated + irregular + high density = classic BI-RADS 5
  // Irregular mass + associated pleomorphic calcs = BI-RADS 5
  if (shape === "irregular" && margin === "spiculated" && density === "high") return "5";
  if (shape === "irregular" && margin === "spiculated" && associatedFeatures.includes("associated_calcs")) return "5";
  if (shape === "irregular" && density === "high" && margin === "spiculated") return "5";
  // 3+ suspicious features = BI-RADS 5
  if (suspiciousFeatureCount >= 3 && margin === "spiculated") return "5";

  // BI-RADS 4C: single highly suspicious feature
  if (margin === "spiculated") return "4C";
  if (shape === "irregular" && margin === "indistinct") return "4C";
  if (shape === "irregular" && density === "high") return "4C";

  // BI-RADS 4B: moderately suspicious
  if (margin === "indistinct") return "4B";
  if (margin === "microlobulated") return "4B";
  if (shape === "irregular" && margin === "obscured") return "4B";
  if (shape === "irregular") return "4B";

  // BI-RADS 4A: low suspicion
  if (margin === "obscured" && shape !== "oval") return "4A";
  if (shape === "round" && density === "high") return "4A";
  if (hasSuspiciousAssociated) return "4A";

  // BI-RADS 3: probably benign (circumscribed, oval/round, equal/low density, no suspicious features)
  if (margin === "circumscribed" && (shape === "oval" || shape === "round") &&
    (density === "equal" || density === "low") && !hasSuspiciousAssociated) {
    return "3";
  }

  // Oval circumscribed mass with non-low/non-fat density
  if (margin === "circumscribed" && shape === "oval") return "3";

  // Round circumscribed
  if (margin === "circumscribed" && shape === "round") return "3";

  // Obscured oval
  if (margin === "obscured" && shape === "oval") return "4A";

  // Default for remaining combinations
  return "4A";
}

function scoreAsymmetry(type, hasAssociatedFeatures) {
  if (type === "single_projection") return "0"; // Needs additional views
  if (type === "global") {
    return hasAssociatedFeatures === "yes" ? "4A" : "2";
  }
  if (type === "focal") {
    return hasAssociatedFeatures === "yes" ? "4A" : "3";
  }
  if (type === "developing") {
    return hasAssociatedFeatures === "yes" ? "4B" : "4A";
  }
  return "0";
}

function scoreCalcifications(morphology, distribution, benignException) {
  if (morphology === "typically_benign") {
    if (benignException === "yes") return "4A"; // New/increasing or adjacent to cancer
    return "2";
  }

  // Suspicious morphologies — modulated by distribution
  if (morphology === "fine_linear") {
    // Highly suspicious morphology
    if (distribution === "segmental" || distribution === "linear") return "5";
    return "4C";
  }

  if (morphology === "fine_pleomorphic") {
    if (distribution === "segmental" || distribution === "linear") return "4C";
    return "4B";
  }

  if (morphology === "amorphous") {
    if (distribution === "segmental" || distribution === "linear") return "4C";
    if (distribution === "grouped") return "4B";
    if (distribution === "regional") return "4B";
    return "4A"; // Diffuse amorphous
  }

  if (morphology === "coarse_heterogeneous") {
    if (distribution === "segmental" || distribution === "linear") return "4C";
    return "4B";
  }

  return "4A";
}

// ═══════════════════════════════════════════════════════
// SCORING ENGINE — ULTRASOUND
// ═══════════════════════════════════════════════════════
export function scoreUltrasound(data) {
  const { usFindingType, usSpecialCase,
    usMassShape, usOrientation, usMargin, usEchoPattern, usPosterior, usAssociatedFeatures = [] } = data;

  if (usFindingType === "no_finding") return "1";

  // Special cases have pre-assigned categories
  if (usFindingType === "special_case" && usSpecialCase) {
    const sc = US_SPECIAL_CASES.find(c => c.value === usSpecialCase);
    return sc ? sc.category : "2";
  }

  if (usFindingType === "calcifications") return "4A"; // Echogenic foci needing mammo correlation
  if (usFindingType === "architectural_distortion") return "4B";

  // ── US MASS ──
  if (usFindingType === "mass") {
    return scoreUSMass(usMassShape, usOrientation, usMargin, usEchoPattern, usPosterior, usAssociatedFeatures);
  }

  return "0";
}

function scoreUSMass(shape, orientation, margin, echoPattern, posterior, associatedFeatures) {
  const hasAssocFeatures = associatedFeatures.length > 0 && !associatedFeatures.includes("none");
  const hasSuspiciousAssoc = associatedFeatures.some(f =>
    ["architectural_distortion", "skin_thickening", "edema"].includes(f)
  );

  // Simple cyst pattern detected from descriptors
  if (echoPattern === "anechoic" && margin === "circumscribed" && posterior === "enhancement") {
    return "2"; // Simple cyst
  }

  // Count suspicious features
  const suspiciousCount = [
    shape === "irregular",
    orientation === "not_parallel",
    margin === "not_circumscribed",
    posterior === "shadowing",
    hasSuspiciousAssoc,
  ].filter(Boolean).length;

  // BI-RADS 5: multiple highly suspicious features
  if (shape === "irregular" && margin === "not_circumscribed" && orientation === "not_parallel" && posterior === "shadowing") return "5";
  if (suspiciousCount >= 4) return "5";
  if (shape === "irregular" && margin === "not_circumscribed" && orientation === "not_parallel") return "5";

  // BI-RADS 4C
  if (suspiciousCount === 3) return "4C";
  if (shape === "irregular" && margin === "not_circumscribed") return "4C";
  if (shape === "irregular" && orientation === "not_parallel") return "4C";

  // BI-RADS 4B
  if (suspiciousCount === 2) return "4B";
  if (margin === "not_circumscribed" && orientation === "not_parallel") return "4B";
  if (shape === "irregular") return "4B";

  // BI-RADS 4A
  if (margin === "not_circumscribed") return "4A";
  if (orientation === "not_parallel") return "4A";
  if (echoPattern === "complex") return "4A";
  if (hasSuspiciousAssoc) return "4A";

  // Complex cystic-and-solid
  if (echoPattern === "complex") return "4A";

  // Probably benign features (oval, parallel, circumscribed, hypo/iso/hyperechoic)
  if (shape === "oval" && margin === "circumscribed" && orientation === "parallel") {
    return "3"; // Probable fibroadenoma
  }

  if (shape === "round" && margin === "circumscribed") return "3";

  return "3";
}

// ═══════════════════════════════════════════════════════
// COMBINED ASSESSMENT
// ═══════════════════════════════════════════════════════
const CATEGORY_ORDER = ["1", "2", "3", "4A", "4B", "4C", "5", "6"];
// 0 is special — treat separately

export function combinedAssessment(mammoCategory, usCategory) {
  // If either is BI-RADS 6, check for additional suspicious findings
  if (mammoCategory === "6" && usCategory === "6") return "6";
  if (mammoCategory === "6") {
    // If US shows something suspicious beyond the known cancer, report that
    if (CATEGORY_ORDER.indexOf(usCategory) > CATEGORY_ORDER.indexOf("2")) return usCategory;
    return "6";
  }
  if (usCategory === "6") {
    if (CATEGORY_ORDER.indexOf(mammoCategory) > CATEGORY_ORDER.indexOf("2")) return mammoCategory;
    return "6";
  }

  // For BI-RADS 0, if other modality has a real assessment, use that
  if (mammoCategory === "0" && usCategory !== "0") return usCategory;
  if (usCategory === "0" && mammoCategory !== "0") return mammoCategory;
  if (mammoCategory === "0" && usCategory === "0") return "0";

  // Take the most suspicious (highest on scale)
  const mammoIdx = CATEGORY_ORDER.indexOf(mammoCategory);
  const usIdx = CATEGORY_ORDER.indexOf(usCategory);
  return CATEGORY_ORDER[Math.max(mammoIdx, usIdx)];
}