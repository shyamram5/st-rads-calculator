// ═══════════════════════════════════════════════════════════════════
// O-RADS™ MRI Risk Stratification — Deterministic Rule Engine
// ═══════════════════════════════════════════════════════════════════

export const ORADS_MRI_CATEGORIES = {
  0: { label: "0", name: "Incomplete", color: "bg-slate-400", textColor: "text-slate-700 dark:text-slate-300", borderColor: "border-slate-300 dark:border-slate-600", bgColor: "bg-slate-50 dark:bg-slate-800/30", ppv: "N/A", description: "Technical factors prevent characterization.", management: "No management algorithm applicable." },
  1: { label: "1", name: "Normal", color: "bg-green-500", textColor: "text-green-700 dark:text-green-300", borderColor: "border-green-300 dark:border-green-700", bgColor: "bg-green-50 dark:bg-green-950/30", ppv: "N/A", description: "Normal ovaries.", management: "No follow-up needed." },
  2: { label: "2", name: "Almost Certainly Benign", color: "bg-lime-400", textColor: "text-lime-700 dark:text-lime-300", borderColor: "border-lime-300 dark:border-lime-700", bgColor: "bg-lime-50 dark:bg-lime-950/30", ppv: "< 0.5%", description: "Almost certainly benign.", management: "Follow-up per specific lesion characteristics. No surgical intervention typically needed." },
  3: { label: "3", name: "Low Risk", color: "bg-yellow-400", textColor: "text-yellow-700 dark:text-yellow-300", borderColor: "border-yellow-300 dark:border-yellow-700", bgColor: "bg-yellow-50 dark:bg-yellow-950/30", ppv: "~5%", description: "Low risk of malignancy.", management: "Follow-up or conservative management. Gynecologist referral." },
  4: { label: "4", name: "Intermediate Risk", color: "bg-orange-400", textColor: "text-orange-700 dark:text-orange-300", borderColor: "border-orange-300 dark:border-orange-700", bgColor: "bg-orange-50 dark:bg-orange-950/30", ppv: "~50%", description: "Intermediate risk of malignancy.", management: "Gynecologist with gyn-oncologist consultation." },
  5: { label: "5", name: "High Risk", color: "bg-red-500", textColor: "text-red-700 dark:text-red-300", borderColor: "border-red-400 dark:border-red-700", bgColor: "bg-red-50 dark:bg-red-950/30", ppv: "~90%", description: "High risk of malignancy.", management: "Gyn-oncologist referral." },
};

export const LESION_TYPES_MRI = [
  { value: "unilocular", label: "Unilocular cyst" },
  { value: "multilocular", label: "Multilocular cyst (≥ 2 compartments)" },
  { value: "lipid", label: "Lesion with lipid content" },
  { value: "dark_t2_dwi", label: "Dark T2 / Dark DWI solid tissue" },
  { value: "solid_tissue", label: "Lesion with solid tissue (not T2-dark)" },
  { value: "dilated_tube", label: "Dilated fallopian tube" },
  { value: "paraovarian", label: "Paraovarian cyst" },
  { value: "peritoneal", label: "Peritoneal / mesenteric / omental disease" },
];

export const FLUID_TYPES = [
  { value: "simple", label: "Simple", desc: "Low T1, high T2" },
  { value: "endometriotic", label: "Endometriotic", desc: "T1 bright, T2 shading" },
  { value: "proteinaceous", label: "Proteinaceous", desc: "T1 intermediate-high" },
  { value: "hemorrhagic", label: "Hemorrhagic", desc: "T1 hyperintense" },
  { value: "mucinous", label: "Mucinous", desc: "T1 variable, T2 bright/intermediate" },
];

export const TIC_OPTIONS = [
  { value: "low", label: "Low Risk TIC (Type I)", desc: "Gradual progressive enhancement — slow rise, no plateau or washout" },
  { value: "intermediate", label: "Intermediate Risk TIC (Type II)", desc: "Early moderate enhancement with plateau" },
  { value: "high", label: "High Risk TIC (Type III)", desc: "Rapid intense enhancement with plateau or washout" },
];

export function classifyMRI(data) {
  const notes = [];

  if (data.primaryFinding === "incomplete") return { category: 0, notes: ["Cannot characterize."] };
  if (data.primaryFinding === "normal") return { category: 1, notes: ["Normal ovaries / physiologic finding."] };

  // Peritoneal override
  if (data.peritonealNodularity || data.mesentericThickening || data.omentalNodularity) {
    notes.push("Peritoneal/mesenteric/omental nodularity or irregular thickening → O-RADS MRI 5.");
    return { category: 5, notes };
  }

  const { lesionType, fluidType, wallEnhancement, septationEnhancement, hasSolidTissue, isDarkT2DWI, ticType, dcePerformed, enhancementVsMyometrium, tubeWall, tubeFluid, lipidSolidVolume } = data;

  // Peritoneal disease type
  if (lesionType === "peritoneal") {
    notes.push("Peritoneal / mesenteric / omental disease.");
    return { category: 5, notes };
  }

  // Dark T2 / Dark DWI
  if (lesionType === "dark_t2_dwi") {
    notes.push("Homogeneously hypointense on T2W AND DWI — consistent with fibroma/Brenner.");
    return { category: 2, notes };
  }

  // Paraovarian cyst
  if (lesionType === "paraovarian") {
    notes.push("Paraovarian cyst with thin smooth wall, no enhancing solid tissue.");
    return { category: 2, notes };
  }

  // Dilated fallopian tube
  if (lesionType === "dilated_tube") {
    if (hasSolidTissue) {
      return classifySolidTissue(data, notes);
    }
    if (tubeFluid === "simple" && (tubeWall === "thin_smooth" || tubeWall === "thick_smooth")) {
      if (tubeWall === "thin_smooth") { notes.push("Dilated tube: simple fluid, thin smooth wall."); return { category: 2, notes }; }
      notes.push("Dilated tube: simple fluid, thick smooth wall.");
      return { category: 3, notes };
    }
    if (tubeFluid === "nonsimple" && tubeWall === "thin_smooth") {
      notes.push("Dilated tube: non-simple fluid, thin smooth wall.");
      return { category: 3, notes };
    }
    if (tubeWall === "irregular") {
      notes.push("Dilated tube: irregular wall.");
      return classifySolidTissue(data, notes);
    }
    notes.push("Dilated tube.");
    return { category: 3, notes };
  }

  // Lipid-containing
  if (lesionType === "lipid") {
    if (!hasSolidTissue) {
      notes.push("Lipid-containing lesion, no enhancing solid tissue.");
      return { category: 2, notes };
    }
    if (lipidSolidVolume === "large") {
      notes.push("Lipid-containing lesion with large-volume enhancing solid tissue.");
      return { category: 4, notes };
    }
    notes.push("Lipid-containing lesion with minimal solid tissue (Rokitansky nodule).");
    return { category: 2, notes };
  }

  // Unilocular cyst
  if (lesionType === "unilocular") {
    if (!hasSolidTissue) {
      if (wallEnhancement === "none") {
        notes.push("Unilocular cyst, no wall enhancement, no solid tissue.");
        return { category: 2, notes };
      }
      if (wallEnhancement === "smooth") {
        if (fluidType === "simple" || fluidType === "endometriotic") {
          notes.push(`Unilocular cyst, ${fluidType} fluid, smooth enhancing wall.`);
          return { category: 2, notes };
        }
        notes.push(`Unilocular cyst, ${fluidType} fluid, smooth enhancing wall.`);
        return { category: 3, notes };
      }
    }
    return classifySolidTissue(data, notes);
  }

  // Multilocular cyst
  if (lesionType === "multilocular") {
    if (!hasSolidTissue) {
      if (septationEnhancement === "smooth" || wallEnhancement === "smooth") {
        notes.push("Multilocular cyst, smooth septae/wall with enhancement, no solid tissue.");
        return { category: 3, notes };
      }
      notes.push("Multilocular cyst, no enhancing solid tissue.");
      return { category: 2, notes };
    }
    return classifySolidTissue(data, notes);
  }

  // Solid tissue lesion
  if (lesionType === "solid_tissue") {
    return classifySolidTissue(data, notes);
  }

  return { category: 0, notes: ["Insufficient data."] };
}

function classifySolidTissue(data, notes) {
  const { ticType, dcePerformed, enhancementVsMyometrium } = data;

  if (dcePerformed === true || dcePerformed === "yes") {
    if (ticType === "low") {
      notes.push("Solid tissue with low risk TIC (type I) — gradual enhancement.");
      return { category: 3, notes };
    }
    if (ticType === "intermediate") {
      notes.push("Solid tissue with intermediate risk TIC (type II) — plateau.");
      return { category: 4, notes };
    }
    if (ticType === "high") {
      notes.push("Solid tissue with high risk TIC (type III) — rapid enhancement ± washout.");
      return { category: 5, notes };
    }
  }

  // Non-DCE fallback
  notes.push("DCE not performed — using non-DCE fallback.");
  if (enhancementVsMyometrium === "leq") {
    notes.push("Enhancement ≤ myometrium at 30–40s → intermediate risk.");
    return { category: 4, notes };
  }
  if (enhancementVsMyometrium === "gt") {
    notes.push("Enhancement > myometrium at 30–40s → high risk.");
    return { category: 5, notes };
  }

  notes.push("Solid tissue present — DCE assessment needed for final scoring.");
  return { category: 4, notes };
}

export function generateMRIReport(data, result) {
  const lines = [];
  lines.push("O-RADS MRI — STRUCTURED REPORT");
  lines.push("");
  if (data.menoStatus) lines.push(`Menopausal Status: ${data.menoStatus}`);
  lines.push(`DCE Performed: ${data.dcePerformed ? "Yes" : "No"}`);
  lines.push("");
  lines.push("FINDINGS:");

  const lt = LESION_TYPES_MRI.find(t => t.value === data.lesionType);
  lines.push(`Lesion type: ${lt?.label || data.lesionType || "N/A"}`);
  if (data.fluidType) lines.push(`Fluid content: ${data.fluidType}`);
  if (data.wallEnhancement) lines.push(`Wall enhancement: ${data.wallEnhancement}`);
  if (data.septationEnhancement) lines.push(`Septation enhancement: ${data.septationEnhancement}`);
  lines.push(`Solid tissue: ${data.hasSolidTissue ? "Present" : "None"}`);
  if (data.ticType) {
    const tic = TIC_OPTIONS.find(t => t.value === data.ticType);
    lines.push(`TIC: ${tic?.label || data.ticType}`);
  }
  if (data.peritonealNodularity) lines.push("Peritoneal nodularity: Present");
  if (data.omentalNodularity) lines.push("Omental nodularity/cake: Present");
  if (data.ascitesMri) lines.push("Ascites: Present");

  lines.push("");
  lines.push("IMPRESSION:");
  const cat = ORADS_MRI_CATEGORIES[result.category];
  lines.push(`O-RADS MRI ${cat.label} — ${cat.name} (PPV: ${cat.ppv}).`);
  lines.push(cat.description);
  lines.push(`Management: ${cat.management}`);
  if (result.notes?.length) result.notes.forEach(n => lines.push(`Note: ${n}`));

  return lines.join("\n");
}