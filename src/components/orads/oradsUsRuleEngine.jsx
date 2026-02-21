// ═══════════════════════════════════════════════════════════════════
// O-RADS™ Ultrasound v2022 — Deterministic Rule Engine
// ═══════════════════════════════════════════════════════════════════

export const ORADS_US_CATEGORIES = {
  0: { label: "0", name: "Incomplete", color: "bg-slate-400", textColor: "text-slate-700 dark:text-slate-300", borderColor: "border-slate-300 dark:border-slate-600", bgColor: "bg-slate-50 dark:bg-slate-800/30", risk: "N/A", description: "Technical factors prevent characterization.", management: "Repeat US or MRI." },
  1: { label: "1", name: "Normal", color: "bg-green-500", textColor: "text-green-700 dark:text-green-300", borderColor: "border-green-300 dark:border-green-700", bgColor: "bg-green-50 dark:bg-green-950/30", risk: "~0%", description: "Normal ovary or physiologic finding.", management: "No follow-up needed." },
  2: { label: "2", name: "Almost Certainly Benign", color: "bg-lime-400", textColor: "text-lime-700 dark:text-lime-300", borderColor: "border-lime-300 dark:border-lime-700", bgColor: "bg-lime-50 dark:bg-lime-950/30", risk: "< 1%", description: "Almost certainly benign.", management: "Follow-up per specific lesion type and menopausal status." },
  3: { label: "3", name: "Low Risk", color: "bg-yellow-400", textColor: "text-yellow-700 dark:text-yellow-300", borderColor: "border-yellow-300 dark:border-yellow-700", bgColor: "bg-yellow-50 dark:bg-yellow-950/30", risk: "1–< 10%", description: "Low risk of malignancy.", management: "Follow-up US ~6 months if not excised. Solid component → consider MRI. Gynecologist referral." },
  4: { label: "4", name: "Intermediate Risk", color: "bg-orange-400", textColor: "text-orange-700 dark:text-orange-300", borderColor: "border-orange-300 dark:border-orange-700", bgColor: "bg-orange-50 dark:bg-orange-950/30", risk: "10–< 50%", description: "Intermediate risk of malignancy.", management: "US specialist or MRI with O-RADS MRI score. Gynecologist with gyn-oncologist consult, or gyn-oncologist." },
  5: { label: "5", name: "High Risk", color: "bg-red-500", textColor: "text-red-700 dark:text-red-300", borderColor: "border-red-400 dark:border-red-700", bgColor: "bg-red-50 dark:bg-red-950/30", risk: "≥ 50%", description: "High risk of malignancy.", management: "Per gyn-oncologist protocol. Gyn-oncologist referral." },
};

export const MENOPAUSAL_OPTIONS = [
  { value: "pre", label: "Premenopausal", desc: "< 1 year amenorrhea" },
  { value: "early_post", label: "Early Postmenopausal", desc: "≥ 1 but < 5 years amenorrhea, or age > 50 but < 55" },
  { value: "late_post", label: "Late Postmenopausal", desc: "≥ 5 years amenorrhea, or age ≥ 55" },
  { value: "uncertain", label: "Uncertain / Uterus Absent", desc: "Use age > 50 as threshold" },
];

export const COLOR_SCORES = [
  { value: 1, label: "CS 1", desc: "No flow detected" },
  { value: 2, label: "CS 2", desc: "Minimal flow (1–3 vessels)" },
  { value: 3, label: "CS 3", desc: "Moderate flow" },
  { value: 4, label: "CS 4", desc: "Very strong, confluent flow" },
];

export const CLASSIC_BENIGN = [
  { value: "hemorrhagic", label: "Hemorrhagic Cyst", desc: "Unilocular, no vascularity, reticular pattern or retractile clot" },
  { value: "dermoid", label: "Dermoid Cyst", desc: "≤ 3 locules, no vascularity, hyperechoic with shadowing / lines & dots / floating spheres" },
  { value: "endometrioma", label: "Endometrioma", desc: "≤ 3 locules, no vascularity, ground glass echoes, smooth walls" },
  { value: "paraovarian", label: "Paraovarian Cyst", desc: "Simple cyst separate from ovary" },
  { value: "peritoneal_inclusion", label: "Peritoneal Inclusion Cyst", desc: "Fluid conforming to pelvic organs" },
  { value: "hydrosalpinx", label: "Hydrosalpinx", desc: "Anechoic tubular structure ± folds" },
];

export function isPostmenopausal(status) {
  return status === "early_post" || status === "late_post";
}

// ═══════════════════════════════════════════════════════════════════
// Classic Benign Management
// ═══════════════════════════════════════════════════════════════════

export function classicBenignManagement(type, menoStatus, sizeCm) {
  const post = isPostmenopausal(menoStatus);
  const size = parseFloat(sizeCm) || 0;

  if (type === "hemorrhagic") {
    if (menoStatus === "late_post") return { category: 2, note: "Late postmenopausal hemorrhagic cyst — should not typically occur. Re-characterize using standard lexicon descriptors." };
    if (!post && size <= 5) return { category: 2, note: "No follow-up needed." };
    if (!post && size > 5 && size < 10) return { category: 2, note: "Follow-up US in 2–3 months." };
    if (menoStatus === "early_post" && size < 10) return { category: 2, note: "Follow-up US in 2–3 months OR US specialist/MRI." };
    if (size >= 10) return { category: 3, note: "Classic benign ≥ 10 cm. Gynecologist referral." };
  }
  if (type === "dermoid") {
    if (size <= 3) return { category: 2, note: "Consider follow-up US in 12 months." };
    if (size > 3 && size < 10) return { category: 2, note: "Follow-up US in 12 months if not excised." };
    if (size >= 10) return { category: 3, note: "Classic benign ≥ 10 cm. Gynecologist referral." };
  }
  if (type === "endometrioma") {
    if (!post && size < 10) return { category: 2, note: "Follow-up US in 12 months." };
    if (post && size < 10) return { category: 2, note: "Postmenopausal endometrioma — follow-up US in 2–3 months, then 12 months. Consider MRI. Increased vigilance." };
    if (size >= 10) return { category: 3, note: "Classic benign ≥ 10 cm. Gynecologist referral." };
  }
  if (type === "paraovarian" || type === "peritoneal_inclusion" || type === "hydrosalpinx") {
    return { category: 2, note: "No imaging follow-up needed." };
  }
  return { category: 2, note: "Follow-up per clinical judgment." };
}

// ═══════════════════════════════════════════════════════════════════
// Main US Classification
// ═══════════════════════════════════════════════════════════════════

export function classifyUS(data) {
  const { primaryFinding, menoStatus } = data;
  const notes = [];

  // ORADS 0
  if (primaryFinding === "incomplete") return { category: 0, notes: ["Technical factors prevent characterization."] };

  // ORADS 1
  if (primaryFinding === "normal" || primaryFinding === "physiologic") return { category: 1, notes: ["Normal ovary or physiologic finding."] };

  // Classic benign pathway
  if (primaryFinding === "classic_benign") {
    const result = classicBenignManagement(data.classicType, menoStatus, data.sizeCm);
    notes.push(result.note);
    return { category: result.category, notes };
  }

  // Ascites / peritoneal override
  if (data.ascites || data.peritonealNodules) {
    notes.push("Ascites and/or peritoneal nodules → O-RADS 5 regardless of other features.");
    return { category: 5, notes };
  }

  const { composition, locules, wallCharacter, sizeCm, solidType, ppCount, hasShadowing, colorScore } = data;
  const size = parseFloat(sizeCm) || 0;
  const cs = colorScore || 1;
  const isIrregular = wallCharacter === "irregular";

  // ── PURELY CYSTIC ──
  if (composition === "cystic") {
    // Simple cyst (unilocular, smooth, no solid, anechoic)
    if (locules === "unilocular" && !isIrregular) {
      if (size <= 3) { notes.push("Simple cyst ≤ 3 cm."); return { category: 2, notes }; }
      if (size <= 5) { notes.push("Simple cyst > 3–5 cm."); return { category: 2, notes }; }
      if (size < 10) { notes.push("Simple cyst > 5–< 10 cm."); return { category: 2, notes }; }
      if (size >= 10) { notes.push("Unilocular smooth cyst ≥ 10 cm."); return { category: 3, notes }; }
    }
    if (locules === "unilocular" && isIrregular) {
      notes.push("Unilocular cyst, irregular, any size.");
      return { category: 3, notes };
    }
    if (locules === "bilocular" && !isIrregular) {
      if (size < 10) { notes.push("Bilocular smooth cyst < 10 cm."); return { category: 2, notes }; }
      notes.push("Bilocular smooth cyst ≥ 10 cm.");
      return { category: 3, notes };
    }
    if (locules === "bilocular" && isIrregular) {
      notes.push("Bilocular cyst, irregular, without solid component.");
      return { category: 4, notes };
    }
    if (locules === "multilocular" && !isIrregular) {
      if (size < 10 && cs < 4) { notes.push("Multilocular smooth cyst < 10 cm, CS < 4."); return { category: 3, notes }; }
      if (size >= 10 && cs < 4) { notes.push("Multilocular smooth cyst ≥ 10 cm, CS < 4."); return { category: 4, notes }; }
      if (cs === 4) { notes.push("Multilocular smooth cyst, CS 4."); return { category: 4, notes }; }
    }
    if (locules === "multilocular" && isIrregular) {
      notes.push("Multilocular cyst, irregular, without solid component.");
      return { category: 4, notes };
    }
  }

  // ── CYSTIC WITH SOLID ──
  if (composition === "cystic_solid") {
    if (locules === "unilocular") {
      const pps = parseInt(ppCount) || 0;
      if (pps >= 4) {
        notes.push("Unilocular cyst with ≥ 4 papillary projections.");
        return { category: 5, notes };
      }
      notes.push("Unilocular cyst with solid component(s) (< 4 pp).");
      return { category: 4, notes };
    }
    // Bi/multilocular with solid
    if (cs >= 3) {
      notes.push(`${locules === "bilocular" ? "Bilocular" : "Multilocular"} cyst with solid component(s), CS ${cs}.`);
      return { category: 5, notes };
    }
    notes.push(`${locules === "bilocular" ? "Bilocular" : "Multilocular"} cyst with solid component(s), CS 1–2.`);
    return { category: 4, notes };
  }

  // ── SOLID LESION ──
  if (composition === "solid") {
    if (isIrregular) {
      notes.push("Solid lesion, irregular contour.");
      return { category: 5, notes };
    }
    // Smooth solid
    if (cs === 4) {
      notes.push("Smooth solid lesion, CS 4.");
      return { category: 5, notes };
    }
    if (hasShadowing) {
      if (cs === 1) { notes.push("Smooth solid lesion with shadowing, CS 1."); return { category: 2, notes }; }
      notes.push("Smooth solid lesion with shadowing, CS 2–3.");
      return { category: 3, notes };
    }
    // Non-shadowing smooth
    if (cs === 1) { notes.push("Smooth solid lesion, no shadowing, CS 1."); return { category: 3, notes }; }
    notes.push("Smooth solid lesion, no shadowing, CS 2–3.");
    return { category: 4, notes };
  }

  return { category: 0, notes: ["Insufficient data for classification."] };
}

// ═══════════════════════════════════════════════════════════════════
// Report generation
// ═══════════════════════════════════════════════════════════════════

export function generateUSReport(data, result) {
  const lines = [];
  lines.push("O-RADS ULTRASOUND v2022 — STRUCTURED REPORT");
  lines.push("");
  lines.push(`Menopausal Status: ${MENOPAUSAL_OPTIONS.find(m => m.value === data.menoStatus)?.label || "N/A"}`);
  lines.push("");
  lines.push("FINDINGS:");

  if (data.primaryFinding === "classic_benign") {
    const cl = CLASSIC_BENIGN.find(c => c.value === data.classicType);
    lines.push(`Classic benign lesion: ${cl?.label || data.classicType}`);
    if (data.sizeCm) lines.push(`Size: ${data.sizeCm} cm`);
  } else if (data.primaryFinding === "lesion") {
    lines.push(`Composition: ${data.composition === "cystic" ? "Purely cystic" : data.composition === "cystic_solid" ? "Cystic with solid component(s)" : "Solid (≥ 80%)"}`);
    if (data.locules) lines.push(`Locules: ${data.locules}`);
    if (data.wallCharacter) lines.push(`Inner wall/septation: ${data.wallCharacter}`);
    if (data.sizeCm) lines.push(`Size: ${data.sizeCm} cm`);
    if (data.composition === "cystic_solid") {
      lines.push(`Papillary projections: ${data.ppCount || "N/A"}`);
    }
    if (data.composition === "solid" && data.hasShadowing !== undefined) {
      lines.push(`Shadowing: ${data.hasShadowing ? "Yes (diffuse/broad)" : "No"}`);
    }
    lines.push(`Color Score: ${data.colorScore || "N/A"}`);
  }
  if (data.ascites) lines.push("Associated: Ascites present");
  if (data.peritonealNodules) lines.push("Associated: Peritoneal nodules present");

  lines.push("");
  lines.push("IMPRESSION:");
  const cat = ORADS_US_CATEGORIES[result.category];
  lines.push(`O-RADS ${cat.label} — ${cat.name} (Risk: ${cat.risk}).`);
  lines.push(cat.description);
  lines.push("");
  lines.push(`Management: ${cat.management}`);
  if (result.notes?.length) result.notes.forEach(n => lines.push(`Note: ${n}`));

  return lines.join("\n");
}