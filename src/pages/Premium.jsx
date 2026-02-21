import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Zap, Star, CreditCard, Shield, Users, Clock, Loader2, Building2 } from "lucide-react";
import { createCheckoutSession } from "@/functions/createCheckoutSession";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";


export default function PremiumPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleStripeCheckout = async () => {
        setIsRedirecting(true);
        try {
            const { data, error } = await createCheckoutSession();
            if (error) {
                console.error("Failed to create checkout session:", error);
                // You could show an error message to the user here
            } else if (data && data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Error redirecting to Stripe:", err);
        } finally {
            setIsRedirecting(false);
        }
    };

    const isPremium = user?.subscription_tier === "premium" || user?.subscription_tier === "institutional";
    const analysesUsed = user?.analyses_used || 0;
    const remainingFree = Math.max(0, 5 - analysesUsed);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Login Required</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to upgrade to Premium</p>
                        <Button 
                            onClick={() => User.login()}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3"
                        >
                            Log In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isPremium) {
        return (
            <div className="min-h-screen space-y-8">
                <div className="text-center">
                    <Crown className="w-20 h-20 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">You're Premium!</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">Enjoy unlimited ST-RADS analyses</p>
                </div>

                <Card className="shadow-2xl border-0 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/30">
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-amber-500" />
                                    Premium Benefits
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <Check className="w-5 h-5 text-green-600" />
                                        Unlimited ST-RADS analyses
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <Check className="w-5 h-5 text-green-600" />
                                        Enhanced AI reports with detailed insights
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <Check className="w-5 h-5 text-green-600" />
                                        Complete analysis history
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <Check className="w-5 h-5 text-green-600" />
                                        Priority customer support
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center flex flex-col justify-center">
                                <Badge className="bg-amber-500 text-white text-lg px-4 py-2 mb-4 mx-auto">
                                    Active Subscription
                                </Badge>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Thank you for supporting ST-RADS Calculator!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <Crown className="w-20 h-20 text-amber-500 mx-auto" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">Upgrade to Premium</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Unlock unlimited ST-RADS analyses, enhanced reporting, and priority support to accelerate your research.</p>
                {remainingFree > 0 && (
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800">
                        Free Trial: {remainingFree} analyses remaining
                    </Badge>
                )}
            </div>

            {/* Comparison Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Trial Card */}
                    <Card className="glass-panel border-0 shadow-xl">
                        <CardHeader className="text-center p-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Zap className="w-6 h-6 text-blue-500" />
                            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Free Trial</CardTitle>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            $0<span className="text-lg font-normal text-slate-600 dark:text-slate-400">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <span><strong>5 ST-RADS analyses</strong> total for evaluation</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                Standard AI-generated reports
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                Community forum support
                            </li>
                        </ul>
                        <Button disabled className="w-full py-3 text-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed rounded-full">
                            Your Current Plan
                        </Button>
                    </CardContent>
                </Card>

                {/* Premium Card */}
                <Card className="glass-panel border-amber-400/50 dark:border-amber-500/50 bg-gradient-to-br from-white/80 to-amber-50/80 dark:from-gray-900/80 dark:to-amber-950/50 relative overflow-hidden ring-1 ring-amber-400/30 dark:ring-amber-500/30">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300"></div>
                    <div className="absolute top-4 -right-12">
                        <Badge className="bg-amber-500 text-white font-bold transform rotate-45 px-8 py-1 shadow-lg">POPULAR</Badge>
                    </div>
                    <CardHeader className="text-center p-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Star className="w-6 h-6 text-amber-500" />
                            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Premium</CardTitle>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            $9.99<span className="text-lg font-normal text-slate-600 dark:text-slate-400">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <span><strong>Unlimited</strong> ST-RADS analyses</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                Enhanced AI reports with detailed insights
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                Complete analysis history &amp; tracking
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                Priority customer support
                            </li>
                        </ul>
                        <Button 
                            onClick={handleStripeCheckout}
                            disabled={isRedirecting}
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 rounded-full"
                        >
                            {isRedirecting ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Redirecting...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-3 h-6 w-6" />
                                    Upgrade Now
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Institutional Plan CTA */}
            <div className="max-w-4xl mx-auto text-center">
                <Card className="glass-panel border-0 shadow-lg bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <CardContent className="p-8 space-y-4">
                        <Building2 className="w-10 h-10 text-blue-500 mx-auto" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Need a plan for your institution?</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                            Get unlimited analyses for your entire radiology department, hospital group, or academic program — just $1,000/year.
                        </p>
                        <Link to={createPageUrl("InstitutionalPlan")}>
                            <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 mt-2">
                                <Building2 className="mr-2 h-5 w-5" />
                                Institutional Plan — $1,000/year
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}