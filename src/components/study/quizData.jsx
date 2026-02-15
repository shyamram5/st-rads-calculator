
// ST-RADS Question Bank — 100 Clinical Vignette Questions
// Aggregated from three bank files

import { QUESTIONS_BANK_1 } from "./questionBank1";
import { QUESTIONS_BANK_2 } from "./questionBank2";
import { QUESTIONS_BANK_3 } from "./questionBank3";

export const QUIZ_QUESTIONS = [
  ...QUESTIONS_BANK_1,
  ...QUESTIONS_BANK_2,
  ...QUESTIONS_BANK_3,
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
