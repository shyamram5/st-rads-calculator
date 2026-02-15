import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Check, Users, Shield, CreditCard, Loader2, Plus, X, Mail } from "lucide-react";
import { createInstitutionCheckout } from "@/functions/createInstitutionCheckout";
import { manageInstitution } from "@/functions/manageInstitution";

export default function InstitutionalPlanPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [institution, setInstitution] = useState(null);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isRemovingEmail, setIsRemovingEmail] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                if (currentUser?.subscription_tier === "institutional") {
                    const { data } = await manageInstitution({ action: "get_institution" });
                    if (data?.institution) setInstitution(data.institution);
                }
            } catch (e) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckout = async () => {
        if (!institutionName.trim()) return;
        setIsRedirecting(true);
        try {
            const { data } = await createInstitutionCheckout({ institution_name: institutionName.trim() });
            if (data?.url) window.location.href = data.url;
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setIsRedirecting(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberEmail.trim()) return;
        setIsAddingMember(true);
        try {
            const { data } = await manageInstitution({ action: "add_member", email: newMemberEmail.trim() });
            if (data?.member_emails) {
                setInstitution(prev => ({ ...prev, member_emails: data.member_emails }));
                setNewMemberEmail("");
            }
        } catch (err) {
            console.error("Error adding member:", err);
        } finally {
            setIsAddingMember(false);
        }
    };

    const handleRemoveMember = async (email) => {
        setIsRemovingEmail(email);
        try {
            const { data } = await manageInstitution({ action: "remove_member", email });
            if (data?.member_emails) {
                setInstitution(prev => ({ ...prev, member_emails: data.member_emails }));
            }
        } catch (err) {
            console.error("Error removing member:", err);
        } finally {
            setIsRemovingEmail(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <Building2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Login Required</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to set up an institutional subscription</p>
                        <Button onClick={() => User.login()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
                            Log In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // If user is already an institutional admin, show management panel
    if (institution && institution.status === "active") {
        return (
            <div className="min-h-screen space-y-8">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{institution.name}</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Institutional Subscription — Active</p>
                </div>

                <Card className="shadow-xl border-0 bg-white dark:bg-slate-900 max-w-2xl mx-auto">
                    <CardHeader className="bg-blue-50 dark:bg-blue-950/30 p-6">
                        <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Members ({(institution.member_emails || []).length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Add members by email. They'll get unlimited analyses when they sign up or log in.
                        </p>

                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="member@institution.edu"
                                value={newMemberEmail}
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                            />
                            <Button onClick={handleAddMember} disabled={isAddingMember || !newMemberEmail.trim()} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shrink-0">
                                {isAddingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Add
                            </Button>
                        </div>

                        <div className="space-y-2 mt-4">
                            {(institution.member_emails || []).map((email) => (
                                <div key={email} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{email}</span>
                                        {email === institution.admin_email && (
                                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs">Admin</Badge>
                                        )}
                                    </div>
                                    {email !== institution.admin_email && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveMember(email)}
                                            disabled={isRemovingEmail === email}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                            {isRemovingEmail === email ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Purchase flow
    return (
        <div className="min-h-screen space-y-8">
            <div className="text-center space-y-4">
                <Building2 className="w-20 h-20 text-blue-500 mx-auto" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">Institutional Plan</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Unlimited ST-RADS analyses for your entire department or radiology group.
                </p>
            </div>

            <Card className="shadow-2xl border-blue-400/30 dark:border-blue-500/30 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/50 max-w-lg mx-auto relative overflow-hidden ring-1 ring-blue-400/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400"></div>
                <CardHeader className="text-center p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Building2 className="w-6 h-6 text-blue-500" />
                        <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Institutional</CardTitle>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                        $500<span className="text-lg font-normal text-slate-600 dark:text-slate-400">/year</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Unlimited members · Unlimited analyses</p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Unlimited analyses</strong> for all members</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Add <strong>unlimited members</strong> by email</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Admin dashboard to manage your team</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Enhanced AI reports with detailed insights</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Priority support for your institution</span>
                        </li>
                    </ul>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Institution Name</label>
                        <Input
                            placeholder="e.g., Mayo Clinic Radiology"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleCheckout}
                        disabled={isRedirecting || !institutionName.trim()}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 rounded-full"
                    >
                        {isRedirecting ? (
                            <>
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-3 h-6 w-6" />
                                Subscribe — $500/year
                            </>
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Shield className="w-3.5 h-3.5" />
                        Secure payment via Stripe · Cancel anytime
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}