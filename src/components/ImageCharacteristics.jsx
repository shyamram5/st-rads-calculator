import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileSearch, Layers, Microscope, Activity } from "lucide-react";

export default function ImageCharacteristics({ selectedCharacteristics, onCharacteristicsChange }) {

    const diagnosticFlowchart = {
        "FIGURE 1: INITIAL ASSESSMENT": {
            id: "initial",
            description: "Start here - determine if a lesion is present and if imaging is adequate.",
            items: [
                "Lesion present - incomplete imaging (ST-RADS 0)",
                "No lesion identified (ST-RADS 1)",
                "Lesion present - adequate imaging"
            ]
        },
        "PRIMARY LESION COMPOSITION": {
            id: "primary",
            parent: "Lesion present - adequate imaging",
            description: "If lesion present with adequate imaging - determine predominant composition.",
            items: [
                "Lipomatous (Fat-like signal intensity)",
                "Cyst-like / High water content",
                "Indeterminate solid lesion"
            ]
        },
        "LIPOMATOUS LESIONS (Figure 2A)": {
            id: "lipomatous",
            parent: "Lipomatous (Fat-like signal intensity)",
            subcategories: {
                "Fat Composition": [
                    "Predominantly lipomatous (>90% fat signal)",
                    "Not predominantly lipomatous (≤90% fat signal)"
                ],
                "Septation Assessment": [
                    "Thin or no septations",
                    "Thick septations (≥2mm)",
                    "Nodular septations"
                ],
                "Enhancement": [
                    "No or minimal enhancement (<10%)",
                    "Moderate enhancement (>10%)",
                    "Nodular enhancement"
                ],
                "Additional Features": [
                    "Prominent vessels (Angiolipoma pattern)",
                    "Mixed fat/non-fat components",
                    "Myxoid areas present"
                ]
            }
        },
        "CYST-LIKE LESIONS (Figure 2B)": {
            id: "cyst-like",
            parent: "Cyst-like / High water content",
            subcategories: {
                "Communication Pattern": [
                    "Communicates with joint space (ganglion cyst)",
                    "Communicates with tendon sheath",
                    "Communicates with bursa",
                    "No apparent communication (epidermoid cyst)"
                ],
                "Internal Architecture": [
                    "Simple fluid signal (T2 hyperintense, T1 hypointense)",
                    "Complex fluid with internal debris",
                    "Fluid-fluid levels present",
                    "Flow voids suggesting vascular malformation",
                    "Phleboliths visible (pathognomonic for venous malformation)"
                ],
                "Wall and Septation Features": [
                    "Thin wall (<2mm, no enhancement)",
                    "Thick wall (≥2mm)",
                    "Thin enhancing septations",
                    "Thick enhancing septations (>2mm)",
                    "Enhancing mural nodule(s) ≥1cm",
                    "No septations or nodules"
                ],
                "Vascular Malformation Signs": [
                    "Intense contrast enhancement throughout",
                    "Serpentine flow voids on T2W",
                    "Phleboliths (round T2 hypointense foci)",
                    "Adjacent feeding vessels visible"
                ]
            }
        },
        "INDETERMINATE SOLID LESIONS (Figure 2C)": {
            id: "solid",
            parent: "Indeterminate solid lesion",
            subcategories: {
                "Location Assessment": [
                    "Superficial (above deep fascia)",
                    "Deep (subfascial or intramuscular)",
                    "Plantar fascia location",
                    "Palmar fascia location",
                    "Intra-articular or juxta-articular",
                    "Along nerve pathway"
                ],
                "Nerve-Related Features": [
                    "Target sign present (concentric rings on T2W)",
                    "Fascicular sign present (internal fascicular pattern)",
                    "Tail sign present (entering/exiting nerve)",
                    "No nerve-related signs"
                ],
                "T2 Signal Characteristics": [
                    "T2 hyperintense (bright on T2W)",
                    "T2 hypointense (dark on T2W - fibrous)",
                    "T2 isointense to muscle",
                    "T2 heterogeneous/mixed signal",
                    "Target appearance on T2W"
                ],
                "Enhancement Pattern": [
                    "No enhancement",
                    "Homogeneous enhancement",
                    "Heterogeneous enhancement",
                    "Peripheral rim enhancement",
                    "Central enhancement only"
                ],
                "Specific Imaging Signs": [
                    "Hemosiderin staining ('blooming' on GRE sequences)",
                    "Calcifications or ossifications present",
                    "Flow voids suggesting vascularity",
                    "Cystic or necrotic components",
                    "Lobulated or multinodular morphology"
                ],
                "Size and Extent": [
                    "Size <3cm",
                    "Size 3-5cm",
                    "Size >5cm",
                    "Confined to single compartment",
                    "Crosses fascial planes or compartments",
                    "Bone involvement (erosion/scalloping)"
                ],
                "Associated Features": [
                    "Perilesional edema present",
                    "No perilesional edema",
                    "Associated joint effusion",
                    "Muscle denervation changes",
                    "Feeding vessels visible"
                ],
                "Morphology": [
                    "Well-circumscribed margins",
                    "Ill-defined or infiltrative margins",
                    "Lobulated contour",
                    "Smooth contour",
                    "Dumbbell shape (nerve-related)"
                ]
            }
        },
        "ANCILLARY FEATURES FOR ST-RADS 5": {
            id: "ancillary",
            description: "High-risk features that may upgrade a lesion to ST-RADS 5, suggesting malignancy.",
            subcategories: {
                "Tissue Characteristics": [
                    "Non-enhancing areas of necrosis",
                    "Hemorrhage within lesion",
                    "Peritumoral edema present"
                ],
                "Metabolic & Functional Features": [
                    "Low ADC <1.1mm²/s (restricted diffusion)",
                    "Rapid increase in size documented",
                    "New symptoms or regional/distant metastatic lesions"
                ]
            }
        }
    };
    
    const initialAssessmentItems = diagnosticFlowchart["FIGURE 1: INITIAL ASSESSMENT"].items;
    const primaryCompositionItems = diagnosticFlowchart["PRIMARY LESION COMPOSITION"].items;
    
    const selectedInitial = useMemo(() => 
        selectedCharacteristics.find(c => initialAssessmentItems.includes(c)),
        [selectedCharacteristics, initialAssessmentItems]
    );

    const selectedPrimary = useMemo(() => 
        selectedCharacteristics.find(c => primaryCompositionItems.includes(c)),
        [selectedCharacteristics, primaryCompositionItems]
    );

    const handleInitialChange = (value) => {
        // Clear all selections and set only the initial assessment
        onCharacteristicsChange([value]);
    };

    const handlePrimaryChange = (value) => {
        // Keep initial assessment, set primary, clear detailed selections
        const initialSelection = selectedCharacteristics.filter(c => initialAssessmentItems.includes(c));
        onCharacteristicsChange([...initialSelection, value]);
    };

    const handleDetailChange = (characteristic, checked) => {
        const updated = checked
            ? [...selectedCharacteristics, characteristic]
            : selectedCharacteristics.filter(c => c !== characteristic);
        onCharacteristicsChange(updated);
    };

    const renderSubcategories = (categoryKey) => {
        const category = diagnosticFlowchart[categoryKey];
        if (!category?.subcategories) return null;

        return (
            <div className="space-y-6 pl-2">
                {Object.entries(category.subcategories).map(([subcatName, items]) => (
                    <div key={subcatName} className="border-l-2 border-blue-200 dark:border-blue-700 pl-4">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">
                            {subcatName}
                        </h4>
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                    <Checkbox
                                        id={item}
                                        checked={selectedCharacteristics.includes(item)}
                                        onCheckedChange={(checked) => handleDetailChange(item, checked)}
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-cyan-500 dark:data-[state=checked]:border-cyan-500 w-4 h-4"
                                    />
                                    <Label htmlFor={item} className="text-slate-700 dark:text-slate-300 cursor-pointer text-sm flex-1">
                                        {item}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getSubFlowCategory = () => {
        if (!selectedPrimary) return null;
        return Object.keys(diagnosticFlowchart).find(key => diagnosticFlowchart[key].parent === selectedPrimary);
    };

    const isAdequateLesionPath = selectedInitial === "Lesion present - adequate imaging";

    return (
        <Card className="glass-panel shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
                <CardTitle>ST-RADS v2025 Diagnostic Flowchart</CardTitle>
                <CardDescription>Follow the diagnostic steps based on the official flowcharts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="step-1" className="w-full">
                    <AccordionItem value="step-1">
                        <AccordionTrigger className="text-lg font-semibold">
                            <div className="flex items-center gap-3">
                                <FileSearch className="w-6 h-6 text-blue-500 dark:text-cyan-400"/>
                                <span>Step 1: Initial Assessment</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {diagnosticFlowchart["FIGURE 1: INITIAL ASSESSMENT"].description}
                            </p>
                            <RadioGroup value={selectedInitial} onValueChange={handleInitialChange}>
                                {initialAssessmentItems.map(item => (
                                    <div key={item} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                        <RadioGroupItem value={item} id={item} />
                                        <Label htmlFor={item} className="font-medium text-base cursor-pointer">{item}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                    
                    {/* Steps 2-4: Only shown when "Lesion present - adequate imaging" is selected */}
                    {isAdequateLesionPath && (
                        <>
                            <AccordionItem value="step-2">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-blue-500 dark:text-cyan-400"/>
                                        <span>Step 2: Primary Composition</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        {diagnosticFlowchart["PRIMARY LESION COMPOSITION"].description}
                                    </p>
                                    <RadioGroup value={selectedPrimary} onValueChange={handlePrimaryChange}>
                                        {primaryCompositionItems.map(item => (
                                            <div key={item} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                                <RadioGroupItem value={item} id={item} />
                                                <Label htmlFor={item} className="font-medium text-base cursor-pointer">{item}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="step-3" disabled={!selectedPrimary}>
                                <AccordionTrigger className={`text-lg font-semibold ${!selectedPrimary ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                     <div className="flex items-center gap-3">
                                        <Microscope className="w-6 h-6 text-blue-500 dark:text-cyan-400"/>
                                        <span>Step 3: Detailed Features</span>
                                        {!selectedPrimary && <span className="text-sm text-slate-500 ml-2">(Complete Step 2 first)</span>}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 max-h-96 overflow-y-auto">
                                    {selectedPrimary ? (
                                        renderSubcategories(getSubFlowCategory())
                                    ) : (
                                        <p className="text-slate-400 dark:text-slate-500 italic">
                                            Complete Step 2 to access detailed feature selection.
                                        </p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="step-4" disabled={!selectedPrimary}>
                                <AccordionTrigger className={`text-lg font-semibold ${!selectedPrimary ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                     <div className="flex items-center gap-3">
                                        <Activity className="w-6 h-6 text-red-500 dark:text-red-400"/>
                                        <span>Step 4: Ancillary Features (ST-RADS 5)</span>
                                        {!selectedPrimary && <span className="text-sm text-slate-500 ml-2">(Complete Step 2 first)</span>}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    {selectedPrimary ? (
                                        <>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                {diagnosticFlowchart["ANCILLARY FEATURES FOR ST-RADS 5"].description}
                                            </p>
                                            {renderSubcategories("ANCILLARY FEATURES FOR ST-RADS 5")}
                                        </>
                                    ) : (
                                        <p className="text-slate-400 dark:text-slate-500 italic">
                                            Complete Step 2 to access ancillary features.
                                        </p>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </>
                    )}
                </Accordion>
            </CardContent>
        </Card>
    );
}