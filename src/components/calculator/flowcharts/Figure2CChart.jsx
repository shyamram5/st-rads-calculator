import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

// Figure 2C: Deep/Intramuscular, Intratendinous, Fascial, Subungual
export default function Figure2CChart({ caseData, finalScore }) {
  const c = caseData.compartment;
  const isDeep = c === "deep_muscle";
  const isTendon = c === "intratendinous";
  const isFascial = c === "fascial";
  const isSubungual = c === "subungual";

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate Solid Soft Tissue Lesion — Fig 2C" isHighlighted={true} className="font-bold px-4 py-2.5" />

      <TreeFork parentHighlighted={true}>
        {/* Deep / Intramuscular */}
        <DeepBranch caseData={caseData} finalScore={finalScore} h={isDeep} />
        {/* Intratendinous */}
        <TendonBranch caseData={caseData} finalScore={finalScore} h={isTendon} />
        {/* Fascial */}
        <FascialBranch caseData={caseData} finalScore={finalScore} h={isFascial} />
        {/* Subungual */}
        <SubungualBranch caseData={caseData} finalScore={finalScore} h={isSubungual} />
      </TreeFork>
    </div>
  );
}

function DeepBranch({ caseData, finalScore, h }) {
  const { muscleSignature, myositisTriad } = caseData;
  const hasSig = muscleSignature === "yes";
  const noSig = muscleSignature === "no";
  const hasTriad = myositisTriad === "yes";
  const noTriad = myositisTriad === "no";

  return (
    <div className="flex flex-col items-center">
      <N label="Deep (subfascial) / Intramuscular" isHighlighted={h} className="max-w-[120px]" />

      <TreeFork parentHighlighted={h}>
        {/* Muscle signature → RADS-2 */}
        <div className="flex flex-col items-center">
          <N label="Muscle signature present" isHighlighted={h && hasSig} className="max-w-[100px]" />
          <Stem h={h && hasSig} />
          <N type="score" score={2} isHighlighted={h && hasSig} isActive={h && hasSig && finalScore === 2} />
        </div>

        {/* No muscle signature → triad */}
        <div className="flex flex-col items-center">
          <N label="No muscle signature" isHighlighted={h && noSig} className="max-w-[100px]" />

          <TreeFork parentHighlighted={h && noSig}>
            <div className="flex flex-col items-center">
              <N label="Benign triad present" isHighlighted={h && noSig && hasTriad} className="max-w-[85px]" />
              <Stem h={h && noSig && hasTriad} />
              <N type="score" score={2} isHighlighted={h && noSig && hasTriad} isActive={h && noSig && hasTriad && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No benign triad" isHighlighted={h && noSig && noTriad} className="max-w-[85px]" />
              <Stem h={h && noSig && noTriad} />
              <N type="score" score={4} isHighlighted={h && noSig && noTriad} isActive={h && noSig && noTriad && (finalScore === 4 || finalScore === 5)} />
              <div className="text-[9px] text-center text-slate-400 mt-0.5">RADS 4 or 5</div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function TendonBranch({ caseData, finalScore, h }) {
  const { tendonMorph, tendonBlooming } = caseData;
  const enlarged = tendonMorph === "enlarged";
  const normal = tendonMorph === "normal";
  const bloom = tendonBlooming === "blooming";
  const noBloom = tendonBlooming === "no_blooming";

  return (
    <div className="flex flex-col items-center">
      <N label="Intratendinous" isHighlighted={h} className="max-w-[100px]" />

      <TreeFork parentHighlighted={h}>
        {/* Enlarged tendon */}
        <div className="flex flex-col items-center">
          <N label="Enlarged tendon" isHighlighted={h && enlarged} className="max-w-[90px]" />

          <TreeFork parentHighlighted={h && enlarged}>
            <div className="flex flex-col items-center">
              <N label="Blooming on GRE" isHighlighted={h && enlarged && bloom} className="max-w-[80px]" />
              <Stem h={h && enlarged && bloom} />
              <N type="score" score={2} isHighlighted={h && enlarged && bloom} isActive={h && enlarged && bloom && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No blooming" isHighlighted={h && enlarged && noBloom} className="max-w-[80px]" />
              <Stem h={h && enlarged && noBloom} />
              <N type="score" score={3} isHighlighted={h && enlarged && noBloom} isActive={h && enlarged && noBloom && finalScore === 3} />
            </div>
          </TreeFork>
        </div>

        {/* Normal tendon */}
        <div className="flex flex-col items-center">
          <N label="Normal size tendon" isHighlighted={h && normal} className="max-w-[90px]" />

          <TreeFork parentHighlighted={h && normal}>
            <div className="flex flex-col items-center">
              <N label="Blooming on GRE" isHighlighted={h && normal && bloom} className="max-w-[80px]" />
              <Stem h={h && normal && bloom} />
              <N type="score" score={4} isHighlighted={h && normal && bloom} isActive={h && normal && bloom && finalScore === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No blooming" isHighlighted={h && normal && noBloom} className="max-w-[80px]" />
              <Stem h={h && normal && noBloom} />
              <N type="score" score={5} isHighlighted={h && normal && noBloom} isActive={h && normal && noBloom && finalScore === 5} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function FascialBranch({ caseData, finalScore, h }) {
  const { fascialSize, fascialMulti } = caseData;
  const small = fascialSize === "small";
  const large = fascialSize === "large";
  const multi = fascialMulti === "yes";
  const notMulti = fascialMulti === "no";

  return (
    <div className="flex flex-col items-center">
      <N label="Plantar / Palmar fascial" isHighlighted={h} className="max-w-[100px]" />

      <TreeFork parentHighlighted={h}>
        <div className="flex flex-col items-center">
          <N label="<2 cm" isHighlighted={h && small} className="max-w-[70px]" />
          <Stem h={h && small} />
          <N type="score" score={2} isHighlighted={h && small} isActive={h && small && finalScore === 2} />
          <div className="text-[9px] text-center text-slate-400 mt-0.5">Fibroma</div>
        </div>
        <div className="flex flex-col items-center">
          <N label="≥2 cm" isHighlighted={h && large} className="max-w-[70px]" />

          <TreeFork parentHighlighted={h && large}>
            <div className="flex flex-col items-center">
              <N label="Multifocal" isHighlighted={h && large && multi} className="max-w-[70px]" />
              <Stem h={h && large && multi} />
              <N type="score" score={3} isHighlighted={h && large && multi} isActive={h && large && multi && finalScore === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Not multifocal" isHighlighted={h && large && notMulti} className="max-w-[70px]" />
              <Stem h={h && large && notMulti} />
              <N type="score" score={4} isHighlighted={h && large && notMulti} isActive={h && large && notMulti && (finalScore === 4 || finalScore === 5)} />
              <div className="text-[9px] text-center text-slate-400 mt-0.5">RADS 4/5</div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function SubungualBranch({ caseData, finalScore, h }) {
  const { subungualSize } = caseData;
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