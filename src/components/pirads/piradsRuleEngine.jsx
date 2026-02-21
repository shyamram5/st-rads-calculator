// ═══════════════════════════════════════════════════════════════════
// PI-RADS® v2.1 (2019) — Deterministic Rule Engine
// ═══════════════════════════════════════════════════════════════════

export const CATEGORIES = {
  1: { label: "1", name: "Very Low", color: "bg-green-500", textColor: "text-green-700 dark:text-green-300", borderColor: "border-green-300 dark:border-green-700", bgColor: "bg-green-50 dark:bg-green-950/30", ppv: "~2%", description: "Clinically significant cancer is highly unlikely to be present.", management: "Biopsy generally NOT indicated based on MRI findings alone." },
  2: { label: "2", name: "Low", color: "bg-lime-400", textColor: "text-lime-700 dark:text-lime-300", borderColor: "border-lime-300 dark:border-lime-700", bgColor: "bg-lime-50 dark:bg-lime-950/30", ppv: "~6%", description: "Clinically significant cancer is unlikely to be present.", management: "Biopsy generally NOT indicated based on MRI findings alone." },
  3: { label: "3", name: "Intermediate", color: "bg-yellow-400", textColor: "text-yellow-700 dark:text-yellow-300", borderColor: "border-yellow-300 dark:border-yellow-700", bgColor: "bg-yellow-50 dark:bg-yellow-950/30", ppv: "~26–30%", description: "Presence of clinically significant cancer is equivocal.", management: "Biopsy may or may not be appropriate — clinical context, PSA density, and local practice standards should guide the decision." },
  4: { label: "4", name: "High", color: "bg-orange-400", textColor: "text-orange-700 dark:text-orange-300", borderColor: "border-orange-300 dark:border-orange-700", bgColor: "bg-orange-50 dark:bg-orange-950/30", ppv: "~60%", description: "Clinically significant cancer is likely to be present.", management: "Biopsy should be considered." },
  5: { label: "5", name: "Very High", color: "bg-red-500", textColor: "text-red-700 dark:text-red-300", borderColor: "border-red-400 dark:border-red-700", bgColor: "bg-red-50 dark:bg-red-950/30", ppv: "~84–90%", description: "Clinically significant cancer is highly likely to be present.", management: "Biopsy should be considered." },
};

// ═══════════════════════════════════════════════════════════════════
// T2W descriptors
// ═══════════════════════════════════════════════════════════════════

export const T2W_PZ_OPTIONS = [
  { value: 1, label: "Score 1", desc: "Uniform hyperintensity (normal)" },
  { value: 2, label: "Score 2", desc: "Linear/wedge-shaped hypointensity; or diffuse hypointensity with indistinct margins (prostatitis/atrophy)" },
  { value: 3, label: "Score 3", desc: "Heterogeneous signal or non-circumscribed, rounded, moderate hypointensity" },
  { value: 4, label: "Score 4", desc: "Circumscribed, homogeneous, moderately hypointense focus/mass — < 1.5 cm" },
  { value: 5, label: "Score 5", desc: "Same as 4 but ≥ 1.5 cm OR definite EPE" },
  { value: "X", label: "X", desc: "Technically inadequate" },
];

export const T2W_TZ_OPTIONS = [
  { value: 1, label: "Score 1", desc: "Normal TZ / BPH nodules alone (normal variant — do NOT assign PI-RADS category)" },
  { value: 2, label: "Score 2", desc: "Circumscribed nodule(s) completely or incompletely encapsulated (atypical BPH nodule)" },
  { value: 3, label: "Score 3", desc: "Heterogeneous signal with obscured margins" },
  { value: 4, label: "Score 4", desc: "Lenticular or non-circumscribed, homogeneous, moderately hypointense — 'erased charcoal' — < 1.5 cm" },
  { value: 5, label: "Score 5", desc: "Same as 4 but ≥ 1.5 cm OR definite EPE / invasive behavior" },
  { value: "X", label: "X", desc: "Technically inadequate" },
];

export const DWI_OPTIONS = [
  { value: 1, label: "Score 1", desc: "No abnormality on ADC or high b-value DWI" },
  { value: 2, label: "Score 2", desc: "Indistinct, mildly hypointense on ADC — not focal or mass-like" },
  { value: 3, label: "Score 3", desc: "Focal, mildly–moderately hypointense on ADC; iso–mildly hyperintense on high b-value" },
  { value: 4, label: "Score 4", desc: "Focal, markedly hypointense on ADC; markedly hyperintense on high b-value — < 1.5 cm" },
  { value: 5, label: "Score 5", desc: "Same as 4 but ≥ 1.5 cm OR definite EPE" },
  { value: "X", label: "X", desc: "Technically inadequate" },
];

export const DCE_OPTIONS = [
  { value: "negative", label: "Negative (–)", desc: "No early focal enhancement coinciding with a suspicious finding" },
  { value: "positive", label: "Positive (+)", desc: "Focal enhancement coinciding with T2W/DWI abnormality, earlier than or with adjacent normal tissue" },
  { value: "X", label: "X", desc: "Not performed or technically inadequate" },
];

// ═══════════════════════════════════════════════════════════════════
// Sector map definitions
// ═══════════════════════════════════════════════════════════════════

export const GLAND_REGIONS = ["Base", "Midgland", "Apex"];
export const SIDES = ["Right", "Left", "Midline/Anterior"];
export const PZ_SUBREGIONS = ["Posterior", "Posterolateral", "Lateral", "Anterior horn"];
export const TZ_SUBREGIONS = ["Anterior", "Posterior"];
export const ZONES = [
  { value: "PZ", label: "Peripheral Zone (PZ)", tip: "DWI is DOMINANT" },
  { value: "TZ", label: "Transition Zone (TZ)", tip: "T2W is DOMINANT" },
  { value: "CZ", label: "Central Zone (CZ)", tip: "Apply PZ or TZ criteria based on apparent origin" },
  { value: "AFMS", label: "Anterior Fibromuscular Stroma", tip: "Apply criteria for zone of apparent origin" },
  { value: "SV", label: "Seminal Vesicle (SV)" },
];

export const EPE_OPTIONS = [
  { value: "none", label: "No EPE" },
  { value: "suspected", label: "Suspected / Possible EPE" },
  { value: "definite", label: "Definite EPE" },
];

// ═══════════════════════════════════════════════════════════════════
// Core classification logic
// ═══════════════════════════════════════════════════════════════════

export function classifyLesion(lesion) {
  const { zone, t2w, dwi, dce, epe, effectiveZone } = lesion;
  const notes = [];
  const ez = effectiveZone || zone;

  // Override: definite EPE → PI-RADS 5
  if (epe === "definite") {
    notes.push("Definite EPE → automatic PI-RADS 5 regardless of sequence scores.");
    return { category: 5, notes, method: "EPE override" };
  }

  const dwiIsX = dwi === "X";
  const dceIsX = dce === "X";
  const t2wIsX = t2w === "X";
  const dcePos = dce === "positive";

  // ── FALLBACK: DWI unavailable ──
  if (dwiIsX) {
    notes.push("DWI unavailable — using T2W + DCE fallback table.");
    if (t2wIsX) {
      notes.push("Both T2W and DWI unavailable — scoring substantially limited.");
      return { category: null, notes, method: "unscoreable" };
    }
    const t = typeof t2w === "number" ? t2w : 0;
    if (t <= 1) return { category: 1, notes, method: "fallback_noDWI" };
    if (t === 2) return { category: 2, notes, method: "fallback_noDWI" };
    if (t === 3) {
      if (dcePos) { notes.push("DCE positive upgrades T2W 3 → PI-RADS 4 (fallback)."); return { category: 4, notes, method: "fallback_noDWI" }; }
      return { category: 3, notes, method: "fallback_noDWI" };
    }
    if (t === 4) return { category: 4, notes, method: "fallback_noDWI" };
    if (t >= 5) return { category: 5, notes, method: "fallback_noDWI" };
    return { category: 3, notes, method: "fallback_noDWI" };
  }

  // ── PERIPHERAL ZONE ──
  if (ez === "PZ") {
    notes.push("PZ assessment: DWI is the dominant sequence.");
    const d = typeof dwi === "number" ? dwi : 0;
    if (d <= 1) return { category: 1, notes, method: "PZ_standard" };
    if (d === 2) return { category: 2, notes, method: "PZ_standard" };
    if (d === 3) {
      if (dcePos && !dceIsX) {
        notes.push("DCE positive upgrades PZ DWI 3 → PI-RADS 4.");
        return { category: 4, notes, method: "PZ_DCE_upgrade" };
      }
      return { category: 3, notes, method: "PZ_standard" };
    }
    if (d === 4) return { category: 4, notes, method: "PZ_standard" };
    if (d >= 5) return { category: 5, notes, method: "PZ_standard" };
  }

  // ── TRANSITION ZONE ──
  if (ez === "TZ") {
    notes.push("TZ assessment: T2W is the dominant sequence.");
    const t = typeof t2w === "number" ? t2w : 0;
    const d = typeof dwi === "number" ? dwi : 0;

    if (t <= 1) {
      notes.push("T2W 1 (BPH only) — no focal lesion to score.");
      return { category: 1, notes, method: "TZ_standard" };
    }
    if (t === 2) {
      if (d >= 4) {
        notes.push("T2W 2 + DWI ≥ 4 → PI-RADS 3 (DWI upgrades atypical BPH nodule).");
        return { category: 3, notes, method: "TZ_DWI_upgrade" };
      }
      return { category: 2, notes, method: "TZ_standard" };
    }
    if (t === 3) {
      if (d >= 5) {
        notes.push("T2W 3 + DWI 5 → PI-RADS 4 (DWI 5 upgrades T2W 3 in TZ).");
        return { category: 4, notes, method: "TZ_DWI5_upgrade" };
      }
      return { category: 3, notes, method: "TZ_standard" };
    }
    if (t === 4) return { category: 4, notes, method: "TZ_standard" };
    if (t >= 5) return { category: 5, notes, method: "TZ_standard" };
  }

  return { category: 3, notes: ["Classification fallback."], method: "fallback" };
}

// ═══════════════════════════════════════════════════════════════════
// Index lesion identification
// ═══════════════════════════════════════════════════════════════════

export function identifyIndexLesion(lesions, results) {
  if (lesions.length === 0) return -1;
  let bestIdx = 0;
  let bestCat = results[0]?.category || 0;
  for (let i = 1; i < lesions.length; i++) {
    const cat = results[i]?.category || 0;
    if (cat > bestCat) { bestCat = cat; bestIdx = i; }
    else if (cat === bestCat) {
      // Tie: prefer definite EPE
      if (lesions[i].epe === "definite" && lesions[bestIdx].epe !== "definite") bestIdx = i;
      // Still tied: prefer larger
      else if (lesions[i].epe === lesions[bestIdx].epe) {
        const sizeI = parseFloat(lesions[i].size) || 0;
        const sizeBest = parseFloat(lesions[bestIdx].size) || 0;
        if (sizeI > sizeBest) bestIdx = i;
      }
    }
  }
  return bestIdx;
}

// ═══════════════════════════════════════════════════════════════════
// Report generation
// ═══════════════════════════════════════════════════════════════════

export function generatePIRADSReport(examData, lesions, results, indexIdx) {
  const lines = [];
  lines.push("PROSTATE MRI — PI-RADS v2.1 STRUCTURED REPORT");
  lines.push("");
  lines.push("CLINICAL INFORMATION:");
  if (examData.psa) lines.push(`PSA: ${examData.psa} ng/mL`);
  if (examData.prostateVolume) lines.push(`Prostate volume: ${examData.prostateVolume} mL`);
  if (examData.psad) lines.push(`PSA Density: ${examData.psad} ng/mL²`);
  if (examData.indication) lines.push(`Indication: ${examData.indication}`);
  if (examData.priorBiopsy === "yes") lines.push(`Prior biopsy: Yes${examData.gleasonScore ? `, Gleason ${examData.gleasonScore}` : ""}`);
  lines.push(`Field strength: ${examData.fieldStrength || "N/A"}`);
  lines.push("");
  lines.push("TECHNIQUE:");
  lines.push(`T2W: ${examData.t2wQuality === "X" ? "Technically inadequate" : "Diagnostic quality"}`);
  lines.push(`DWI/ADC: ${examData.dwiQuality === "X" ? "Technically inadequate" : "Diagnostic quality"}`);
  lines.push(`DCE: ${examData.dceQuality === "X" ? "Not performed/inadequate" : examData.dceQuality === "not_performed" ? "Not performed" : "Diagnostic quality"}`);
  lines.push("");
  lines.push("FINDINGS:");

  lesions.forEach((l, i) => {
    const r = results[i];
    const isIndex = i === indexIdx;
    const cat = r?.category;
    lines.push("");
    lines.push(`Lesion ${i + 1}${isIndex ? " [INDEX LESION]" : ""}:`);
    lines.push(`  Zone: ${l.zone}${l.effectiveZone && l.effectiveZone !== l.zone ? ` (scored as ${l.effectiveZone})` : ""}`);
    lines.push(`  Location: ${l.region || ""} ${l.side || ""} ${l.subregion || ""}`);
    lines.push(`  Size: ${l.size || "N/A"} mm (${l.measureSequence || ""})`);
    lines.push(`  T2W: ${l.t2w}  |  DWI: ${l.dwi}  |  DCE: ${l.dce}`);
    lines.push(`  EPE: ${l.epe === "definite" ? "Definite" : l.epe === "suspected" ? "Suspected" : "None"}`);
    lines.push(`  PI-RADS Assessment Category: ${cat || "N/A"}`);
    if (r?.notes?.length) r.notes.forEach(n => lines.push(`  Note: ${n}`));
  });

  lines.push("");
  lines.push("IMPRESSION:");
  if (lesions.length === 0) {
    lines.push("No suspicious lesions identified. PI-RADS 1.");
  } else {
    const indexResult = results[indexIdx];
    const indexCat = indexResult?.category;
    const catInfo = CATEGORIES[indexCat];
    lines.push(`Index lesion (Lesion ${indexIdx + 1}): PI-RADS ${indexCat} — ${catInfo?.name || "N/A"}.`);
    lines.push(`${catInfo?.description || ""}`);
    lines.push(`Management: ${catInfo?.management || ""}`);
  }

  lines.push("");
  lines.push("PI-RADS v2.1 intentionally does NOT include specific biopsy or management recommendations.");
  lines.push("Clinically significant cancer: Gleason ≥ 7, volume > 0.5 cc, or EPE.");

  return lines.join("\n");
}