import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

// Figure 2D: Intravascular, Intraarticular, Intraneural, Cutaneous
export default function Figure2DChart({ caseData, finalScore }) {
  const c = caseData.compartment;
  const isVasc = c === "intravascular";
  const isIA = c === "intraarticular";
  const isNerve = c === "intraneural";
  const isCut = c === "cutaneous";

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate Solid Soft Tissue Mass — Fig 2D" isHighlighted={true} className="font-bold px-4 py-2.5" />

      <TreeFork parentHighlighted={true}>
        <VascBranch caseData={caseData} finalScore={finalScore} h={isVasc} />
        <IABranch caseData={caseData} finalScore={finalScore} h={isIA} />
        <NerveBranch caseData={caseData} finalScore={finalScore} h={isNerve} />
        <CutBranch caseData={caseData} finalScore={finalScore} h={isCut} />
      </TreeFork>
    </div>
  );
}

function VascBranch({ caseData, finalScore, h }) {
  const { vascMorphology, vascBlooming, vascT2Enhancement } = caseData;
  const isPhleb = vascMorphology === "phleboliths";
  const isHyper = vascMorphology === "hyper_no_phleb";
  const isCalc = vascMorphology === "calc_hypo";

  return (
    <div className="flex flex-col items-center">
      <N label="Intravascular / Vessel-related" isHighlighted={h} className="max-w-[110px]" />

      <TreeFork parentHighlighted={h}>
        {/* Phleboliths → RADS-2 */}
        <div className="flex flex-col items-center">
          <N label="Phleboliths + fluid-fluid levels" isHighlighted={h && isPhleb} className="max-w-[95px]" />
          <Stem h={h && isPhleb} />
          <N type="score" score={2} isHighlighted={h && isPhleb} isActive={h && isPhleb && finalScore === 2} />
        </div>

        {/* Hyper T2, no phleboliths → T2/enh */}
        <div className="flex flex-col items-center">
          <N label="Hyper T2, no phleboliths" isHighlighted={h && isHyper} className="max-w-[95px]" />

          <TreeFork parentHighlighted={h && isHyper}>
            <div className="flex flex-col items-center">
              <N label="Hyper T2 + peripheral enh." isHighlighted={h && isHyper && vascT2Enhancement === "hyperintense_peripheral"} className="max-w-[80px]" />
              <Stem h={h && isHyper && vascT2Enhancement === "hyperintense_peripheral"} />
              <N type="score" score={4} isHighlighted={h && isHyper && vascT2Enhancement === "hyperintense_peripheral"} isActive={h && isHyper && vascT2Enhancement === "hyperintense_peripheral" && finalScore === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hypo T2 + no peripheral enh." isHighlighted={h && isHyper && vascT2Enhancement === "hypointense_no_peripheral"} className="max-w-[80px]" />
              <Stem h={h && isHyper && vascT2Enhancement === "hypointense_no_peripheral"} />
              <N type="score" score={5} isHighlighted={h && isHyper && vascT2Enhancement === "hypointense_no_peripheral"} isActive={h && isHyper && vascT2Enhancement === "hypointense_no_peripheral" && finalScore === 5} />
            </div>
          </TreeFork>
        </div>

        {/* Calcified / hypo T2 → blooming */}
        <div className="flex flex-col items-center">
          <N label="Calcified / hypo T2" isHighlighted={h && isCalc} className="max-w-[95px]" />

          <TreeFork parentHighlighted={h && isCalc}>
            <div className="flex flex-col items-center">
              <N label="Blooming on GRE" isHighlighted={h && isCalc && vascBlooming === "blooming"} className="max-w-[75px]" />
              <Stem h={h && isCalc && vascBlooming === "blooming"} />
              <N type="score" score={2} isHighlighted={h && isCalc && vascBlooming === "blooming"} isActive={h && isCalc && vascBlooming === "blooming" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No blooming" isHighlighted={h && isCalc && vascBlooming === "no_blooming"} className="max-w-[75px]" />
              <Stem h={h && isCalc && vascBlooming === "no_blooming"} />
              <N type="score" score={2} isHighlighted={h && isCalc && vascBlooming === "no_blooming"} isActive={h && isCalc && vascBlooming === "no_blooming" && finalScore === 2} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function IABranch({ caseData, finalScore, h }) {
  const { iaSignal, iaBlooming, iaEnhancement } = caseData;
  const isCalc = iaSignal === "calcified_hypo";
  const isNotCalc = iaSignal === "not_calcified_hyper";

  return (
    <div className="flex flex-col items-center">
      <N label="Intra-articular" isHighlighted={h} className="max-w-[100px]" />

      <TreeFork parentHighlighted={h}>
        {/* Calcified/hypo → blooming */}
        <div className="flex flex-col items-center">
          <N label="Calcified / hypo T2" isHighlighted={h && isCalc} className="max-w-[85px]" />

          <TreeFork parentHighlighted={h && isCalc}>
            <div className="flex flex-col items-center">
              <N label="Blooming" isHighlighted={h && isCalc && iaBlooming === "blooming"} className="max-w-[70px]" />
              <Stem h={h && isCalc && iaBlooming === "blooming"} />
              <N type="score" score={2} isHighlighted={h && isCalc && iaBlooming === "blooming"} isActive={h && isCalc && iaBlooming === "blooming" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No blooming" isHighlighted={h && isCalc && iaBlooming === "no_blooming"} className="max-w-[70px]" />
              <Stem h={h && isCalc && iaBlooming === "no_blooming"} />
              <N type="score" score={2} isHighlighted={h && isCalc && iaBlooming === "no_blooming"} isActive={h && isCalc && iaBlooming === "no_blooming" && finalScore === 2} />
            </div>
          </TreeFork>
        </div>

        {/* Not calcified, hyper T2 → enhancement */}
        <div className="flex flex-col items-center">
          <N label="Not calcified, hyper T2" isHighlighted={h && isNotCalc} className="max-w-[90px]" />

          <TreeFork parentHighlighted={h && isNotCalc}>
            <div className="flex flex-col items-center">
              <N label="Peripheral enh." isHighlighted={h && isNotCalc && iaEnhancement === "peripheral"} className="max-w-[75px]" />
              <Stem h={h && isNotCalc && iaEnhancement === "peripheral"} />
              <N type="score" score={3} isHighlighted={h && isNotCalc && iaEnhancement === "peripheral"} isActive={h && isNotCalc && iaEnhancement === "peripheral" && finalScore === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No peripheral enh." isHighlighted={h && isNotCalc && iaEnhancement === "no_peripheral"} className="max-w-[75px]" />
              <Stem h={h && isNotCalc && iaEnhancement === "no_peripheral"} />
              <N type="score" score={4} isHighlighted={h && isNotCalc && iaEnhancement === "no_peripheral"} isActive={h && isNotCalc && iaEnhancement === "no_peripheral" && finalScore === 4} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function NerveBranch({ caseData, finalScore, h }) {
  const { targetSign, nerveADC, nerveT2Enhancement } = caseData;
  const hasTarget = targetSign === "yes";
  const noTarget = targetSign === "no";
  const highADC = nerveADC === "high";
  const lowADC = nerveADC === "low";

  return (
    <div className="flex flex-col items-center">
      <N label="Intraneural / Nerve-related" isHighlighted={h} className="max-w-[100px]" />

      <TreeFork parentHighlighted={h}>
        {/* Target sign → RADS-2 */}
        <div className="flex flex-col items-center">
          <N label="Target sign present" isHighlighted={h && hasTarget} className="max-w-[85px]" />
          <Stem h={h && hasTarget} />
          <N type="score" score={2} isHighlighted={h && hasTarget} isActive={h && hasTarget && finalScore === 2} />
        </div>

        {/* No target sign → ADC */}
        <div className="flex flex-col items-center">
          <N label="No target sign" isHighlighted={h && noTarget} className="max-w-[85px]" />

          <TreeFork parentHighlighted={h && noTarget}>
            {/* ADC > 1.1 → RADS-3 */}
            <div className="flex flex-col items-center">
              <N label="ADC >1.1" isHighlighted={h && noTarget && highADC} className="max-w-[70px]" />
              <Stem h={h && noTarget && highADC} />
              <N type="score" score={3} isHighlighted={h && noTarget && highADC} isActive={h && noTarget && highADC && finalScore === 3} />
            </div>

            {/* ADC ≤ 1.1 → T2/enh */}
            <div className="flex flex-col items-center">
              <N label="ADC ≤1.1" isHighlighted={h && noTarget && lowADC} className="max-w-[70px]" />

              <TreeFork parentHighlighted={h && noTarget && lowADC}>
                <div className="flex flex-col items-center">
                  <N label="Hyper T2 + periph. enh." isHighlighted={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral"} className="max-w-[75px]" />
                  <Stem h={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral"} />
                  <N type="score" score={4} isHighlighted={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral"} isActive={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral" && finalScore === 4} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="Hypo T2 + no periph. enh." isHighlighted={h && lowADC && nerveT2Enhancement === "hypointense_no_peripheral"} className="max-w-[75px]" />
                  <Stem h={h && lowADC && nerveT2Enhancement === "hypointense_no_peripheral"} />
                  <N type="score" score={5} isHighlighted={h && lowADC && nerveT2Enhancement === "hypointense_no_peripheral"} isActive={h && lowADC && nerveT2Enhancement === "hypointense_no_peripheral" && finalScore === 5} />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function CutBranch({ caseData, finalScore, h }) {
  const { growthPattern, cutEnhancement } = caseData;
  const isExo = growthPattern === "exophytic";
  const isEndo = growthPattern === "endophytic";

  return (
    <div className="flex flex-col items-center">
      <N label="Cutaneous / Subcutaneous" isHighlighted={h} className="max-w-[100px]" />

      <TreeFork parentHighlighted={h}>
        {/* Exophytic → enhancement */}
        <div className="flex flex-col items-center">
          <N label="Exophytic" isHighlighted={h && isExo} className="max-w-[80px]" />

          <TreeFork parentHighlighted={h && isExo}>
            <div className="flex flex-col items-center">
              <N label="Peripheral enh." isHighlighted={h && isExo && cutEnhancement === "peripheral"} className="max-w-[75px]" />
              <Stem h={h && isExo && cutEnhancement === "peripheral"} />
              <N type="score" score={2} isHighlighted={h && isExo && cutEnhancement === "peripheral"} isActive={h && isExo && cutEnhancement === "peripheral" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Internal enh." isHighlighted={h && isExo && cutEnhancement === "internal"} className="max-w-[75px]" />
              <Stem h={h && isExo && cutEnhancement === "internal"} />
              <N type="score" score={4} isHighlighted={h && isExo && cutEnhancement === "internal"} isActive={h && isExo && cutEnhancement === "internal" && finalScore === 4} />
            </div>
          </TreeFork>
        </div>

        {/* Endophytic → RADS-5 */}
        <div className="flex flex-col items-center">
          <N label="Endophytic" isHighlighted={h && isEndo} className="max-w-[80px]" />
          <Stem h={h && isEndo} />
          <N type="score" score={5} isHighlighted={h && isEndo} isActive={h && isEndo && finalScore === 5} />
        </div>
      </TreeFork>
    </div>
  );
}