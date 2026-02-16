import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

export default function Figure2AChart({ caseData, finalScore }) {
  const { lipFatContent, lipNoduleSeptation, lipSeptations, lipVessels, lipNoduleFeatures } = caseData;

  const isPred = lipFatContent === "predominantly";
  const isNotPred = lipFatContent === "not_predominantly";
  const isThinAbsence = lipNoduleSeptation === "thin_absence";
  const isSeptPresence = lipNoduleSeptation === "septations_presence";
  const isThickEnh = lipSeptations === "thick_high_enh";
  const isThinEnh = lipSeptations === "thin_low_enh";
  const isNoNodules = lipNoduleFeatures === "no_nodules";
  const isNodules = lipNoduleFeatures === "nodules_present";

  return (
    <div className="flex flex-col items-center">
      <N label="Lipomatous Soft Tissue Lesion" isHighlighted={true} className="font-bold px-4 py-2.5" />

      <TreeFork parentHighlighted={true}>
        {/* Predominantly lipomatous */}
        <div className="flex flex-col items-center">
          <N label="Predominantly lipomatous (>90%)" isHighlighted={isPred} className="max-w-[150px]" />

          <TreeFork parentHighlighted={isPred}>
            {/* Thin sept / absence of nodules → RADS-2 */}
            <div className="flex flex-col items-center">
              <N label="Thin sept. (<2mm) OR absence of nodules" isHighlighted={isThinAbsence} className="max-w-[130px]" />
              <Stem h={isThinAbsence} />
              <N type="score" score={2} isHighlighted={isThinAbsence} isActive={isThinAbsence && finalScore === 2} />
            </div>

            {/* Septations AND presence of nodules */}
            <div className="flex flex-col items-center">
              <N label="Septations AND presence of nodules" isHighlighted={isSeptPresence} className="max-w-[130px]" />

              <TreeFork parentHighlighted={isSeptPresence}>
                {/* Thin / low enh → vessels → RADS-3 */}
                <div className="flex flex-col items-center">
                  <N label="Thin sept. <2mm OR enh. <10%" isHighlighted={isThinEnh} className="max-w-[120px]" />
                  <Stem h={isThinEnh} />
                  <N type="score" score={3} isHighlighted={isThinEnh} isActive={isThinEnh && finalScore === 3} />
                  <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-0.5 max-w-[100px]">Angiolipoma</div>
                </div>

                {/* Thick / high enh → RADS-4 */}
                <div className="flex flex-col items-center">
                  <N label="Thick sept. ≥2mm OR enh. >10%" isHighlighted={isThickEnh} className="max-w-[120px]" />
                  <Stem h={isThickEnh} />
                  <N type="score" score={4} isHighlighted={isThickEnh} isActive={isThickEnh && finalScore === 4} />
                  <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-0.5 max-w-[100px]">ALT / WDL</div>
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>

        {/* Not predominantly lipomatous */}
        <div className="flex flex-col items-center">
          <N label="Not predominantly lipomatous (≤90%)" isHighlighted={isNotPred} className="max-w-[150px]" />

          <TreeFork parentHighlighted={isNotPred}>
            {/* No enhancing nodules → RADS-4 */}
            <div className="flex flex-col items-center">
              <N label="No enhancing nodule(s) / larger lipomatous component" isHighlighted={isNoNodules} className="max-w-[130px]" />
              <Stem h={isNoNodules} />
              <N type="score" score={4} isHighlighted={isNoNodules} isActive={isNoNodules && finalScore === 4} />
              <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-0.5 max-w-[100px]">ALT / WDL</div>
            </div>

            {/* Enhancing nodules → RADS-5 */}
            <div className="flex flex-col items-center">
              <N label="Enhancing nodule(s) / smaller lipomatous component" isHighlighted={isNodules} className="max-w-[130px]" />
              <Stem h={isNodules} />
              <N type="score" score={5} isHighlighted={isNodules} isActive={isNodules && finalScore === 5} />
              <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-0.5 max-w-[100px]">Liposarcoma</div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}