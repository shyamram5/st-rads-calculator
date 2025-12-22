import React from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Microscope, FileText, CheckCircle, Info, Stethoscope } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function StructuredReport({ analysis }) {
    const getScoreInfo = (score) => {
        const info = {
            0: { label: "Incomplete", color: "gray", risk: "N/A" },
            1: { label: "Negative", color: "green", risk: "None" },
            2: { label: "Benign", color: "green", risk: "Extremely Low" },
            3: { label: "Probably Benign", color: "yellow", risk: "Low" },
            4: { label: "Suspicious", color: "orange", risk: "Intermediate" },
            5: { label: "Highly Suggestive", color: "red", risk: "High" },
        };
        return info[score] || { label: "Unknown", color: "gray", risk: "Unknown" };
    };

    const { label, color, risk } = getScoreInfo(analysis.strads_score);

    const scoreRingColor = {
        gray: "ring-gray-400 dark:ring-gray-600",
        green: "ring-green-400 dark:ring-green-500",
        yellow: "ring-yellow-400 dark:ring-yellow-500",
        orange: "ring-orange-500 dark:ring-orange-500",
        red: "ring-red-500 dark:ring-red-600",
    }[color];
    
    const scoreTextColor = {
        gray: "text-gray-700 dark:text-gray-300",
        green: "text-green-700 dark:text-green-300",
        yellow: "text-yellow-700 dark:text-yellow-300",
        orange: "text-orange-700 dark:text-orange-300",
        red: "text-red-700 dark:text-red-300",
    }[color];
    
    const scoreBgColor = {
        gray: "bg-gray-100 dark:bg-gray-900",
        green: "bg-green-100 dark:bg-green-950/50",
        yellow: "bg-yellow-100 dark:bg-yellow-950/50",
        orange: "bg-orange-100 dark:bg-orange-950/50",
        red: "bg-red-100 dark:bg-red-950/50",
    }[color];

    const getImpressionText = () => {
        return `ST-RADS ${analysis.strads_score} - ${label}`;
    };

    // Display subtype in the circle if it's ST-RADS 6 - REMOVED
    const displayScore = analysis.strads_score;

    return (
        <Card className="glass-panel h-full flex flex-col shadow-xl border-0">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-gray-800/30">
                <CardTitle className="text-slate-900 dark:text-slate-100 text-center text-xl">AI-Assisted Radiology Report</CardTitle>
                <CardDescription className="text-center text-slate-500 dark:text-slate-400">ST-RADS v2025 Educational Analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-grow">
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                        <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ring-8 ${scoreRingColor} ${scoreBgColor} shadow-inner`}>
                            <span className={`font-bold text-6xl ${scoreTextColor}`}>{displayScore}</span>
                        </div>
                        <h2 className={`mt-4 text-2xl font-bold ${scoreTextColor}`}>{label}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Risk of Malignancy: <strong>{risk}</strong></p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <ReportSection icon={<Info />} title="Impression">
                            <p className={`font-semibold text-base text-slate-900 dark:text-slate-100`}>{getImpressionText()}</p>
                        </ReportSection>
                        <ReportSection icon={<CheckCircle />} title="Management Recommendation">
                           <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-800/60">
                             <p className="font-medium text-blue-900 dark:text-blue-200">{analysis.recommendation}</p>
                           </div>
                        </ReportSection>
                    </div>
                </div>

                {/* Conditional rendering for ST-RADS 6 removed */}
                <> 
                    <Separator className="bg-slate-200 dark:bg-slate-800" />
                    
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <ReportSectionHeader icon={<FileText />} title="Findings & Explanation" />
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pl-7 text-sm text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                                <ReactMarkdown
                                    className="prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                    components={{
                                        ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                                        li: ({ children }) => <li className="my-0">{children}</li>,
                                    }}
                                >
                                    {analysis.explanation}
                                </ReactMarkdown>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>


                    {analysis.differential_diagnosis && (
                        <ReportSection icon={<Stethoscope />} title="Most Likely Differential Diagnosis">
                           <p className="font-semibold text-base text-slate-900 dark:text-slate-100">{analysis.differential_diagnosis}</p>
                        </ReportSection>
                    )}
                </>

                <Separator className="bg-slate-200 dark:bg-slate-800" />

                <div className={`bg-red-50 dark:bg-red-950/40 p-4 rounded-lg border-l-4 border-red-500 dark:border-red-600`}>
                    <div className="flex items-center space-x-3">
                         <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                         <h3 className="font-bold text-red-800 dark:text-red-200 text-base">Critical Limitations & Disclaimer</h3>
                    </div>
                    <div className="text-red-700 dark:text-red-300 text-sm mt-2 pl-9 space-y-1">
                        <p>{analysis.limitations}</p>
                        <p><strong>This analysis is for educational purposes only and is not a medical diagnosis.</strong> Proper ST-RADS evaluation requires cross-sectional imaging (MRI/CT).</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ReportSectionHeader({ icon, title }) {
    return (
        <div className="flex items-center space-x-2">
            {React.cloneElement(icon, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })}
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm">{title}</h3>
        </div>
    );
}

function ReportSection({ icon, title, children }) {
    return (
        <div>
            <ReportSectionHeader icon={icon} title={title} />
            <div className="pl-7 pt-2 text-sm text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                {children}
            </div>
        </div>
    );
}