import React from "react";
import FlowchartNode from "./FlowchartNode";
import FlowchartConnector from "./FlowchartConnector";

export default function Figure2CChart({ caseData, finalScore }) {
  const { compartment, muscleSignature, myositisTriad, tendonMorph, tendonBlooming, fascialSize, fascialMulti, subungualSize } = caseData;

  const isDeep = compartment === "deep_muscle";
  const isTendon = compartment === "intratendinous";
  const isFascial = compartment === "fascial";
  const isSubungual = compartment === "subungual";

  return (
    <div className="flex flex-col items-center gap-0">
      <FlowchartNode label="Indeterminate Solid Soft Tissue Lesion" isHighlighted={true} className="font-bold text-xs px-5 py-2.5" />
      <FlowchartConnector isHighlighted={true} />

      <div className="flex items-start gap-3 md:gap-6 flex-wrap justify-center">
        {/* Deep / Intramuscular */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Deep (subfascial) / Intramuscular" isHighlighted={isDeep} className="max-w-[130px]" />
          <FlowchartConnector isHighlighted={isDeep} />
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Muscle signature" isHighlighted={isDeep && muscleSignature === "yes"} className="max-w-[90px]" />
              <FlowchartConnector isHighlighted={isDeep && muscleSignature === "yes"} />
              <FlowchartNode type="score" score={2} isHighlighted={isDeep && muscleSignature === "yes"} isActive={isDeep && muscleSignature === "yes" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="No muscle signature" isHighlighted={isDeep && muscleSignature === "no"} className="max-w-[90px]" />
              <FlowchartConnector isHighlighted={isDeep && muscleSignature === "no"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Benign triad" isHighlighted={isDeep && myositisTriad === "yes"} className="max-w-[70px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isDeep && myositisTriad === "yes"} />
                  <FlowchartNode type="score" score={2} isHighlighted={isDeep && myositisTriad === "yes"} isActive={isDeep && myositisTriad === "yes" && finalScore === 2} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No triad" isHighlighted={isDeep && myositisTriad === "no"} className="max-w-[70px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isDeep && myositisTriad === "no"} />
                  <FlowchartNode type="score" score={4} isHighlighted={isDeep && myositisTriad === "no"} isActive={isDeep && myositisTriad === "no" && (finalScore === 4 || finalScore === 5)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intratendinous */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Intratendinous" isHighlighted={isTendon} className="max-w-[110px]" />
          <FlowchartConnector isHighlighted={isTendon} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Enlarged tendon" isHighlighted={isTendon && tendonMorph === "enlarged"} className="max-w-[80px] text-[10px]" />
              <FlowchartConnector isHighlighted={isTendon && tendonMorph === "enlarged"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Blooming" isHighlighted={isTendon && tendonMorph === "enlarged" && tendonBlooming === "blooming"} className="max-w-[60px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isTendon && tendonMorph === "enlarged" && tendonBlooming === "blooming"} />
                  <FlowchartNode type="score" score={2} isHighlighted={isTendon && tendonMorph === "enlarged" && tendonBlooming === "blooming"} isActive={isTendon && tendonMorph === "enlarged" && tendonBlooming === "blooming" && finalScore === 2} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No bloom" isHighlighted={isTendon && tendonMorph === "enlarged" && tendonBlooming !== "blooming"} className="max-w-[60px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isTendon && tendonMorph === "enlarged" && tendonBlooming !== "blooming"} />
                  <FlowchartNode type="score" score={3} isHighlighted={isTendon && tendonMorph === "enlarged" && tendonBlooming !== "blooming"} isActive={isTendon && tendonMorph === "enlarged" && tendonBlooming !== "blooming" && finalScore === 3} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Normal tendon" isHighlighted={isTendon && tendonMorph === "normal"} className="max-w-[80px] text-[10px]" />
              <FlowchartConnector isHighlighted={isTendon && tendonMorph === "normal"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Blooming" isHighlighted={isTendon && tendonMorph === "normal" && tendonBlooming === "blooming"} className="max-w-[60px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isTendon && tendonMorph === "normal" && tendonBlooming === "blooming"} />
                  <FlowchartNode type="score" score={4} isHighlighted={isTendon && tendonMorph === "normal" && tendonBlooming === "blooming"} isActive={isTendon && tendonMorph === "normal" && tendonBlooming === "blooming" && finalScore === 4} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No bloom" isHighlighted={isTendon && tendonMorph === "normal" && tendonBlooming !== "blooming"} className="max-w-[60px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isTendon && tendonMorph === "normal" && tendonBlooming !== "blooming"} />
                  <FlowchartNode type="score" score={5} isHighlighted={isTendon && tendonMorph === "normal" && tendonBlooming !== "blooming"} isActive={isTendon && tendonMorph === "normal" && tendonBlooming !== "blooming" && finalScore === 5} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fascial */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Plantar or palmar fascial" isHighlighted={isFascial} className="max-w-[110px]" />
          <FlowchartConnector isHighlighted={isFascial} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="<2 cm" isHighlighted={isFascial && fascialSize === "small"} className="max-w-[70px] text-[10px]" />
              <FlowchartConnector isHighlighted={isFascial && fascialSize === "small"} />
              <FlowchartNode type="score" score={2} isHighlighted={isFascial && fascialSize === "small"} isActive={isFascial && fascialSize === "small" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="≥2 cm" isHighlighted={isFascial && fascialSize === "large"} className="max-w-[70px] text-[10px]" />
              <FlowchartConnector isHighlighted={isFascial && fascialSize === "large"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Multi-focal" isHighlighted={isFascial && fascialMulti === "yes"} className="max-w-[65px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isFascial && fascialMulti === "yes"} />
                  <FlowchartNode type="score" score={3} isHighlighted={isFascial && fascialMulti === "yes"} isActive={isFascial && fascialMulti === "yes" && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Not multi" isHighlighted={isFascial && fascialMulti === "no"} className="max-w-[65px] text-[10px]" />
                  <FlowchartConnector isHighlighted={isFascial && fascialMulti === "no"} />
                  <FlowchartNode type="score" score={4} isHighlighted={isFascial && fascialMulti === "no"} isActive={isFascial && fascialMulti === "no" && (finalScore === 4 || finalScore === 5)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subungual */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Subungual" isHighlighted={isSubungual} className="max-w-[100px]" />
          <FlowchartConnector isHighlighted={isSubungual} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="<1 cm" isHighlighted={isSubungual && subungualSize === "small"} className="max-w-[60px] text-[10px]" />
              <FlowchartConnector isHighlighted={isSubungual && subungualSize === "small"} />
              <FlowchartNode type="score" score={3} isHighlighted={isSubungual && subungualSize === "small"} isActive={isSubungual && subungualSize === "small" && finalScore === 3} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="≥1 cm" isHighlighted={isSubungual && subungualSize === "large"} className="max-w-[60px] text-[10px]" />
              <FlowchartConnector isHighlighted={isSubungual && subungualSize === "large"} />
              <FlowchartNode type="score" score={4} isHighlighted={isSubungual && subungualSize === "large"} isActive={isSubungual && subungualSize === "large" && finalScore === 4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}