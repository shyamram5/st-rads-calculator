import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

// FIGURE 1: Suspected Soft Tissue Lesion on MRI
// Top → Incomplete→RADS-0 | Complete→ No lesion→RADS-1 | Lesion→ Fat on T1W? Yes→Lipomatous | No→ T2/Enh→ Cyst-like | Indeterminate solid
export default function Figure1Chart({ caseData, finalScore }) {
  const { examAdequacy, lesionPresent, macroscopicFatT1W, t2EnhancementPath } = caseData;

  const complete = examAdequacy === "complete";
  const incomplete = examAdequacy === "incomplete";
  const hasLesion = lesionPresent === "yes";
  const noLesion = lesionPresent === "no";
  const hasFat = macroscopicFatT1W === "yes";
  const noFat = macroscopicFatT1W === "no";
  const isCyst = t2EnhancementPath === "cystlike";
  const isSolid = t2EnhancementPath === "indeterminate_solid";

  return (
    <div className="flex flex-col items-center">
      <N label="Suspected soft tissue lesion on MRI" isHighlighted={true} className="font-bold px-5 py-2.5" />

      <TreeFork parentHighlighted={true}>
        {/* LEFT: Incomplete */}
        <div className="flex flex-col items-center">
          <N label="Incomplete imaging" isHighlighted={incomplete} className="max-w-[120px]" />
          <Stem h={incomplete} />
          <N type="score" score={0} isHighlighted={incomplete} isActive={incomplete && finalScore === 0} />
        </div>

        {/* RIGHT: Complete */}
        <div className="flex flex-col items-center">
          <N label="Complete imaging" isHighlighted={complete} className="max-w-[120px]" />

          <TreeFork parentHighlighted={complete}>
            {/* No lesion → RADS-1 */}
            <div className="flex flex-col items-center">
              <N label="No soft tissue lesion" isHighlighted={noLesion} className="max-w-[110px]" />
              <Stem h={noLesion} />
              <N type="score" score={1} isHighlighted={noLesion} isActive={noLesion && finalScore === 1} />
            </div>

            {/* Lesion present */}
            <div className="flex flex-col items-center">
              <N label="Soft tissue lesion" isHighlighted={hasLesion} className="max-w-[120px]" />

              <TreeFork parentHighlighted={hasLesion}>
                {/* Fat on T1W → Lipomatous pathway */}
                <div className="flex flex-col items-center">
                  <N type="pathway" label="Macroscopic fat on T1W → Lipomatous algorithm (Fig 2A)" isHighlighted={hasFat} className="max-w-[150px]" />
                </div>

                {/* No fat → T2/enhancement split */}
                <div className="flex flex-col items-center">
                  <N label="No macroscopic fat on T1W" isHighlighted={noFat} className="max-w-[140px]" />

                  <TreeFork parentHighlighted={noFat}>
                    <div className="flex flex-col items-center">
                      <N type="pathway" label="Markedly high T2 AND <20% enhancement → Cyst-like algorithm (Fig 2B)" isHighlighted={isCyst} className="max-w-[150px]" />
                    </div>
                    <div className="flex flex-col items-center">
                      <N type="pathway" label="Variable T2 OR >20% enhancement → Indeterminate solid algorithm (Fig 2C/2D)" isHighlighted={isSolid} className="max-w-[150px]" />
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