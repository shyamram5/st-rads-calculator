import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2B — "Cyst-like" or "high water content" Soft Tissue Lesion
  
  MANUSCRIPT FIGURE (image 3):
  ─────────────────────────────
  "Cyst-like" or "high water content" Soft Tissue Lesion
  ├─ Communicates with joint, tendon sheath, bursa
  │  OR Cutaneous or subcutaneous location
  │  OR Intra-neural location
  │  → Soft Tissue RADS-2
  └─ No communication with joint, tendon sheath, bursa
     OR deeper location¹
     ├─ Predominantly comprised of flow voids or fluid-fluid levels
     │                                                          │
     │      ┌── features suggesting hematoma ──┐                │
     │      │ (shared box between flow paths)  │                │
     │      └──────────────────────────────────┘                │
     │         ↓                                                │
     │      Soft Tissue RADS-3                                  │
     │      (Hematoma / Chronic expanding hematoma)             │
     │                                                          │
     │  Soft Tissue RADS-2                                      │
     │  (Low/high-flow vascular malformation, Aneurysm, etc.)  │
     │                                                          │
     └─ Not predominantly comprised of flow voids or fluid-fluid levels
        ├─ Absence of thick enhancing septations and small mural nodule(s) <1 cm
        │  → Soft Tissue RADS-3 / Soft Tissue RADS-4
        └─ Presence of thick enhancing septations and/or mural nodule(s)
           ≥1 cm or larger soft tissue component
           → Soft Tissue RADS-5*

  RULE ENGINE MAPPING:
  ─────────────────────
  - cystLocation === "superficial_communicating" → RADS-2
  - cystLocation === "deep_non_communicating":
    - cystFlow === "yes":
      - cystHematoma === "yes" → RADS-3
      - cystHematoma === "no" (or undefined) → RADS-2
    - cystFlow === "no":
      - cystSeptationNodules === "absent" → RADS-3 (or 4, radiologist choice)
      - cystSeptationNodules === "present" → RADS-5

  WIZARD:
  ────────
  - cystHematoma is ONLY asked when cystFlow === "yes"
  - cystSeptationNodules is ONLY asked when cystFlow === "no"
*/

export default function Figure2BChart({ caseData, finalScore }) {
  const loc = caseData.cystLocation;
  const flow = caseData.cystFlow;
  const hem = caseData.cystHematoma;
  const sept = caseData.cystSeptationNodules;

  const hSuper = loc === "superficial_communicating";
  const hDeep = loc === "deep_non_communicating";
  const hFlowYes = hDeep && flow === "yes";
  const hFlowNo = hDeep && flow === "no";

  // Flow-yes sub-paths
  const hHemYes = hFlowYes && hem === "yes";
  const hHemNo = hFlowYes && (hem === "no" || !hem);

  // Flow-no sub-paths
  const hSeptAbsent = hFlowNo && sept === "absent";
  const hSeptPresent = hFlowNo && sept === "present";

  return (
    <div className="flex flex-col items-center">
      <N label={'"Cyst-like" or "high water content" Soft Tissue Lesion'} isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        {/* LEFT: Communicates / superficial / intraneural → RADS-2 */}
        <div className="flex flex-col items-center">
          <N label="Communicates with joint, tendon sheath, bursa OR Cutaneous or subcutaneous location OR Intra-neural location" isHighlighted={hSuper} className="max-w-[170px]" />
          <Stem h={hSuper} />
          <N type="score" score={2} isHighlighted={hSuper} isActive={hSuper && finalScore === 2} />
        </div>

        {/* RIGHT: No communication / deeper location */}
        <div className="flex flex-col items-center">
          <N label="No communication with joint, tendon sheath, bursa OR deeper location¹" isHighlighted={hDeep} className="max-w-[170px]" />
          <TreeFork parentHighlighted={hDeep}>
            {/* Flow voids path */}
            <div className="flex flex-col items-center">
              <N label="Predominantly comprised of flow voids or fluid-fluid levels" isHighlighted={hFlowYes} className="max-w-[135px]" />
              {/* Hematoma decision — per manuscript this sits between flow paths visually */}
              <Stem h={hFlowYes} />
              <N label="Features suggesting hematoma" isHighlighted={hFlowYes} className="max-w-[115px]" />
              <TreeFork parentHighlighted={hFlowYes}>
                <div className="flex flex-col items-center">
                  <N label="No" isHighlighted={hHemNo} className="max-w-[50px]" />
                  <Stem h={hHemNo} />
                  <N type="score" score={2} isHighlighted={hHemNo} isActive={hHemNo && finalScore === 2} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="Yes" isHighlighted={hHemYes} className="max-w-[50px]" />
                  <Stem h={hHemYes} />
                  <N type="score" score={3} isHighlighted={hHemYes} isActive={hHemYes && finalScore === 3} />
                </div>
              </TreeFork>
            </div>

            {/* Not flow voids path → septation fork */}
            <div className="flex flex-col items-center">
              <N label="Not predominantly comprised of flow voids or fluid-fluid levels" isHighlighted={hFlowNo} className="max-w-[135px]" />
              <TreeFork parentHighlighted={hFlowNo}>
                <div className="flex flex-col items-center">
                  <N label="Absence of thick enhancing septations and small mural nodule(s) <1 cm" isHighlighted={hSeptAbsent} className="max-w-[125px]" />
                  <Stem h={hSeptAbsent} />
                  <div className="flex gap-1.5">
                    <N type="score" score={3} isHighlighted={hSeptAbsent} isActive={hSeptAbsent && (finalScore === 3)} />
                    <N type="score" score={4} isHighlighted={hSeptAbsent} isActive={hSeptAbsent && (finalScore === 4)} />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <N label="Presence of thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft tissue component" isHighlighted={hSeptPresent} className="max-w-[125px]" />
                  <Stem h={hSeptPresent} />
                  <N type="score" score={5} isHighlighted={hSeptPresent} isActive={hSeptPresent && finalScore === 5} />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}