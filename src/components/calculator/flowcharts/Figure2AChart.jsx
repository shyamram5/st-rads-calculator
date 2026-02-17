import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2A — Lipomatous Soft Tissue Lesion (exact manuscript match)

  Lipomatous Soft Tissue Lesion
  ├─ Predominantly lipomatous (>90%)*
  │   ├─ Thin septations (<2 mm) OR absence of nodules and like subcutaneous fat intensity on all sequences
  │   │   → Soft Tissue RADS-2
  │   └─ Septations and presence of nodules and like subcutaneous fat intensity on all sequences
  │       ├─ Thin septations <2 mm OR Enhancement <10%
  │       │   ├─ Many prominent vessels → Soft Tissue RADS-3
  │       │   └─ Few prominent vessels → Soft Tissue RADS-4
  │       └─ Thick septations ≥2 mm OR Enhancement >10%*
  │           → Soft Tissue RADS-4
  └─ Not predominantly lipomatous (≤90%)*
      ├─ No enhancing nodule(s) OR proportionately larger lipomatous component than soft tissue component*
      │   → Soft Tissue RADS-4
      └─ Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue component
          → Soft Tissue RADS-5**
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
      <N label="Lipomatous Soft Tissue Lesion" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        {/* LEFT: Predominantly lipomatous (>90%)* */}
        <div className="flex flex-col items-center">
          <N label="Predominantly lipomatous (>90%)*" isHighlighted={hPred} className="max-w-[150px]" />
          <TreeFork parentHighlighted={hPred}>
            {/* Thin septations / absence → RADS 2 */}
            <div className="flex flex-col items-center">
              <N label="Thin septations (<2 mm) OR absence of nodules and like subcutaneous fat intensity on all sequences" isHighlighted={hThinAbsence} className="max-w-[145px]" />
              <Stem h={hThinAbsence} />
              <N type="score" score={2} isHighlighted={hThinAbsence} isActive={hThinAbsence && finalScore === 2} />
            </div>

            {/* Septations AND nodules */}
            <div className="flex flex-col items-center">
              <N label="Septations and presence of nodules and like subcutaneous fat intensity on all sequences" isHighlighted={hSeptPresence} className="max-w-[145px]" />
              <TreeFork parentHighlighted={hSeptPresence}>
                {/* Thin sept / low enh → vessel fork */}
                <div className="flex flex-col items-center">
                  <N label="Thin septations <2 mm OR Enhancement <10%" isHighlighted={hThinEnh} className="max-w-[120px]" />
                  <TreeFork parentHighlighted={hThinEnh}>
                    <div className="flex flex-col items-center">
                      <N label="Many prominent vessels" isHighlighted={hManyVes} className="max-w-[95px]" />
                      <Stem h={hManyVes} />
                      <N type="score" score={3} isHighlighted={hManyVes} isActive={hManyVes && finalScore === 3} />
                    </div>
                    <div className="flex flex-col items-center">
                      <N label="Few prominent vessels" isHighlighted={hFewVes} className="max-w-[95px]" />
                    </div>
                  </TreeFork>
                </div>

                {/* Thick sept / high enh */}
                <div className="flex flex-col items-center">
                  <N label="Thick septations ≥2 mm OR Enhancement >10%*" isHighlighted={hThickEnh} className="max-w-[120px]" />
                </div>
              </TreeFork>
              {/* Shared RADS-4 for few vessels + thick sept */}
              <Stem h={hFewVes || hThickEnh} />
              <N type="score" score={4} isHighlighted={hFewVes || hThickEnh} isActive={(hFewVes || hThickEnh) && finalScore === 4} />
            </div>
          </TreeFork>
        </div>

        {/* RIGHT: Not predominantly lipomatous (≤90%)* */}
        <div className="flex flex-col items-center">
          <N label="Not predominantly lipomatous (≤90%)*" isHighlighted={hNotPred} className="max-w-[150px]" />
          <TreeFork parentHighlighted={hNotPred}>
            <div className="flex flex-col items-center">
              <N label="No enhancing nodule(s) OR proportionately larger lipomatous component than soft tissue component*" isHighlighted={hNoNodules} className="max-w-[135px]" />
              <Stem h={hNoNodules} />
              <N type="score" score={4} isHighlighted={hNoNodules} isActive={hNoNodules && finalScore === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue component" isHighlighted={hNodules} className="max-w-[135px]" />
              <Stem h={hNodules} />
              <N type="score" score={5} isHighlighted={hNodules} isActive={hNodules && finalScore === 5} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}