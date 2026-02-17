import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2D — Indeterminate Solid (Vascular, Articular, Neural, Cutaneous)
  Matches scoreIntravascular(), scoreIntraarticular(), scoreIntraneural(), 
  scoreCutaneous() in stradsRuleEngine.js exactly.

  Indeterminate solid soft tissue mass
  ├─ Intravascular / vessel-related
  │   ├─ Hyper T2 lobules WITH phleboliths WITH fluid-fluid → ST-RADS 2
  │   └─ Hyper T2 lobules WITHOUT phleboliths WITHOUT fluid-fluid → ST-RADS 4 or 5
  ├─ Intraarticular
  │   ├─ Calcified/ossified or predominantly hypointense T2 → ST-RADS 2
  │   └─ Not calcified, hyperintense T2
  │       ├─ Hyperintense T2 + peripheral enhancement → ST-RADS 3
  │       └─ Hypointense T2 + no peripheral enhancement → ST-RADS 4
  ├─ Intraneural / nerve-related
  │   ├─ Target sign present → ST-RADS 2
  │   └─ No target sign
  │       ├─ ADC >1.1 → ST-RADS 3
  │       └─ ADC ≤1.1 → ST-RADS 4 or 5
  └─ Cutaneous / subcutaneous
      ├─ Exophytic
      │   ├─ Peripheral enhancement → ST-RADS 2
      │   └─ Internal enhancement → ST-RADS 4
      └─ Endophytic → ST-RADS 5

  NOTE: The wizard only offers two vascMorphology options (phleboliths, hyper_no_phleb).
  The rule engine also handles calc_hypo but the wizard doesn't present it. The flowchart
  matches the wizard-reachable paths exactly.
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

/* Intravascular — rule engine only has 2 wizard-reachable paths: phleboliths → 2, hyper_no_phleb → 4/5 */
function VascBranch({ cd, fs, on }) {
  const vm = cd.vascMorphology;

  const hPhleb = on && vm === "phleboliths";
  const hHyper = on && vm === "hyper_no_phleb";

  return (
    <div className="flex flex-col items-center">
      <N label="Intravascular / vessel-related" isHighlighted={on} className="max-w-[115px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Hyper T2 lobules WITH phleboliths WITH fluid-fluid" isHighlighted={hPhleb} className="max-w-[110px]" />
          <Stem h={hPhleb} />
          <N type="score" score={2} isHighlighted={hPhleb} isActive={hPhleb && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="Hyper T2 lobules WITHOUT phleboliths WITHOUT fluid-fluid" isHighlighted={hHyper} className="max-w-[110px]" />
          <Stem h={hHyper} />
          <N type="score" score={4} isHighlighted={hHyper} isActive={hHyper && (fs === 4 || fs === 5)} />
        </div>
      </TreeFork>
    </div>
  );
}

/* Intraarticular — rule engine: calcified_hypo → 2 (no blooming split), not_calcified_hyper → enh fork */
function IABranch({ cd, fs, on }) {
  const sig = cd.iaSignal;
  const enh = cd.iaEnhancement;

  const hCalc = on && sig === "calcified_hypo";
  const hHyper = on && sig === "not_calcified_hyper";

  return (
    <div className="flex flex-col items-center">
      <N label="Intraarticular" isHighlighted={on} className="max-w-[100px]" />
      <TreeFork parentHighlighted={on}>
        {/* Calcified → RADS 2 directly */}
        <div className="flex flex-col items-center">
          <N label="Calcified / ossified or predominantly hypointense T2" isHighlighted={hCalc} className="max-w-[105px]" />
          <Stem h={hCalc} />
          <N type="score" score={2} isHighlighted={hCalc} isActive={hCalc && fs === 2} />
        </div>
        {/* Not calcified → enhancement fork */}
        <div className="flex flex-col items-center">
          <N label="Not calcified, hyperintense T2" isHighlighted={hHyper} className="max-w-[105px]" />
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

/* Intraneural — target sign → 2, no target → ADC fork → 3 or 4/5 */
function NerveBranch({ cd, fs, on }) {
  const ts = cd.targetSign;
  const adc = cd.nerveADC;

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
              <Stem h={hLowADC} />
              <N type="score" score={4} isHighlighted={hLowADC} isActive={hLowADC && (fs === 4 || fs === 5)} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

/* Cutaneous — exophytic → enh fork, endophytic → 5 */
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