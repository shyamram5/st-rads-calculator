import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 1 — Suspected Soft Tissue Lesion on MRI
  Faithfully follows calculateSTRADS() in stradsRuleEngine.js

  Suspected soft tissue lesion on MRI
  ├─ Incomplete imaging → ST-RADS 0
  └─ Complete imaging
      ├─ No soft tissue lesion → ST-RADS 1
      └─ Soft tissue lesion present
          ├─ Macroscopic fat on T1W: YES → Lipomatous algorithm (Fig 2A)
          └─ Macroscopic fat on T1W: NO
              ├─ Markedly high T2 AND <20% enhancement → Cyst-like algorithm (Fig 2B)
              └─ Variable T2 OR >20% enhancement → Indeterminate solid (Fig 2C/2D)
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
  const hFatYes = hLesion && fat === "yes";
  const hFatNo = hLesion && fat === "no";
  const hCyst = hFatNo && t2 === "cystlike";
  const hSolid = hFatNo && t2 === "indeterminate_solid";

  return (
    <div className="flex flex-col items-center">
      <N label="Suspected soft tissue lesion on MRI" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        {/* Incomplete → RADS 0 */}
        <div className="flex flex-col items-center">
          <N label="Incomplete imaging" isHighlighted={hIncomplete} className="max-w-[120px]" />
          <Stem h={hIncomplete} />
          <N type="score" score={0} isHighlighted={hIncomplete} isActive={hIncomplete && finalScore === 0} />
        </div>

        {/* Complete */}
        <div className="flex flex-col items-center">
          <N label="Complete imaging" isHighlighted={hComplete} className="max-w-[120px]" />
          <TreeFork parentHighlighted={hComplete}>
            {/* No lesion → RADS 1 */}
            <div className="flex flex-col items-center">
              <N label="No soft tissue lesion" isHighlighted={hNoLesion} className="max-w-[110px]" />
              <Stem h={hNoLesion} />
              <N type="score" score={1} isHighlighted={hNoLesion} isActive={hNoLesion && finalScore === 1} />
            </div>

            {/* Lesion present */}
            <div className="flex flex-col items-center">
              <N label="Soft tissue lesion present" isHighlighted={hLesion} className="max-w-[120px]" />
              <TreeFork parentHighlighted={hLesion}>
                {/* Fat YES → lipomatous */}
                <div className="flex flex-col items-center">
                  <N label="Macroscopic fat on T1W: YES" isHighlighted={hFatYes} className="max-w-[130px]" />
                  <Stem h={hFatYes} />
                  <N type="pathway" label="→ Lipomatous algorithm (Fig 2A)" isHighlighted={hFatYes} className="max-w-[150px]" />
                </div>

                {/* Fat NO → T2/enhancement fork */}
                <div className="flex flex-col items-center">
                  <N label="Macroscopic fat on T1W: NO" isHighlighted={hFatNo} className="max-w-[130px]" />
                  <TreeFork parentHighlighted={hFatNo}>
                    <div className="flex flex-col items-center">
                      <N label="Markedly high T2 AND <20% enhancement" isHighlighted={hCyst} className="max-w-[130px]" />
                      <Stem h={hCyst} />
                      <N type="pathway" label="→ Cyst-like algorithm (Fig 2B)" isHighlighted={hCyst} className="max-w-[140px]" />
                    </div>
                    <div className="flex flex-col items-center">
                      <N label="Variable T2 OR >20% enhancement" isHighlighted={hSolid} className="max-w-[130px]" />
                      <Stem h={hSolid} />
                      <N type="pathway" label="→ Indeterminate solid (Fig 2C/2D)" isHighlighted={hSolid} className="max-w-[150px]" />
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