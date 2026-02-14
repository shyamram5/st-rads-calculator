// Quiz, Flashcard, and Fill-in-the-Blank data derived from ST-RADS literature

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "ST-RADS Categories",
    question: "A 45-year-old woman presents with a painless thigh mass noticed 6 months ago. MRI reveals a 7 cm well-circumscribed intramuscular lesion that follows fat signal on all sequences (T1 hyperintense, T2 intermediate, signal dropout on fat suppression). Thin septations measuring <2 mm are present. Post-contrast imaging shows <10% increase in signal intensity. No perilesional edema is identified. DWI shows no restricted diffusion with a mean ADC of 1.8 × 10⁻³ mm²/s.\n\nWhat is the most appropriate ST-RADS classification?",
    options: ["ST-RADS 2 — Definitely benign", "ST-RADS 3 — Probably benign", "ST-RADS 4 — Suspicious", "ST-RADS 5 — Highly suspicious for malignancy"],
    correctIndex: 0,
    explanation: "This lesion meets all criteria for ST-RADS 2 (definitely benign lipoma): homogeneous fat signal on all sequences, thin septations <2 mm (100% specificity for benign), <10% enhancement increase, and ADC >1.5 × 10⁻³ mm²/s. Despite the 7 cm size (lipomas up to 10 cm can be category 2), the imaging features are classic for a simple lipoma with virtually zero malignancy risk."
  },
  {
    id: 2,
    category: "Nerve Sheath Tumors",
    question: "A 38-year-old man with neurofibromatosis type 1 presents with new pain and rapid growth of a pre-existing left sciatic nerve mass. MRI demonstrates a 6.2 cm fusiform mass along the sciatic nerve with ill-defined margins (loss of previously well-defined borders). The lesion is heterogeneously T2 hyperintense with loss of the previously seen target sign. There is marked perilesional edema extending into adjacent muscle compartments. DWI reveals restricted diffusion with a mean ADC of 0.85 × 10⁻³ mm²/s.\n\nWhich finding is the MOST specific indicator of malignant transformation in this clinical scenario?",
    options: ["Loss of the target sign", "Perilesional edema (60% sensitivity, 94% specificity)", "ADC <1.1 × 10⁻³ mm²/s (93% sensitivity, 95% specificity)", "Ill-defined margins"],
    correctIndex: 2,
    explanation: "While all features suggest malignant transformation of a PNST, ADC restriction <1.1 × 10⁻³ mm²/s is the most accurate single discriminator with 93% sensitivity and 95% specificity (Wilson 2021). Perilesional edema has high specificity (90-94%) but lower sensitivity (60%). Loss of target sign and ill-defined margins are supportive but less quantitative. This patient's ADC of 0.85 × 10⁻³ is well below the malignancy threshold, strongly suggesting malignant PNST. This warrants ST-RADS 5 classification and urgent sarcoma center referral."
  },
  {
    id: 3,
    category: "Tumor Subtypes",
    question: "A 62-year-old man presents with a slowly enlarging painless mass in the anterior thigh. MRI shows a 9 cm heterogeneous mass centered in the subcutaneous fat extending along the deep fascia. On T2-weighted images, there are linear areas of high signal extending along fascial planes beyond the main tumor margins — described as a 'tail' of signal abnormality. The lesion demonstrates heterogeneous enhancement. Multiple satellite nodules are identified along the fascial surface. Mean ADC is 1.0 × 10⁻³ mm²/s.\n\nWhich diagnosis is MOST consistent with these imaging findings?",
    options: ["Undifferentiated pleomorphic sarcoma", "Myxofibrosarcoma", "Atypical lipomatous tumor / well-differentiated liposarcoma", "Desmoid-type fibromatosis"],
    correctIndex: 1,
    explanation: "The fascial 'tail sign' — perifascial T2 signal extension beyond the main tumor — is the hallmark of myxofibrosarcoma, present in 82% of cases (Kaya 2008). Combined with satellite nodules along fascial planes, heterogeneous enhancement, and low ADC (1.0 × 10⁻³), this presentation is classic. While UPS can show the tail sign (~60%), the subcutaneous/fascial location, prominent tail sign with satellite nodules, and infiltrative fascial spread pattern make myxofibrosarcoma the best answer. This highlights why wide surgical margins are critical — local recurrence rates are high due to fascial plane spread."
  },
  {
    id: 4,
    category: "Lipomatous Tumors",
    question: "A 58-year-old woman undergoes MRI for a deep-seated thigh mass. Imaging reveals a 12 cm predominantly fatty mass with thick enhancing septations measuring 3-4 mm. Post-contrast images show >10% increase in signal intensity within the septations and nodular non-adipose components. There is no perilesional edema or invasion of adjacent structures. ADC mapping of the non-adipose components shows a mean value of 1.3 × 10⁻³ mm²/s.\n\nWhat is the appropriate ST-RADS classification and recommended management?",
    options: [
      "ST-RADS 2 — No follow-up needed",
      "ST-RADS 3 — Short-interval imaging follow-up at 3 months",
      "ST-RADS 4 — Tissue diagnosis or sarcoma center referral (lesion ≥5 cm)",
      "ST-RADS 5 — Urgent biopsy and sarcoma center referral"
    ],
    correctIndex: 2,
    explanation: "This is ST-RADS 4. The lipomatous mass has thick septations (3-4 mm, exceeding the 2 mm threshold) and >10% enhancement increase — both features that upgrade a lipomatous lesion from category 2 to category 4, concerning for atypical lipomatous tumor / well-differentiated liposarcoma. The ADC of 1.3 × 10⁻³ is in the intermediate range (1.1-1.5). At ≥5 cm (this is 12 cm), tissue diagnosis or sarcoma center referral is recommended. ALTs demonstrate 100% post-gadolinium enhancement and thick septations are the key distinguishing features from simple lipomas."
  },
  {
    id: 5,
    category: "Vascular Tumors",
    question: "A 35-year-old woman presents with a painful 2.5 cm subcutaneous nodule in the calf that worsens with cold exposure. MRI demonstrates a well-circumscribed, homogeneously T2 hyperintense lesion with avid homogeneous post-contrast enhancement. On T2-weighted images, dark linear strands are seen within the lesion creating an internal reticular pattern. The mass is isointense to muscle on T1. ADC values are intermediate at 1.2 × 10⁻³ mm²/s.\n\nWhich diagnosis is BEST supported by the combination of clinical and imaging features?",
    options: ["Glomus tumor", "Angioleiomyoma", "Hemangioma", "Angiosarcoma"],
    correctIndex: 1,
    explanation: "The 'dark reticular sign' (or 'reticular sign') on T2-weighted imaging — dark linear strands within a T2 hyperintense mass — is characteristic of angioleiomyoma, present in 56-76% of cases (Koga et al.). The clinical presentation (painful subcutaneous nodule worsening with cold) is classic for angioleiomyoma due to smooth muscle contraction. While glomus tumors are also painful, they are typically subungual in the upper extremity with T2 hyperintensity in 86-100% but lack the reticular sign. Hemangiomas usually show phlebolith and serpiginous vascular channels. This would be classified as ST-RADS 2-3."
  },
  {
    id: 6,
    category: "Tumor Subtypes",
    question: "A 28-year-old woman presents with a 3.5 cm firm, rapidly growing mass in the forearm that appeared 3 weeks ago. MRI shows a well-circumscribed lesion with heterogeneous T2 signal (100% of these lesions show heterogeneous T2/STIR signal) and well-defined borders. The lesion is located in the subcutaneous tissue adjacent to fascia. There is moderate post-contrast enhancement. The mass appeared to grow rapidly over weeks rather than months.\n\nGiven the rapid onset, patient demographics, and MRI characteristics, which diagnosis should be STRONGLY considered before recommending excision?",
    options: ["Synovial sarcoma", "Dermatofibrosarcoma protuberans", "Nodular fasciitis", "Fibrosarcoma"],
    correctIndex: 2,
    explanation: "Nodular fasciitis is a benign, self-limiting reactive process that characteristically presents as a rapidly growing mass in young adults, mimicking malignancy. Key features: 100% demonstrate heterogeneous T2/STIR signal (29/29 cases, Coyle 2013), 97% show well-defined borders, and the rapid growth over weeks is a hallmark clinical feature. It is typically <3 cm and subcutaneous/fascial. Recognizing this entity is critical to avoid unnecessary radical surgery — many resolve spontaneously. This would be ST-RADS 3 given the clinical-imaging correlation, with short-interval follow-up to confirm stability or regression."
  },
  {
    id: 7,
    category: "ST-RADS Categories",
    question: "A 55-year-old man undergoes surveillance MRI 8 months after surgical resection and adjuvant radiation therapy for a high-grade undifferentiated pleomorphic sarcoma of the thigh. The post-operative bed shows expected post-treatment changes with fibrosis and edema. However, a new 2.8 cm nodular focus is identified at the deep margin of the surgical bed. This focus demonstrates T2 hyperintensity, avid enhancement, and restricted diffusion with ADC of 0.9 × 10⁻³ mm²/s. Compared to pre-treatment imaging, this represents a new finding with >20% increase from the baseline post-operative appearance.\n\nWhat is the correct ST-RADS classification?",
    options: ["ST-RADS 6A — No residual tumor", "ST-RADS 6B — Residual tumor, stable", "ST-RADS 6C — Recurrent or progressive disease", "ST-RADS 5 — Highly suspicious for malignancy"],
    correctIndex: 2,
    explanation: "ST-RADS 6C indicates recurrent or progressive soft-tissue tumor, defined as >20% increase in largest dimension since pretreatment imaging, new nodular enhancement, or increased diffusion restriction — all present here. This is distinguished from 6A (no residual tumor, expected post-treatment changes only) and 6B (residual tumor ≤20% size change with similar or increased ADC). Category 5 would not apply as the patient has a known prior tumor, placing them in the category 6 pathway. The new enhancing nodule with restricted diffusion (ADC 0.9) at the surgical margin is highly concerning for local recurrence."
  },
  {
    id: 8,
    category: "Tumor Subtypes",
    question: "A 42-year-old woman presents with diffuse swelling and intermittent locking of the knee. MRI reveals a lobulated, infiltrative mass involving the synovium of the knee joint with extension into the suprapatellar recess and popliteal fossa. The mass demonstrates low signal intensity on both T1-weighted and T2-weighted sequences with areas of 'blooming' artifact on gradient echo (GRE) sequences. There are scattered areas of intermediate T2 signal. Post-contrast images show heterogeneous enhancement. Mean ADC is 0.9 × 10⁻³ mm²/s.\n\nWhat is the MOST likely diagnosis?",
    options: ["Synovial sarcoma", "Diffuse-type tenosynovial giant cell tumor (TGCT)", "Synovial chondromatosis", "Rheumatoid pannus"],
    correctIndex: 1,
    explanation: "Diffuse-type TGCT (formerly pigmented villonodular synovitis) is characterized by: central hypointensity on T1 and T2 from hemosiderin deposition (83% of cases), infiltrative margins (83%), blooming artifact on GRE sequences (pathognomonic for hemosiderin), and universally low ADC values (mean 0.9 × 10⁻³ mm²/s). The knee is the most common location. Despite the low ADC suggesting malignancy by ST-RADS thresholds, TGCT is a notable exception — it is a benign but locally aggressive process. This would be classified as ST-RADS 3, recognizing that ADC alone cannot determine malignancy."
  },
  {
    id: 9,
    category: "Tumor Subtypes",
    question: "A 22-year-old man presents with a painless, slowly growing mass in the posterior thigh. MRI shows a 7 cm well-defined, multilobulated mass that is markedly T2 hyperintense — appearing almost as bright as fluid. Internal septations are present (86% of these tumors show septations) with 93% demonstrating gadolinium enhancement. The lesion has areas that appear 'cystic' on T2 but enhance on post-contrast sequences. It is located deep to the fascia within the muscle.\n\nWhich diagnosis should be the PRIMARY concern?",
    options: ["Intramuscular myxoma", "Ganglion cyst", "Myxoid liposarcoma", "Schwannoma"],
    correctIndex: 2,
    explanation: "Myxoid liposarcoma is the primary concern here. Key features: marked T2 hyperintensity mimicking fluid (due to high water content of myxoid matrix), internal septations (86%), near-universal gadolinium enhancement (93%), and cystic-appearing areas that actually enhance (distinguishing from true cysts). The deep intramuscular location in a young adult's thigh is the classic demographic. This is a common diagnostic pitfall — the cystic appearance on T2 can lead to misdiagnosis as a benign cystic lesion. Unlike intramuscular myxoma which occurs in older patients and is truly cystic, myxoid liposarcoma's 'cystic' areas enhance. ST-RADS 5 classification with tissue diagnosis is warranted."
  },
  {
    id: 10,
    category: "Tumor Subtypes",
    question: "A 50-year-old woman presents with a painless scalp mass. MRI reveals a 4.5 cm heterogeneous mass with areas of intratumoral T2 hypointensity (87% show this finding) and mixed signal components (71% heterogeneous). Post-contrast imaging demonstrates avid but heterogeneous enhancement. There are areas suggesting internal hemorrhage and possible necrosis. No flow voids are identified.\n\nWhich aggressive vascular neoplasm is MOST consistent with these imaging features?",
    options: ["Kaposi sarcoma", "Angiosarcoma", "Epithelioid hemangioendothelioma", "Alveolar soft part sarcoma"],
    correctIndex: 1,
    explanation: "Angiosarcoma is characterized by intratumoral T2 hypointensity (present in 87% of cases), heterogeneous signal components (71%), internal hemorrhage, and necrosis. The scalp is one of the most common locations. Unlike alveolar soft part sarcoma, which characteristically demonstrates flow voids (78-96%), angiosarcoma may or may not show flow voids but consistently demonstrates the T2 hypointensity pattern. This finding helps distinguish angiosarcoma from squamous cell carcinoma in the same location. ST-RADS 5 with urgent tissue diagnosis and oncology referral."
  },
  {
    id: 11,
    category: "MRI Protocol",
    question: "A referring clinician sends a patient for MRI of a suspected soft-tissue tumor. The outside facility performs only axial T1-weighted and axial T2-weighted sequences with fat suppression, but does NOT obtain pre-contrast images, DWI, or a T2 sequence without fat suppression. The lesion shows T1 hyperintensity and T2 hyperintensity with fat suppression.\n\nAccording to ST-RADS minimum MRI protocol requirements, what is the most critical limitation of this study?",
    options: [
      "Lack of DWI prevents ADC quantification for risk stratification",
      "Absence of pre-contrast fat-suppressed T1 prevents assessment of enhancement",
      "Missing T2 without fat suppression prevents characterization of fat-containing lesions",
      "All of the above represent significant protocol limitations"
    ],
    correctIndex: 3,
    explanation: "The minimum ST-RADS MRI protocol requires: (1) Axial T1W, (2) Axial fluid-sensitive (T2W/STIR), (3) Axial pre- AND post-contrast fat-suppressed T1W (pre-contrast is essential to distinguish intrinsic T1 hyperintensity from enhancement), (4) DWI with b-values 50, 400, 800 (for ADC quantification — the key risk stratification tool), and (5) at least one T2W without fat suppression (to confirm fat content — critical for lipomatous tumor characterization). This study should be classified ST-RADS 0 (incomplete) with recall for complete imaging."
  },
  {
    id: 12,
    category: "Nerve Sheath Tumors",
    question: "A 32-year-old woman presents with a 3 cm fusiform mass along the ulnar nerve at the elbow. MRI demonstrates a well-circumscribed lesion (84% of benign PNSTs show well-defined margins) with a classic 'target sign' — central low T2 signal surrounded by peripheral high T2 signal. The entering and exiting nerve is clearly identified (split fat sign positive). There is no perilesional edema. ADC values measure 1.4 × 10⁻³ mm²/s.\n\nWhat ST-RADS category is MOST appropriate, and what is the key finding that supports this classification?",
    options: [
      "ST-RADS 2 — Target sign is characteristic of benign PNST",
      "ST-RADS 3 — Benign-appearing but nerve sheath tumors carry inherent risk",
      "ST-RADS 4 — Any nerve sheath tumor should be considered suspicious",
      "ST-RADS 5 — ADC <1.5 suggests possible malignancy"
    ],
    correctIndex: 0,
    explanation: "ST-RADS 2 (definitely benign) is correct. The target sign — central T2 hypointensity (fibrosis) with peripheral T2 hyperintensity (myxoid tissue) — is characteristic of benign peripheral nerve sheath tumors (schwannomas and neurofibromas). Combined with well-defined margins (84.2% of benign PNSTs), no perilesional edema, ADC >1.1 × 10⁻³, and classic split fat sign, this lesion has imaging features classic for a benign entity. The target sign essentially excludes malignant PNST, which characteristically shows heterogeneous T2 signal without the organized target pattern."
  },
  {
    id: 13,
    category: "Tumor Subtypes",
    question: "A 17-year-old boy presents with a painful, enlarging mass in the popliteal fossa. MRI reveals a 5.5 cm mass that is uniformly T2 hyperintense (100% show this finding). Peritumoral edema is present (73-96% of these tumors). The lesion demonstrates heterogeneous enhancement with areas of internal hemorrhage. The 'triple sign' is noted — areas of high, intermediate, and low signal on T2-weighted images. ADC mapping shows restricted diffusion (mean 0.95 × 10⁻³ mm²/s).\n\nWhich diagnosis should be MOST strongly suspected?",
    options: ["Rhabdomyosarcoma", "Synovial sarcoma", "Malignant peripheral nerve sheath tumor", "Epithelioid sarcoma"],
    correctIndex: 1,
    explanation: "Synovial sarcoma is the best answer. Key supporting features: uniform T2 hyperintensity (100% of cases), peritumoral edema (73-96%), the 'triple sign' (high, intermediate, and low T2 signal representing solid tumor, hemorrhage, and calcification/fibrosis — highly characteristic), and low ADC in higher-grade tumors. The patient demographics (adolescent/young adult) and juxta-articular location (popliteal fossa) are classic. Despite the name, synovial sarcoma does not arise from synovium. Sedaghat 2023 and Chhabra 2019 confirmed these imaging characteristics. ST-RADS 5 with urgent tissue diagnosis."
  },
  {
    id: 14,
    category: "Tumor Subtypes",
    question: "A 30-year-old woman presents with a slowly growing painless mass in the posterior thigh. MRI reveals a 6 cm well-defined deep-seated mass that is markedly T2 hyperintense and uniformly T1 hypointense. The lesion demonstrates avid, homogeneous post-contrast enhancement. Notably, prominent flow voids are identified within and around the mass on both T1 and T2 sequences (78-96% demonstrate this finding). There is no perilesional edema.\n\nWhich rare sarcoma is characterized by this combination of findings?",
    options: ["Epithelioid sarcoma", "Clear cell sarcoma", "Alveolar soft part sarcoma", "Extraskeletal myxoid chondrosarcoma"],
    correctIndex: 2,
    explanation: "Alveolar soft part sarcoma is characterized by prominent flow voids (78-96%), reflecting marked tumor vascularity — this is its most distinctive imaging feature. The lesion is typically T2 hyperintense relative to muscle with homogeneous or heterogeneous enhancement. It occurs in young adults (20-40 years), commonly in the lower extremity. The flow voids distinguish it from most other soft-tissue sarcomas. Despite its indolent growth pattern, ASPS has a high rate of late metastasis (particularly pulmonary). ST-RADS 5 with tissue diagnosis and systemic staging."
  },
  {
    id: 15,
    category: "ST-RADS Categories",
    question: "A 48-year-old man presents with a 4 cm intramuscular mass in the deltoid discovered incidentally. MRI shows a well-defined, homogeneously T2 hyperintense lesion with minimal enhancement. ADC measures 2.1 × 10⁻³ mm²/s. There is no perilesional edema, no necrosis, no fascial tail sign. The patient has no relevant medical history.\n\nA colleague suggests this may be an intramuscular myxoma and recommends no further workup. According to ST-RADS principles, what is the most appropriate approach?",
    options: [
      "ST-RADS 2 with no follow-up — imaging is classic for a benign myxoma",
      "ST-RADS 3 with short-interval follow-up at 3-6 months — probably benign but needs monitoring",
      "ST-RADS 4 if patient is >40 years old — age modifies the risk of myxoid lesions",
      "ST-RADS 5 — all intramuscular myxoid lesions require biopsy"
    ],
    correctIndex: 2,
    explanation: "In ST-RADS, age is a modifier for intramuscular myxoid lesions. In younger patients, an intramuscular myxoma with classic features would be ST-RADS 3 (probably benign). However, in patients >40 years (this patient is 48), the same imaging appearance raises concern for myxoid liposarcoma or low-grade myxofibrosarcoma, upgrading the classification to ST-RADS 4 (suspicious). Despite the 'benign' appearance, the high ADC (2.1), and lack of aggressive features, the age-dependent risk warrants tissue diagnosis or close surveillance. This is a critical teaching point — imaging features alone are insufficient without clinical context."
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