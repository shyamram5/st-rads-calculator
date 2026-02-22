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
      "All 9 RADS systems (ST-RADS, TI-RADS, LI-RADS, BI-RADS, Lung-RADS, PI-RADS, O-RADS, MSKI-RADS, Bone-RADS)",
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
      "All 9 RADS systems",
      "Unlimited users",
      "Priority email support",
      "Analytics dashboard",
      "Quarterly updates",
    ],
    icon: Users,
    gradient: "from-indigo-500 to-purple-500",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30",

  },
  {
    id: "enterprise",
    name: "Large / Enterprise",
    size: "25+ radiologists",
    features: [
      "All 9 RADS systems",
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // ── Active institution management panel ──
  if (institution && institution.status === "active") {
    const tierInfo = TIERS.find(t => t.id === institution.tier) || TIERS[0];
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{institution.name}</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-gray-900 dark:bg-white text-white dark:text-black">{tierInfo.name}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">Active</Badge>
          </div>
        </div>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none">
          <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-900">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Members ({(institution.member_emails || []).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Add members by email. They'll get unlimited access when they sign up or log in.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="member@institution.edu" value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddMember()} />
              <Button onClick={handleAddMember} disabled={isAddingMember || !newMemberEmail.trim()} className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 gap-2 shrink-0 rounded-lg shadow-none">
                {isAddingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
              </Button>
            </div>
            <div className="space-y-1 mt-4">
              {(institution.member_emails || []).map((email) => (
                <div key={email} className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] text-gray-700 dark:text-gray-300">{email}</span>
                    {email === institution.admin_email && <Badge variant="outline" className="text-[10px]">Admin</Badge>}
                  </div>
                  {email !== institution.admin_email && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(email)} disabled={isRemovingEmail === email}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8">
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
      <div className="max-w-md mx-auto text-center space-y-6 py-16">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inquiry Submitted</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400">
          Our team will review your inquiry and reach out within 1–2 business days.
        </p>
        <Button onClick={() => { setSubmitted(false); setSelectedTier(null); }} variant="outline" className="rounded-lg border-gray-200 dark:border-gray-800 shadow-none">
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  // ── Tier selection + inquiry form ──
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Institutional Plans</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          All RADS systems for your department, program, or enterprise.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {TIERS.map(tier => {
          const TierIcon = tier.icon;
          const isSelected = selectedTier === tier.id;
          return (
            <button key={tier.id}
              className={`text-left bg-white dark:bg-black p-6 transition-colors duration-150 ${
                isSelected ? "bg-gray-50 dark:bg-gray-950" : "hover:bg-gray-50 dark:hover:bg-gray-950"
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <TierIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{tier.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{tier.size}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-gray-500 dark:text-gray-400">
                      <Check className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className={`w-full text-center py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                    : "border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  {isSelected ? "Selected" : "Select"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inquiry Form */}
      {selectedTier && (
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-none max-w-2xl mx-auto">
          <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-900">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
              Request Information — {TIERS.find(t => t.id === selectedTier)?.name}
            </CardTitle>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
              Fill out the form and our team will reach out to discuss pricing and setup.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Institution Name *</label>
                <Input placeholder="e.g., Mayo Clinic" value={formData.institution_name} onChange={(e) => updateField("institution_name", e.target.value)} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Department / Program</label>
                <Input placeholder="e.g., Radiology" value={formData.department} onChange={(e) => updateField("department", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Contact Name *</label>
                <Input placeholder="Your full name" value={formData.contact_name} onChange={(e) => updateField("contact_name", e.target.value)} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Contact Email *</label>
                <Input type="email" placeholder="you@institution.edu" value={formData.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Phone</label>
                <Input placeholder="(555) 123-4567" value={formData.contact_phone} onChange={(e) => updateField("contact_phone", e.target.value)} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block"># of Radiologists</label>
                <Input type="number" placeholder="e.g., 15" min="1" value={formData.num_radiologists} onChange={(e) => updateField("num_radiologists", e.target.value)} />
              </div>
              {selectedTier === "enterprise" && (
                <div>
                  <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block"># of Sites</label>
                  <Input type="number" placeholder="e.g., 3" min="1" value={formData.num_sites} onChange={(e) => updateField("num_sites", e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Message (optional)</label>
              <textarea
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-sm text-gray-700 dark:text-gray-300 p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="Tell us about your specific needs or questions..."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmitInquiry}
              disabled={isSubmitting || !formData.institution_name.trim() || !formData.contact_name.trim() || !formData.contact_email.trim()}
              size="lg"
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 font-medium h-11 text-sm rounded-lg shadow-none disabled:opacity-60"
            >
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Inquiry</>}
            </Button>
            <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> We'll respond within 1–2 business days
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}