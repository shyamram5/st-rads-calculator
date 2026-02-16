import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

// FIGURE 2D: Indeterminate Solid Soft Tissue Mass
// Compartments: Intravascular, Intraarticular, Intraneural, Cutaneous

export default function Figure2DChart({ caseData, finalScore }) {
  const c = caseData.compartment;

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate solid soft tissue mass" isHighlighted={true} className="font-bold px-5 py-2.5" />

      <TreeFork parentHighlighted={true}>
        <VascBranch caseData={caseData} finalScore={finalScore} active={c === "intravascular"} />
        <IABranch caseData={caseData} finalScore={finalScore} active={c === "intraarticular"} />
        <NerveBranch caseData={caseData} finalScore={finalScore} active={c === "intraneural"} />
        <CutBranch caseData={caseData} finalScore={finalScore} active={c === "cutaneous"} />
      </TreeFork>
    </div>
  );
}

// Intravascular / vessel-related
// Phleboliths + fluid-fluid → RADS-2
// Hyper T2, no phleboliths → Hyper T2 + peripheral enh → RADS-4 | Hypo T2 + no periph enh → RADS-5
// Calcified / hypo T2 → Blooming → RADS-2 | No blooming → RADS-2
function VascBranch({ caseData, finalScore, active }) {
  const { vascMorphology, vascBlooming, vascT2Enhancement } = caseData;
  const h = active;

  return (
    <div className="flex flex-col items-center">
      <N label="Intravascular / vessel-related" isHighlighted={h} className="max-w-[120px]" />

      <TreeFork parentHighlighted={h}>
        {/* Phleboliths → RADS-2 */}
        <div className="flex flex-col items-center">
          <N label="Hyper T2 lobules WITH phleboliths WITH fluid-fluid levels" isHighlighted={h && vascMorphology === "phleboliths"} className="max-w-[110px]" />
          <Stem h={h && vascMorphology === "phleboliths"} />
          <N type="score" score={2} isHighlighted={h && vascMorphology === "phleboliths"} isActive={h && vascMorphology === "phleboliths" && finalScore === 2} />
        </div>

        {/* Hyper T2, no phleboliths → T2/enh */}
        <div className="flex flex-col items-center">
          <N label="Hyper T2 lobules WITHOUT phleboliths WITHOUT fluid-fluid" isHighlighted={h && vascMorphology === "hyper_no_phleb"} className="max-w-[110px]" />

          <TreeFork parentHighlighted={h && vascMorphology === "hyper_no_phleb"}>
            <div className="flex flex-col items-center">
              <N label="Hyperintense T2 + peripheral enhancement" isHighlighted={h && vascT2Enhancement === "hyperintense_peripheral"} className="max-w-[95px]" />
              <Stem h={h && vascT2Enhancement === "hyperintense_peripheral"} />
              <N type="score" score={4} isHighlighted={h && vascT2Enhancement === "hyperintense_peripheral"} isActive={h && vascT2Enhancement === "hyperintense_peripheral" && finalScore === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hypointense T2 + no peripheral enhancement" isHighlighted={h && vascT2Enhancement === "hypointense_no_peripheral"} className="max-w-[95px]" />
              <Stem h={h && vascT2Enhancement === "hypointense_no_peripheral"} />
              <N type="score" score={5} isHighlighted={h && vascT2Enhancement === "hypointense_no_peripheral"} isActive={h && vascT2Enhancement === "hypointense_no_peripheral" && finalScore === 5} />
            </div>
          </TreeFork>
        </div>

        {/* Calcified / hypo T2 → blooming */}
        <div className="flex flex-col items-center">
          <N label="Calcified / ossified or predominantly hypointense T2" isHighlighted={h && vascMorphology === "calc_hypo"} className="max-w-[110px]" />

          <TreeFork parentHighlighted={h && vascMorphology === "calc_hypo"}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming on GRE" isHighlighted={h && vascBlooming === "blooming"} className="max-w-[90px]" />
              <Stem h={h && vascBlooming === "blooming"} />
              <N type="score" score={2} isHighlighted={h && vascBlooming === "blooming"} isActive={h && vascBlooming === "blooming" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={h && vascBlooming === "no_blooming"} className="max-w-[90px]" />
              <Stem h={h && vascBlooming === "no_blooming"} />
              <N type="score" score={2} isHighlighted={h && vascBlooming === "no_blooming"} isActive={h && vascBlooming === "no_blooming" && finalScore === 2} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

// Intraarticular
// Calcified / hypo T2 → Blooming → RADS-2 | No blooming → RADS-2
// Not calcified, hyper T2 → Peripheral enh → RADS-3 | No peripheral → RADS-4
function IABranch({ caseData, finalScore, active }) {
  const { iaSignal, iaBlooming, iaEnhancement } = caseData;
  const h = active;

  return (
    <div className="flex flex-col items-center">
      <N label="Intra-articular" isHighlighted={h} className="max-w-[100px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="Calcified / ossified or predominantly hypointense T2" isHighlighted={h && iaSignal === "calcified_hypo"} className="max-w-[100px]" />

          <TreeFork parentHighlighted={h && iaSignal === "calcified_hypo"}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming" isHighlighted={h && iaBlooming === "blooming"} className="max-w-[85px]" />
              <Stem h={h && iaBlooming === "blooming"} />
              <N type="score" score={2} isHighlighted={h && iaBlooming === "blooming"} isActive={h && iaBlooming === "blooming" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={h && iaBlooming === "no_blooming"} className="max-w-[85px]" />
              <Stem h={h && iaBlooming === "no_blooming"} />
              <N type="score" score={2} isHighlighted={h && iaBlooming === "no_blooming"} isActive={h && iaBlooming === "no_blooming" && finalScore === 2} />
            </div>
          </TreeFork>
        </div>

        <div className="flex flex-col items-center">
          <N label="Not calcified, hyperintense T2" isHighlighted={h && iaSignal === "not_calcified_hyper"} className="max-w-[100px]" />

          <TreeFork parentHighlighted={h && iaSignal === "not_calcified_hyper"}>
            <div className="flex flex-col items-center">
              <N label="Hyper T2 + peripheral enhancement" isHighlighted={h && iaEnhancement === "peripheral"} className="max-w-[90px]" />
              <Stem h={h && iaEnhancement === "peripheral"} />
              <N type="score" score={3} isHighlighted={h && iaEnhancement === "peripheral"} isActive={h && iaEnhancement === "peripheral" && finalScore === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hypo T2 + no peripheral enhancement" isHighlighted={h && iaEnhancement === "no_peripheral"} className="max-w-[90px]" />
              <Stem h={h && iaEnhancement === "no_peripheral"} />
              <N type="score" score={4} isHighlighted={h && iaEnhancement === "no_peripheral"} isActive={h && iaEnhancement === "no_peripheral" && finalScore === 4} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

// Intraneural / nerve-related
// Target sign → RADS-2
// No target sign → ADC >1.1 → RADS-3 | ADC ≤1.1 → Hyper T2 + periph enh → RADS-4 | Hypo T2 + no periph → RADS-5
function NerveBranch({ caseData, finalScore, active }) {
  const { targetSign, nerveADC, nerveT2Enhancement } = caseData;
  const h = active;
  const noTarget = targetSign === "no";
  const lowADC = nerveADC === "low";

  return (
    <div className="flex flex-col items-center">
      <N label="Intraneural / nerve-related" isHighlighted={h} className="max-w-[110px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="Target sign present" isHighlighted={h && targetSign === "yes"} className="max-w-[90px]" />
          <Stem h={h && targetSign === "yes"} />
          <N type="score" score={2} isHighlighted={h && targetSign === "yes"} isActive={h && targetSign === "yes" && finalScore === 2} />
        </div>

        <div className="flex flex-col items-center">
          <N label="No target sign" isHighlighted={h && noTarget} className="max-w-[90px]" />

          <TreeFork parentHighlighted={h && noTarget}>
            <div className="flex flex-col items-center">
              <N label="ADC >1.1 × 10⁻³ mm²/s" isHighlighted={h && noTarget && nerveADC === "high"} className="max-w-[90px]" />
              <Stem h={h && noTarget && nerveADC === "high"} />
              <N type="score" score={3} isHighlighted={h && noTarget && nerveADC === "high"} isActive={h && noTarget && nerveADC === "high" && finalScore === 3} />
            </div>

            <div className="flex flex-col items-center">
              <N label="ADC ≤1.1 × 10⁻³ mm²/s" isHighlighted={h && noTarget && lowADC} className="max-w-[90px]" />

              <TreeFork parentHighlighted={h && noTarget && lowADC}>
                <div className="flex flex-col items-center">
                  <N label="Hyper T2 + peripheral enhancement" isHighlighted={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral"} className="max-w-[85px]" />
                  <Stem h={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral"} />
                  <N type="score" score={4} isHighlighted={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral"} isActive={h && lowADC && nerveT2Enhancement === "hyperintense_peripheral" && finalScore === 4} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="Hypo T2 + no peripheral enhancement" isHighlighted={h && lowADC && nerveT2Enhancement === "hypointense_no_peripheral"} className="max-w-[85px]" />
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

// Cutaneous / subcutaneous
// Exophytic → Peripheral enh → RADS-2 | Internal enh → RADS-4
// Endophytic → RADS-5
function CutBranch({ caseData, finalScore, active }) {
  const { growthPattern, cutEnhancement } = caseData;
  const h = active;
  const isExo = growthPattern === "exophytic";
  const isEndo = growthPattern === "endophytic";

  return (
    <div className="flex flex-col items-center">
      <N label="Cutaneous / subcutaneous" isHighlighted={h} className="max-w-[110px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="Exophytic" isHighlighted={h && isExo} className="max-w-[85px]" />

          <TreeFork parentHighlighted={h && isExo}>
            <div className="flex flex-col items-center">
              <N label="Peripheral enhancement" isHighlighted={h && isExo && cutEnhancement === "peripheral"} className="max-w-[85px]" />
              <Stem h={h && isExo && cutEnhancement === "peripheral"} />
              <N type="score" score={2} isHighlighted={h && isExo && cutEnhancement === "peripheral"} isActive={h && isExo && cutEnhancement === "peripheral" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Internal enhancement" isHighlighted={h && isExo && cutEnhancement === "internal"} className="max-w-[85px]" />
              <Stem h={h && isExo && cutEnhancement === "internal"} />
              <N type="score" score={4} isHighlighted={h && isExo && cutEnhancement === "internal"} isActive={h && isExo && cutEnhancement === "internal" && finalScore === 4} />
            </div>
          </TreeFork>
        </div>

        <div className="flex flex-col items-center">
          <N label="Endophytic" isHighlighted={h && isEndo} className="max-w-[85px]" />
          <Stem h={h && isEndo} />
          <N type="score" score={5} isHighlighted={h && isEndo} isActive={h && isEndo && finalScore === 5} />
        </div>
      </TreeFork>
    </div>
  );
}