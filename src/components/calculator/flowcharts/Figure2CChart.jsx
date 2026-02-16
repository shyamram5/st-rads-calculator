import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

// FIGURE 2C: Indeterminate Solid Soft Tissue Lesion
// Compartments: Deep/Intramuscular, Intratendinous, Fascial, Subungual

export default function Figure2CChart({ caseData, finalScore }) {
  const c = caseData.compartment;

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate solid soft tissue lesion" isHighlighted={true} className="font-bold px-5 py-2.5" />

      <TreeFork parentHighlighted={true}>
        <DeepBranch caseData={caseData} finalScore={finalScore} active={c === "deep_muscle"} />
        <TendonBranch caseData={caseData} finalScore={finalScore} active={c === "intratendinous"} />
        <FascialBranch caseData={caseData} finalScore={finalScore} active={c === "fascial"} />
        <SubungualBranch caseData={caseData} finalScore={finalScore} active={c === "subungual"} />
      </TreeFork>
    </div>
  );
}

// Deep (subfascial) / Inter or intramuscular
// Muscle signature → RADS-2
// No muscle signature → Benign triad (injury + edema + mineralization)? Yes → RADS-2 | No → RADS-4 or 5
function DeepBranch({ caseData, finalScore, active }) {
  const { muscleSignature, myositisTriad } = caseData;
  const h = active;

  return (
    <div className="flex flex-col items-center">
      <N label="Deep (subfascial) / inter or intramuscular" isHighlighted={h} className="max-w-[130px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="Muscle signature present" isHighlighted={h && muscleSignature === "yes"} className="max-w-[100px]" />
          <Stem h={h && muscleSignature === "yes"} />
          <N type="score" score={2} isHighlighted={h && muscleSignature === "yes"} isActive={h && muscleSignature === "yes" && finalScore === 2} />
        </div>

        <div className="flex flex-col items-center">
          <N label="No muscle signature" isHighlighted={h && muscleSignature === "no"} className="max-w-[100px]" />

          <TreeFork parentHighlighted={h && muscleSignature === "no"}>
            <div className="flex flex-col items-center">
              <N label="Prior injury + peritumoral edema + peripheral mineralization" isHighlighted={h && myositisTriad === "yes"} className="max-w-[110px]" />
              <Stem h={h && myositisTriad === "yes"} />
              <N type="score" score={2} isHighlighted={h && myositisTriad === "yes"} isActive={h && myositisTriad === "yes" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No benign triad" isHighlighted={h && myositisTriad === "no"} className="max-w-[90px]" />
              <Stem h={h && myositisTriad === "no"} />
              <N type="score" score={4} isHighlighted={h && myositisTriad === "no"} isActive={h && myositisTriad === "no" && (finalScore === 4 || finalScore === 5)} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

// Intratendinous
// Enlarged tendon → Blooming → RADS-2 | No blooming → RADS-3
// Normal tendon → Blooming → RADS-4 | No blooming → RADS-5
function TendonBranch({ caseData, finalScore, active }) {
  const { tendonMorph, tendonBlooming } = caseData;
  const h = active;
  const enlarged = tendonMorph === "enlarged";
  const normal = tendonMorph === "normal";
  const bloom = tendonBlooming === "blooming";
  const noBloom = tendonBlooming === "no_blooming";

  return (
    <div className="flex flex-col items-center">
      <N label="Intratendinous" isHighlighted={h} className="max-w-[110px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="Enlarged tendon with calcifications / cystic change / fat" isHighlighted={h && enlarged} className="max-w-[110px]" />

          <TreeFork parentHighlighted={h && enlarged}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming on GRE" isHighlighted={h && enlarged && bloom} className="max-w-[90px]" />
              <Stem h={h && enlarged && bloom} />
              <N type="score" score={2} isHighlighted={h && enlarged && bloom} isActive={h && enlarged && bloom && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={h && enlarged && noBloom} className="max-w-[90px]" />
              <Stem h={h && enlarged && noBloom} />
              <N type="score" score={3} isHighlighted={h && enlarged && noBloom} isActive={h && enlarged && noBloom && finalScore === 3} />
            </div>
          </TreeFork>
        </div>

        <div className="flex flex-col items-center">
          <N label="Normal size tendon without calcifications / cysts / fat" isHighlighted={h && normal} className="max-w-[110px]" />

          <TreeFork parentHighlighted={h && normal}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming on GRE" isHighlighted={h && normal && bloom} className="max-w-[90px]" />
              <Stem h={h && normal && bloom} />
              <N type="score" score={4} isHighlighted={h && normal && bloom} isActive={h && normal && bloom && finalScore === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={h && normal && noBloom} className="max-w-[90px]" />
              <Stem h={h && normal && noBloom} />
              <N type="score" score={5} isHighlighted={h && normal && noBloom} isActive={h && normal && noBloom && finalScore === 5} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

// Plantar / Palmar fascial
// <2 cm → RADS-2
// ≥2 cm → Multifocal → RADS-3 | Not multifocal → RADS-4 or 5
function FascialBranch({ caseData, finalScore, active }) {
  const { fascialSize, fascialMulti } = caseData;
  const h = active;
  const small = fascialSize === "small";
  const large = fascialSize === "large";
  const multi = fascialMulti === "yes";
  const notMulti = fascialMulti === "no";

  return (
    <div className="flex flex-col items-center">
      <N label="Plantar or palmar fascial" isHighlighted={h} className="max-w-[110px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="<2 cm" isHighlighted={h && small} className="max-w-[70px]" />
          <Stem h={h && small} />
          <N type="score" score={2} isHighlighted={h && small} isActive={h && small && finalScore === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="≥2 cm" isHighlighted={h && large} className="max-w-[70px]" />

          <TreeFork parentHighlighted={h && large}>
            <div className="flex flex-col items-center">
              <N label="Multifocal / conglomerate" isHighlighted={h && large && multi} className="max-w-[90px]" />
              <Stem h={h && large && multi} />
              <N type="score" score={3} isHighlighted={h && large && multi} isActive={h && large && multi && finalScore === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Not multifocal" isHighlighted={h && large && notMulti} className="max-w-[90px]" />
              <Stem h={h && large && notMulti} />
              <N type="score" score={4} isHighlighted={h && large && notMulti} isActive={h && large && notMulti && (finalScore === 4 || finalScore === 5)} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

// Subungual
// T2 hyperintense + diffuse enhancement
// <1 cm → RADS-3
// ≥1 cm → RADS-4
function SubungualBranch({ caseData, finalScore, active }) {
  const { subungualSize } = caseData;
  const h = active;
  const small = subungualSize === "small";
  const large = subungualSize === "large";

  return (
    <div className="flex flex-col items-center">
      <N label="Subungual" isHighlighted={h} className="max-w-[90px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="<1 cm" isHighlighted={h && small} className="max-w-[60px]" />
          <Stem h={h && small} />
          <N type="score" score={3} isHighlighted={h && small} isActive={h && small && finalScore === 3} />
        </div>
        <div className="flex flex-col items-center">
          <N label="≥1 cm" isHighlighted={h && large} className="max-w-[60px]" />
          <Stem h={h && large} />
          <N type="score" score={4} isHighlighted={h && large} isActive={h && large && finalScore === 4} />
        </div>
      </TreeFork>
    </div>
  );
}