// ═══════════════════════════════════════════════════════════════════
// ACR Lung-RADS® v2022 — Deterministic Rule Engine
// ═══════════════════════════════════════════════════════════════════

export const CATEGORIES = {
  "0": {
    label: "0", name: "Incomplete", color: "bg-slate-400", textColor: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-300 dark:border-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-800/40",
    prevalence: "~1%",
    description: "Prior CT being located OR part/all of lungs cannot be evaluated OR findings suggesting inflammatory/infectious process.",
    management: "Obtain comparison CT; additional LDCT imaging needed; 1–3 month LDCT for inflammatory/infectious findings.",
  },
  "1": {
    label: "1", name: "Negative", color: "bg-green-500", textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    prevalence: "~39%",
    description: "No nodules OR nodule with definitively benign features (calcification pattern or fat).",
    management: "12-month screening LDCT.",
  },
  "2": {
    label: "2", name: "Benign Appearance or Behavior", color: "bg-lime-400", textColor: "text-lime-700 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    bgColor: "bg-lime-50 dark:bg-lime-950/30",
    prevalence: "~45%",
    description: "Nodule(s) with benign appearance or behavior based on size, morphology, and/or stability.",
    management: "12-month screening LDCT.",
  },
  "3": {
    label: "3", name: "Probably Benign", color: "bg-yellow-400", textColor: "text-yellow-700 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    prevalence: "~9%",
    description: "Probably benign finding(s) for which short-term follow-up is suggested.",
    management: "6-month LDCT.",
  },
  "4A": {
    label: "4A", name: "Suspicious", color: "bg-orange-400", textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    prevalence: "~4%",
    description: "Suspicious finding(s) for which additional diagnostic testing is recommended.",
    management: "3-month LDCT. PET/CT may be considered if solid nodule or solid component ≥ 8 mm.",
  },
  "4B": {
    label: "4B", name: "Very Suspicious", color: "bg-red-500", textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    prevalence: "~2%",
    description: "Very suspicious finding(s) for which tissue sampling or further clinical evaluation is recommended.",
    management: "Referral for further clinical evaluation; diagnostic chest CT ± contrast; PET/CT consideration if solid ≥ 8 mm; tissue sampling; clinical referral. Management depends on clinical evaluation, comorbidities, patient preference, and probability of malignancy.",
  },
  "4X": {
    label: "4X", name: "Very Suspicious + Additional Malignancy Features", color: "bg-red-700", textColor: "text-red-800 dark:text-red-200",
    borderColor: "border-red-400 dark:border-red-700",
    bgColor: "bg-red-100 dark:bg-red-950/40",
    prevalence: "<1%",
    description: "Very suspicious finding(s) with additional features increasing suspicion for malignancy beyond nodule size alone.",
    management: "Same as 4B — diagnostic CT, PET/CT consideration, tissue sampling, referral.",
  },
};

// ═══════════════════════════════════════════════════════════════════
// Size threshold tables
// ═══════════════════════════════════════════════════════════════════

function classifyBaselineSolid(meanDiam) {
  if (meanDiam < 6) return "2";
  if (meanDiam < 8) return "3";
  if (meanDiam < 15) return "4A";
  return "4B";
}

function classifyBaselinePartSolid(totalMeanDiam, solidMeanDiam) {
  if (totalMeanDiam < 6) return "2";
  if (solidMeanDiam < 6) return "3";
  if (solidMeanDiam < 8) return "4A";
  return "4B";
}

function classifyBaselineGGN(meanDiam) {
  if (meanDiam < 30) return "2";
  return "3";
}

function classifyNewSolid(meanDiam) {
  if (meanDiam < 4) return "2";
  if (meanDiam < 6) return "3";
  if (meanDiam < 8) return "4A";
  return "4B";
}

function classifyNewPartSolid(totalMeanDiam, solidMeanDiam) {
  if (totalMeanDiam < 6) return "3";
  if (solidMeanDiam < 4) return "4A";
  return "4B";
}

function classifyNewGGN() {
  return "3";
}

// ═══════════════════════════════════════════════════════════════════
// Growth logic (follow-up, existing nodule)
// ═══════════════════════════════════════════════════════════════════

function classifyFollowUpSolid(meanDiam, behavior) {
  if (behavior === "stable" || behavior === "decreased") {
    // Apply baseline thresholds for stable
    return classifyBaselineSolid(meanDiam);
  }
  if (behavior === "growing") {
    if (meanDiam < 8) return "4A";
    return "4B";
  }
  if (behavior === "slow_growing") {
    return "4B";
  }
  return classifyBaselineSolid(meanDiam);
}

function classifyFollowUpPartSolid(totalMeanDiam, solidMeanDiam, behavior) {
  if (behavior === "stable" || behavior === "decreased") {
    return classifyBaselinePartSolid(totalMeanDiam, solidMeanDiam);
  }
  if (behavior === "growing") {
    if (solidMeanDiam < 4) return "4A";
    return "4B";
  }
  if (behavior === "slow_growing") {
    return "4B";
  }
  return classifyBaselinePartSolid(totalMeanDiam, solidMeanDiam);
}

function classifyFollowUpGGN(meanDiam, behavior) {
  if (behavior === "stable" || behavior === "decreased") {
    return classifyBaselineGGN(meanDiam);
  }
  if (behavior === "growing") {
    return "4A";
  }
  if (behavior === "slow_growing") {
    return "4B";
  }
  return classifyBaselineGGN(meanDiam);
}

// ═══════════════════════════════════════════════════════════════════
// Main classification function
// ═══════════════════════════════════════════════════════════════════

export function classifyNodule(nodule) {
  const notes = [];
  let category = null;

  // Step 0: Exam context
  if (nodule.examType === "followup" && nodule.priorsAvailable === "being_located") {
    return { category: "0", notes: ["Lung-RADS 0 — prior CT being located. Classification pending comparison."], appliedNotes: [1] };
  }

  // Inflammatory/infectious override
  if (nodule.inflammatoryProcess === "yes_infection") {
    return { category: "0", notes: ["Findings suggesting inflammatory/infectious process. Consider 1–3 month LDCT follow-up."], appliedNotes: [14] };
  }

  // Step 1: No nodule / benign features
  if (nodule.noduleType === "none") {
    return { category: "1", notes: ["No lung nodule detected."], appliedNotes: [] };
  }

  if (nodule.benignFeatures === "yes") {
    return { category: "1", notes: ["Nodule with definitively benign features (calcification or fat)."], appliedNotes: [2] };
  }

  // Step 1 branching by nodule type
  const isBaseline = nodule.examType === "baseline";
  const isNew = nodule.noduleStatus === "new";
  const behavior = nodule.noduleBehavior;

  // Juxtapleural
  if (nodule.noduleType === "juxtapleural") {
    if (nodule.juxtapleuralShape === "benign_pattern" && nodule.meanDiameter < 10) {
      return { category: "2", notes: ["Juxtapleural nodule: solid, smooth margins, oval/lentiform/triangular, < 10 mm — consistent with intrapulmonary lymph node."], appliedNotes: [5] };
    }
    // Otherwise treat as solid
    notes.push("Juxtapleural nodule not meeting intrapulmonary lymph node criteria — classified as solid nodule.");
    if (isBaseline) {
      category = classifyBaselineSolid(nodule.meanDiameter);
    } else if (isNew) {
      category = classifyNewSolid(nodule.meanDiameter);
    } else {
      category = classifyFollowUpSolid(nodule.meanDiameter, behavior);
    }
  }

  // Airway
  else if (nodule.noduleType === "airway") {
    if (nodule.airwayLocation === "subsegmental") {
      category = "2";
      notes.push("Subsegmental/multiple tubular airway finding — favors infectious/inflammatory process.");
    } else if (nodule.airwayLocation === "segmental_baseline") {
      category = "4A";
      notes.push("Segmental or more proximal airway finding at baseline — referral for bronchoscopy consideration.");
    } else {
      category = "4B";
      notes.push("Segmental or more proximal airway finding, stable or growing on follow-up — referral for further clinical evaluation.");
    }
  }

  // Atypical cyst
  else if (nodule.noduleType === "cyst") {
    if (nodule.cystType === "thin_walled") {
      return { category: "1", notes: ["Thin-walled (< 2 mm) unilocular cyst with uniform wall — benign, not classified in Lung-RADS."], appliedNotes: [12] };
    }
    
    const isFollowUp = !isBaseline;
    if (nodule.cystChanging === "growing_wall" || nodule.cystChanging === "growing_multilocular" || nodule.cystChanging === "increased_opacity") {
      category = "4B";
      notes.push("Atypical cyst with growing/worsening features on follow-up.");
    } else if (nodule.cystChanging === "growing_cystic_component") {
      category = "3";
      notes.push("Growing cystic component of thick-walled cyst.");
    } else if (isFollowUp && nodule.cystChanging === "stable") {
      category = nodule.cystType === "thick_walled" || nodule.cystType === "multilocular" ? "4A" : "3";
    } else {
      // Baseline
      if (nodule.cystType === "thick_walled" || nodule.cystType === "multilocular" || nodule.cystType === "became_multilocular") {
        category = "4A";
        notes.push("Atypical pulmonary cyst at baseline — thick-walled/multilocular.");
      } else {
        category = "3";
      }
    }

    // Associated nodule
    if (nodule.cystAssociatedNodule === "yes") {
      notes.push("Associated nodule present — manage based on most concerning feature.");
    }
  }

  // Solid nodule
  else if (nodule.noduleType === "solid") {
    if (isBaseline) {
      category = classifyBaselineSolid(nodule.meanDiameter);
    } else if (isNew) {
      category = classifyNewSolid(nodule.meanDiameter);
      notes.push("New solid nodule — lower size thresholds applied.");
    } else {
      category = classifyFollowUpSolid(nodule.meanDiameter, behavior);
      if (behavior === "growing") notes.push("Growing solid nodule (>1.5 mm increase in 12-month interval).");
      if (behavior === "slow_growing") notes.push("Slow-growing solid nodule — may not show increased PET activity; biopsy/surgical evaluation may be preferred over PET.");
    }
  }

  // Part-solid nodule
  else if (nodule.noduleType === "part_solid") {
    const totalDiam = nodule.totalMeanDiameter || nodule.meanDiameter;
    const solidDiam = nodule.solidMeanDiameter || 0;

    if (isBaseline) {
      category = classifyBaselinePartSolid(totalDiam, solidDiam);
    } else if (isNew) {
      category = classifyNewPartSolid(totalDiam, solidDiam);
      notes.push("New part-solid nodule — lower size thresholds applied.");
    } else {
      category = classifyFollowUpPartSolid(totalDiam, solidDiam, behavior);
      if (behavior === "growing") notes.push("Growing part-solid nodule.");
      if (behavior === "slow_growing") notes.push("Slow-growing part-solid nodule.");
    }
  }

  // GGN
  else if (nodule.noduleType === "ggn") {
    if (isBaseline) {
      category = classifyBaselineGGN(nodule.meanDiameter);
    } else if (isNew) {
      category = classifyNewGGN();
      notes.push("New ground glass nodule.");
    } else {
      category = classifyFollowUpGGN(nodule.meanDiameter, behavior);
      if (behavior === "growing") notes.push("Growing GGN.");
    }
  }

  if (!category) category = "0";

  // Prior category downgrade
  if (nodule.priorCategory === "3" && (behavior === "stable" || behavior === "decreased")) {
    category = "2";
    notes.push("Previously Category 3, now stable/decreased at 6-month follow-up — downgraded to Category 2.");
  }
  if (nodule.priorCategory === "4A" && (behavior === "stable" || behavior === "decreased") && nodule.noduleType !== "airway") {
    category = "3";
    notes.push("Previously Category 4A, now stable/decreased at 3-month follow-up — downgraded to Category 3.");
  }
  if (nodule.priorCategory === "4B" && nodule.provenBenign === "yes") {
    category = "2";
    notes.push("Previously Category 4B, proven benign after diagnostic workup — downgraded to Category 2.");
  }

  // 4X check
  if (nodule.suspiciousFeatures && nodule.suspiciousFeatures.length > 0 && (category === "3" || category.startsWith("4"))) {
    category = "4X";
    notes.push("Additional features increasing malignancy suspicion — classified as 4X.");
  }

  // Inflammatory override for 4B
  if (nodule.inflammatoryProcess === "yes_malignancy" && (category === "4A" || category === "4B")) {
    notes.push("Inflammatory/infectious findings present but imaging features more concerning for malignancy.");
  }

  // Collect applicable footnote numbers
  const appliedNotes = [];
  if (behavior === "slow_growing") appliedNotes.push(8);
  if (nodule.noduleType === "airway") appliedNotes.push(11);
  if (nodule.noduleType === "cyst") appliedNotes.push(12);
  if (nodule.noduleType === "juxtapleural") appliedNotes.push(5);
  if (isNew) appliedNotes.push(7);
  if (nodule.suspiciousFeatures?.length > 0) appliedNotes.push(10);
  if (nodule.sModifier) appliedNotes.push(15);

  return { category, notes, appliedNotes };
}

// ═══════════════════════════════════════════════════════════════════
// Multi-nodule: pick highest category
// ═══════════════════════════════════════════════════════════════════

const CATEGORY_ORDER = ["1", "2", "3", "4A", "4B", "4X"];

export function getHighestCategory(categories) {
  let maxIdx = -1;
  categories.forEach(c => {
    const idx = CATEGORY_ORDER.indexOf(c);
    if (idx > maxIdx) maxIdx = idx;
  });
  return maxIdx >= 0 ? CATEGORY_ORDER[maxIdx] : "0";
}

// ═══════════════════════════════════════════════════════════════════
// Report generation
// ═══════════════════════════════════════════════════════════════════

export function generateReport(nodule, result) {
  const lines = [];
  lines.push("FINDINGS:");

  const typeLabels = {
    solid: "Solid nodule", part_solid: "Part-solid nodule", ggn: "Non-solid (ground glass) nodule",
    airway: "Airway nodule", cyst: "Atypical pulmonary cyst", juxtapleural: "Juxtapleural nodule", none: "No nodule"
  };
  lines.push(`Nodule type: ${typeLabels[nodule.noduleType] || nodule.noduleType}`);

  if (nodule.noduleType === "part_solid") {
    lines.push(`Total mean diameter: ${nodule.totalMeanDiameter || nodule.meanDiameter} mm`);
    lines.push(`Solid component mean diameter: ${nodule.solidMeanDiameter || 0} mm`);
  } else if (nodule.meanDiameter) {
    lines.push(`Mean diameter: ${nodule.meanDiameter} mm`);
  }
  if (nodule.volume) lines.push(`Volume: ${nodule.volume} mm³`);

  if (nodule.examType === "followup") {
    if (nodule.noduleStatus === "new") {
      lines.push("Status: New nodule on follow-up exam.");
    } else if (nodule.noduleBehavior) {
      const behaviorLabels = { stable: "Stable", growing: "Growing (>1.5 mm/12 mo)", decreased: "Decreased", slow_growing: "Slow-growing" };
      lines.push(`Behavior: ${behaviorLabels[nodule.noduleBehavior] || nodule.noduleBehavior}`);
    }
  }

  result.notes.forEach(n => lines.push(n));

  lines.push("");
  lines.push("IMPRESSION:");

  const cat = CATEGORIES[result.category];
  lines.push(`Lung-RADS ${cat.label}${nodule.sModifier ? "S" : ""} — ${cat.name}.`);
  lines.push(`Management: ${cat.management}`);

  if (nodule.sModifier) {
    lines.push("S modifier: Clinically significant incidental finding present. Manage per ACR Incidental Findings guidelines.");
  }

  if (result.category === "4B" || result.category === "4X") {
    lines.push("Consider McWilliams risk calculator for malignancy probability estimation.");
  }

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════
// Footnotes
// ═══════════════════════════════════════════════════════════════════

export const FOOTNOTES = {
  1: "Prior chest CT comparison: For patients with no priors being located, classify as Category 0 pending comparison.",
  2: "Definitively benign: Complete/central/popcorn/concentric ring calcifications or fat-containing nodules = Category 1.",
  3: "Measurement: Mean diameter = (long axis + short axis) ÷ 2. Do not include ground glass when measuring solid component. Spiculations excluded.",
  4: "Size thresholds: Baseline solid: <6 mm = Cat 2, 6–<8 = Cat 3, 8–<15 = Cat 4A, ≥15 = Cat 4B.",
  5: "Juxtapleural: Solid, smooth, oval/lentiform/triangular, <10 mm = intrapulmonary lymph node (Category 2).",
  6: "Part-solid: Solid component drives management. Measure solid and total independently.",
  7: "New nodule thresholds are lower than baseline because new nodules on follow-up carry higher clinical concern.",
  8: "Slow growth: Nodule growing over multiple exams but <1.5 mm/12 months may be 4B. May not show increased PET activity; biopsy/surgery may be preferred.",
  9: "Growth definition: >1.5 mm mean diameter increase (>2 mm³ volume) within 12-month interval.",
  10: "4X: Additional features (spiculation, lymphadenopathy, metastatic pattern, GGN doubling in <1 year) — 4X is a DISTINCT category, not a modifier.",
  11: "Airway: Subsegmental/tubular favors infection = Cat 2. Segmental/proximal at baseline = 4A; stable/growing on follow-up = 4B.",
  12: "Atypical cysts: Only thick-walled (≥2 mm), multilocular, or cysts with nodules enter Lung-RADS. Thin-walled simple cysts are benign.",
  13: "Downgrade: Cat 3 stable at 6 mo → Cat 2. Cat 4A stable at 3 mo (non-airway) → Cat 3. Cat 4B proven benign → Cat 2.",
  14: "Inflammatory/infectious: Segmental consolidation, >6 new nodules, large solid nodules in short interval — consider Cat 0 with 1–3 mo LDCT.",
  15: "S modifier: Significant incidental findings unrelated to lung cancer. Manage per ACR Incidental Findings guidelines.",
  16: "Final exam category = highest category among all nodules. All nodules described individually in report.",
};