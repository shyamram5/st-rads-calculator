import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2D — Indeterminate Solid Soft Tissue Mass (Fig 2D compartments)

  Indeterminate solid soft tissue mass
  ├─ Intravascular / vessel-related
  │   ├─ Hyper T2 lobules/tubules WITH phleboliths WITH fluid-fluid → ST-RADS 2
  │   ├─ Hyper T2 lobules/tubules WITHOUT phleboliths WITHOUT fluid-fluid
  │   │   ├─ Hyperintense T2 + peripheral enhancement → ST-RADS 4
  │   │   └─ Hypointense T2 + no peripheral enhancement → ST-RADS 5
  │   └─ Calcified/ossified or predominantly hypointense T2
  │       ├─ Hemosiderin with blooming on GRE → ST-RADS 2
  │       └─ Hemosiderin without blooming → ST-RADS 2
  ├─ Intraarticular
  │   ├─ Calcified/ossified or predominantly hypointense T2
  │   │   ├─ Hemosiderin with blooming → ST-RADS 2
  │   │   └─ Hemosiderin without blooming → ST-RADS 2
  │   └─ Not calcified, hyperintense T2
  │       ├─ Hyper T2 + peripheral enhancement → ST-RADS 3
  │       └─ Hypo T2 + no peripheral enhancement → ST-RADS 4
  ├─ Intraneural / nerve-related
  │   ├─ Target sign present → ST-RADS 2
  │   └─ No target sign
  │       ├─ ADC >1.1 → ST-RADS 3
  │       └─ ADC ≤1.1
  │           ├─ Hyper T2 + peripheral enhancement → ST-RADS 4
  │           └─ Hypo T2 + no peripheral enhancement → ST-RADS 5
  └─ Cutaneous / subcutaneous
      ├─ Exophytic
      │   ├─ Peripheral enhancement → ST-RADS 2
      │   └─ Internal enhancement → ST-RADS 4
      └─ Endophytic → ST-RADS 5
*/

export default function Figure2DChart({ caseData, finalScore }) {
  const c = caseData.compartment;

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate solid soft tissue mass" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        <VascBranch cd={caseData} fs={finalScore} on={c === "intravascular"} />
        <IABranch cd={caseData} fs={finalScore} on={c === "intraarticular"} />
        <NerveBranch cd={caseData} fs={finalScore} on={c === "intraneural"} />
        <CutBranch cd={caseData} fs={finalScore} on={c === "cutaneous"} />
      </TreeFork>
    </div>
  );
}

function VascBranch({ cd, fs, on }) {
  const vm = cd.vascMorphology;
  const vb = cd.vascBlooming;
  const vt = cd.vascT2Enhancement;

  const hPhleb = on && vm === "phleboliths";
  const hHyper = on && vm === "hyper_no_phleb";
  const hCalc = on && vm === "calc_hypo";

  return (
    <div className="flex flex-col items-center">
      <N label="Intravascular / vessel-related" isHighlighted={on} className="max-w-[115px]" />
      <TreeFork parentHighlighted={on}>
        {/* Phleboliths → RADS 2 */}
        <div className="flex flex-col items-center">
          <N label="Hyper T2 lobules WITH phleboliths WITH fluid-fluid" isHighlighted={hPhleb} className="max-w-[105px]" />
          <Stem h={hPhleb} />
          <N type="score" score={2} isHighlighted={hPhleb} isActive={hPhleb && fs === 2} />
        </div>

        {/* Hyper T2 no phleboliths → T2/enh split */}
        <div className="flex flex-col items-center">
          <N label="Hyper T2 lobules WITHOUT phleboliths WITHOUT fluid-fluid" isHighlighted={hHyper} className="max-w-[105px]" />
          <TreeFork parentHighlighted={hHyper}>
            <div className="flex flex-col items-center">
              <N label="Hyperintense T2 + peripheral enhancement" isHighlighted={hHyper && vt === "hyperintense_peripheral"} className="max-w-[90px]" />
              <Stem h={hHyper && vt === "hyperintense_peripheral"} />
              <N type="score" score={4} isHighlighted={hHyper && vt === "hyperintense_peripheral"} isActive={hHyper && vt === "hyperintense_peripheral" && fs === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hypointense T2 + no peripheral enhancement" isHighlighted={hHyper && vt === "hypointense_no_peripheral"} className="max-w-[90px]" />
              <Stem h={hHyper && vt === "hypointense_no_peripheral"} />
              <N type="score" score={5} isHighlighted={hHyper && vt === "hypointense_no_peripheral"} isActive={hHyper && vt === "hypointense_no_peripheral" && fs === 5} />
            </div>
          </TreeFork>
        </div>

        {/* Calcified / hypo T2 → blooming */}
        <div className="flex flex-col items-center">
          <N label="Calcified / ossified or predominantly hypointense T2" isHighlighted={hCalc} className="max-w-[105px]" />
          <TreeFork parentHighlighted={hCalc}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming on GRE" isHighlighted={hCalc && vb === "blooming"} className="max-w-[85px]" />
              <Stem h={hCalc && vb === "blooming"} />
              <N type="score" score={2} isHighlighted={hCalc && vb === "blooming"} isActive={hCalc && vb === "blooming" && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={hCalc && vb === "no_blooming"} className="max-w-[85px]" />
              <Stem h={hCalc && vb === "no_blooming"} />
              <N type="score" score={2} isHighlighted={hCalc && vb === "no_blooming"} isActive={hCalc && vb === "no_blooming" && fs === 2} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function IABranch({ cd, fs, on }) {
  const sig = cd.iaSignal;
  const bl = cd.iaBlooming;
  const enh = cd.iaEnhancement;

  const hCalc = on && sig === "calcified_hypo";
  const hHyper = on && sig === "not_calcified_hyper";

  return (
    <div className="flex flex-col items-center">
      <N label="Intraarticular" isHighlighted={on} className="max-w-[100px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Calcified / ossified or predominantly hypointense T2" isHighlighted={hCalc} className="max-w-[100px]" />
          <TreeFork parentHighlighted={hCalc}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming" isHighlighted={hCalc && bl === "blooming"} className="max-w-[85px]" />
              <Stem h={hCalc && bl === "blooming"} />
              <N type="score" score={2} isHighlighted={hCalc && bl === "blooming"} isActive={hCalc && bl === "blooming" && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={hCalc && bl === "no_blooming"} className="max-w-[85px]" />
              <Stem h={hCalc && bl === "no_blooming"} />
              <N type="score" score={2} isHighlighted={hCalc && bl === "no_blooming"} isActive={hCalc && bl === "no_blooming" && fs === 2} />
            </div>
          </TreeFork>
        </div>
        <div className="flex flex-col items-center">
          <N label="Not calcified, hyperintense T2" isHighlighted={hHyper} className="max-w-[100px]" />
          <TreeFork parentHighlighted={hHyper}>
            <div className="flex flex-col items-center">
              <N label="Hyper T2 + peripheral enhancement" isHighlighted={hHyper && enh === "peripheral"} className="max-w-[90px]" />
              <Stem h={hHyper && enh === "peripheral"} />
              <N type="score" score={3} isHighlighted={hHyper && enh === "peripheral"} isActive={hHyper && enh === "peripheral" && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hypo T2 + no peripheral enhancement" isHighlighted={hHyper && enh === "no_peripheral"} className="max-w-[90px]" />
              <Stem h={hHyper && enh === "no_peripheral"} />
              <N type="score" score={4} isHighlighted={hHyper && enh === "no_peripheral"} isActive={hHyper && enh === "no_peripheral" && fs === 4} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function NerveBranch({ cd, fs, on }) {
  const ts = cd.targetSign;
  const adc = cd.nerveADC;
  const nt = cd.nerveT2Enhancement;

  const hTarget = on && ts === "yes";
  const hNoTarget = on && ts === "no";
  const hHighADC = hNoTarget && adc === "high";
  const hLowADC = hNoTarget && adc === "low";

  return (
    <div className="flex flex-col items-center">
      <N label="Intraneural / nerve-related" isHighlighted={on} className="max-w-[105px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Target sign present" isHighlighted={hTarget} className="max-w-[90px]" />
          <Stem h={hTarget} />
          <N type="score" score={2} isHighlighted={hTarget} isActive={hTarget && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="No target sign" isHighlighted={hNoTarget} className="max-w-[90px]" />
          <TreeFork parentHighlighted={hNoTarget}>
            <div className="flex flex-col items-center">
              <N label="ADC >1.1 × 10⁻³" isHighlighted={hHighADC} className="max-w-[85px]" />
              <Stem h={hHighADC} />
              <N type="score" score={3} isHighlighted={hHighADC} isActive={hHighADC && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="ADC ≤1.1 × 10⁻³" isHighlighted={hLowADC} className="max-w-[85px]" />
              <TreeFork parentHighlighted={hLowADC}>
                <div className="flex flex-col items-center">
                  <N label="Hyper T2 + peripheral enhancement" isHighlighted={hLowADC && nt === "hyperintense_peripheral"} className="max-w-[85px]" />
                  <Stem h={hLowADC && nt === "hyperintense_peripheral"} />
                  <N type="score" score={4} isHighlighted={hLowADC && nt === "hyperintense_peripheral"} isActive={hLowADC && nt === "hyperintense_peripheral" && fs === 4} />
                </div>
                <div className="flex flex-col items-center">
                  <N label="Hypo T2 + no peripheral enhancement" isHighlighted={hLowADC && nt === "hypointense_no_peripheral"} className="max-w-[85px]" />
                  <Stem h={hLowADC && nt === "hypointense_no_peripheral"} />
                  <N type="score" score={5} isHighlighted={hLowADC && nt === "hypointense_no_peripheral"} isActive={hLowADC && nt === "hypointense_no_peripheral" && fs === 5} />
                </div>
              </TreeFork>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function CutBranch({ cd, fs, on }) {
  const gp = cd.growthPattern;
  const ce = cd.cutEnhancement;

  const hExo = on && gp === "exophytic";
  const hEndo = on && gp === "endophytic";

  return (
    <div className="flex flex-col items-center">
      <N label="Cutaneous / subcutaneous" isHighlighted={on} className="max-w-[105px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Exophytic" isHighlighted={hExo} className="max-w-[85px]" />
          <TreeFork parentHighlighted={hExo}>
            <div className="flex flex-col items-center">
              <N label="Peripheral enhancement" isHighlighted={hExo && ce === "peripheral"} className="max-w-[85px]" />
              <Stem h={hExo && ce === "peripheral"} />
              <N type="score" score={2} isHighlighted={hExo && ce === "peripheral"} isActive={hExo && ce === "peripheral" && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Internal enhancement" isHighlighted={hExo && ce === "internal"} className="max-w-[85px]" />
              <Stem h={hExo && ce === "internal"} />
              <N type="score" score={4} isHighlighted={hExo && ce === "internal"} isActive={hExo && ce === "internal" && fs === 4} />
            </div>
          </TreeFork>
        </div>
        <div className="flex flex-col items-center">
          <N label="Endophytic" isHighlighted={hEndo} className="max-w-[85px]" />
          <Stem h={hEndo} />
          <N type="score" score={5} isHighlighted={hEndo} isActive={hEndo && fs === 5} />
        </div>
      </TreeFork>
    </div>
  );
}