import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { base44 } from "@/api/base44Client";
import { sendInquiryNotification } from "@/functions/sendInquiryNotification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Check, Users, Shield, Loader2, Plus, X, Mail, Send, Globe, Phone, MessageSquare, Stethoscope, ChevronRight } from "lucide-react";
import { manageInstitution } from "@/functions/manageInstitution";

const TIERS = [
  {
    id: "academic",
    name: "Academic / Small Practice",
    size: "1–10 radiologists",
    features: [
      "All 4 RADS systems (ST-RADS, TI-RADS, LI-RADS, BI-RADS)",
      "Unlimited users at your institution",
      "Email support",
      "Updates included",
    ],
    icon: Stethoscope,
    gradient: "from-blue-500 to-cyan-500",
    border: "border-blue-200 dark:border-blue-800",
    bg: "from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30",
  },
  {
    id: "department",
    name: "Medium Department",
    size: "11–25 radiologists",
    features: [
      "All 4 RADS systems",
      "Unlimited users",
      "Priority email support",
      "Analytics dashboard",
      "Quarterly updates",
    ],
    icon: Users,
    gradient: "from-indigo-500 to-purple-500",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Large / Enterprise",
    size: "25+ radiologists",
    features: [
      "All 4 RADS systems",
      "Multi-site access",
      "Dedicated support",
      "Custom features on request",
      "API access",
      "Monthly updates",
    ],
    icon: Globe,
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-200 dark:border-amber-800",
    bg: "from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30",
  },
];

export default function InstitutionalPlanPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [institution, setInstitution] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRemovingEmail, setIsRemovingEmail] = useState(null);

  // Inquiry form state
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({
    institution_name: "", contact_name: "", contact_email: "",
    contact_phone: "", department: "", num_radiologists: "",
    num_sites: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser?.email) {
          setFormData(prev => ({
            ...prev,
            contact_email: currentUser.email,
            contact_name: currentUser.full_name || "",
          }));
        }
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

  const handleSubmitInquiry = async () => {
    if (!formData.institution_name.trim() || !formData.contact_name.trim() || !formData.contact_email.trim() || !selectedTier) return;
    setIsSubmitting(true);
    try {
      const inquiryData = {
        institution_name: formData.institution_name.trim(),
        contact_name: formData.contact_name.trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim(),
        department: formData.department.trim(),
        tier_interest: selectedTier,
        num_radiologists: formData.num_radiologists ? parseInt(formData.num_radiologists) : undefined,
        num_sites: formData.num_sites ? parseInt(formData.num_sites) : undefined,
        message: formData.message.trim(),
        status: "new",
      };
      await base44.entities.InstitutionInquiry.create(inquiryData);
      // Send email notification
      sendInquiryNotification({ inquiry: inquiryData }).catch(console.error);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting inquiry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Active institution management panel ──
  if (institution && institution.status === "active") {
    const tierInfo = TIERS.find(t => t.id === institution.tier) || TIERS[0];
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{institution.name}</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge className={`bg-gradient-to-r ${tierInfo.gradient} text-white`}>{tierInfo.name}</Badge>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">Active</Badge>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/30 p-6">
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Members ({(institution.member_emails || []).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Add members by email. They'll get unlimited access when they sign up or log in.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="member@institution.edu" value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddMember()} />
              <Button onClick={handleAddMember} disabled={isAddingMember || !newMemberEmail.trim()} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shrink-0">
                {isAddingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
              </Button>
            </div>
            <div className="space-y-2 mt-4">
              {(institution.member_emails || []).map((email) => (
                <div key={email} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{email}</span>
                    {email === institution.admin_email && <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs">Admin</Badge>}
                  </div>
                  {email !== institution.admin_email && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(email)} disabled={isRemovingEmail === email}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
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

  // ── Submitted confirmation ──
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Inquiry Submitted!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Thank you for your interest. Our team will review your inquiry and reach out within 1–2 business days to discuss the best plan for your institution.
        </p>
        <Button onClick={() => { setSubmitted(false); setSelectedTier(null); }} variant="outline" className="rounded-full">
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  // ── Tier selection + inquiry form ──
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-3">
        <Building2 className="w-16 h-16 text-blue-500 mx-auto" />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Institutional Plans</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          All 4 RADS systems for your department, program, or enterprise. Contact us for a plan tailored to your needs.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {TIERS.map(tier => {
          const TierIcon = tier.icon;
          const isSelected = selectedTier === tier.id;
          return (
            <Card key={tier.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                isSelected ? `${tier.border} ring-2 ring-offset-2 ring-blue-500 shadow-xl scale-[1.02]` : `${tier.border} hover:shadow-lg hover:scale-[1.01]`
              } bg-gradient-to-br ${tier.bg}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-indigo-500 text-white text-[10px]">POPULAR</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center`}>
                    <TierIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-slate-100">{tier.name}</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tier.size}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <ul className="space-y-2">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={isSelected ? "default" : "outline"} className={`w-full rounded-full text-sm ${isSelected ? `bg-gradient-to-r ${tier.gradient} text-white border-0` : ""}`}>
                  {isSelected ? "Selected" : "Select"} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inquiry Form */}
      {selectedTier && (
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900 max-w-2xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Request Information — {TIERS.find(t => t.id === selectedTier)?.name}
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fill out the form below and our team will reach out to discuss pricing and setup.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Institution Name *</label>
                <Input placeholder="e.g., Mayo Clinic" value={formData.institution_name} onChange={(e) => updateField("institution_name", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Department / Program</label>
                <Input placeholder="e.g., Radiology" value={formData.department} onChange={(e) => updateField("department", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Contact Name *</label>
                <Input placeholder="Your full name" value={formData.contact_name} onChange={(e) => updateField("contact_name", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Contact Email *</label>
                <Input type="email" placeholder="you@institution.edu" value={formData.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Phone</label>
                <Input placeholder="(555) 123-4567" value={formData.contact_phone} onChange={(e) => updateField("contact_phone", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"># of Radiologists</label>
                <Input type="number" placeholder="e.g., 15" min="1" value={formData.num_radiologists} onChange={(e) => updateField("num_radiologists", e.target.value)} />
              </div>
              {selectedTier === "enterprise" && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"># of Sites</label>
                  <Input type="number" placeholder="e.g., 3" min="1" value={formData.num_sites} onChange={(e) => updateField("num_sites", e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Message (optional)</label>
              <textarea
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your specific needs, any custom requirements, or questions..."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmitInquiry}
              disabled={isSubmitting || !formData.institution_name.trim() || !formData.contact_name.trim() || !formData.contact_email.trim()}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 text-base shadow-lg rounded-full disabled:opacity-60"
            >
              {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-5 w-5" /> Submit Inquiry</>}
            </Button>
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" /> We'll respond within 1–2 business days
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}