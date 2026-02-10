import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Crown, Calendar, CreditCard, AlertTriangle, CheckCircle,
    Loader2, Receipt, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BillingPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);
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

    const handleCancelSubscription = async () => {
        setIsCancelling(true);
        try {
            const response = await fetch("/api/functions/cancelSubscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            if (!response.ok || result.error) {
                alert("Failed to cancel subscription. Please try again or contact support.");
            } else {
                setCancelSuccess(true);
                setShowConfirmation(false);
                const updatedUser = await User.me();
                setUser(updatedUser);
            }
        } catch (err) {
            alert("An error occurred while cancelling your subscription.");
        } finally {
            setIsCancelling(false);
        }
    };

    const handleUpgrade = async () => {
        setIsRedirecting(true);
        try {
            const { data, error } = await createCheckoutSession();
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Error redirecting to Stripe:", err);
        } finally {
            setIsRedirecting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading billing info...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Login Required</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to view billing information</p>
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

    const isPremium = user.subscription_tier === "premium";
    const subscriptionDate = user.subscription_date ? new Date(user.subscription_date).toLocaleDateString() : "N/A";
    const analysesUsed = user.analyses_used || 0;

    return (
        <div className="min-h-screen space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Billing</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">Manage your subscription and billing</p>
            </div>

            {cancelSuccess && (
                <Alert className="border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        Your subscription has been cancelled. You'll retain Premium access until the end of your current billing period.
                    </AlertDescription>
                </Alert>
            )}

            {/* Current Plan */}
            <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
                    <CardTitle className="text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Receipt className="w-6 h-6" />
                        Current Plan
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Badge className={isPremium ? "bg-amber-500 text-white text-sm px-3 py-1" : "bg-slate-500 text-white text-sm px-3 py-1"}>
                                    {isPremium ? "Premium" : "Free"}
                                </Badge>
                                {isPremium && <Crown className="w-5 h-5 text-amber-500" />}
                            </div>
                            {isPremium ? (
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$9.99 <span className="text-base font-normal text-slate-500">/month</span></p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        Subscribed since {subscriptionDate}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$0 <span className="text-base font-normal text-slate-500">/month</span></p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{analysesUsed} of 5 free analyses used</p>
                                </div>
                            )}
                        </div>

                        {!isPremium && (
                            <Button
                                onClick={handleUpgrade}
                                disabled={isRedirecting}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg"
                            >
                                {isRedirecting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting...</>
                                ) : (
                                    <><Crown className="mr-2 h-4 w-4" /> Upgrade to Premium — $9.99/mo</>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Premium Benefits */}
            {isPremium && (
                <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
                        <CardTitle className="text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Crown className="w-6 h-6 text-amber-500" />
                            Your Premium Benefits
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                Unlimited ST-RADS analyses
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                Enhanced AI reports with detailed insights
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                Complete analysis history
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                Priority customer support
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Cancel Subscription */}
            {isPremium && (
                <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Cancel Subscription
                        </CardTitle>
                        <CardDescription className="text-red-700/70 dark:text-red-300/70">
                            Cancelling will end your Premium benefits at the end of your current billing period.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!showConfirmation ? (
                            <Button
                                variant="destructive"
                                onClick={() => setShowConfirmation(true)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Cancel Subscription
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-slate-700 dark:text-slate-300 font-medium">
                                    Are you sure? You'll lose access to Premium features after your current billing period ends.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="destructive"
                                        onClick={handleCancelSubscription}
                                        disabled={isCancelling}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isCancelling ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancelling...</>
                                        ) : (
                                            "Yes, Cancel"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowConfirmation(false)}
                                        disabled={isCancelling}
                                    >
                                        Keep Premium
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Link to Account */}
            <div className="text-center">
                <Link to={createPageUrl("Account")}>
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        Go to Account Settings <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}