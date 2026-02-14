// Quiz, Flashcard, and Fill-in-the-Blank data derived from ST-RADS literature

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "ST-RADS Categories",
    question: "A lipomatous lesion measuring 8 cm with thin septations (<2 mm), homogeneous fat signal, and <10% enhancement increase would be classified as which ST-RADS category?",
    options: ["ST-RADS 2", "ST-RADS 3", "ST-RADS 4", "ST-RADS 5"],
    correctIndex: 0,
    explanation: "ST-RADS 2 is assigned to lesions with imaging findings classic for a definitely benign soft-tissue tumor. A lipomatous lesion up to 10 cm with thin/no septations, fat-like signal on all sequences, and <10% enhancement increase meets category 2 criteria."
  },
  {
    id: 2,
    category: "MRI Findings",
    question: "What is the reported sensitivity and specificity of ADC restriction (<1.1 × 10⁻³ mm²/s) for distinguishing malignant from benign peripheral nerve sheath tumors?",
    options: ["60% sensitivity, 90% specificity", "93% sensitivity, 95% specificity", "80% sensitivity, 75% specificity", "50% sensitivity, 99% specificity"],
    correctIndex: 1,
    explanation: "ADC restriction <1.1 × 10⁻³ mm²/s showed 93% sensitivity and 95% specificity for malignant vs benign PNSTs, making it the most accurate single discriminator (Wilson 2021)."
  },
  {
    id: 3,
    category: "Tumor Subtypes",
    question: "The fascial 'tail sign' on T2-weighted MRI is most characteristically associated with which tumor?",
    options: ["Lipoma", "Myxofibrosarcoma", "Schwannoma", "Glomus tumor"],
    correctIndex: 1,
    explanation: "Myxofibrosarcoma characteristically demonstrates perifascial T2 signal extension (82% of cases), known as the 'tail sign,' reflecting infiltrative spread along fascial planes (Kaya 2008)."
  },
  {
    id: 4,
    category: "ST-RADS Categories",
    question: "A soft-tissue lesion with thick septations (≥2 mm) and >10% increase in signal intensity between pre- and post-contrast images in a lipomatous mass would be classified as:",
    options: ["ST-RADS 2", "ST-RADS 3", "ST-RADS 4", "ST-RADS 5"],
    correctIndex: 2,
    explanation: "ST-RADS 4 is assigned for lipomatous lesions with thick septations or >10% enhancement increase, suggestive of atypical lipomatous tumor / well-differentiated liposarcoma."
  },
  {
    id: 5,
    category: "MRI Findings",
    question: "What percentage of glomus tumors demonstrate T2 hyperintensity on MRI?",
    options: ["50-60%", "70-80%", "85.7-100%", "40-50%"],
    correctIndex: 2,
    explanation: "Glomus tumors consistently demonstrated T2 hyperintensity in 85.7-100% of cases, with well-defined margins and solid enhancement in all instances (Al-Qattan 2005)."
  },
  {
    id: 6,
    category: "Tumor Subtypes",
    question: "Which MRI feature is present in 100% of cases of nodular fasciitis on T2W or STIR sequences?",
    options: ["Homogeneous signal", "Heterogeneous signal", "Complete signal void", "Ring enhancement"],
    correctIndex: 1,
    explanation: "Nodular fasciitis lesions demonstrated heterogeneous signal on T2W or STIR sequences in 100% of cases (29/29), along with well-defined borders in 97% (Coyle 2013)."
  },
  {
    id: 7,
    category: "ST-RADS Categories",
    question: "ST-RADS category 6C indicates:",
    options: ["No residual tumor after treatment", "Residual tumor with stable size", "Recurrent or progressive tumor, with or without metastasis", "Incomplete imaging"],
    correctIndex: 2,
    explanation: "Category 6C indicates recurrent or progressive soft-tissue tumor or tumor-like lesion, with or without metastatic disease (>20% increase in largest dimension since pretreatment imaging)."
  },
  {
    id: 8,
    category: "MRI Findings",
    question: "The 'reticular sign' on T2-weighted imaging is a characteristic feature of which tumor?",
    options: ["Angiosarcoma", "Angioleiomyoma", "Synovial sarcoma", "Rhabdomyosarcoma"],
    correctIndex: 1,
    explanation: "Angioleiomyomas frequently exhibit the reticular sign on T2W images, present in 56-76% of cases. Koga et al. emphasized the 'dark reticular sign' as useful for differentiating angioleiomyomas from other vascular tumors."
  },
  {
    id: 9,
    category: "Tumor Subtypes",
    question: "What is the hallmark MRI finding of tenosynovial giant cell tumors (TGCTs)?",
    options: ["Marked T2 hyperintensity", "Low signal on T1W and T2W with blooming artifact on GRE", "Fascial tail sign", "Flow voids"],
    correctIndex: 1,
    explanation: "TGCTs display areas of low T1 and T2 signal with blooming artifact on gradient echo from hemosiderin deposition. They also show universally low ADC values (mean 0.9 × 10⁻³ mm²/s)."
  },
  {
    id: 10,
    category: "MRI Findings",
    question: "Alveolar soft part sarcomas characteristically demonstrate which MRI feature in 78-96% of cases?",
    options: ["Fascial tail sign", "Reticular sign", "Flow voids", "Target sign"],
    correctIndex: 2,
    explanation: "Alveolar soft part sarcomas were typically T2 hyperintense relative to muscle and demonstrated flow voids in 78-96% of cases, reflecting their marked vascularity."
  },
  {
    id: 11,
    category: "ST-RADS Categories",
    question: "Which ADC threshold in ST-RADS supports a category 2 (definitely benign) classification?",
    options: ["ADC < 0.8 × 10⁻³ mm²/s", "ADC 1.1-1.5 × 10⁻³ mm²/s", "ADC > 1.5 × 10⁻³ mm²/s", "ADC < 1.1 × 10⁻³ mm²/s"],
    correctIndex: 2,
    explanation: "Mean ADC > 1.5 × 10⁻³ mm²/s supports a ST-RADS category 2 classification. ADC 1.1-1.5 is intermediate (category 3), and ADC < 1.1 suggests malignancy (category 5)."
  },
  {
    id: 12,
    category: "Tumor Subtypes",
    question: "What percentage of malignant peripheral nerve sheath tumors demonstrate ill-defined margins on MRI?",
    options: ["30%", "50%", "78.6%", "95%"],
    correctIndex: 2,
    explanation: "Malignant PNSTs typically presented with ill-defined boundaries in 78.6% of cases (22/28), compared to benign PNSTs which showed well-defined margins in 84.2% (Jin 2023)."
  },
  {
    id: 13,
    category: "MRI Findings",
    question: "Perilesional edema has what sensitivity and specificity for distinguishing malignant from benign PNSTs?",
    options: ["93% sensitivity, 95% specificity", "60% sensitivity, 94% specificity", "80% sensitivity, 80% specificity", "45% sensitivity, 99% specificity"],
    correctIndex: 1,
    explanation: "Perilesional edema demonstrated 60% sensitivity and 94% specificity (some studies report 90% specificity) for distinguishing malignant from benign PNSTs (Wilson 2021)."
  },
  {
    id: 14,
    category: "ST-RADS Categories",
    question: "For a ST-RADS category 4 lesion measuring ≥5 cm, what is the recommended management?",
    options: ["No follow-up needed", "Imaging follow-up in 1 year", "Tissue diagnosis or referral to a sarcoma center", "Repeat MRI in 6 months only"],
    correctIndex: 2,
    explanation: "For ST-RADS category 4 lesions measuring ≥5 cm, tissue diagnosis or referral to a sarcoma center is recommended. Smaller lesions may undergo biopsy or close follow-up imaging."
  },
  {
    id: 15,
    category: "Tumor Subtypes",
    question: "Synovial sarcomas demonstrated peritumoral edema in what percentage of cases?",
    options: ["30-40%", "50-60%", "73-96%", "10-20%"],
    correctIndex: 2,
    explanation: "Synovial sarcomas showed peritumoral edema in 73-96% of cases, were uniformly T2 hyperintense (100%), and demonstrated low ADC values in higher-grade tumors (Sedaghat 2023; Chhabra 2019)."
  },
];

export const FLASHCARDS = [
  { front: "ST-RADS Category 0", back: "Incomplete imaging, limiting diagnostic interpretation. Action: Recall for additional imaging and/or request prior examinations." },
  { front: "ST-RADS Category 1", back: "No soft-tissue lesion identified on MRI. May include findings mimicking lesions (e.g., asymmetric fatty prominence). No further imaging follow-up recommended." },
  { front: "ST-RADS Category 2", back: "Definitely benign. Very low (nearly zero) malignancy risk. Examples: lipoma, ganglion, synovial cyst, vascular malformation, benign PNST with target sign. Mean ADC > 1.5 × 10⁻³ mm²/s." },
  { front: "ST-RADS Category 3", back: "Probably benign. Low malignancy risk. Examples: angiolipoma, hematoma, TSGCT, intramuscular myxoma (younger patient), hibernoma. Follow-up at 6 weeks–3 months, 6 months, 1 year, 2 years." },
  { front: "ST-RADS Category 4", back: "Suspicious. Intermediate malignancy risk. Examples: ALT/WDL (thick septations, >10% enhancement), cystic PNST with edema, intramuscular myxoma (older patient). Biopsy or close follow-up; tissue diagnosis if ≥5 cm." },
  { front: "ST-RADS Category 5", back: "Highly suspicious for malignancy. Examples: large mass with perilesional edema, necrosis, fascial tail sign, crossing compartments. Mean ADC < 1.1 × 10⁻³ mm²/s. Action: Tissue diagnosis + sarcoma center referral." },
  { front: "ST-RADS Category 6A", back: "Known tumor, post-treatment: No residual tumor or tumor-like lesion. Expected post-treatment changes, no focal mass or substantial diffusion restriction." },
  { front: "ST-RADS Category 6B", back: "Known tumor, post-treatment: Residual tumor present. ≤20% increase in largest dimension. Similar or increased ADC compared to before treatment." },
  { front: "ST-RADS Category 6C", back: "Known tumor, post-treatment: Recurrent or progressive disease. >20% size increase, increased diffusion restriction, possible regional or distant metastasis." },
  { front: "Fascial Tail Sign", back: "Perifascial T2 signal extension reflecting infiltrative spread along fascial planes. Present in 82% of myxofibrosarcomas, 60% of undifferentiated pleomorphic sarcomas, and ~30% of malignant PNSTs." },
  { front: "Target Sign", back: "Central low T2 signal with peripheral high T2 signal, resembling a bullseye. Characteristic of benign peripheral nerve sheath tumors (schwannomas, neurofibromas). Supports ST-RADS 2." },
  { front: "Reticular Sign", back: "Dark reticular strands within a tumor on T2W images. Characteristic of angioleiomyoma (56-76%). Useful for differentiating from other vascular tumors." },
  { front: "ADC Thresholds in ST-RADS", back: "ADC > 1.5 × 10⁻³ = Likely benign (Cat 2)\nADC 1.1–1.5 × 10⁻³ = Intermediate (Cat 3)\nADC < 1.1 × 10⁻³ = Likely malignant (Cat 5)\n\nFor PNSTs: ADC < 1.1 has 93% sensitivity, 95% specificity for malignancy." },
  { front: "Lipoma vs ALT/WDL", back: "Lipoma: Thin septa <2mm (100% specificity), homogeneous fat signal (89% sensitivity), <10% enhancement.\n\nALT/WDL: Thick septations ≥2mm, 100% post-gadolinium enhancement, >10% signal increase on contrast." },
  { front: "Myxoid Liposarcoma", back: "86% internal septations, 93% gadolinium enhancement. Marked T2 hyperintensity from myxoid matrix (high water content). Can mimic cystic mass. Multilobulated with cystic-appearing components." },
  { front: "TGCT (Tenosynovial Giant Cell Tumor)", back: "Diffuse type: Central hypointensity/hemosiderin (83%), infiltrative margins (83%), blooming on GRE.\nLocalized type: Circumscribed (100%), single nodule (82%), peripheral hypointense rim (86%).\nAll: Low ADC (0.9 × 10⁻³)." },
  { front: "Malignant PNST vs Benign PNST", back: "Malignant: Ill-defined margins (79%), peritumoral edema (66%), heterogeneous T2 (81%), size >4cm, no target sign, ADC <1.1.\n\nBenign: Well-defined margins (84%), target sign, fascicular sign, ADC >1.1." },
  { front: "Minimum MRI Protocol for ST-RADS", back: "Axial 2D T1W + axial 2D fluid-sensitive (T2W/STIR) + axial pre/post-contrast fat-suppressed T1W.\nSlice thickness: 3-4mm, 10% gap.\nDWI: b-values 50, 400, 800 s/mm².\nAt least one T2W without fat suppression." },
  { front: "Glomus Tumor", back: "T2 hyperintense (86-100%), solid enhancement with well-defined margins (100%). Most common in upper extremities (subungual). MRI: 90% sensitivity, 50% specificity, 97% PPV. May show 'salt and pepper' sign." },
  { front: "Angiosarcoma", back: "Intratumoral hypointensity (87%), heterogeneous components (71%). May have hemorrhage, necrosis, and flow voids. Distinct from squamous cell carcinoma by intratumoral T2 hypointensity." },
];

export const FILL_IN_BLANKS = [
  {
    id: 1,
    text: "Lipomas are characterized by septations less than ___ mm, with 100% specificity for benign diagnosis.",
    answer: "2",
    hint: "Think about the thin septation threshold in ST-RADS.",
    category: "Lipomatous Tumors"
  },
  {
    id: 2,
    text: "ADC restriction below ___ × 10⁻³ mm²/s has 93% sensitivity and 95% specificity for malignant PNSTs.",
    answer: "1.1",
    hint: "This is also the ADC threshold for ST-RADS category 5.",
    category: "Nerve Sheath Tumors"
  },
  {
    id: 3,
    text: "Myxofibrosarcoma demonstrates the fascial ___ sign in approximately 82% of cases.",
    answer: "tail",
    hint: "This sign reflects infiltrative spread along fascial planes.",
    category: "Fibroblastic Tumors"
  },
  {
    id: 4,
    text: "Atypical lipomatous tumors demonstrate post-gadolinium enhancement in ___% of all cases.",
    answer: "100",
    hint: "Enhancement is universally present in ALTs.",
    category: "Lipomatous Tumors"
  },
  {
    id: 5,
    text: "Tenosynovial giant cell tumors show a mean ADC of ___ × 10⁻³ mm²/s.",
    answer: "0.9",
    hint: "This is below the 1.1 malignancy threshold but TGCTs are not malignant — ADC alone isn't enough.",
    category: "TGCT"
  },
  {
    id: 6,
    text: "The ___ sign on T2-weighted MRI is characteristic of angioleiomyoma, showing dark internal strands.",
    answer: "reticular",
    hint: "Koga et al. emphasized this as a useful differentiating feature.",
    category: "Vascular Tumors"
  },
  {
    id: 7,
    text: "ST-RADS category ___ is used when imaging is incomplete, limiting diagnostic interpretation.",
    answer: "0",
    hint: "This prompts recall for additional imaging.",
    category: "ST-RADS Categories"
  },
  {
    id: 8,
    text: "Alveolar soft part sarcomas demonstrate flow voids in ___-96% of cases.",
    answer: "78",
    hint: "This reflects the marked vascularity of these tumors.",
    category: "Uncertain Differentiation"
  },
  {
    id: 9,
    text: "Synovial sarcomas are uniformly T2 hyperintense in ___% of cases.",
    answer: "100",
    hint: "This is one of their most consistent MRI features.",
    category: "Uncertain Differentiation"
  },
  {
    id: 10,
    text: "For ST-RADS category 4 lesions, tissue diagnosis or sarcoma referral is recommended if the lesion measures ≥___ cm.",
    answer: "5",
    hint: "This is a key size threshold in sarcoma management.",
    category: "ST-RADS Categories"
  },
  {
    id: 11,
    text: "Benign peripheral nerve sheath tumors show well-defined margins in ___% of cases.",
    answer: "84",
    hint: "Compare this to the 79% ill-defined margins seen in malignant PNSTs.",
    category: "Nerve Sheath Tumors"
  },
  {
    id: 12,
    text: "Epithelioid sarcomas demonstrate peritumoral edema in ___% of cases.",
    answer: "100",
    hint: "This is the highest rate of peritumoral edema among all tumor types reviewed.",
    category: "Uncertain Differentiation"
  },
];