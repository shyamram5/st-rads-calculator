import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 1 — Suspected Soft Tissue Lesion (exact manuscript match)

  Suspected Soft Tissue Lesion
  ├─ Incomplete imaging → Soft tissue RADS-0
  └─ Complete imaging
      ├─ No soft tissue lesion → Soft tissue RADS-1*
      └─ Soft tissue lesion
          ├─ No macroscopic fat on T1W
          │   ├─ No variable high signal on T2W OR >20% enhancement on T1W+C
          │   │   → "Indeterminate solid" algorithm
          │   └─ Markedly high signal on T2W AND <20% enhancement on T1W+C
          │       → "Cyst-like" or "high water content" algorithm
          └─ Macroscopic fat on T1W**
              → "Lipomatous" algorithm
*/

export default function Figure1Chart({ caseData, finalScore }) {
  const ea = caseData.examAdequacy;
  const lp = caseData.lesionPresent;
  const fat = caseData.macroscopicFatT1W;
  const t2 = caseData.t2EnhancementPath;

  const hIncomplete = ea === "incomplete";
  const hComplete = ea === "complete";
  const hNoLesion = hComplete && lp === "no";
  const hLesion = hComplete && lp === "yes";
  const hNoFat = hLesion && fat === "no";
  const hFat = hLesion && fat === "yes";
  const hSolid = hNoFat && t2 === "indeterminate_solid";
  const hCyst = hNoFat && t2 === "cystlike";

  return (
    <div className="flex flex-col items-center">
      <N label="Suspected Soft Tissue Lesion" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        {/* Incomplete → RADS 0 */}
        <div className="flex flex-col items-center">
          <N label="Incomplete imaging" isHighlighted={hIncomplete} className="max-w-[120px]" />
          <Stem h={hIncomplete} />
          <N type="score" score={0} isHighlighted={hIncomplete} isActive={hIncomplete && finalScore === 0} />
        </div>

        {/* Complete imaging */}
        <div className="flex flex-col items-center">
          <N label="Complete imaging" isHighlighted={hComplete} className="max-w-[120px]" />
          <TreeFork parentHighlighted={hComplete}>
            {/* No soft tissue lesion → RADS 1 */}
            <div className="flex flex-col items-center">
              <N label="No soft tissue lesion" isHighlighted={hNoLesion} className="max-w-[120px]" />
              <Stem h={hNoLesion} />
              <N type="score" score={1} isHighlighted={hNoLesion} isActive={hNoLesion && finalScore === 1} />
            </div>

            {/* Soft tissue lesion */}
            <div className="flex flex-col items-center">
              <N label="Soft tissue lesion" isHighlighted={hLesion} className="max-w-[120px]" />
              <TreeFork parentHighlighted={hLesion}>
                {/* No macroscopic fat → T2/enh fork */}
                <div className="flex flex-col items-center">
                  <N label="No macroscopic fat on T1W" isHighlighted={hNoFat} className="max-w-[130px]" />
                  <TreeFork parentHighlighted={hNoFat}>
                    <div className="flex flex-col items-center">
                      <N label='No variable high signal on T2W OR >20% enhancement on T1W+C' isHighlighted={hSolid} className="max-w-[140px]" />
                      <Stem h={hSolid} />
                      <N type="pathway" label={'Determine Soft Tissue-RADS Score by following "Indeterminate solid" Soft Tissue Lesion Algorithm'} isHighlighted={hSolid} className="max-w-[155px]" />
                    </div>
                    <div className="flex flex-col items-center">
                      <N label='Markedly high signal on T2W AND <20% enhancement on T1W+C' isHighlighted={hCyst} className="max-w-[140px]" />
                      <Stem h={hCyst} />
                      <N type="pathway" label={'Determine Soft Tissue-RADS Score by following "Cyst-like" or "high water content" Soft Tissue Lesion Algorithm'} isHighlighted={hCyst} className="max-w-[155px]" />
                    </div>
                  </TreeFork>
                </div>

                {/* Macroscopic fat on T1W** */}
                <div className="flex flex-col items-center">
                  <N label="Macroscopic fat on T1W**" isHighlighted={hFat} className="max-w-[130px]" />
                  <Stem h={hFat} />
                  <N type="pathway" label={'Determine Soft Tissue-RADS Score by following "Lipomatous" Soft Tissue Lesion Algorithm'} isHighlighted={hFat} className="max-w-[155px]" />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}