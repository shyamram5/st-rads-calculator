// ═══════════════════════════════════════════════════════════════════════
// Bone-RADS Rule Engine
// Based on: Caracciolo et al., JACR 2023;20:1044–1058
// Co-endorsed by the Musculoskeletal Tumor Society
// ═══════════════════════════════════════════════════════════════════════

export const MARGIN_GRADES = [
  { value: "IA", label: "Grade IA", name: "Geographic, well-defined with marginal sclerosis", points: 1, risk: "< 10%", examples: "Nonossifying fibroma, simple bone cyst, fibrous cortical defect", desc: "Complete sclerotic rim fully surrounding the lesion." },
  { value: "IB", label: "Grade IB", name: "Geographic, well-defined without marginal sclerosis", points: 3, risk: "< 10%", examples: "Giant cell tumor, aneurysmal bone cyst, enchondroma", desc: "Well-defined but no surrounding sclerotic rim." },
  { value: "II", label: "Grade II", name: "Geographic, ill-defined margins", points: 5, risk: "~50%", examples: "Low-grade chondrosarcoma, osteomyelitis (Brodie's abscess), fibrosarcoma", desc: "Geographic lesion with poorly defined zone of transition." },
  { value: "IIIA", label: "Grade IIIA", name: "Changing margins", points: 7, risk: "> 80%", examples: "Malignant transformation of pre-existing benign lesion", desc: "Two distinct zones of transition — e.g., one well-defined, another ill-defined. Assign the MOST CONCERNING pattern." },
  { value: "IIIB", label: "Grade IIIB", name: "Moth-eaten or permeative osteolysis", points: 7, risk: "> 80%", examples: "Osteosarcoma, Ewing sarcoma, lymphoma, myeloma, aggressive metastases", desc: "Multiple small poorly defined lytic foci or diffuse infiltrative destruction." },
  { value: "IIIC", label: "Grade IIIC", name: "Radiographically occult margins", points: 7, risk: "> 80%", examples: "Early hematogenous metastases, diffuse marrow infiltration", desc: "Lesion seen on other modality but not visible on radiography." },
];

export const PERIOSTEAL_OPTIONS = [
  { value: "none", label: "No periosteal reaction or remodeling", points: 0 },
  { value: "remodeling", label: "Cortical remodeling only (no periosteal reaction)", points: 0, note: "Neocortex replaces original cortex — does NOT add points" },
  { value: "nonaggressive", label: "Nonaggressive periosteal reaction", points: 2 },
  { value: "aggressive", label: "Aggressive periosteal reaction", points: 4 },
];

export const NONAGGRESSIVE_PATTERNS = [
  { value: "smooth_solid", label: "Smooth solid periosteal reaction", desc: "Dense layers of new bone added slowly" },
  { value: "remodeling_intact", label: "Cortical remodeling with intact neocortex", desc: "Thin shell, ridged/septated, lobulated, or thick shell" },
];

export const AGGRESSIVE_PATTERNS = [
  { value: "lamellated", label: 'Lamellated / "onion-skin"', desc: "Concentric layers — may be benign aggressive (LCH) or malignant (Ewing sarcoma)" },
  { value: "parallel_spiculated", label: 'Parallel spiculated / "hair-on-end"', desc: "Perpendicular spicules — strongly associated with osteosarcoma" },
  { value: "divergent_spiculated", label: 'Divergent spiculated / "sunburst"', desc: "Radiating spicules — highly aggressive, classic for osteosarcoma" },
  { value: "codman", label: "Codman's angle", desc: "Elevated, acutely disrupted periosteum at shoulder of extra-osseous mass" },
  { value: "complex", label: "Complex / combined patterns", desc: "Lamellated + spiculated — variable growth rate, malignant transformation" },
  { value: "interrupted", label: "Interrupted periosteum", desc: "Cortical breakthrough with periosteal disruption" },
];

export const ENDOSTEAL_OPTIONS = [
  { value: "none", label: "No endosteal erosion / not applicable", points: 0 },
  { value: "grade1", label: "Mild (Grade 1): < 1/3 cortical thickness", points: 0 },
  { value: "grade2", label: "Moderate (Grade 2): 1/3 to 2/3 cortical thickness", points: 1 },
  { value: "grade3", label: "Deep (Grade 3): > 2/3 cortical thickness or disruption", points: 2 },
];

export const CATEGORIES = {
  0: {
    label: "Bone-RADS 0",
    name: "Incompletely Characterized",
    color: "bg-gray-200 dark:bg-gray-700",
    textColor: "text-gray-800 dark:text-gray-200",
    borderColor: "border-gray-300 dark:border-gray-600",
    management: "Additional radiographic views (orthogonal projections) or cross-sectional imaging (CT or MRI) for further evaluation before risk assignment. Risk of malignancy cannot be adequately predicted.",
  },
  1: {
    label: "Bone-RADS 1",
    name: "Very Low Risk — Very Likely Benign",
    color: "bg-emerald-100 dark:bg-emerald-900/40",
    textColor: "text-emerald-800 dark:text-emerald-200",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    management: "If asymptomatic, workup may be complete versus annual surveillance to ensure expected stability. If symptomatic or change in clinical presentation, consider advanced imaging and orthopedic oncology referral for treatment of benign tumor.",
  },
  2: {
    label: "Bone-RADS 2",
    name: "Low Risk — Probably Benign",
    color: "bg-lime-100 dark:bg-lime-900/40",
    textColor: "text-lime-800 dark:text-lime-200",
    borderColor: "border-lime-300 dark:border-lime-700",
    management: "Short-interval (3–6 months) radiographic surveillance to ensure stability. Consider advanced imaging (CT, MRI, bone scan, or PET) to assess tumor composition. Consider biopsy if needed to confirm benignity or if uncertainty remains. Consider orthopedic oncology referral for surveillance or treatment of benign tumor if symptomatic or locally aggressive.",
  },
  3: {
    label: "Bone-RADS 3",
    name: "Intermediate Risk — Potentially Malignant",
    color: "bg-orange-100 dark:bg-orange-900/40",
    textColor: "text-orange-800 dark:text-orange-200",
    borderColor: "border-orange-300 dark:border-orange-700",
    management: "Orthopedic oncology referral for probable biopsy and treatment planning. Recommend advanced imaging (CT, MRI, or bone scan) for further characterization. Biopsy should be performed in consultation with the orthopedic oncologist who would provide definitive treatment if malignancy confirmed.",
  },
  4: {
    label: "Bone-RADS 4",
    name: "High Risk — Highly Suspicious for Malignancy",
    color: "bg-red-200 dark:bg-red-900/60",
    textColor: "text-red-800 dark:text-red-100",
    borderColor: "border-red-400 dark:border-red-600",
    management: "Orthopedic oncology referral for recommended biopsy and treatment planning. Advanced imaging for tumor staging including evaluation for additional sites of disease. Malignant until proven otherwise.",
  },
};

export function calculateBoneRADS(data) {
  if (data.characterizable === "no") {
    return { score: 0, totalPoints: null, breakdown: [], alerts: [] };
  }

  const breakdown = [];
  const alerts = [];
  let total = 0;

  // Margins
  const margin = MARGIN_GRADES.find(m => m.value === data.margin_grade);
  if (margin) {
    breakdown.push({ feature: "Margination", value: `${margin.label} — ${margin.name}`, points: margin.points });
    total += margin.points;
  }

  // Periosteal reaction
  const periosteal = data.periosteal;
  let periPoints = 0;
  let periLabel = "None";
  if (periosteal === "nonaggressive") { periPoints = 2; periLabel = "Nonaggressive"; }
  else if (periosteal === "aggressive") { periPoints = 4; periLabel = "Aggressive"; }
  else if (periosteal === "remodeling") { periLabel = "Cortical remodeling (0 pts)"; }
  breakdown.push({ feature: "Periosteal Reaction", value: periLabel, points: periPoints });
  total += periPoints;

  // Endosteal erosion
  const endosteal = ENDOSTEAL_OPTIONS.find(e => e.value === data.endosteal);
  if (endosteal) {
    breakdown.push({ feature: "Endosteal Erosion", value: endosteal.label, points: endosteal.points });
    total += endosteal.points;
    if (endosteal.value === "grade3") alerts.push("fracture_risk");
  }

  // Pathological fracture
  const fracPts = data.pathological_fracture === "yes" ? 2 : 0;
  breakdown.push({ feature: "Pathological Fracture", value: data.pathological_fracture === "yes" ? "Present" : "Absent", points: fracPts });
  total += fracPts;
  if (fracPts > 0) alerts.push("fracture_risk");

  // Soft tissue mass
  const stmPts = data.soft_tissue_mass === "yes" ? 4 : 0;
  breakdown.push({ feature: "Extra-osseous Soft Tissue Mass", value: data.soft_tissue_mass === "yes" ? "Present" : "Absent", points: stmPts });
  total += stmPts;
  if (stmPts > 0) alerts.push("soft_tissue_mass");

  // Known primary cancer
  const cancerPts = data.known_cancer === "yes" ? 2 : 0;
  breakdown.push({ feature: "Known Primary Cancer", value: data.known_cancer === "yes" ? `Yes${data.cancer_type ? ` (${data.cancer_type})` : ""}` : "No", points: cancerPts });
  total += cancerPts;
  if (cancerPts > 0) alerts.push("known_cancer");

  // Score conversion
  let score;
  if (total <= 2) score = 1;
  else if (total <= 4) score = 2;
  else if (total <= 6) score = 3;
  else score = 4;

  return { score, totalPoints: total, breakdown, alerts: [...new Set(alerts)] };
}

// ── Structured report ─────────────────────────────────────────────────

export function generateBoneRADSReport(data, result) {
  const cat = CATEGORIES[result.score];
  const margin = MARGIN_GRADES.find(m => m.value === data.margin_grade);
  const endosteal = ENDOSTEAL_OPTIONS.find(e => e.value === data.endosteal);
  const lines = [];

  lines.push("BONE-RADS STRUCTURED REPORT");
  lines.push("═══════════════════════════════════════");
  lines.push("");

  // Clinical
  if (data.patient_age) lines.push(`Patient age: ${data.patient_age} years`);
  if (data.symptoms) lines.push(`Symptoms: ${data.symptoms === "asymptomatic" ? "Asymptomatic (incidental)" : "Symptomatic"}`);
  if (data.multifocal) lines.push(`Distribution: ${data.multifocal === "solitary" ? "Solitary" : "Multifocal / polyostotic"}`);
  lines.push("");

  // Findings
  const densityLabel = data.density ? { lytic: "lytic", sclerotic: "sclerotic", mixed: "mixed lytic and sclerotic" }[data.density] : "";
  const locationParts = [];
  if (data.specific_bone) locationParts.push(data.specific_bone);
  if (data.longitudinal) locationParts.push(data.longitudinal);
  if (data.transverse) locationParts.push(data.transverse);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "[location]";

  lines.push("FINDINGS:");
  lines.push(`${locationStr} demonstrates a ${densityLabel || "[density]"} bone lesion with ${margin ? `modified Lodwick-Madewell ${margin.label} (${margin.name})` : "[margin grade]"} margination${data.margin_grade === "IA" ? " with marginal sclerosis" : data.margin_grade === "IB" ? " without marginal sclerosis" : ""}.`);

  // Periosteal
  if (data.periosteal === "aggressive") {
    const pattern = data.aggressive_pattern || "aggressive pattern";
    lines.push(`Aggressive periosteal reaction is present (${pattern}).`);
  } else if (data.periosteal === "nonaggressive") {
    lines.push("Nonaggressive periosteal reaction is present.");
  } else if (data.periosteal === "remodeling") {
    lines.push("Cortical remodeling is present without periosteal reaction.");
  } else {
    lines.push("No periosteal reaction is identified.");
  }

  // Endosteal
  if (endosteal && endosteal.value !== "none") {
    lines.push(`Endosteal erosion: ${endosteal.label}.`);
  } else {
    lines.push("No significant endosteal erosion.");
  }

  lines.push(`Pathological fracture: ${data.pathological_fracture === "yes" ? "Present." : "Absent."}`);
  lines.push(`Extra-osseous soft tissue mass: ${data.soft_tissue_mass === "yes" ? "Present." : "Absent."}`);
  lines.push(`History of primary malignancy: ${data.known_cancer === "yes" ? `Present${data.cancer_type ? ` (${data.cancer_type})` : ""}.` : "Absent."}`);
  lines.push("");

  // Point calculation
  const pointStrs = result.breakdown.map(b => `${b.feature} [${b.points}]`).join(" + ");
  lines.push(`Point calculation: ${pointStrs} = Total ${result.totalPoints} points.`);
  lines.push("");

  // Impression
  lines.push("IMPRESSION:");
  lines.push(`${cat.label}: ${cat.name}.`);
  lines.push("");
  lines.push("RECOMMENDED MANAGEMENT:");
  lines.push(cat.management);
  lines.push("");
  lines.push("───────────────────────────────────────");
  lines.push("Classification per Bone-RADS (Caracciolo et al., JACR 2023)");

  return lines.join("\n");
}

// ── Differential diagnosis engine ─────────────────────────────────────

export const DIFFERENTIALS = [
  { density: "lytic", matrix: "none", location: "epiphyseal", entities: ["Giant cell tumor", "Chondroblastoma", "Clear cell chondrosarcoma (rare)"] },
  { density: "lytic", matrix: "none", location: "metaphyseal", entities: ["Simple bone cyst", "Fibrous dysplasia", "Nonossifying fibroma", "Aneurysmal bone cyst"] },
  { density: "lytic", matrix: "none", location: "diaphyseal", entities: ["Ewing sarcoma (young)", "Lymphoma", "Langerhans cell histiocytosis", "Adamantinoma (tibia)"] },
  { density: "lytic", matrix: "chondroid", location: null, entities: ["Enchondroma", "Low-grade chondrosarcoma", "Chondroblastoma (epiphyseal)"] },
  { density: "lytic", matrix: "osteoid", location: null, entities: ["Osteosarcoma (telangiectatic variant)", "Osteoblastic metastasis"] },
  { density: "sclerotic", matrix: "osteoid", location: null, entities: ["Osteoid osteoma", "Osteoblastoma", "Osteosarcoma", "Osteoblastic metastases (breast, prostate)"] },
  { density: "sclerotic", matrix: "none", location: null, entities: ["Bone island (enostosis)", "Lymphoma", "Chronic osteomyelitis", "Osteoblastic metastases"] },
  { density: "sclerotic", matrix: "ground_glass", location: null, entities: ["Fibrous dysplasia"] },
  { density: "mixed", matrix: null, location: null, entities: ["Osteosarcoma", "Fibrous dysplasia", "Chondrosarcoma", "Metastatic disease", "Osteomyelitis"] },
  { density: "lytic", matrix: "none", location: null, entities: ["Multiple myeloma", "Metastatic disease", "Lymphoma", "Langerhans cell histiocytosis"] },
];

export function getDifferentials(data) {
  const matches = [];
  for (const d of DIFFERENTIALS) {
    let score = 0;
    if (d.density && d.density === data.density) score += 2;
    if (d.matrix && d.matrix === data.matrix) score += 2;
    if (d.location && d.location === data.longitudinal) score += 2;
    if (d.density === null || d.density === data.density) {
      if (d.matrix === null || d.matrix === data.matrix) {
        if (d.location === null || d.location === data.longitudinal) {
          if (score > 0) matches.push({ ...d, score });
        }
      }
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 5);
}

export const LOCATION_PEARLS = [
  "Adamantinoma: anterior cortex of proximal-to-mid tibia",
  "Parosteal osteosarcoma: posterior distal femur",
  "Chordoma: sacrum and skull base",
  "Enchondromas: small tubular bones of hand",
  "Giant cell tumor: epiphysis of long bones in skeletally mature patients",
  "Ewing sarcoma: diaphysis of long bones and flat bones",
  "Osteoid osteoma: femoral neck, proximal tibia cortex",
  "Nonossifying fibroma: eccentric metaphysis of distal femur/tibia",
  "Epiphyseal lesions in adults: almost always benign or GCT — malignant epiphyseal lesions are rare",
];

export const DO_NOT_TOUCH = [
  { name: "Nonossifying fibroma", desc: "IA margins, eccentric distal femur/tibia, young patient, spontaneously regresses" },
  { name: "Osteoid osteoma", desc: "Intracortical, solid periosteal reaction, nidus < 1.5 cm, pain relieved by NSAIDs" },
  { name: "Bone island (enostosis)", desc: "Sclerotic, no periosteal reaction, no growth, spiculated margins blending with trabeculae" },
  { name: "Simple bone cyst", desc: "Central metaphyseal, well-defined, no periosteal reaction unless fractured" },
  { name: "Fibrous cortical defect", desc: "Small (< 2 cm) eccentric cortical lucency, young patient" },
];