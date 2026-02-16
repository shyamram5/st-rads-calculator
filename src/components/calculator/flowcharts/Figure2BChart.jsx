import React from "react";
import FlowchartNode from "./FlowchartNode";
import FlowchartConnector from "./FlowchartConnector";

export default function Figure2BChart({ caseData, finalScore }) {
  const { cystLocation, cystFlow, cystHematoma, cystSeptationNodules } = caseData;

  const isSuperficial = cystLocation === "superficial_communicating";
  const isDeep = cystLocation === "deep_non_communicating";
  const hasFlow = cystFlow === "yes";
  const noFlow = cystFlow === "no";
  const hasHematoma = cystHematoma === "yes";
  const noHematoma = cystHematoma === "no";
  const septAbsent = cystSeptationNodules === "absent";
  const septPresent = cystSeptationNodules === "present";

  return (
    <div className="flex flex-col items-center gap-0">
      <FlowchartNode label='"Cyst-like" or "High Water Content" Soft Tissue Lesion' isHighlighted={true} className="font-bold text-xs px-5 py-2.5" />
      <FlowchartConnector isHighlighted={true} />

      <div className="flex items-start gap-6 md:gap-12">
        {/* Communicating / superficial */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Communicates with joint/tendon/bursa OR cutaneous/subcutaneous OR intraneural" isHighlighted={isSuperficial} className="max-w-[160px]" />
          <FlowchartConnector isHighlighted={isSuperficial} />
          <FlowchartNode type="score" score={2} isHighlighted={isSuperficial} isActive={isSuperficial && finalScore === 2} />
        </div>

        {/* Deep */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Deep (subfascial), no communication" isHighlighted={isDeep} className="max-w-[160px]" />
          <FlowchartConnector isHighlighted={isDeep} />

          <div className="flex items-start gap-4 md:gap-8">
            {/* Flow voids */}
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Predominantly flow voids / fluid-fluid levels" isHighlighted={hasFlow} className="max-w-[130px]" />
              <FlowchartConnector isHighlighted={hasFlow} />
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Hematoma" isHighlighted={hasFlow && hasHematoma} className="max-w-[80px]" />
                  <FlowchartConnector isHighlighted={hasFlow && hasHematoma} />
                  <FlowchartNode type="score" score={3} isHighlighted={hasFlow && hasHematoma} isActive={hasFlow && hasHematoma && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No hematoma" isHighlighted={hasFlow && noHematoma} className="max-w-[80px]" />
                  <FlowchartConnector isHighlighted={hasFlow && noHematoma} />
                  <FlowchartNode type="score" score={2} isHighlighted={hasFlow && noHematoma} isActive={hasFlow && noHematoma && finalScore === 2} />
                </div>
              </div>
            </div>

            {/* No flow voids */}
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Not predominantly flow voids" isHighlighted={isDeep && noFlow} className="max-w-[130px]" />
              <FlowchartConnector isHighlighted={isDeep && noFlow} />

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Hematoma features" isHighlighted={noFlow && hasHematoma} className="max-w-[80px]" />
                  <FlowchartConnector isHighlighted={noFlow && hasHematoma} />
                  <FlowchartNode type="score" score={3} isHighlighted={noFlow && hasHematoma} isActive={noFlow && hasHematoma && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No thick sept. / nodules <1cm" isHighlighted={noFlow && noHematoma && septAbsent} className="max-w-[100px]" />
                  <FlowchartConnector isHighlighted={noFlow && noHematoma && septAbsent} />
                  <FlowchartNode type="score" score={3} isHighlighted={noFlow && noHematoma && septAbsent} isActive={noFlow && noHematoma && septAbsent && (finalScore === 3 || finalScore === 4)} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Thick sept. / nodules ≥1cm" isHighlighted={noFlow && septPresent} className="max-w-[100px]" />
                  <FlowchartConnector isHighlighted={noFlow && septPresent} />
                  <FlowchartNode type="score" score={5} isHighlighted={noFlow && septPresent} isActive={noFlow && septPresent && finalScore === 5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}