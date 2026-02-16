import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

export default function Figure2BChart({ caseData, finalScore }) {
  const { cystLocation, cystFlow, cystHematoma, cystSeptationNodules } = caseData;

  const isSuperficial = cystLocation === "superficial_communicating";
  const isDeep = cystLocation === "deep_non_communicating";
  const hasFlow = cystFlow === "yes";
  const noFlow = cystFlow === "no";
  const hasHematoma = cystHematoma === "yes";
  const noHematoma = cystHematoma === "no";
  const septPresent = cystSeptationNodules === "present";
  const septAbsent = cystSeptationNodules === "absent";

  return (
    <div className="flex flex-col items-center">
      <N label='"Cyst-like" or High Water Content Soft Tissue Lesion' isHighlighted={true} className="font-bold px-4 py-2.5" />

      <TreeFork parentHighlighted={true}>
        {/* Communicating / superficial → RADS-2 */}
        <div className="flex flex-col items-center">
          <N label="Communicates with joint/tendon/bursa OR cutaneous/subcut. OR intraneural" isHighlighted={isSuperficial} className="max-w-[160px]" />
          <Stem h={isSuperficial} />
          <N type="score" score={2} isHighlighted={isSuperficial} isActive={isSuperficial && finalScore === 2} />
        </div>

        {/* Deep, no communication */}
        <div className="flex flex-col items-center">
          <N label="Deep (subfascial), no communication" isHighlighted={isDeep} className="max-w-[150px]" />

          <TreeFork parentHighlighted={isDeep}>
            {/* Predominantly flow voids */}
            <div className="flex flex-col items-center">
              <N label="Predominantly flow voids / fluid-fluid levels" isHighlighted={hasFlow} className="max-w-[130px]" />

              <TreeFork parentHighlighted={hasFlow}>
                <div className="flex flex-col items-center">
                  <N label="Hematoma features" isHighlighted={hasFlow && hasHematoma} className="max-w-[90px]" />
                  <Stem h={hasFlow && hasHematoma} />
                  <N type="score" score={3} isHighlighted={hasFlow && hasHematoma} isActive={hasFlow && hasHematoma && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="No hematoma" isHighlighted={hasFlow && noHematoma} className="max-w-[90px]" />
                  <Stem h={hasFlow && noHematoma} />
                  <N type="score" score={2} isHighlighted={hasFlow && noHematoma} isActive={hasFlow && noHematoma && finalScore === 2} />
                  <div className="text-[9px] text-center text-slate-400 mt-0.5 max-w-[90px]">Vascular malformation</div>
                </div>
              </TreeFork>
            </div>

            {/* Not predominantly flow voids */}
            <div className="flex flex-col items-center">
              <N label="Not predominantly flow voids" isHighlighted={isDeep && noFlow} className="max-w-[130px]" />

              <TreeFork parentHighlighted={isDeep && noFlow}>
                <div className="flex flex-col items-center">
                  <N label="Hematoma features" isHighlighted={noFlow && hasHematoma} className="max-w-[90px]" />
                  <Stem h={noFlow && hasHematoma} />
                  <N type="score" score={3} isHighlighted={noFlow && hasHematoma} isActive={noFlow && hasHematoma && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="No thick sept. / nodules <1cm" isHighlighted={noFlow && noHematoma && septAbsent} className="max-w-[100px]" />
                  <Stem h={noFlow && noHematoma && septAbsent} />
                  <N type="score" score={3} isHighlighted={noFlow && noHematoma && septAbsent} isActive={noFlow && noHematoma && septAbsent && (finalScore === 3 || finalScore === 4)} />
                  <div className="text-[9px] text-center text-slate-400 mt-0.5 max-w-[90px]">RADS 3 or 4</div>
                </div>
                <div className="flex flex-col items-center">
                  <N label="Thick sept. / nodules ≥1cm" isHighlighted={noFlow && noHematoma && septPresent} className="max-w-[100px]" />
                  <Stem h={noFlow && noHematoma && septPresent} />
                  <N type="score" score={5} isHighlighted={noFlow && noHematoma && septPresent} isActive={noFlow && noHematoma && septPresent && finalScore === 5} />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}