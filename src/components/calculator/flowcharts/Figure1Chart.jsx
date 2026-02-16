import React from "react";
import FlowchartNode from "./FlowchartNode";
import FlowchartConnector from "./FlowchartConnector";

export default function Figure1Chart({ caseData, finalScore }) {
  const { examAdequacy, lesionPresent, macroscopicFatT1W, t2EnhancementPath } = caseData;

  const isComplete = examAdequacy === "complete";
  const isIncomplete = examAdequacy === "incomplete";
  const hasLesion = lesionPresent === "yes";
  const noLesion = lesionPresent === "no";
  const hasFat = macroscopicFatT1W === "yes";
  const noFat = macroscopicFatT1W === "no";
  const isCyst = t2EnhancementPath === "cystlike";
  const isSolid = t2EnhancementPath === "indeterminate_solid";

  return (
    <div className="flex flex-col items-center gap-0">
      {/* Title */}
      <FlowchartNode label="Suspected Soft Tissue Lesion" isHighlighted={true} className="font-bold text-xs px-5 py-2.5" />
      <FlowchartConnector isHighlighted={true} />

      {/* Incomplete vs Complete */}
      <div className="flex items-start gap-6 md:gap-12">
        {/* Incomplete branch */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Incomplete imaging" isHighlighted={isIncomplete} />
          <FlowchartConnector isHighlighted={isIncomplete} />
          <FlowchartNode type="score" score={0} isHighlighted={isIncomplete} isActive={isIncomplete && finalScore === 0} />
        </div>

        {/* Complete branch */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Complete imaging" isHighlighted={isComplete} />
          <FlowchartConnector isHighlighted={isComplete} />

          {/* No lesion vs lesion */}
          <div className="flex items-start gap-6 md:gap-10">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="No soft tissue lesion" isHighlighted={noLesion} />
              <FlowchartConnector isHighlighted={noLesion} />
              <FlowchartNode type="score" score={1} isHighlighted={noLesion} isActive={noLesion && finalScore === 1} />
            </div>

            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Soft tissue lesion" isHighlighted={hasLesion} />
              <FlowchartConnector isHighlighted={hasLesion} />

              {/* Fat vs no fat */}
              <div className="flex items-start gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No macroscopic fat on T1W" isHighlighted={noFat} />
                  <FlowchartConnector isHighlighted={noFat} />

                  {/* T2/Enhancement split */}
                  <div className="flex items-start gap-3 md:gap-6">
                    <div className="flex flex-col items-center gap-0">
                      <FlowchartNode
                        type="pathway"
                        label={'Variable T2 OR >20% enh → "Indeterminate solid"'}
                        isHighlighted={isSolid}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0">
                      <FlowchartNode
                        type="pathway"
                        label={'Markedly high T2 AND <20% enh → "Cyst-like"'}
                        isHighlighted={isCyst}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode
                    type="pathway"
                    label={'Macroscopic fat on T1W → "Lipomatous"'}
                    isHighlighted={hasFat}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}