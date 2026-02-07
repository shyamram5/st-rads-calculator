const PDF_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/9ffa5a94e_chhabra-et-al-2025-soft-tissue-rads-an-acr-work-in-progress-framework-for-standardized-reporting-of-soft-tissue-lesions.pdf";

export { PDF_URL };

export const CASE_EXAMPLES = [
  {
    id: "case-2",
    category: 2,
    categoryLabel: "2",
    riskLevel: "Very Low Risk",
    title: "Geyser Phenomenon (Supraclavicular Mass)",
    patient: "76-year-old patient with gradually increasing supraclavicular mass",
    diagnosis: "Geyser Phenomenon",
    figureRef: "Figure 3",
    imageDescriptions: [
      { label: "A — Axial T1W", desc: "Large well-defined lesion with perilesional edema" },
      { label: "B — In-phase Dixon T2W", desc: "High signal intensity lesion" },
      { label: "C — Water Dixon T2W", desc: "Bright fluid-signal content" },
      { label: "D — Sagittal STIR", desc: "Perilesional edema visible" },
      { label: "E — Axial DWI", desc: "Increased signal intensity in lesion" },
      { label: "F — ADC Map", desc: "High ADC value (2.6 × 10⁻³ mm²/s)" },
      { label: "G — Post-contrast T1W FS", desc: "Peripheral enhancement only" },
    ],
    findings: "Axial T1W, in-phase Dixon T2W, water Dixon T2W, and sagittal STIR images show a large well-defined lesion with perilesional edema. Axial DWI shows increased signal intensity within the lesion. ADC map demonstrates high ADC value (2.6 × 10⁻³ mm²/s). Axial fat-suppressed contrast-enhanced T1W image shows peripheral enhancement. Findings are classic for geyser phenomenon in the setting of a rotator cuff tear.",
    keyFeatures: [
      "Large, well-defined cyst-like lesion",
      "Communication with joint (rotator cuff tear)",
      "High ADC value (2.6 × 10⁻³ mm²/s)",
      "Peripheral enhancement only",
      "No solid enhancing component",
      "Perilesional edema present"
    ],
    management: "For ST-RADS category 2, the risk of malignancy is very low (nearly zero), and further imaging follow-up is at the clinical team's discretion. No further imaging or biopsy was performed in this patient. Treatment of the underlying rotator cuff pathology may be considered.",
    teachingPoint: "Category 2 lesions show imaging findings classic for a specific definitely benign soft-tissue tumor or tumor-like lesion. The geyser phenomenon is a well-known complication of massive rotator cuff tears, where joint fluid tracks superiorly through the defect to form a large subcutaneous cyst. The high ADC value (>1.5 × 10⁻³ mm²/s) further supports benignity."
  },
  {
    id: "case-3",
    category: 3,
    categoryLabel: "3",
    riskLevel: "Low Risk",
    title: "Subcutaneous Hematoma (Posterior Forearm)",
    patient: "65-year-old patient with mass in posterior forearm after subacute injury",
    diagnosis: "Hematoma",
    figureRef: "Figure 4",
    imageDescriptions: [
      { label: "A — Axial T1W", desc: "Small well-defined subcutaneous heterogeneous lesion" },
      { label: "B — In-phase Dixon T2W", desc: "Heterogeneous signal in lesion" },
      { label: "C — Water Dixon T2W", desc: "Mixed signal intensity" },
      { label: "D — Axial DWI", desc: "Increased signal intensity" },
      { label: "E — ADC Map", desc: "High ADC value (1.6 × 10⁻³ mm²/s)" },
      { label: "F — Pre-contrast T1W FS", desc: "Baseline signal before contrast" },
      { label: "G — Post-contrast T1W FS", desc: "No significant enhancement" },
    ],
    findings: "Axial T1W, in-phase Dixon T2W, and water Dixon T2W images show a small well-defined subcutaneous heterogeneous lesion. Axial DWI shows increased signal intensity within the lesion. ADC map demonstrates high ADC value (1.6 × 10⁻³ mm²/s). Axial fat-suppressed T1W images obtained before and after IV contrast media administration show no significant enhancement. Findings are suggestive of hematoma.",
    keyFeatures: [
      "Small, well-defined subcutaneous lesion",
      "Heterogeneous signal characteristics",
      "High ADC value (1.6 × 10⁻³ mm²/s)",
      "No significant enhancement post-contrast",
      "History of subacute injury",
      "Subcutaneous location"
    ],
    management: "For ST-RADS category 3, risk of malignancy is low. Imaging follow-up can be considered at 6 weeks to 3 months, 6 months, 1 year, and 2 years, unless the lesion resolves or significantly regresses. For hematomas specifically, imaging or clinical follow-up to resolution is warranted due to the possibility of an underlying neoplasm. The lesion in this patient resolved completely on clinical follow-up.",
    teachingPoint: "Category 3 lesions represent findings suggestive of a probably benign entity, but with some diagnostic uncertainty. Hematomas are especially important to follow to resolution, as they may occasionally mask an underlying soft-tissue neoplasm. The absence of enhancement and history of trauma support a benign etiology, but complete resolution should be documented."
  },
  {
    id: "case-4",
    category: 4,
    categoryLabel: "4",
    riskLevel: "Intermediate Risk",
    title: "Atypical Lipomatous Tumor (Anterior Thigh)",
    patient: "35-year-old woman with mass in anterior thigh",
    diagnosis: "Atypical Lipomatous Tumor (ALT/WDL)",
    figureRef: "Figure 5",
    imageDescriptions: [
      { label: "A — Axial T1W", desc: "Lipomatous intramuscular lesion with thick septations" },
      { label: "B — Water Dixon T2W", desc: "Internal vascularity and thick septations visible" },
      { label: "C — Pre-contrast T1W FS", desc: "Baseline signal" },
      { label: "D — Post-contrast T1W FS", desc: "Internal enhancement (>10% signal increase)" },
    ],
    findings: "Axial T1W and water Dixon T2W images show a small well-defined lipomatous intramuscular lesion with internal thick septations and vascularity, measuring less than 5 cm. Axial fat-suppressed T1W images obtained before and after administration of IV contrast media show internal enhancement with signal intensity increase measured greater than 10%. Findings are suggestive of atypical lipomatous tumor.",
    keyFeatures: [
      "Lipomatous intramuscular lesion",
      "Internal thick septations",
      "Prominent internal vascularity",
      ">10% signal increase on post-contrast images",
      "Size less than 5 cm",
      "Well-defined margins"
    ],
    management: "For ST-RADS category 4, risk of malignancy is intermediate. Given the lesion size (<5 cm), follow-up options include image-guided biopsy, open biopsy, or follow-up imaging at 4–6 weeks with subsequent regular interval follow-up for up to 2 years. The lesion was excised, confirming the suspected diagnosis of atypical lipomatous tumor.",
    teachingPoint: "Category 4 identifies lesions suspicious for malignancy or local aggressiveness. In lipomatous lesions, thick septations (≥2 mm) and >10% enhancement increase on post-contrast imaging suggest an atypical lipomatous tumor / well-differentiated liposarcoma (ALT/WDL) rather than a simple lipoma. Tissue diagnosis or referral to a sarcoma center is recommended for lesions ≥5 cm."
  },
  {
    id: "case-5",
    category: 5,
    categoryLabel: "5",
    riskLevel: "High Risk",
    title: "Leiomyosarcoma (Thigh Mass)",
    patient: "45-year-old woman with gradually increasing thigh mass",
    diagnosis: "Leiomyosarcoma",
    figureRef: "Figure 6",
    imageDescriptions: [
      { label: "A — Axial T1W", desc: "Heterogeneous intramuscular solid lesion" },
      { label: "B — Sagittal STIR", desc: "Associated peritumoral edema" },
      { label: "C — Post-contrast T1W FS", desc: "Heterogeneous solid enhancement with cystic changes" },
    ],
    findings: "Axial T1W and sagittal STIR images show a heterogeneous intramuscular solid lesion with associated peritumoral edema. Axial fat-suppressed contrast-enhanced T1W image shows heterogeneous solid enhancement of the lesion with cystic changes. Findings are highly suspicious for a malignant soft-tissue tumor.",
    keyFeatures: [
      "Large heterogeneous intramuscular mass",
      "Peritumoral edema",
      "Heterogeneous solid enhancement",
      "Internal cystic/necrotic changes",
      "Gradually increasing in size",
      "Deep (subfascial) location"
    ],
    management: "For ST-RADS category 5, risk of malignancy is high. Tissue diagnosis and referral to a sarcoma center are recommended. The lesion was subsequently biopsied, yielding a diagnosis of leiomyosarcoma.",
    teachingPoint: "Category 5 lesions are highly suspicious (essentially pathognomonic) for sarcoma. Key imaging features that raise concern for malignancy include large size, deep location, heterogeneous signal, peritumoral edema, internal necrosis or hemorrhage, fascial tail sign, and crossing of fascial compartments. Prompt tissue diagnosis and sarcoma center referral are critical for these lesions."
  },
  {
    id: "case-6c",
    category: 6,
    categoryLabel: "6C",
    riskLevel: "Known Tumor — Progressive",
    title: "Progressive Pleomorphic Rhabdomyosarcoma (Thigh)",
    patient: "45-year-old patient receiving chemotherapy for known pleomorphic rhabdomyosarcoma of thigh",
    diagnosis: "Pleomorphic Rhabdomyosarcoma (Progressive)",
    figureRef: "Figure 7",
    imageDescriptions: [
      { label: "A — Pre-Tx Axial T1W", desc: "Left anterior thigh intramuscular mass" },
      { label: "B — Pre-Tx Dixon T2W", desc: "Heterogeneous mass prior to treatment" },
      { label: "C — Post-Tx Axial T1W", desc: "Increase in size of mass" },
      { label: "D — Post-Tx Dixon T2W", desc: "Progressive disease evident" },
    ],
    findings: "Axial unenhanced T1W and in-phase Dixon T2W images from the pretreatment MRI examination show a left anterior thigh intramuscular mass. Axial unenhanced T1W and in-phase Dixon T2W images from the posttreatment MRI examination show an increase in size of the mass, consistent with progressive disease.",
    keyFeatures: [
      "Known biopsy-proven malignancy",
      "Currently receiving chemotherapy",
      "Interval increase in size on follow-up",
      "Intramuscular thigh location",
      "Progressive disease on treatment",
      "Comparison with pretreatment imaging"
    ],
    management: "The mass qualifies as category 6C (recurrent or progressive tumor). Recommendation includes surgical excision or other further medical treatment, as clinically appropriate. In the absence of such interventions, follow-up imaging can be considered at 6 weeks to 3 months, 6 months, 1 year, and 2 years.",
    teachingPoint: "Category 6 is reserved for known soft-tissue tumors under treatment or previously treated. Subcategory 6C indicates recurrent or progressive disease, defined as >20% increase in largest dimension since pretreatment imaging. This distinction from 6A (no residual) and 6B (residual, stable) is critical for guiding ongoing treatment decisions in the multidisciplinary sarcoma care model."
  }
];