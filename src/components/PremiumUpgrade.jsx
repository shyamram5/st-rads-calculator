import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PremiumUpgrade({ analysesUsed, onUpgrade }) {
    const remainingFree = 5 - analysesUsed;

    return (
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/30 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-6">
                <div className="flex items-center justify-center gap-4">
                    <Crown className="w-8 h-8" />
                    <CardTitle className="text-3xl font-bold">Upgrade to Premium</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                        Free Trial: {remainingFree} analyses remaining
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Free Trial
                        </h3>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                5 ST-RADS analyses
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Basic AI reports
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Educational use only
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Premium
                        </h3>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Unlimited analyses
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Enhanced AI reports
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Analysis history
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Priority support
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                        $9.99<span className="text-lg font-normal text-slate-600 dark:text-slate-400">/month</span>
                    </div>
                    <Link to={createPageUrl("Premium")}>
                        <Button 
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Crown className="mr-3 h-6 w-6" />
                            View Premium Plans
                        </Button>
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Cancel anytime • 30-day money-back guarantee
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}