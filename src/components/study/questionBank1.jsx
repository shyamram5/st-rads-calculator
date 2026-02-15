// Questions 1-34: ST-RADS Categories, Lipomatous Tumors, MRI Protocol

export const QUESTIONS_BANK_1 = [
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
    category: "Lipomatous Tumors",
    question: "A 58-year-old woman undergoes MRI for a deep-seated thigh mass. Imaging reveals a 12 cm predominantly fatty mass with thick enhancing septations measuring 3-4 mm. Post-contrast images show >10% increase in signal intensity within the septations and nodular non-adipose components. There is no perilesional edema or invasion of adjacent structures. ADC mapping of the non-adipose components shows a mean value of 1.3 × 10⁻³ mm²/s.\n\nWhat is the appropriate ST-RADS classification and recommended management?",
    options: ["ST-RADS 2 — No follow-up needed", "ST-RADS 3 — Short-interval imaging follow-up at 3 months", "ST-RADS 4 — Tissue diagnosis or sarcoma center referral (lesion ≥5 cm)", "ST-RADS 5 — Urgent biopsy and sarcoma center referral"],
    correctIndex: 2,
    explanation: "This is ST-RADS 4. The lipomatous mass has thick septations (3-4 mm, exceeding the 2 mm threshold) and >10% enhancement increase — both features that upgrade a lipomatous lesion from category 2 to category 4, concerning for atypical lipomatous tumor / well-differentiated liposarcoma. The ADC of 1.3 × 10⁻³ is in the intermediate range (1.1-1.5). At ≥5 cm (this is 12 cm), tissue diagnosis or sarcoma center referral is recommended. ALTs demonstrate 100% post-gadolinium enhancement."
  },
  {
    id: 3,
    category: "ST-RADS Categories",
    question: "A 55-year-old man undergoes surveillance MRI 8 months after surgical resection and adjuvant radiation therapy for a high-grade undifferentiated pleomorphic sarcoma of the thigh. The post-operative bed shows expected post-treatment changes with fibrosis and edema. A new 2.8 cm nodular focus is identified at the deep margin of the surgical bed demonstrating T2 hyperintensity, avid enhancement, and restricted diffusion with ADC of 0.9 × 10⁻³ mm²/s. This represents a >20% increase from the baseline post-operative appearance.\n\nWhat is the correct ST-RADS classification?",
    options: ["ST-RADS 6A — No residual tumor", "ST-RADS 6B — Residual tumor, stable", "ST-RADS 6C — Recurrent or progressive disease", "ST-RADS 5 — Highly suspicious for malignancy"],
    correctIndex: 2,
    explanation: "ST-RADS 6C indicates recurrent or progressive soft-tissue tumor, defined as >20% increase in largest dimension since pretreatment imaging, new nodular enhancement, or increased diffusion restriction. This is distinguished from 6A (no residual, expected post-treatment changes only) and 6B (residual tumor ≤20% size change with similar or increased ADC). Category 5 would not apply as the patient has a known prior tumor, placing them in the category 6 pathway."
  },
  {
    id: 4,
    category: "ST-RADS Categories",
    question: "A 48-year-old man presents with a 4 cm intramuscular mass in the deltoid discovered incidentally. MRI shows a well-defined, homogeneously T2 hyperintense lesion with minimal enhancement. ADC measures 2.1 × 10⁻³ mm²/s. There is no perilesional edema, no necrosis, no fascial tail sign.\n\nA colleague suggests this may be an intramuscular myxoma and recommends no further workup. According to ST-RADS principles, what is the most appropriate approach?",
    options: ["ST-RADS 2 with no follow-up — imaging is classic for a benign myxoma", "ST-RADS 3 with short-interval follow-up — probably benign but needs monitoring", "ST-RADS 4 — age >40 modifies the risk for intramuscular myxoid lesions", "ST-RADS 5 — all intramuscular myxoid lesions require biopsy"],
    correctIndex: 2,
    explanation: "In ST-RADS, age is a modifier for intramuscular myxoid lesions. In younger patients, an intramuscular myxoma with classic features would be ST-RADS 3. However, in patients >40 years (this patient is 48), the same appearance raises concern for myxoid liposarcoma or low-grade myxofibrosarcoma, upgrading classification to ST-RADS 4. Despite 'benign' imaging and high ADC, age-dependent risk warrants tissue diagnosis or close surveillance."
  },
  {
    id: 5,
    category: "MRI Protocol",
    question: "A referring clinician sends a patient for MRI of a suspected soft-tissue tumor. The outside facility performs only axial T1-weighted and axial T2-weighted sequences with fat suppression, but does NOT obtain pre-contrast images, DWI, or a T2 sequence without fat suppression. The lesion shows T1 hyperintensity and T2 hyperintensity with fat suppression.\n\nAccording to ST-RADS minimum MRI protocol requirements, what is the most critical limitation?",
    options: ["Lack of DWI prevents ADC quantification for risk stratification", "Absence of pre-contrast fat-suppressed T1 prevents assessment of enhancement", "Missing T2 without fat suppression prevents characterization of fat-containing lesions", "All of the above represent significant protocol limitations"],
    correctIndex: 3,
    explanation: "The minimum ST-RADS MRI protocol requires: (1) Axial T1W, (2) Axial fluid-sensitive T2W/STIR, (3) Axial pre- AND post-contrast fat-suppressed T1W, (4) DWI with b-values 50, 400, 800, and (5) at least one T2W without fat suppression. This study should be classified ST-RADS 0 (incomplete) with recall for complete imaging."
  },
  {
    id: 6,
    category: "ST-RADS Categories",
    question: "A 30-year-old woman undergoes MRI for wrist pain. Imaging reveals a 1.5 cm well-defined cystic lesion adjacent to the scapholunate ligament. The lesion is homogeneously T2 hyperintense, T1 hypointense, with a thin imperceptible wall. There is no internal enhancement, no solid component, and no restricted diffusion.\n\nWhat is the most appropriate ST-RADS classification?",
    options: ["ST-RADS 1 — No soft-tissue lesion identified", "ST-RADS 2 — Definitely benign", "ST-RADS 3 — Probably benign", "ST-RADS 0 — Incomplete imaging"],
    correctIndex: 1,
    explanation: "This is a classic ganglion cyst — a well-defined, homogeneous cystic lesion with no solid component or enhancement at a typical juxta-articular location. Ganglion cysts are ST-RADS 2 (definitely benign) with virtually zero malignancy risk. No follow-up imaging is needed."
  },
  {
    id: 7,
    category: "ST-RADS Categories",
    question: "A 65-year-old man undergoes MRI of the shoulder for rotator cuff evaluation. No discrete soft-tissue mass is identified. There is asymmetric fatty prominence in the deltoid muscle compared to the contralateral side, but no focal lesion, no enhancement abnormality, and normal DWI.\n\nWhat is the appropriate ST-RADS classification?",
    options: ["ST-RADS 0 — Incomplete imaging", "ST-RADS 1 — No soft-tissue lesion identified", "ST-RADS 2 — Definitely benign", "ST-RADS 3 — Probably benign"],
    correctIndex: 1,
    explanation: "ST-RADS 1 is assigned when no soft-tissue lesion is identified on MRI. Asymmetric fatty prominence or muscle atrophy can mimic a lesion but does not represent a true soft-tissue tumor. No further imaging follow-up is recommended for category 1."
  },
  {
    id: 8,
    category: "Lipomatous Tumors",
    question: "A 42-year-old man presents with a 5 cm painless mass in the posterior neck. MRI demonstrates a well-circumscribed subcutaneous lesion that is T1 hyperintense (brighter than subcutaneous fat) and shows marked signal dropout on fat-suppressed sequences. The lesion is uniformly T2 hyperintense with fat suppression. There is no restricted diffusion. Post-contrast imaging reveals diffuse, homogeneous enhancement throughout the lesion.\n\nWhich lipomatous lesion is MOST consistent with these findings?",
    options: ["Simple lipoma", "Atypical lipomatous tumor", "Hibernoma", "Myxoid liposarcoma"],
    correctIndex: 2,
    explanation: "Hibernoma (brown fat tumor) characteristically demonstrates T1 signal brighter than normal subcutaneous fat (due to brown fat composition), signal dropout on fat suppression, and diffuse homogeneous enhancement. Unlike simple lipomas which show <10% enhancement increase, hibernomas enhance avidly throughout. This is ST-RADS 3 (probably benign). The posterior neck/interscapular region is a classic location."
  },
  {
    id: 9,
    category: "Lipomatous Tumors",
    question: "A 22-year-old man presents with a painless, slowly growing mass in the posterior thigh. MRI shows a 7 cm well-defined, multilobulated mass that is markedly T2 hyperintense — appearing almost as bright as fluid. Internal septations are present (86% of these tumors show septations) with 93% demonstrating gadolinium enhancement. Areas appear 'cystic' on T2 but enhance on post-contrast sequences.\n\nWhich diagnosis should be the PRIMARY concern?",
    options: ["Intramuscular myxoma", "Ganglion cyst", "Myxoid liposarcoma", "Schwannoma"],
    correctIndex: 2,
    explanation: "Myxoid liposarcoma shows marked T2 hyperintensity mimicking fluid (myxoid matrix), internal septations (86%), near-universal gadolinium enhancement (93%), and 'cystic'-appearing areas that actually enhance. The deep intramuscular location in a young adult's thigh is classic. This is a common pitfall — the cystic appearance on T2 can lead to misdiagnosis as a benign cystic lesion. ST-RADS 5 classification with tissue diagnosis is warranted."
  },
  {
    id: 10,
    category: "Lipomatous Tumors",
    question: "A 70-year-old woman has a 15 cm retroperitoneal mass discovered on CT. MRI shows a predominantly fatty mass with multiple thick enhancing septations (4-5 mm), nodular non-adipose components demonstrating restricted diffusion (ADC 1.0 × 10⁻³ mm²/s), and areas of non-lipomatous tissue comprising approximately 25% of the tumor volume. Fat-suppressed images confirm the fatty nature of the dominant component.\n\nWhich feature BEST distinguishes this from a simple lipoma?",
    options: ["Size >10 cm", "Thick septations ≥2 mm with enhancement", "Retroperitoneal location", "Patient age >60"],
    correctIndex: 1,
    explanation: "While large size, retroperitoneal location, and older age are concerning, the imaging feature that BEST distinguishes ALT/WDL from lipoma is thick septations ≥2 mm with enhancement. Thin septations <2 mm have 100% specificity for benign lipoma. The >10% enhancement increase and nodular non-adipose components further support the diagnosis of ALT/WDL. Size alone does not reliably differentiate — lipomas up to 10 cm can be ST-RADS 2 if imaging features are classic."
  },
  {
    id: 11,
    category: "Lipomatous Tumors",
    question: "A 55-year-old man presents with a 9 cm deep thigh mass. MRI demonstrates a fatty lesion with thin septations (<2 mm), homogeneous fat signal on all sequences, and <10% enhancement increase. ADC is 1.7 × 10⁻³ mm²/s. However, there is a single 1.2 cm nodular non-adipose focus within the mass that shows intermediate T2 signal and mild enhancement.\n\nHow does the non-adipose nodule affect ST-RADS classification?",
    options: ["Remains ST-RADS 2 — the dominant lipoma features override a single small nodule", "Upgrades to ST-RADS 3 — probably benign with monitoring", "Upgrades to ST-RADS 4 — the non-adipose nodular component is suspicious for ALT/WDL", "Upgrades to ST-RADS 5 — any non-adipose component requires urgent biopsy"],
    correctIndex: 2,
    explanation: "The presence of a nodular non-adipose component within an otherwise classic-appearing lipoma upgrades the lesion to ST-RADS 4. While the dominant features suggest lipoma, non-adipose nodular tissue raises concern for dedifferentiated areas within an ALT/WDL. This is a key teaching point: ALTs demonstrate 100% post-gadolinium enhancement and non-adipose nodular components are the hallmark of dedifferentiation risk."
  },
  {
    id: 12,
    category: "ST-RADS Categories",
    question: "A 25-year-old woman presents with a palpable mass in the forearm. MRI shows a 3 cm well-circumscribed lesion with serpiginous vascular channels demonstrating flow voids on T2-weighted images. The lesion has areas of high T2 signal interspersed with low-signal phleboliths. Post-contrast images show avid enhancement of the vascular components. No restricted diffusion is present.\n\nWhat ST-RADS category is most appropriate?",
    options: ["ST-RADS 2 — Definitely benign", "ST-RADS 3 — Probably benign", "ST-RADS 4 — Suspicious", "ST-RADS 5 — Highly suspicious for malignancy"],
    correctIndex: 0,
    explanation: "This is a classic venous malformation (formerly cavernous hemangioma) with pathognomonic features: serpiginous vascular channels, phleboliths, and avid enhancement without restricted diffusion. Vascular malformations with classic imaging features are ST-RADS 2 (definitely benign). Phleboliths are essentially pathognomonic for venous malformations."
  },
  {
    id: 13,
    category: "ST-RADS Categories",
    question: "A 35-year-old man is seen for a painless mass in the popliteal fossa. MRI reveals a 2 cm well-defined cystic lesion communicating with the posterior joint capsule. The lesion is T2 hyperintense with a thin wall, no solid component, no internal enhancement, and no restricted diffusion. The fluid signal is identical to joint fluid.\n\nWhat is the most likely diagnosis and ST-RADS classification?",
    options: ["Baker's cyst — ST-RADS 1", "Baker's cyst — ST-RADS 2", "Synovial sarcoma — ST-RADS 4", "Myxoid liposarcoma — ST-RADS 5"],
    correctIndex: 1,
    explanation: "This is a Baker's cyst (popliteal synovial cyst) — a classic ST-RADS 2 lesion. The communication with the joint capsule, uniform fluid signal, thin wall without solid components, and lack of enhancement or restricted diffusion are diagnostic. Note: ST-RADS 1 means no lesion was identified; since there IS a cystic structure, category 2 is correct."
  },
  {
    id: 14,
    category: "ST-RADS Categories",
    question: "A 40-year-old woman undergoes MRI for a 2.5 cm painful lump in the lateral thigh after a fall 4 weeks ago. The lesion demonstrates heterogeneous T1 and T2 signal with a peripheral rim of T1 hyperintensity (methemoglobin). There is surrounding edema but no solid enhancing component. No restricted diffusion is identified in the mass itself. Follow-up is recommended.\n\nWhat is the most appropriate ST-RADS classification?",
    options: ["ST-RADS 2 — Definitely benign", "ST-RADS 3 — Probably benign with follow-up", "ST-RADS 4 — Suspicious", "ST-RADS 5 — Cannot exclude malignancy in hemorrhagic lesion"],
    correctIndex: 1,
    explanation: "This presentation is classic for a resolving hematoma — heterogeneous T1/T2 signal with peripheral methemoglobin (T1 bright rim), surrounding edema, no solid enhancing component, and a history of trauma. Hematomas are ST-RADS 3 (probably benign). Follow-up at 6 weeks to 3 months is recommended to confirm resolution, as hemorrhagic malignancies can mimic hematomas."
  },
  {
    id: 15,
    category: "Lipomatous Tumors",
    question: "A 60-year-old man with a known 8 cm thigh lipoma (previously documented as ST-RADS 2) returns for follow-up MRI after 2 years. The mass has increased to 11 cm. The previously thin septations now measure 3 mm, and new areas of non-adipose tissue are seen with enhancement. ADC in the new non-adipose component is 1.2 × 10⁻³ mm²/s.\n\nWhat is the most concerning change and appropriate action?",
    options: ["Size increase alone — repeat imaging in 6 months", "Development of thick septations with enhancement — reclassify to ST-RADS 4, biopsy recommended", "ADC in intermediate range — classify as ST-RADS 3", "All changes are expected lipoma evolution — maintain ST-RADS 2"],
    correctIndex: 1,
    explanation: "The development of thick septations (≥2 mm) with enhancement in a previously simple-appearing lipoma is the most concerning change, suggesting transformation or initial under-classification. This requires reclassification from ST-RADS 2 to ST-RADS 4 (suspicious for ALT/WDL). Given the lesion is now >5 cm with new suspicious features, tissue diagnosis is recommended."
  },
  {
    id: 16,
    category: "ST-RADS Categories",
    question: "A 50-year-old woman undergoes post-treatment surveillance MRI 6 months after wide excision of a myxofibrosarcoma. The surgical bed shows expected post-operative changes including seroma, fibrosis, and mild enhancement along the surgical tract. No discrete nodular mass is identified. DWI shows no focal restricted diffusion. The largest dimension of the post-operative changes is unchanged from the 3-month follow-up.\n\nWhat is the appropriate ST-RADS category?",
    options: ["ST-RADS 1 — No lesion identified", "ST-RADS 6A — No residual tumor", "ST-RADS 6B — Residual tumor present", "ST-RADS 6C — Recurrent disease"],
    correctIndex: 1,
    explanation: "ST-RADS 6A is assigned when there is no residual tumor or tumor-like lesion after treatment. Expected post-treatment changes (seroma, fibrosis, mild surgical tract enhancement) without discrete nodular mass or focal restricted diffusion are consistent with 6A. Category 1 would not apply because the patient is in the post-treatment surveillance pathway (category 6)."
  },
  {
    id: 17,
    category: "ST-RADS Categories",
    question: "A 62-year-old man is 1 year post-resection of a high-grade liposarcoma. Surveillance MRI shows a 2 cm enhancing focus at the surgical margin. Compared to the 6-month post-op scan, this focus has increased by 15% in maximum dimension. ADC has decreased slightly from 1.3 to 1.15 × 10⁻³ mm²/s. No distant metastatic disease is identified.\n\nWhat is the appropriate ST-RADS classification?",
    options: ["ST-RADS 6A — Expected post-treatment changes", "ST-RADS 6B — Residual tumor, stable or slowly growing", "ST-RADS 6C — Recurrent or progressive disease", "Cannot classify — need comparison to pretreatment baseline"],
    correctIndex: 1,
    explanation: "ST-RADS 6B is assigned for residual tumor with ≤20% increase in largest dimension and similar or slightly changed ADC. This enhancing focus shows 15% increase (below the 20% threshold for 6C) with a mild ADC decrease but still above 1.1 × 10⁻³. ST-RADS 6C requires >20% size increase, significant ADC decrease, or metastatic disease. Close continued surveillance is indicated."
  },
  {
    id: 18,
    category: "ST-RADS Categories",
    question: "A 38-year-old woman presents with a soft, compressible mass in the medial calf. MRI reveals a 4 cm lesion composed of macroscopic fat lobules separated by thin fibrous septations, with interspersed vascular channels. The mass is T1 hyperintense (fat signal), becomes heterogeneous on fat suppression due to vascular components, and shows moderate enhancement of the vascular elements. No restricted diffusion.\n\nWhat is the most likely diagnosis and ST-RADS classification?",
    options: ["Simple lipoma — ST-RADS 2", "Angiolipoma — ST-RADS 3", "Atypical lipomatous tumor — ST-RADS 4", "Liposarcoma — ST-RADS 5"],
    correctIndex: 1,
    explanation: "This is an angiolipoma — a benign lipomatous tumor with admixed vascular components. The fat lobules with interspersed vascular channels showing enhancement is characteristic. Unlike simple lipomas, the vascular component may cause pain (especially in superficial angiolipomas). Angiolipomas are ST-RADS 3 (probably benign) due to the vascular component making them slightly more complex than a simple lipoma, warranting short-interval follow-up."
  },
  {
    id: 19,
    category: "Lipomatous Tumors",
    question: "A 45-year-old woman undergoes MRI for a 6 cm deep thigh mass. Imaging shows a predominantly fatty lesion. On subtraction images (post-contrast minus pre-contrast), the septations within the mass demonstrate a 12% increase in signal intensity. The septations measure 2.5 mm thick.\n\nWhich specific imaging finding most reliably differentiates this from a simple lipoma?",
    options: ["The 12% enhancement increase on subtraction imaging", "The 2.5 mm septation thickness", "The 6 cm size", "The deep location"],
    correctIndex: 1,
    explanation: "Septation thickness ≥2 mm is the most reliable differentiator. Thin septations <2 mm have 100% specificity for benign lipoma. At 2.5 mm, these are thick septations raising concern for ALT/WDL. While >10% enhancement also raises concern, the septation thickness threshold is more specific. Size and location are less reliable discriminators on their own."
  },
  {
    id: 20,
    category: "ST-RADS Categories",
    question: "A 28-year-old man presents with knee pain and swelling. MRI demonstrates a 2 cm well-defined intra-articular nodule arising from the synovium of the anterior knee joint. The nodule is predominantly T2 hypointense with areas of blooming artifact on GRE sequences. Post-contrast imaging shows moderate enhancement. There is a small joint effusion.\n\nWhat is the most likely diagnosis?",
    options: ["Synovial chondromatosis", "Localized tenosynovial giant cell tumor (TGCT)", "Intra-articular lipoma arborescens", "Synovial sarcoma"],
    correctIndex: 1,
    explanation: "Localized TGCT (formerly localized PVNS) presents as a well-defined intra-articular nodule with T2 hypointensity from hemosiderin deposition and blooming on GRE — the hallmark features. Localized type shows circumscribed morphology (100%), single nodule (82%), and peripheral hypointense rim (86%). This is ST-RADS 3 with low ADC (mean 0.9 × 10⁻³) due to hemosiderin, not malignancy."
  },
  {
    id: 21,
    category: "MRI Protocol",
    question: "A radiologist reviews an outside MRI of a soft-tissue mass. The study includes axial T1, axial T2 with fat suppression, and post-contrast T1 with fat suppression. DWI was performed with only b-values of 0 and 1000 s/mm². No pre-contrast fat-suppressed T1 and no T2 without fat suppression were obtained.\n\nWhich DWI-related issue is MOST problematic for ST-RADS classification?",
    options: ["Only two b-values were used instead of the recommended three (50, 400, 800)", "The b=0 includes T2 shine-through that may overestimate diffusion restriction", "DWI is not necessary if contrast-enhanced images are obtained", "The b=1000 value is too high and creates susceptibility artifact"],
    correctIndex: 0,
    explanation: "ST-RADS recommends DWI with b-values of 50, 400, and 800 s/mm². Using only b=0 and b=1000 provides suboptimal ADC quantification. The b=50 eliminates perfusion effects, b=400 is intermediate, and b=800 provides diffusion weighting without excessive susceptibility. Additionally, the missing pre-contrast fat-suppressed T1W prevents reliable subtraction analysis of enhancement."
  },
  {
    id: 22,
    category: "ST-RADS Categories",
    question: "A 72-year-old man presents with a rapidly enlarging 8 cm mass in the anterior thigh. MRI demonstrates a heterogeneous mass with areas of necrosis centrally, marked perilesional edema extending into adjacent compartments, and a fascial tail of T2 signal extending 4 cm beyond the visible tumor margin. Post-contrast images show heterogeneous enhancement with non-enhancing necrotic foci. ADC measures 0.85 × 10⁻³ mm²/s.\n\nWhich combination of findings is MOST concerning for high-grade sarcoma?",
    options: ["Heterogeneous enhancement and large size alone", "Perilesional edema, fascial tail sign, and ADC <1.1 × 10⁻³", "Central necrosis and rapid growth alone", "Patient age and deep location"],
    correctIndex: 1,
    explanation: "The combination of perilesional edema (extending into adjacent compartments), fascial tail sign (T2 signal beyond tumor margins), and ADC <1.1 × 10⁻³ mm²/s represents the most concerning constellation for high-grade sarcoma. This is ST-RADS 5. While necrosis, rapid growth, and large size are supportive, the specific combination of edema + tail sign + restricted diffusion is the most specific predictor of malignancy in the ST-RADS framework."
  },
  {
    id: 23,
    category: "Lipomatous Tumors",
    question: "A 35-year-old woman presents with a 3 cm painful subcutaneous mass in the forearm. MRI shows a predominantly fatty lesion with small areas of T2 hyperintensity on fat-suppressed sequences representing vascular channels. The mass is encapsulated with thin septations. She reports the mass is tender to palpation and occasionally throbs.\n\nWhat clinical feature helps distinguish this from a simple lipoma?",
    options: ["Pain is never associated with lipomas", "Pain with superficial fatty tumors containing vascular elements suggests angiolipoma", "The small size excludes lipoma", "Subcutaneous location is atypical for lipomas"],
    correctIndex: 1,
    explanation: "Angiolipomas characteristically cause pain, especially in superficial locations, due to their vascular component. Simple lipomas are typically painless. The combination of a fatty mass with admixed vascular channels in a painful subcutaneous lesion is classic for angiolipoma. This is ST-RADS 3 (probably benign). Size is not the discriminator — small lipomas are common, and subcutaneous location is actually the most common lipoma site."
  },
  {
    id: 24,
    category: "ST-RADS Categories",
    question: "A 52-year-old woman presents with a palpable forearm mass. MRI shows a 2.5 cm well-defined subcutaneous lesion. On pre-contrast fat-suppressed T1W images, the lesion is uniformly hyperintense. On T2W images, it is intermediate signal. Post-contrast fat-suppressed T1W images show the lesion remains uniformly hyperintense — identical to the pre-contrast appearance.\n\nWhat is the significance of the pre-contrast T1 hyperintensity on fat-suppressed images?",
    options: ["It indicates protein-rich fluid content — likely a complicated cyst", "It represents intrinsic T1 shortening (e.g., melanin, blood products) — NOT enhancement", "It confirms avid gadolinium enhancement — suspicious for malignancy", "It suggests fat content inadequately suppressed — repeat with STIR"],
    correctIndex: 1,
    explanation: "This is a critical teaching point for ST-RADS: pre-contrast fat-suppressed T1 hyperintensity indicates intrinsic T1 shortening from substances like melanin, methemoglobin, or proteinaceous content — NOT enhancement. Without pre-contrast fat-suppressed T1W images, this could be mistaken for avid enhancement. This is precisely why the ST-RADS protocol requires BOTH pre- and post-contrast fat-suppressed T1W sequences. The differential includes melanoma metastasis, hemorrhagic lesion, or proteinaceous cyst."
  },
  {
    id: 25,
    category: "ST-RADS Categories",
    question: "A 44-year-old man presents with bilateral symmetric fatty masses in the neck, axillae, and upper trunk. MRI confirms multiple encapsulated lipomatous masses (largest 6 cm) with homogeneous fat signal, thin septations, no enhancement beyond 10%, and ADC >1.5 × 10⁻³ mm²/s. He has a history of chronic alcohol use.\n\nWhat is the most likely diagnosis and how should these be classified?",
    options: ["Multiple lipomas — each classified individually as ST-RADS 2", "Madelung disease (benign symmetric lipomatosis) — ST-RADS 2", "Multiple ALTs requiring tissue diagnosis — ST-RADS 4", "Liposarcomatosis — ST-RADS 5"],
    correctIndex: 1,
    explanation: "Madelung disease (benign symmetric lipomatosis) presents with bilateral symmetric fatty deposits, classically in the neck and upper trunk, associated with chronic alcohol use. Despite the dramatic clinical appearance, each deposit shows classic benign lipoma features (homogeneous fat signal, thin septations, <10% enhancement, high ADC) and is classified as ST-RADS 2. The bilateral symmetric distribution and clinical history clinch the diagnosis."
  },
  {
    id: 26,
    category: "ST-RADS Categories",
    question: "A 33-year-old woman presents with a 1.8 cm mass near the wrist. MRI shows a well-defined multiloculated cystic lesion with thin walls, uniform T2 hyperintensity, T1 hypointensity, and no solid components or enhancement. The lesion is located adjacent to the extensor tendon sheath.\n\nThis is classified as ST-RADS 2. Which additional imaging finding would upgrade this to ST-RADS 4?",
    options: ["Mild wall thickening up to 2 mm", "A solid enhancing mural nodule within the cyst", "Size increase to 3 cm on follow-up", "Mild surrounding edema from cyst rupture"],
    correctIndex: 1,
    explanation: "A solid enhancing mural nodule within an otherwise cystic lesion would be the most concerning finding, upgrading from ST-RADS 2 to ST-RADS 4. A solid nodule raises concern for a cystic sarcoma (e.g., synovial sarcoma can appear predominantly cystic). Mild wall thickening, modest size increase, or reactive edema from rupture do not necessarily change classification from a ganglion cyst."
  },
  {
    id: 27,
    category: "Lipomatous Tumors",
    question: "A 50-year-old man presents with a 14 cm deep thigh mass. MRI shows a heterogeneous lesion with a dominant fatty component and a discrete 5 cm non-lipomatous nodular region. The non-lipomatous component demonstrates T2 hyperintensity, avid enhancement, and restricted diffusion (ADC 0.8 × 10⁻³ mm²/s). The fatty component follows simple fat signal.\n\nWhat is the most likely diagnosis?",
    options: ["Large simple lipoma with focal fat necrosis", "Well-differentiated liposarcoma with dedifferentiation", "Myxoid liposarcoma", "Intramuscular hemangioma"],
    correctIndex: 1,
    explanation: "A fatty mass with a discrete non-lipomatous nodular component showing restricted diffusion (ADC 0.8 × 10⁻³) and avid enhancement is classic for dedifferentiated liposarcoma — a WDL/ALT with a non-lipomatous high-grade component. This is critical to recognize because dedifferentiation dramatically changes prognosis and management. This is ST-RADS 5 requiring urgent tissue diagnosis. Biopsy should target the non-lipomatous component."
  },
  {
    id: 28,
    category: "ST-RADS Categories",
    question: "A 40-year-old woman presents with a slowly growing mass in the thigh. MRI shows a 6 cm well-defined intramuscular lesion with heterogeneous T1 and T2 signal. The lesion contains a mixture of fat and fluid-fluid levels with areas of T1 hyperintensity suggesting blood products. Post-contrast images show no solid enhancing component. The patient reports no history of trauma.\n\nWhat is the most appropriate ST-RADS category and next step?",
    options: ["ST-RADS 2 — Chronic hematoma, no follow-up", "ST-RADS 3 — Likely hematoma but follow-up in 6-8 weeks to confirm resolution", "ST-RADS 4 — Hemorrhagic mass without trauma history is suspicious", "ST-RADS 5 — All hemorrhagic masses without trauma require biopsy"],
    correctIndex: 1,
    explanation: "Without a clear history of trauma, a hemorrhagic-appearing intramuscular mass should be classified as ST-RADS 3 with short-interval follow-up (6-8 weeks). While the appearance suggests hematoma (fluid-fluid levels, blood products, no solid enhancement), the absence of trauma history means hemorrhagic sarcoma cannot be entirely excluded. Follow-up to confirm resolution is critical — failure to resolve or development of solid components upgrades classification."
  },
  {
    id: 29,
    category: "MRI Protocol",
    question: "A technologist asks which single additional sequence would provide the most diagnostic value when added to a basic MRI protocol (axial T1W, axial T2W FS, axial post-contrast T1W FS) for a suspected soft-tissue mass.\n\nAccording to ST-RADS protocol recommendations, which sequence should be prioritized?",
    options: ["Coronal T2-weighted for longitudinal extent", "DWI with b-values 50, 400, 800 for ADC mapping", "Gradient echo for susceptibility", "Pre-contrast fat-suppressed T1W for subtraction analysis"],
    correctIndex: 3,
    explanation: "The pre-contrast fat-suppressed T1W sequence is the most critical missing element. Without it, you cannot perform subtraction analysis (post minus pre) to accurately assess enhancement — making it impossible to distinguish intrinsic T1 shortening from true enhancement. While DWI is also essential for ADC quantification, the pre-contrast T1 FS enables the entire enhancement assessment framework that ST-RADS relies upon."
  },
  {
    id: 30,
    category: "ST-RADS Categories",
    question: "A 56-year-old man presents with a 3 cm subcutaneous mass in the posterior calf. MRI reveals a well-defined lesion that is T1 intermediate, markedly T2 hyperintense, with avid homogeneous enhancement. ADC measures 1.6 × 10⁻³ mm²/s. The mass appears to arise from a small cutaneous nerve. No perilesional edema. No restricted diffusion.\n\nWhat is the most likely diagnosis and ST-RADS category?",
    options: ["Malignant peripheral nerve sheath tumor — ST-RADS 5", "Schwannoma — ST-RADS 2", "Neurofibroma — ST-RADS 3", "Desmoid tumor — ST-RADS 4"],
    correctIndex: 1,
    explanation: "A well-defined nerve-associated mass with high ADC (>1.5 × 10⁻³), no perilesional edema, no restricted diffusion, and homogeneous enhancement is consistent with a benign schwannoma — ST-RADS 2. Even without the classic target sign, the combination of well-defined margins, nerve association, and ADC >1.5 strongly supports benign PNST. Malignant PNSTs characteristically show ADC <1.1, ill-defined margins, and perilesional edema."
  },
  {
    id: 31,
    category: "ST-RADS Categories",
    question: "A 60-year-old man with a history of neurofibromatosis type 1 has multiple known neurofibromas throughout both lower extremities. Annual surveillance MRI shows that one previously stable 3.5 cm neurofibroma in the right thigh has increased to 5.2 cm over 12 months. The lesion now shows heterogeneous T2 signal (previously homogeneous), new perilesional edema, and the ADC has decreased from 1.4 to 0.95 × 10⁻³ mm²/s.\n\nWhat is the most appropriate next step?",
    options: ["Continue annual surveillance — growth alone is common in NF1", "Short-interval 3-month follow-up MRI", "FDG-PET/CT and urgent tissue diagnosis for suspected malignant transformation", "Reclassify as ST-RADS 3 and monitor"],
    correctIndex: 2,
    explanation: "In NF1, rapid growth of a previously stable neurofibroma combined with new heterogeneous T2 signal, perilesional edema, and ADC decrease below 1.1 × 10⁻³ mm²/s (from 1.4 to 0.95) is highly concerning for malignant PNST transformation. This warrants ST-RADS 5 classification with FDG-PET/CT (elevated SUV further supports malignancy) and urgent tissue diagnosis. The 8-13% lifetime risk of MPNST in NF1 patients makes this scenario clinically critical."
  },
  {
    id: 32,
    category: "Lipomatous Tumors",
    question: "A 48-year-old woman presents with a 4 cm subcutaneous thigh mass. MRI demonstrates a lipomatous lesion with a single thin (<1 mm) septation, homogeneous fat signal, <5% enhancement on subtraction, and ADC of 1.9 × 10⁻³ mm²/s. The lesion is well-encapsulated.\n\nWhat is the probability of malignancy?",
    options: ["Approximately 10% — requires follow-up", "Approximately 5% — probably benign", "Nearly zero — definitely benign (ST-RADS 2)", "Cannot determine without biopsy"],
    correctIndex: 2,
    explanation: "A lipomatous lesion with thin septations <2 mm (here <1 mm), homogeneous fat signal, <10% enhancement, high ADC (>1.5 × 10⁻³), and encapsulation has a virtually zero malignancy risk. Thin septations <2 mm carry 100% specificity for benign lipoma. Homogeneous fat signal has 89% sensitivity for benign diagnosis. This is ST-RADS 2 (definitely benign) with no follow-up needed."
  },
  {
    id: 33,
    category: "ST-RADS Categories",
    question: "A 29-year-old woman presents with a 3 cm soft mass in the subcutaneous tissue of the upper arm. MRI shows a well-defined lesion that is T1 hyperintense, T2 hyperintense, and does NOT suppress on STIR or chemical fat suppression sequences. The lesion is homogeneous with no septations. Enhancement shows a 4% increase on subtraction.\n\nThis lesion fails to suppress fat signal. What is the most important consideration?",
    options: ["Failed fat suppression — this is ST-RADS 0, needs repeat imaging", "This may be a non-lipomatous lesion with intrinsic T1 shortening, not fat", "Homogeneous T1 bright lesions that don't suppress are always lipomas — artifact is common", "The lesion contains brown fat which resists standard fat suppression"],
    correctIndex: 0,
    explanation: "If the lesion is T1 hyperintense but does NOT suppress on fat suppression, the first consideration must be whether fat suppression was technically adequate. If fat suppression failed globally (check adjacent subcutaneous fat), the study is technically limited and should be classified ST-RADS 0 with recall for repeat imaging. If fat suppression is adequate elsewhere but the lesion doesn't suppress, it may contain melanin, blood products, or proteinaceous material rather than fat — changing the differential entirely."
  },
  {
    id: 34,
    category: "ST-RADS Categories",
    question: "A 37-year-old woman presents with a painful 2 cm mass in the finger pad. MRI shows a well-defined, markedly T2 hyperintense lesion in the subungual region with avid homogeneous enhancement. The lesion is T1 hypointense to intermediate. ADC is 1.3 × 10⁻³ mm²/s.\n\nGiven the location and MRI features, what is the most likely diagnosis?",
    options: ["Epidermoid inclusion cyst", "Giant cell tumor of tendon sheath", "Glomus tumor", "Digital fibroma"],
    correctIndex: 2,
    explanation: "Glomus tumors are characteristically subungual in the upper extremity, presenting with pain. MRI shows T2 hyperintensity (86-100%), well-defined margins (100%), and avid solid enhancement in all cases. MRI has 90% sensitivity and 97% positive predictive value for glomus tumors. The classic clinical triad is localized pain, cold sensitivity, and point tenderness. ST-RADS 2-3 classification."
  },
];