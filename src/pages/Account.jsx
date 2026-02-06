import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Crown, 
    Calendar, 
    CreditCard, 
    AlertTriangle, 
    CheckCircle, 
    User as UserIcon,
    Mail,
    Loader2
} from "lucide-react";
import { cancelSubscription } from "@/functions/cancelSubscription";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom'; // Added Link import
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSavingName, setIsSavingName] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                setNewName(currentUser.full_name || "");
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSaveName = async () => {
        if (!newName.trim() || newName.trim() === user.full_name) {
            setIsEditingName(false);
            setNewName(user.full_name);
            return;
        }

        // Optimistic update: show the new name immediately
        const previousName = user.full_name;
        setUser(prev => ({ ...prev, full_name: newName.trim() }));
        setIsEditingName(false);
        
        try {
            await User.updateMyUserData({ full_name: newName.trim() });
        } catch (error) {
            console.error("Failed to update name:", error);
            // Revert optimistic update
            setUser(prev => ({ ...prev, full_name: previousName }));
            setNewName(previousName);
            alert("Failed to update name. Please try again.");
        }
    };

    const handleCancelSubscription = async () => {
        setIsCancelling(true);
        try {
            const { data, error } = await cancelSubscription();
            if (error) {
                console.error("Failed to cancel subscription:", error);
                alert("Failed to cancel subscription. Please try again or contact support.");
            } else {
                setCancelSuccess(true);
                setShowConfirmation(false);
                // Refresh user data
                const updatedUser = await User.me();
                setUser(updatedUser);
            }
        } catch (err) {
            console.error("Error cancelling subscription:", err);
            alert("An error occurred while cancelling your subscription.");
        } finally {
            setIsCancelling(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const { data } = await base44.functions.invoke("deleteAccount", {});
            if (data.success) {
                await User.logout();
                window.location.href = "/";
            } else {
                 alert("Failed to delete account. Please try again.");
            }
        } catch (err) {
            console.error("Failed to delete account", err);
            alert("An error occurred while deleting your account.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading account...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <UserIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Login Required</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to manage your account</p>
                        <div className="space-y-3">
                            <Button 
                                onClick={() => User.login()}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3"
                            >
                                Log In
                            </Button>
                            {/* Assuming '/about' is the correct path for "About the Creator" */}
                            <Link to={"/about"}> 
                                <Button variant="outline" className="w-full">
                                    About the Creator
                                </Button>
                            </Link>
                        </div>
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
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Account Management</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">Manage your subscription and account settings</p>
            </div>

            {cancelSuccess && (
                <Alert className="border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        Your subscription has been successfully cancelled. You'll retain Premium access until the end of your current billing period.
                    </AlertDescription>
                </Alert>
            )}

            {/* Account Information */}
            <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
                    <CardTitle className="text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        Account Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Full Name</p>
                                    {!isEditingName ? (
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</p>
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)} className="min-h-[44px]">
                                                  Edit
                                              </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="min-h-[44px]"
                                            />
                                            <Button size="sm" onClick={handleSaveName} className="min-h-[44px]">
                                                Save
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => { setIsEditingName(false); setNewName(user.full_name); }} 
                                                className="min-h-[44px]"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Subscription</p>
                                    <div className="flex items-center gap-2">
                                        <Badge className={isPremium ? "bg-amber-500 text-white" : "bg-slate-500 text-white"}>
                                            {isPremium ? "Premium" : "Free"}
                                        </Badge>
                                        {isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {isPremium ? "Subscription Date" : "Analyses Used"}
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {isPremium ? subscriptionDate : `${analysesUsed} of 5`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Subscription Management */}
            {isPremium && (
                <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
                        <CardTitle className="text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Crown className="w-6 h-6 text-amber-500" />
                            Premium Subscription
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Current Plan: Premium</h3>
                                      <p className="text-amber-700 dark:text-amber-300">$30/year • Unlimited ST-RADS analyses</p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Your Premium Benefits:</h4>
                                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Unlimited ST-RADS analyses
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Enhanced AI reports with detailed insights
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Complete analysis history
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Priority customer support
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Cancel Subscription</h4>
                                <Alert className="border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-800 mb-4">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        Cancelling will end your Premium benefits at the end of your current billing period. You'll revert to the free tier with 5 analyses total.
                                    </AlertDescription>
                                </Alert>
                                
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
                                            Are you sure you want to cancel your Premium subscription?
                                        </p>
                                        <div className="flex gap-3">
                                            <Button 
                                                variant="destructive" 
                                                onClick={handleCancelSubscription}
                                                disabled={isCancelling}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                {isCancelling ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    "Yes, Cancel Subscription"
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
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Account Section */}
            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-700/70 dark:text-red-300/70">Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-red-900 dark:text-red-100">Delete Account</p>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account,
                                        subscription, and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                        Delete Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}