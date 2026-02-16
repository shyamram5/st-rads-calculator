import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2C — Indeterminate Solid Soft Tissue Lesion (Fig 2C compartments)

  Indeterminate solid soft tissue lesion
  ├─ Deep (subfascial) / inter or intramuscular
  │   ├─ Muscle signature present → ST-RADS 2
  │   └─ No muscle signature
  │       ├─ Prior injury + peritumoral edema + peripheral mineralization → ST-RADS 2
  │       └─ No benign triad → ST-RADS 4 or 5
  ├─ Intratendinous
  │   ├─ Enlarged tendon (calcifications / cystic change / fat)
  │   │   ├─ Hemosiderin with blooming on GRE → ST-RADS 2
  │   │   └─ Hemosiderin without blooming → ST-RADS 3
  │   └─ Normal size tendon
  │       ├─ Hemosiderin with blooming on GRE → ST-RADS 4
  │       └─ Hemosiderin without blooming → ST-RADS 5
  ├─ Plantar / palmar fascial
  │   ├─ <2 cm → ST-RADS 2
  │   └─ ≥2 cm
  │       ├─ Multifocal / conglomerate → ST-RADS 3
  │       └─ Not multifocal → ST-RADS 4 or 5
  └─ Subungual (T2 hyperintense, diffuse enhancement)
      ├─ <1 cm → ST-RADS 3
      └─ ≥1 cm → ST-RADS 4
*/

export default function Figure2CChart({ caseData, finalScore }) {
  const c = caseData.compartment;

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate solid soft tissue lesion" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        <DeepBranch cd={caseData} fs={finalScore} on={c === "deep_muscle"} />
        <TendonBranch cd={caseData} fs={finalScore} on={c === "intratendinous"} />
        <FascialBranch cd={caseData} fs={finalScore} on={c === "fascial"} />
        <SubungualBranch cd={caseData} fs={finalScore} on={c === "subungual"} />
      </TreeFork>
    </div>
  );
}

function DeepBranch({ cd, fs, on }) {
  const ms = cd.muscleSignature;
  const mt = cd.myositisTriad;

  return (
    <div className="flex flex-col items-center">
      <N label="Deep (subfascial) / inter or intramuscular" isHighlighted={on} className="max-w-[125px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Muscle signature present" isHighlighted={on && ms === "yes"} className="max-w-[100px]" />
          <Stem h={on && ms === "yes"} />
          <N type="score" score={2} isHighlighted={on && ms === "yes"} isActive={on && ms === "yes" && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="No muscle signature" isHighlighted={on && ms === "no"} className="max-w-[100px]" />
          <TreeFork parentHighlighted={on && ms === "no"}>
            <div className="flex flex-col items-center">
              <N label="Prior injury + peritumoral edema + peripheral mineralization" isHighlighted={on && mt === "yes"} className="max-w-[105px]" />
              <Stem h={on && mt === "yes"} />
              <N type="score" score={2} isHighlighted={on && mt === "yes"} isActive={on && mt === "yes" && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No benign triad" isHighlighted={on && mt === "no"} className="max-w-[85px]" />
              <Stem h={on && mt === "no"} />
              <N type="score" score={4} isHighlighted={on && mt === "no"} isActive={on && mt === "no" && (fs === 4 || fs === 5)} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function TendonBranch({ cd, fs, on }) {
  const tm = cd.tendonMorph;
  const tb = cd.tendonBlooming;

  const hEnlarged = on && tm === "enlarged";
  const hNormal = on && tm === "normal";

  return (
    <div className="flex flex-col items-center">
      <N label="Intratendinous" isHighlighted={on} className="max-w-[105px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Enlarged tendon with calcifications / cystic change / fat" isHighlighted={hEnlarged} className="max-w-[105px]" />
          <TreeFork parentHighlighted={hEnlarged}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming on GRE" isHighlighted={hEnlarged && tb === "blooming"} className="max-w-[90px]" />
              <Stem h={hEnlarged && tb === "blooming"} />
              <N type="score" score={2} isHighlighted={hEnlarged && tb === "blooming"} isActive={hEnlarged && tb === "blooming" && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={hEnlarged && tb === "no_blooming"} className="max-w-[90px]" />
              <Stem h={hEnlarged && tb === "no_blooming"} />
              <N type="score" score={3} isHighlighted={hEnlarged && tb === "no_blooming"} isActive={hEnlarged && tb === "no_blooming" && fs === 3} />
            </div>
          </TreeFork>
        </div>
        <div className="flex flex-col items-center">
          <N label="Normal size tendon" isHighlighted={hNormal} className="max-w-[105px]" />
          <TreeFork parentHighlighted={hNormal}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin with blooming on GRE" isHighlighted={hNormal && tb === "blooming"} className="max-w-[90px]" />
              <Stem h={hNormal && tb === "blooming"} />
              <N type="score" score={4} isHighlighted={hNormal && tb === "blooming"} isActive={hNormal && tb === "blooming" && fs === 4} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin without blooming" isHighlighted={hNormal && tb === "no_blooming"} className="max-w-[90px]" />
              <Stem h={hNormal && tb === "no_blooming"} />
              <N type="score" score={5} isHighlighted={hNormal && tb === "no_blooming"} isActive={hNormal && tb === "no_blooming" && fs === 5} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function FascialBranch({ cd, fs, on }) {
  const sz = cd.fascialSize;
  const mu = cd.fascialMulti;

  const hSmall = on && sz === "small";
  const hLarge = on && sz === "large";

  return (
    <div className="flex flex-col items-center">
      <N label="Plantar / palmar fascial" isHighlighted={on} className="max-w-[105px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="<2 cm" isHighlighted={hSmall} className="max-w-[65px]" />
          <Stem h={hSmall} />
          <N type="score" score={2} isHighlighted={hSmall} isActive={hSmall && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="≥2 cm" isHighlighted={hLarge} className="max-w-[65px]" />
          <TreeFork parentHighlighted={hLarge}>
            <div className="flex flex-col items-center">
              <N label="Multifocal / conglomerate" isHighlighted={hLarge && mu === "yes"} className="max-w-[90px]" />
              <Stem h={hLarge && mu === "yes"} />
              <N type="score" score={3} isHighlighted={hLarge && mu === "yes"} isActive={hLarge && mu === "yes" && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Not multifocal" isHighlighted={hLarge && mu === "no"} className="max-w-[90px]" />
              <Stem h={hLarge && mu === "no"} />
              <N type="score" score={4} isHighlighted={hLarge && mu === "no"} isActive={hLarge && mu === "no" && (fs === 4 || fs === 5)} />
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

function SubungualBranch({ cd, fs, on }) {
  const sz = cd.subungualSize;

  return (
    <div className="flex flex-col items-center">
      <N label="Subungual" isHighlighted={on} className="max-w-[85px]" />
      <Stem h={on} />
      <N label="T2 hyperintense + diffuse enhancement" isHighlighted={on} className="max-w-[110px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="<1 cm" isHighlighted={on && sz === "small"} className="max-w-[60px]" />
          <Stem h={on && sz === "small"} />
          <N type="score" score={3} isHighlighted={on && sz === "small"} isActive={on && sz === "small" && fs === 3} />
        </div>
        <div className="flex flex-col items-center">
          <N label="≥1 cm" isHighlighted={on && sz === "large"} className="max-w-[60px]" />
          <Stem h={on && sz === "large"} />
          <N type="score" score={4} isHighlighted={on && sz === "large"} isActive={on && sz === "large" && fs === 4} />
        </div>
      </TreeFork>
    </div>
  );
}