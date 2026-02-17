import React from "react";
import N from "./FlowchartNode";
import { TreeFork, Stem } from "./TreeLayout";

/*
  FIGURE 2C — Indeterminate Solid Soft Tissue Lesion* (exact manuscript match)

  Indeterminate Solid Soft Tissue Lesion*
  ├─ Deep (subfascial)/inter or intra-muscular
  │   ├─ Muscle signature → ST-RADS 2
  │   └─ No muscle signature
  │       ├─ History of prior injury with peritumoral edema & mature peripheral mineralization → (none shown, goes to RADS-2 same as muscle sig)
  │       └─ No history → RADS-4 / RADS-5**
  ├─ Intra-tendinous or tendon-related
  │   ├─ Enlarged tendon → Hemosiderin blooming on GRE → RADS-2 / no blooming → RADS-2 (Gout, Amyloid, Xanthoma shown)
  │     Wait — manuscript shows: Enlarged → RADS-2 (Gout, Amyloid, Xanthoma)
  │     Normal → blooming → RADS-3 (TSGCT) / no blooming → RADS-4 / RADS-5**
  │   
  │   Actually per manuscript image: Enlarged tendon splits to Hemosiderin blooming/no blooming
  │     blooming → RADS-2, no blooming → ... but the RADS-2 shows Gout/Amyloid/Xanthoma
  │   Normal tendon:
  │     Hemosiderin with blooming → RADS-3 (TSGCT)
  │     Hemosiderin without blooming → RADS-4 / RADS-5**
  ├─ Plantar or palmar fascial
  │   ├─ <2 cm → RADS-2 (Fibroma)
  │   └─ ≥2 cm
  │       ├─ Multifocal → RADS-3 (Fibromatosis)
  │       └─ No multifocal → RADS-4 / RADS-5**
  └─ Subungual
      ├─ Small <1 cm → RADS-3
      └─ Large ≥1 cm → RADS-4
*/

export default function Figure2CChart({ caseData, finalScore }) {
  const c = caseData.compartment;

  return (
    <div className="flex flex-col items-center">
      <N label="Indeterminate Solid Soft Tissue Lesion*" isHighlighted className="font-bold px-5 py-2.5" />
      <TreeFork parentHighlighted>
        <DeepBranch cd={caseData} fs={finalScore} on={c === "deep_muscle"} />
        <TendonBranch cd={caseData} fs={finalScore} on={c === "intratendinous"} />
        <FascialBranch cd={caseData} fs={finalScore} on={c === "fascial"} />
        <SubungualBranch cd={caseData} fs={finalScore} on={c === "subungual"} />
      </TreeFork>
    </div>
  );
}

/*
  Deep (subfascial)/inter or intra-muscular
  
  MANUSCRIPT (image 4):
    Muscle signature → RADS-2
    No muscle signature →
      History of prior injury with peritumoral edema & mature peripheral mineralization
        Yes → RADS-2
        No → RADS-4 / RADS-5**

  RULE ENGINE (scoreDeepMuscle):
    muscleSignature === "yes" → RADS-2
    muscleSignature === "no":
      myositisTriad === "yes" → RADS-2
      myositisTriad === "no" (default) → RADS-4 (radiologistChoice=true)
*/
function DeepBranch({ cd, fs, on }) {
  const ms = cd.muscleSignature;
  const mt = cd.myositisTriad;

  const hMusYes = on && ms === "yes";
  const hMusNo = on && ms === "no";
  const hTriadYes = hMusNo && mt === "yes";
  const hTriadNo = hMusNo && mt === "no";

  return (
    <div className="flex flex-col items-center">
      <N label="Deep (subfascial)/inter or intra-muscular" isHighlighted={on} className="max-w-[130px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Muscle signature" isHighlighted={hMusYes} className="max-w-[90px]" />
          <Stem h={hMusYes} />
          <N type="score" score={2} isHighlighted={hMusYes} isActive={hMusYes && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="No muscle signature" isHighlighted={hMusNo} className="max-w-[100px]" />
          <Stem h={hMusNo} />
          <N label="History of prior injury with peritumoral edema & mature peripheral mineralization" isHighlighted={hMusNo} className="max-w-[130px]" />
          <TreeFork parentHighlighted={hMusNo}>
            <div className="flex flex-col items-center">
              <N label="Yes" isHighlighted={hTriadYes} className="max-w-[50px]" />
              <Stem h={hTriadYes} />
              <N type="score" score={2} isHighlighted={hTriadYes} isActive={hTriadYes && fs === 2} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No" isHighlighted={hTriadNo} className="max-w-[50px]" />
              <Stem h={hTriadNo} />
              <div className="flex gap-1.5">
                <N type="score" score={4} isHighlighted={hTriadNo} isActive={hTriadNo && (fs === 4 || fs === 5)} />
                <N type="score" score={5} isHighlighted={hTriadNo} isActive={hTriadNo && (fs === 4 || fs === 5)} />
              </div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

/* Intra-tendinous or tendon-related — per manuscript:
   Enlarged tendon → RADS-2 (Gout, Amyloid, Xanthoma)
   Normal size tendon → Hemosiderin with blooming → RADS-3 (TSGCT)
                       → Hemosiderin without blooming → RADS-4 / RADS-5**
*/
function TendonBranch({ cd, fs, on }) {
  const tm = cd.tendonMorph;
  const tb = cd.tendonBlooming;

  const hEnlarged = on && tm === "enlarged";
  const hNormal = on && tm === "normal";
  const hBlooming = hNormal && tb === "blooming";
  const hNoBlooming = hNormal && tb === "no_blooming";

  return (
    <div className="flex flex-col items-center">
      <N label="Intra-tendinous or tendon-related" isHighlighted={on} className="max-w-[120px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Enlarged tendon with calcifications, cystic change, fat, or underlying history of amyloidosis or autoimmune disease" isHighlighted={hEnlarged} className="max-w-[120px]" />
          <Stem h={hEnlarged} />
          <N type="score" score={2} isHighlighted={hEnlarged} isActive={hEnlarged && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="Normal size tendon without calcifications, cystic change, fat, or no underlying history of amyloidosis or autoimmune disease" isHighlighted={hNormal} className="max-w-[120px]" />
          <TreeFork parentHighlighted={hNormal}>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin staining with blooming on GRE" isHighlighted={hBlooming} className="max-w-[95px]" />
              <Stem h={hBlooming} />
              <N type="score" score={3} isHighlighted={hBlooming} isActive={hBlooming && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="Hemosiderin staining without blooming on GRE" isHighlighted={hNoBlooming} className="max-w-[95px]" />
              <Stem h={hNoBlooming} />
              <div className="flex gap-1.5">
                <N type="score" score={4} isHighlighted={hNoBlooming} isActive={hNoBlooming && fs === 4} />
                <N type="score" score={5} isHighlighted={hNoBlooming} isActive={hNoBlooming && fs === 5} />
              </div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

/* Plantar or palmar fascial */
function FascialBranch({ cd, fs, on }) {
  const sz = cd.fascialSize;
  const mu = cd.fascialMulti;

  const hSmall = on && sz === "small";
  const hLarge = on && sz === "large";
  const hMulti = hLarge && mu === "yes";
  const hNoMulti = hLarge && mu === "no";

  return (
    <div className="flex flex-col items-center">
      <N label="Plantar or palmar fascial" isHighlighted={on} className="max-w-[110px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Fascial nodule <2 cm in length" isHighlighted={hSmall} className="max-w-[100px]" />
          <Stem h={hSmall} />
          <N type="score" score={2} isHighlighted={hSmall} isActive={hSmall && fs === 2} />
        </div>
        <div className="flex flex-col items-center">
          <N label="Fascial nodule ≥2 cm in length" isHighlighted={hLarge} className="max-w-[100px]" />
          <TreeFork parentHighlighted={hLarge}>
            <div className="flex flex-col items-center">
              <N label="Multifocal or conglomerate fascial nodules" isHighlighted={hMulti} className="max-w-[95px]" />
              <Stem h={hMulti} />
              <N type="score" score={3} isHighlighted={hMulti} isActive={hMulti && fs === 3} />
            </div>
            <div className="flex flex-col items-center">
              <N label="No multifocal or conglomerate fascial nodules" isHighlighted={hNoMulti} className="max-w-[95px]" />
              <Stem h={hNoMulti} />
              <div className="flex gap-1.5">
                <N type="score" score={4} isHighlighted={hNoMulti} isActive={hNoMulti && fs === 4} />
                <N type="score" score={5} isHighlighted={hNoMulti} isActive={hNoMulti && fs === 5} />
              </div>
            </div>
          </TreeFork>
        </div>
      </TreeFork>
    </div>
  );
}

/* Subungual */
function SubungualBranch({ cd, fs, on }) {
  const sz = cd.subungualSize;

  return (
    <div className="flex flex-col items-center">
      <N label="Subungual" isHighlighted={on} className="max-w-[85px]" />
      <Stem h={on} />
      <N label="Hyperintense on T2W, diffuse enhancement on T1W + contrast" isHighlighted={on} className="max-w-[120px]" />
      <TreeFork parentHighlighted={on}>
        <div className="flex flex-col items-center">
          <N label="Small <1 cm" isHighlighted={on && sz === "small"} className="max-w-[70px]" />
          <Stem h={on && sz === "small"} />
          <N type="score" score={3} isHighlighted={on && sz === "small"} isActive={on && sz === "small" && fs === 3} />
        </div>
        <div className="flex flex-col items-center">
          <N label="Large ≥1 cm" isHighlighted={on && sz === "large"} className="max-w-[70px]" />
          <Stem h={on && sz === "large"} />
          <N type="score" score={4} isHighlighted={on && sz === "large"} isActive={on && sz === "large" && fs === 4} />
        </div>
      </TreeFork>
    </div>
  );
}