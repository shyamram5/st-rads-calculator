import React from "react";
import FlowchartNode from "./FlowchartNode";
import FlowchartConnector from "./FlowchartConnector";

export default function Figure2DChart({ caseData, finalScore }) {
  const {
    compartment,
    vascMorphology, vascBlooming, vascT2Enhancement,
    iaSignal, iaBlooming, iaEnhancement,
    targetSign, nerveADC, nerveT2Enhancement,
    growthPattern, cutEnhancement
  } = caseData;

  const isVasc = compartment === "intravascular";
  const isIA = compartment === "intraarticular";
  const isNerve = compartment === "intraneural";
  const isCut = compartment === "cutaneous";

  return (
    <div className="flex flex-col items-center gap-0">
      <FlowchartNode label="Indeterminate Solid Soft Tissue Mass" isHighlighted={true} className="font-bold text-xs px-5 py-2.5" />
      <FlowchartConnector isHighlighted={true} />

      <div className="flex items-start gap-3 md:gap-6 flex-wrap justify-center">
        {/* Intravascular */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Intravascular or vessel-related" isHighlighted={isVasc} className="max-w-[120px]" />
          <FlowchartConnector isHighlighted={isVasc} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Phleboliths + fluid-fluid" isHighlighted={isVasc && vascMorphology === "phleboliths"} className="max-w-[85px] text-[10px]" />
              <FlowchartConnector isHighlighted={isVasc && vascMorphology === "phleboliths"} />
              <FlowchartNode type="score" score={2} isHighlighted={isVasc && vascMorphology === "phleboliths"} isActive={isVasc && vascMorphology === "phleboliths" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Hyper T2, no phleboliths" isHighlighted={isVasc && vascMorphology === "hyper_no_phleb"} className="max-w-[85px] text-[10px]" />
              <FlowchartConnector isHighlighted={isVasc && vascMorphology === "hyper_no_phleb"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Peripheral enh." isHighlighted={isVasc && vascT2Enhancement === "hyperintense_peripheral"} className="max-w-[70px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isVasc && vascT2Enhancement === "hyperintense_peripheral"} />
                  <FlowchartNode type="score" score={4} isHighlighted={isVasc && vascT2Enhancement === "hyperintense_peripheral"} isActive={isVasc && vascT2Enhancement === "hyperintense_peripheral" && finalScore === 4} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No periph. enh." isHighlighted={isVasc && vascT2Enhancement === "hypointense_no_peripheral"} className="max-w-[70px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isVasc && vascT2Enhancement === "hypointense_no_peripheral"} />
                  <FlowchartNode type="score" score={5} isHighlighted={isVasc && vascT2Enhancement === "hypointense_no_peripheral"} isActive={isVasc && vascT2Enhancement === "hypointense_no_peripheral" && finalScore === 5} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Calcified / hypo T2" isHighlighted={isVasc && vascMorphology === "calc_hypo"} className="max-w-[85px] text-[10px]" />
              <FlowchartConnector isHighlighted={isVasc && vascMorphology === "calc_hypo"} />
              <FlowchartNode type="score" score={2} isHighlighted={isVasc && vascMorphology === "calc_hypo"} isActive={isVasc && vascMorphology === "calc_hypo" && finalScore === 2} />
            </div>
          </div>
        </div>

        {/* Intraarticular */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Intra-articular" isHighlighted={isIA} className="max-w-[110px]" />
          <FlowchartConnector isHighlighted={isIA} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Calcified / hypo T2" isHighlighted={isIA && iaSignal === "calcified_hypo"} className="max-w-[80px] text-[10px]" />
              <FlowchartConnector isHighlighted={isIA && iaSignal === "calcified_hypo"} />
              <FlowchartNode type="score" score={2} isHighlighted={isIA && iaSignal === "calcified_hypo"} isActive={isIA && iaSignal === "calcified_hypo" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Not calcified, hyper T2" isHighlighted={isIA && iaSignal === "not_calcified_hyper"} className="max-w-[80px] text-[10px]" />
              <FlowchartConnector isHighlighted={isIA && iaSignal === "not_calcified_hyper"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Peripheral" isHighlighted={isIA && iaEnhancement === "peripheral"} className="max-w-[65px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isIA && iaEnhancement === "peripheral"} />
                  <FlowchartNode type="score" score={3} isHighlighted={isIA && iaEnhancement === "peripheral"} isActive={isIA && iaEnhancement === "peripheral" && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="No periph." isHighlighted={isIA && iaEnhancement === "no_peripheral"} className="max-w-[65px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isIA && iaEnhancement === "no_peripheral"} />
                  <FlowchartNode type="score" score={4} isHighlighted={isIA && iaEnhancement === "no_peripheral"} isActive={isIA && iaEnhancement === "no_peripheral" && finalScore === 4} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intraneural */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Intra-neural or nerve related" isHighlighted={isNerve} className="max-w-[110px]" />
          <FlowchartConnector isHighlighted={isNerve} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Target sign" isHighlighted={isNerve && targetSign === "yes"} className="max-w-[70px] text-[10px]" />
              <FlowchartConnector isHighlighted={isNerve && targetSign === "yes"} />
              <FlowchartNode type="score" score={2} isHighlighted={isNerve && targetSign === "yes"} isActive={isNerve && targetSign === "yes" && finalScore === 2} />
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="No target sign" isHighlighted={isNerve && targetSign === "no"} className="max-w-[80px] text-[10px]" />
              <FlowchartConnector isHighlighted={isNerve && targetSign === "no"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="ADC >1.1" isHighlighted={isNerve && nerveADC === "high"} className="max-w-[60px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isNerve && nerveADC === "high"} />
                  <FlowchartNode type="score" score={3} isHighlighted={isNerve && nerveADC === "high"} isActive={isNerve && nerveADC === "high" && finalScore === 3} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="ADC ≤1.1" isHighlighted={isNerve && nerveADC === "low"} className="max-w-[60px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isNerve && nerveADC === "low"} />
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col items-center gap-0">
                      <FlowchartNode label="Periph." isHighlighted={isNerve && nerveT2Enhancement === "hyperintense_peripheral"} className="max-w-[50px] text-[9px]" />
                      <FlowchartConnector isHighlighted={isNerve && nerveT2Enhancement === "hyperintense_peripheral"} />
                      <FlowchartNode type="score" score={4} isHighlighted={isNerve && nerveT2Enhancement === "hyperintense_peripheral"} isActive={isNerve && nerveT2Enhancement === "hyperintense_peripheral" && finalScore === 4} />
                    </div>
                    <div className="flex flex-col items-center gap-0">
                      <FlowchartNode label="No periph." isHighlighted={isNerve && nerveT2Enhancement === "hypointense_no_peripheral"} className="max-w-[50px] text-[9px]" />
                      <FlowchartConnector isHighlighted={isNerve && nerveT2Enhancement === "hypointense_no_peripheral"} />
                      <FlowchartNode type="score" score={5} isHighlighted={isNerve && nerveT2Enhancement === "hypointense_no_peripheral"} isActive={isNerve && nerveT2Enhancement === "hypointense_no_peripheral" && finalScore === 5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cutaneous */}
        <div className="flex flex-col items-center gap-0">
          <FlowchartNode label="Cutaneous or subcutaneous" isHighlighted={isCut} className="max-w-[110px]" />
          <FlowchartConnector isHighlighted={isCut} />
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Exophytic" isHighlighted={isCut && growthPattern === "exophytic"} className="max-w-[70px] text-[10px]" />
              <FlowchartConnector isHighlighted={isCut && growthPattern === "exophytic"} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Peripheral enh." isHighlighted={isCut && cutEnhancement === "peripheral"} className="max-w-[65px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isCut && cutEnhancement === "peripheral"} />
                  <FlowchartNode type="score" score={2} isHighlighted={isCut && cutEnhancement === "peripheral"} isActive={isCut && cutEnhancement === "peripheral" && finalScore === 2} />
                </div>
                <div className="flex flex-col items-center gap-0">
                  <FlowchartNode label="Internal enh." isHighlighted={isCut && cutEnhancement === "internal"} className="max-w-[65px] text-[9px]" />
                  <FlowchartConnector isHighlighted={isCut && cutEnhancement === "internal"} />
                  <FlowchartNode type="score" score={4} isHighlighted={isCut && cutEnhancement === "internal"} isActive={isCut && cutEnhancement === "internal" && finalScore === 4} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0">
              <FlowchartNode label="Endophytic" isHighlighted={isCut && growthPattern === "endophytic"} className="max-w-[70px] text-[10px]" />
              <FlowchartConnector isHighlighted={isCut && growthPattern === "endophytic"} />
              <FlowchartNode type="score" score={5} isHighlighted={isCut && growthPattern === "endophytic"} isActive={isCut && growthPattern === "endophytic" && finalScore === 5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}