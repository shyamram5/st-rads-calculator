import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2A — "Lipomatous" Soft Tissue Lesion

  "Lipomatous" soft tissue lesion
  ├─ Predominantly lipomatous (>90%)
  │   ├─ Thin septations (<2 mm) OR absence of nodules, and like subcutaneous fat on all sequences
  │   │   → ST-RADS 2
  │   └─ Septations AND presence of nodules, and like subcutaneous fat on all sequences
  │       ├─ Thin septations <2 mm OR enhancement <10%
  │       │   ├─ Many prominent vessels → ST-RADS 3
  │       │   └─ Few prominent vessels → ST-RADS 3
  │       └─ Thick septations ≥2 mm OR enhancement >10%
  │           → ST-RADS 4
  └─ Not predominantly lipomatous (≤90%)
      ├─ No enhancing nodule(s) OR proportionately larger lipomatous component
      │   → ST-RADS 4
      └─ Enhancing nodule(s) OR proportionately smaller lipomatous component
          → ST-RADS 5
*/

export default function Figure2AChart({ caseData, finalScore }) {
  const fc = caseData.lipFatContent;
  const ns = caseData.lipNoduleSeptation;
  const sep = caseData.lipSeptations;
  const ves = caseData.lipVessels;
  const nf = caseData.lipNoduleFeatures;

  const hPred = fc === "predominantly";
  const hNotPred = fc === "not_predominantly";
  const hThinAbsence = hPred && ns === "thin_absence";
  const hSeptPresence = hPred && ns === "septations_presence";
  const hThinEnh = hSeptPresence && sep === "thin_low_enh";
  const hThickEnh = hSeptPresence && sep === "thick_high_enh";
  const hManyVes = hThinEnh && ves === "many";
  const hFewVes = hThinEnh && ves === "few";
  const hNoNodules = hNotPred && nf === "no_nodules";
  const hNodules = hNotPred && nf === "nodules_present";

  return (
    <div className="flex flex-col items-center">
      <N label={'"Lipomatous" soft tissue lesion'} isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        {/* LEFT: Predominantly lipomatous (>90%) */}
        <div className="flex flex-col items-center">
          <N label="Predominantly lipomatous (>90%)" isHighlighted={hPred} className="max-w-[140px]" />
          <TreeFork parentHighlighted={hPred}>
            {/* Thin septations / absence of nodules → RADS 2 */}
            <div className="flex flex-col items-center">
              <N label="Thin septations (<2 mm) OR absence of nodules and like subcutaneous fat on all sequences" isHighlighted={hThinAbsence} className="max-w-[130px]" />
              <Stem h={hThinAbsence} />
              <N type="score" score={2} isHighlighted={hThinAbsence} isActive={hThinAbsence && finalScore === 2} />
            </div>

            {/* Septations AND presence of nodules */}
            <div className="flex flex-col items-center">
              <N label="Septations AND presence of nodules and like subcutaneous fat on all sequences" isHighlighted={hSeptPresence} className="max-w-[130px]" />
              <TreeFork parentHighlighted={hSeptPresence}>
                {/* Thin sept / low enh → vessel fork */}
                <div className="flex flex-col items-center">
                  <N label="Thin septations <2 mm OR enhancement <10%" isHighlighted={hThinEnh} className="max-w-[115px]" />
                  <TreeFork parentHighlighted={hThinEnh}>
                    {/* Many prominent vessels → RADS 3 */}
                    <div className="flex flex-col items-center">
                      <N label="Many prominent vessels" isHighlighted={hManyVes} className="max-w-[100px]" />
                      <Stem h={hManyVes} />
                      <N type="score" score={3} isHighlighted={hManyVes} isActive={hManyVes && finalScore === 3} />
                    </div>
                    {/* Few prominent vessels → RADS 3 */}
                    <div className="flex flex-col items-center">
                      <N label="Few prominent vessels" isHighlighted={hFewVes} className="max-w-[100px]" />
                      <Stem h={hFewVes} />
                      <N type="score" score={3} isHighlighted={hFewVes} isActive={hFewVes && finalScore === 3} />
                    </div>
                  </TreeFork>
                </div>

                {/* Thick sept / high enh → RADS 4 */}
                <div className="flex flex-col items-center">
                  <N label="Thick septations ≥2 mm OR enhancement >10%" isHighlighted={hThickEnh} className="max-w-[115px]" />
                  <Stem h={hThickEnh} />
                  <N type="score" score={4} isHighlighted={hThickEnh} isActive={hThickEnh && finalScore === 4} />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>

        {/* RIGHT: Not predominantly lipomatous (≤90%) */}
        <div className="flex flex-col items-center">
          <N label="Not predominantly lipomatous (≤90%)" isHighlighted={hNotPred} className="max-w-[140px]" />
          <TreeFork parentHighlighted={hNotPred}>
            {/* No enhancing nodules → RADS 4 */}
            <div className="flex flex-col items-center">
              <N label="No enhancing nodule(s) OR proportionately larger lipomatous component" isHighlighted={hNoNodules} className="max-w-[130px]" />
              <Stem h={hNoNodules} />
              <N type="score" score={4} isHighlighted={hNoNodules} isActive={hNoNodules && finalScore === 4} />
            </div>
            {/* Enhancing nodules → RADS 5 */}
            <div className="flex flex-col items-center">
              <N label="Enhancing nodule(s) OR proportionately smaller lipomatous component" isHighlighted={hNodules} className="max-w-[130px]" />
              <Stem h={hNodules} />
              <N type="score" score={5} isHighlighted={hNodules} isActive={hNodules && finalScore === 5} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}