import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2D — Indeterminate Solid Soft Tissue Mass*
  
  MANUSCRIPT FIGURE (image 5):
  ─────────────────────────────
  Indeterminate Solid Soft Tissue Mass*
  ├─ Intra-vascular or Vessel related**
  │   ├─ Hyperintense lobules or tubules on T2W
  │   │  with hypointense phleboliths with fluid-fluid levels
  │   │  → Soft Tissue RADS-2 (Venous or venolymphatic malformation)
  │   └─ Hypointense lobules or tubules on T2W
  │      without hypointense phleboliths with fluid-fluid levels
  │      → Soft Tissue RADS-4 / Soft Tissue RADS-5**
  │
  ├─ Intra-articular
  │   ├─ Calcified/ossified on XR or CT and/or predominantly
  │   │  hypointense foci on T2W
  │   │  ├─ Hemosiderin staining as blooming on GRE
  │   │  │  → Soft Tissue RADS-2
  │   │  └─ Hemosiderin staining without blooming on GRE
  │   │     → Soft Tissue RADS-2
  │   └─ Not calcified/ossified on XR or CT OR predominantly
  │      hyperintense foci on T2W
  │      ├─ Hyperintense on T2W and peripheral enhancement
  │      │  → Soft Tissue RADS-3
  │      └─ Hypointense on T2W and no peripheral enhancement
  │         → Soft Tissue RADS-4
  │
  ├─ Intra-neural or Nerve related*
  │   ├─ Target sign → Soft Tissue RADS-2 (Benign PNST)
  │   └─ No target sign
  │      ├─ ADC >1.1 mm²/s → Soft Tissue RADS-3
  │      └─ ADC ≤1.1 mm²/s → Soft Tissue RADS-4** / Soft Tissue RADS-5**
  │
  └─ Cutaneous or Subcutaneous
      ├─ Exophytic
      │  ├─ Peripheral enhancement → Soft Tissue RADS-2
      │  └─ Internal enhancement → Soft Tissue RADS-4
      └─ Endophytic → Soft Tissue RADS-5**

  RULE ENGINE MAPPING:
  ─────────────────────
  scoreIntravascular:
    - phleboliths → RADS-2
    - hyper_no_phleb → RADS-4 (radiologistChoice: true, i.e. 4 or 5)
    
  scoreIntraarticular:
    - calcified_hypo → RADS-2 (no blooming question in wizard/rule engine)
    - not_calcified_hyper:
      - peripheral → RADS-3
      - no_peripheral → RADS-4

  scoreIntraneural:
    - targetSign === "yes" → RADS-2
    - targetSign === "no":
      - nerveADC === "high" → RADS-3
      - nerveADC === "low" → RADS-4 (radiologistChoice: true, i.e. 4 or 5)

  scoreCutaneous:
    - exophytic:
      - peripheral → RADS-2
      - internal → RADS-4
    - endophytic → RADS-5

  NOTE: The intra-articular blooming split (under calcified_hypo) appears in the
  manuscript figure but is NOT in the wizard or rule engine (both paths → RADS-2).
  We show it for manuscript fidelity. Both sub-branches highlight when calcified_hypo
  is selected since the rule engine outcome is identical.
*/

export default function Figure2DChart({ caseData, finalScore }) {
  const c = caseData.compartment;

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate Solid Soft Tissue Mass*" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        <VascBranch cd={caseData} fs={finalScore} on={c === "intravascular"} />
        <IABranch cd={caseData} fs={finalScore} on={c === "intraarticular"} />
        <NerveBranch cd={caseData} fs={finalScore} on={c === "intraneural"} />
        <CutBranch cd={caseData} fs={finalScore} on={c === "cutaneous"} />
      </TreeFork>
    </div>
  );
}

/* Intra-vascular or Vessel related — 2 branches per manuscript */
function VascBranch({ cd, fs, on }) {
  const vm = cd.vascMorphology;

  const hPhleb = on && vm === "phleboliths";
  const hNoP = on && vm === "hyper_no_phleb";

  return (
    <div className="flex flex-col items-center">
      <N label="Intra-vascular or Vessel related**" isHighlighted={on} className="max-w-[120px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Hyperintense lobules or tubules on T2W with hypointense phleboliths with fluid-fluid levels" isHighlighted={hPhleb} className="max-w-[115px]" />
          <Stem h={hPhleb} />
          <N type="score" score={2} isHighlighted={hPhleb} isActive={hPhleb && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="Hypointense lobules or tubules on T2W without hypointense phleboliths with fluid-fluid levels" isHighlighted={hNoP} className="max-w-[115px]" />
          <Stem h={hNoP} />
          <div className="flex gap-1.5">
            <N type="score" score={4} isHighlighted={hNoP} isActive={hNoP && (fs === 4 || fs === 5)} />
            <N type="score" score={5} isHighlighted={hNoP} isActive={hNoP && (fs === 4 || fs === 5)} />
          </div>
        </div>
      </TreeFork>
    </div>
  );
}

/*
  Intra-articular — manuscript shows blooming split under calcified path.
  Rule engine: calcified_hypo → RADS-2 directly (no blooming variable).
  We show the blooming split for manuscript fidelity. Since iaBlooming is not
  in the wizard, we highlight BOTH sub-branches when calcified_hypo is active
  (both lead to RADS-2 anyway).
*/
function IABranch({ cd, fs, on }) {
  const sig = cd.iaSignal;
  const enh = cd.iaEnhancement;

  const hCalc = on && sig === "calcified_hypo";
  const hHyper = on && sig === "not_calcified_hyper";

  return (
    <div className="flex flex-col items-center">
      <N label="Intra-articular" isHighlighted={on} className="max-w-[105px]" />
      <TreeFork parentHighlighted={on}>
        {/* Calcified → blooming split (manuscript fidelity, both → RADS-2) */}
        <div className="flex flex-col items-center">
          <N label="Calcified/ossified on XR or CT and/or predominantly hypointense foci on T2W" isHighlighted={hCalc} className="max-w-[110px]" />
          <TreeFork parentHighlighted={hCalc}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin staining as blooming on GRE" isHighlighted={hCalc} className="max-w-[90px]" />
              <Stem h={hCalc} />
              <N type="score" score={2} isHighlighted={hCalc} isActive={hCalc && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin staining without blooming on GRE" isHighlighted={hCalc} className="max-w-[90px]" />
              <Stem h={hCalc} />
              <N type="score" score={2} isHighlighted={hCalc} isActive={hCalc && fs === 2} />
            </div>
          </TreeFork>
        </div>

        {/* Not calcified → T2/enhancement fork */}
        <div className="flex flex-col items-center">
          <N label="Not calcified/ossified on XR or CT OR predominantly hyperintense foci on T2W" isHighlighted={hHyper} className="max-w-[110px]" />
          <TreeFork parentHighlighted={hHyper}>
            <div className="flex flex-col items-center">
              <N label="Hyperintense on T2W and peripheral enhancement" isHighlighted={hHyper && enh === "peripheral"} className="max-w-[95px]" />
              <Stem h={hHyper && enh === "peripheral"} />
              <N type="score" score={3} isHighlighted={hHyper && enh === "peripheral"} isActive={hHyper && enh === "peripheral" && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hypointense on T2W and no peripheral enhancement" isHighlighted={hHyper && enh === "no_peripheral"} className="max-w-[95px]" />
              <Stem h={hHyper && enh === "no_peripheral"} />
              <N type="score" score={4} isHighlighted={hHyper && enh === "no_peripheral"} isActive={hHyper && enh === "no_peripheral" && fs === 4} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

/* Intra-neural or Nerve related — target sign → RADS-2, no target → ADC fork */
function NerveBranch({ cd, fs, on }) {
  const ts = cd.targetSign;
  const adc = cd.nerveADC;

  const hTarget = on && ts === "yes";
  const hNoTarget = on && ts === "no";
  const hHighADC = hNoTarget && adc === "high";
  const hLowADC = hNoTarget && adc === "low";

  return (
    <div className="flex flex-col items-center">
      <N label="Intra-neural or Nerve related*" isHighlighted={on} className="max-w-[110px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Target sign" isHighlighted={hTarget} className="max-w-[85px]" />
          <Stem h={hTarget} />
          <N type="score" score={2} isHighlighted={hTarget} isActive={hTarget && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="No target sign" isHighlighted={hNoTarget} className="max-w-[85px]" />
          <TreeFork parentHighlighted={hNoTarget}>
            <div className="flex flex-col items-center">
              <N label="ADC >1.1 mm²/s" isHighlighted={hHighADC} className="max-w-[85px]" />
              <Stem h={hHighADC} />
              <N type="score" score={3} isHighlighted={hHighADC} isActive={hHighADC && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="ADC ≤1.1 mm²/s" isHighlighted={hLowADC} className="max-w-[85px]" />
              <Stem h={hLowADC} />
              <div className="flex gap-1.5">
                <N type="score" score={4} isHighlighted={hLowADC} isActive={hLowADC && (fs === 4 || fs === 5)} />
                <N type="score" score={5} isHighlighted={hLowADC} isActive={hLowADC && (fs === 4 || fs === 5)} />
              </div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

/* Cutaneous or Subcutaneous — exophytic/endophytic */
function CutBranch({ cd, fs, on }) {
  const gp = cd.growthPattern;
  const ce = cd.cutEnhancement;

  const hExo = on && gp === "exophytic";
  const hEndo = on && gp === "endophytic";

  return (
    <div className="flex flex-col items-center">
      <N label="Cutaneous or Subcutaneous" isHighlighted={on} className="max-w-[105px]" />
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