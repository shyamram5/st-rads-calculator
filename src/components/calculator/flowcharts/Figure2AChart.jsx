import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

// FIGURE 2A: Lipomatous Soft Tissue Lesion
//
// Root: "Lipomatous" soft tissue lesion
//   ├─ Predominantly lipomatous (>90%)
//   │   ├─ Thin septations (<2mm) OR absence of nodules → RADS-2
//   │   └─ Septations AND presence of nodules
//   │       ├─ Thin sept <2mm OR enh <10%
//   │       │   ├─ Many prominent vessels → RADS-3
//   │       │   └─ Few prominent vessels → RADS-3
//   │       └─ Thick sept ≥2mm OR enh >10% → RADS-4
//   └─ Not predominantly lipomatous (≤90%)
//       ├─ No enhancing nodule(s) / larger lipomatous → RADS-4
//       └─ Enhancing nodule(s) / smaller lipomatous → RADS-5

export default function Figure2AChart({ caseData, finalScore }) {
  const { lipFatContent, lipNoduleSeptation, lipSeptations, lipVessels, lipNoduleFeatures } = caseData;

  const isPred = lipFatContent === "predominantly";
  const isNotPred = lipFatContent === "not_predominantly";
  const isThinAbsence = lipNoduleSeptation === "thin_absence";
  const isSeptPresence = lipNoduleSeptation === "septations_presence";
  const isThinEnh = lipSeptations === "thin_low_enh";
  const isThickEnh = lipSeptations === "thick_high_enh";
  const isManyVessels = lipVessels === "many";
  const isFewVessels = lipVessels === "few";
  const isNoNodules = lipNoduleFeatures === "no_nodules";
  const isNodules = lipNoduleFeatures === "nodules_present";

  return (
    <div className="flex flex-col items-center">
      <N label={'"Lipomatous" soft tissue lesion'} isHighlighted={true} className="font-bold px-5 py-2.5" />

      <TreeFork parentHighlighted={true}>
        {/* LEFT: Predominantly lipomatous (>90%) */}
        <div className="flex flex-col items-center">
          <N label="Predominantly lipomatous (>90%)" isHighlighted={isPred} className="max-w-[150px]" />

          <TreeFork parentHighlighted={isPred}>
            {/* Thin sept / absence of nodules → RADS-2 */}
            <div className="flex flex-col items-center">
              <N label="Thin septations (<2mm) OR absence of nodules" isHighlighted={isThinAbsence} className="max-w-[130px]" />
              <Stem h={isThinAbsence} />
              <N type="score" score={2} isHighlighted={isThinAbsence} isActive={isThinAbsence && finalScore === 2} />
            </div>

            {/* Septations AND presence of nodules */}
            <div className="flex flex-col items-center">
              <N label="Septations AND presence of nodules" isHighlighted={isSeptPresence} className="max-w-[130px]" />

              <TreeFork parentHighlighted={isSeptPresence}>
                {/* Thin sept / low enh → vessels fork */}
                <div className="flex flex-col items-center">
                  <N label="Thin sept. <2mm OR enhancement <10%" isHighlighted={isThinEnh} className="max-w-[120px]" />

                  <TreeFork parentHighlighted={isThinEnh}>
                    {/* Many prominent vessels → RADS-3 */}
                    <div className="flex flex-col items-center">
                      <N label="Many prominent vessels" isHighlighted={isThinEnh && isManyVessels} className="max-w-[100px]" />
                      <Stem h={isThinEnh && isManyVessels} />
                      <N type="score" score={3} isHighlighted={isThinEnh && isManyVessels} isActive={isThinEnh && isManyVessels && finalScore === 3} />
                    </div>
                    {/* Few prominent vessels → RADS-3 */}
                    <div className="flex flex-col items-center">
                      <N label="Few prominent vessels" isHighlighted={isThinEnh && isFewVessels} className="max-w-[100px]" />
                      <Stem h={isThinEnh && isFewVessels} />
                      <N type="score" score={3} isHighlighted={isThinEnh && isFewVessels} isActive={isThinEnh && isFewVessels && finalScore === 3} />
                    </div>
                  </TreeFork>
                </div>

                {/* Thick sept / high enh → RADS-4 */}
                <div className="flex flex-col items-center">
                  <N label="Thick sept. ≥2mm OR enhancement >10%" isHighlighted={isThickEnh} className="max-w-[120px]" />
                  <Stem h={isThickEnh} />
                  <N type="score" score={4} isHighlighted={isThickEnh} isActive={isThickEnh && finalScore === 4} />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>

        {/* RIGHT: Not predominantly lipomatous (≤90%) */}
        <div className="flex flex-col items-center">
          <N label="Not predominantly lipomatous (≤90%)" isHighlighted={isNotPred} className="max-w-[150px]" />

          <TreeFork parentHighlighted={isNotPred}>
            {/* No enhancing nodules → RADS-4 */}
            <div className="flex flex-col items-center">
              <N label="No enhancing nodule(s) / larger lipomatous component" isHighlighted={isNoNodules} className="max-w-[130px]" />
              <Stem h={isNoNodules} />
              <N type="score" score={4} isHighlighted={isNoNodules} isActive={isNoNodules && finalScore === 4} />
            </div>

            {/* Enhancing nodules → RADS-5 */}
            <div className="flex flex-col items-center">
              <N label="Enhancing nodule(s) / smaller lipomatous component" isHighlighted={isNodules} className="max-w-[130px]" />
              <Stem h={isNodules} />
              <N type="score" score={5} isHighlighted={isNodules} isActive={isNodules && finalScore === 5} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}