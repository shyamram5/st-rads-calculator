import React from "react";
import FlowchartNode from "./FlowchartNode";
import FlowchartConnector from "./FlowchartConnector";

export default function Figure2AChart({ caseData, finalScore }) {
  const { lipFatContent, lipNoduleSeptation, lipSeptations, lipNoduleFeatures } = caseData;

  const isPred = lipFatContent === "predominantly";
  const isNotPred = lipFatContent === "not_predominantly";
  const isThinAbsence = lipNoduleSeptation === "thin_absence";
  const isSeptPresence = lipNoduleSeptation === "septations_presence";
  const isThickEnh = lipSeptations === "thick_high_enh";
  const isThinEnh = lipSeptations === "thin_low_enh";
  const isNoNodules = lipNoduleFeatures === "no_nodules";
  const isNodules = lipNoduleFeatures === "nodules_present";

  return (
    <div className="flex flex-col items-center gap-0">
      <FlowchartNode label="Lipomatous Soft Tissue Lesion" isHighlighted={true} className="font-bold text-xs px-5 py-2.5" />
      <FlowchartConnector isHighlighted={true} />

      <div className="flex items-start gap-6 md:gap-10">
        {/* Predominantly */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Predominantly lipomatous (>90%)" isHighlighted={isPred} />
          <FlowchartConnector isHighlighted={isPred} />

          <div className="flex items-start gap-4 md:gap-8">
            {/* Thin / absence */}
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Thin septations (<2mm) OR absence of nodules" isHighlighted={isThinAbsence} className="max-w-[140px]" />
              <FlowchartConnector isHighlighted={isThinAbsence} />
              <FlowchartNode type="score" score={2} isHighlighted={isThinAbsence} isActive={isThinAbsence && finalScore === 2} />
            </div>

            {/* Septations & nodules present */}
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Septations AND presence of nodules" isHighlighted={isSeptPresence} className="max-w-[140px]" />
              <FlowchartConnector isHighlighted={isSeptPresence} />

              <div className="flex items-start gap-3 md:gap-6">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Thin sept. <2mm OR enh. <10%" isHighlighted={isThinEnh} className="max-w-[120px]" />
                  <FlowchartConnector isHighlighted={isThinEnh} />
                  <FlowchartNode type="score" score={3} isHighlighted={isThinEnh} isActive={isThinEnh && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Thick sept. ≥2mm OR enh. >10%" isHighlighted={isThickEnh} className="max-w-[120px]" />
                  <FlowchartConnector isHighlighted={isThickEnh} />
                  <FlowchartNode type="score" score={4} isHighlighted={isThickEnh} isActive={isThickEnh && finalScore === 4} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Not predominantly */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Not predominantly lipomatous (≤90%)" isHighlighted={isNotPred} />
          <FlowchartConnector isHighlighted={isNotPred} />

          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="No enhancing nodule(s)" isHighlighted={isNoNodules} className="max-w-[120px]" />
              <FlowchartConnector isHighlighted={isNoNodules} />
              <FlowchartNode type="score" score={4} isHighlighted={isNoNodules} isActive={isNoNodules && finalScore === 4} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Enhancing nodule(s) present" isHighlighted={isNodules} className="max-w-[120px]" />
              <FlowchartConnector isHighlighted={isNodules} />
              <FlowchartNode type="score" score={5} isHighlighted={isNodules} isActive={isNodules && finalScore === 5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}