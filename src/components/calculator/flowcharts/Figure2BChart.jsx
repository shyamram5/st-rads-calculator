import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2B — "Cyst-like" or "High Water Content" Soft Tissue Lesion

  "Cyst-like" or "high water content" soft tissue lesion
  ├─ Communicates with joint/tendon sheath/bursa OR cutaneous/subcutaneous OR intraneural
  │   → ST-RADS 2
  └─ Deep (subfascial), no communication
      ├─ Predominantly flow voids / fluid-fluid levels
      │   ├─ Hematoma features → ST-RADS 3
      │   └─ No hematoma → ST-RADS 2
      └─ Not predominantly flow voids
          ├─ Hematoma features → ST-RADS 3
          └─ No hematoma
              ├─ Absence of thick enhancing septations and small mural nodule(s) <1 cm → ST-RADS 3 or 4
              └─ Thick enhancing septations and/or mural nodule(s) ≥1 cm → ST-RADS 5
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
  const hFlowHemYes = hFlowYes && hem === "yes";
  const hFlowHemNo = hFlowYes && hem === "no";
  const hNoFlowHemYes = hFlowNo && hem === "yes";
  const hNoFlowHemNo = hFlowNo && hem === "no";
  const hSeptAbsent = hNoFlowHemNo && sept === "absent";
  const hSeptPresent = hNoFlowHemNo && sept === "present";

  return (
    <div className="flex flex-col items-center">
      <N label={'"Cyst-like" or "high water content" soft tissue lesion'} isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        {/* LEFT: Communicating / superficial → RADS 2 */}
        <div className="flex flex-col items-center">
          <N label="Communicates with joint / tendon sheath / bursa OR cutaneous / subcutaneous OR intraneural" isHighlighted={hSuper} className="max-w-[155px]" />
          <Stem h={hSuper} />
          <N type="score" score={2} isHighlighted={hSuper} isActive={hSuper && finalScore === 2} />
        </div>

        {/* RIGHT: Deep, no communication */}
        <div className="flex flex-col items-center">
          <N label="Deep (subfascial), no communication" isHighlighted={hDeep} className="max-w-[145px]" />
          <TreeFork parentHighlighted={hDeep}>
            {/* Flow voids present */}
            <div className="flex flex-col items-center">
              <N label="Predominantly flow voids / fluid-fluid levels" isHighlighted={hFlowYes} className="max-w-[125px]" />
              <TreeFork parentHighlighted={hFlowYes}>
                <div className="flex flex-col items-center">
                  <N label="Hematoma features" isHighlighted={hFlowHemYes} className="max-w-[95px]" />
                  <Stem h={hFlowHemYes} />
                  <N type="score" score={3} isHighlighted={hFlowHemYes} isActive={hFlowHemYes && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="No hematoma" isHighlighted={hFlowHemNo} className="max-w-[95px]" />
                  <Stem h={hFlowHemNo} />
                  <N type="score" score={2} isHighlighted={hFlowHemNo} isActive={hFlowHemNo && finalScore === 2} />
                </div>
              </TreeFork>
            </div>

            {/* No flow voids */}
            <div className="flex flex-col items-center">
              <N label="Not predominantly flow voids" isHighlighted={hFlowNo} className="max-w-[125px]" />
              <TreeFork parentHighlighted={hFlowNo}>
                <div className="flex flex-col items-center">
                  <N label="Hematoma features" isHighlighted={hNoFlowHemYes} className="max-w-[95px]" />
                  <Stem h={hNoFlowHemYes} />
                  <N type="score" score={3} isHighlighted={hNoFlowHemYes} isActive={hNoFlowHemYes && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="No hematoma" isHighlighted={hNoFlowHemNo} className="max-w-[95px]" />
                  <TreeFork parentHighlighted={hNoFlowHemNo}>
                    <div className="flex flex-col items-center">
                      <N label="Absence of thick enhancing septations and small mural nodule(s) <1 cm" isHighlighted={hSeptAbsent} className="max-w-[115px]" />
                      <Stem h={hSeptAbsent} />
                      <N type="score" score={3} isHighlighted={hSeptAbsent} isActive={hSeptAbsent && (finalScore === 3 || finalScore === 4)} />
                    </div>
                    <div className="flex flex-col items-center">
                      <N label="Thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft tissue component" isHighlighted={hSeptPresent} className="max-w-[115px]" />
                      <Stem h={hSeptPresent} />
                      <N type="score" score={5} isHighlighted={hSeptPresent} isActive={hSeptPresent && finalScore === 5} />
                    </div>
                  </TreeFork>
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}