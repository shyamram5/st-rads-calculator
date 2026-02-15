// Questions 35-67: Nerve Sheath Tumors, Fibroblastic, Vascular Tumors, TGCT

export const QUESTIONS_BANK_2 = [
  {
    id: 35,
    category: "Nerve Sheath Tumors",
    question: "A 38-year-old man with neurofibromatosis type 1 presents with new pain and rapid growth of a pre-existing left sciatic nerve mass. MRI demonstrates a 6.2 cm fusiform mass with ill-defined margins. The lesion is heterogeneously T2 hyperintense with loss of the previously seen target sign. Marked perilesional edema extends into adjacent muscle compartments. DWI reveals restricted diffusion with a mean ADC of 0.85 × 10⁻³ mm²/s.\n\nWhich finding is the MOST specific indicator of malignant transformation?",
    options: ["Loss of the target sign", "Perilesional edema (60% sensitivity, 94% specificity)", "ADC <1.1 × 10⁻³ mm²/s (93% sensitivity, 95% specificity)", "Ill-defined margins"],
    correctIndex: 2,
    explanation: "ADC restriction <1.1 × 10⁻³ mm²/s is the most accurate single discriminator with 93% sensitivity and 95% specificity for malignant PNST (Wilson 2021). Perilesional edema has high specificity (90-94%) but lower sensitivity (60%). Loss of target sign and ill-defined margins are supportive but less quantitative. This patient's ADC of 0.85 is well below the malignancy threshold — ST-RADS 5 with urgent sarcoma center referral."
  },
  {
    id: 36,
    category: "Nerve Sheath Tumors",
    question: "A 32-year-old woman presents with a 3 cm fusiform mass along the ulnar nerve at the elbow. MRI demonstrates a well-circumscribed lesion with a classic 'target sign' — central low T2 signal surrounded by peripheral high T2 signal. The entering and exiting nerve is clearly identified (split fat sign positive). No perilesional edema. ADC measures 1.4 × 10⁻³ mm²/s.\n\nWhat ST-RADS category is MOST appropriate?",
    options: ["ST-RADS 2 — Target sign is characteristic of benign PNST", "ST-RADS 3 — Nerve sheath tumors carry inherent risk", "ST-RADS 4 — Any nerve sheath tumor should be suspicious", "ST-RADS 5 — ADC <1.5 suggests possible malignancy"],
    correctIndex: 0,
    explanation: "ST-RADS 2 (definitely benign). The target sign — central T2 hypointensity (fibrosis) with peripheral hyperintensity (myxoid tissue) — is characteristic of benign PNSTs (schwannomas, neurofibromas). Combined with well-defined margins (84% of benign PNSTs), no perilesional edema, ADC >1.1, and split fat sign, this is classic for a benign lesion. The target sign essentially excludes malignant PNST."
  },
  {
    id: 37,
    category: "Nerve Sheath Tumors",
    question: "A 45-year-old man presents with a 4.5 cm mass along the tibial nerve. MRI shows a fusiform lesion with mildly heterogeneous T2 signal but NO target sign. The margins are mostly well-defined but slightly irregular in one region. There is subtle perilesional edema laterally. ADC measures 1.15 × 10⁻³ mm²/s (just above the 1.1 threshold). No NF1 history.\n\nHow should this borderline lesion be classified?",
    options: ["ST-RADS 2 — ADC is above 1.1, likely benign", "ST-RADS 3 — Probably benign but warrants monitoring", "ST-RADS 4 — Suspicious features in a nerve sheath tumor warrant biopsy", "ST-RADS 5 — Any PNST without target sign is malignant"],
    correctIndex: 2,
    explanation: "This borderline nerve sheath tumor should be ST-RADS 4. Despite ADC being just above 1.1 × 10⁻³, the combination of absent target sign, mildly irregular margins, subtle perilesional edema, and size >4 cm creates a suspicious profile. In the ST-RADS framework, nerve sheath tumors with perilesional edema (even subtle) and absent classic benign signs warrant tissue diagnosis, especially given the 60% sensitivity/94% specificity of edema for malignancy."
  },
  {
    id: 38,
    category: "Nerve Sheath Tumors",
    question: "A 55-year-old woman with NF1 has two nerve sheath tumors in the same extremity. Tumor A is 3 cm with target sign, well-defined margins, ADC 1.5 × 10⁻³, no edema. Tumor B is 2.5 cm without target sign, well-defined margins, ADC 1.3 × 10⁻³, no edema.\n\nHow should each tumor be classified?",
    options: ["Both ST-RADS 2", "Tumor A: ST-RADS 2, Tumor B: ST-RADS 3", "Both ST-RADS 3 due to NF1 background", "Both ST-RADS 4 — NF1 patients require tissue diagnosis of all tumors"],
    correctIndex: 1,
    explanation: "Each lesion is classified independently. Tumor A with target sign, well-defined margins, and ADC >1.1 is ST-RADS 2 (definitely benign). Tumor B, while lacking concerning features, does not show the target sign and has intermediate ADC — warranting ST-RADS 3 with follow-up. NF1 status alone does not automatically upgrade all lesions; each is assessed on its own imaging features. However, any changes on follow-up should trigger heightened suspicion given NF1 background risk."
  },
  {
    id: 39,
    category: "Nerve Sheath Tumors",
    question: "A 60-year-old man presents with a 7 cm mass in the buttock. MRI shows a large, heterogeneous mass with areas of necrosis, marked perilesional edema, and ADC of 0.7 × 10⁻³ mm²/s. The mass is along the course of the sciatic nerve. On review of prior imaging from 5 years ago, a 2 cm fusiform nerve sheath tumor was noted at the same location.\n\nWhat is the MOST likely diagnosis?",
    options: ["Enlarging benign schwannoma", "Ancient schwannoma with degenerative changes", "Malignant peripheral nerve sheath tumor arising from pre-existing PNST", "De novo high-grade sarcoma adjacent to nerve"],
    correctIndex: 2,
    explanation: "A previously documented small PNST that has grown from 2 to 7 cm with new necrosis, marked perilesional edema, and very low ADC (0.7 × 10⁻³) is classic for malignant transformation. MPNSTs frequently arise from pre-existing benign PNSTs, especially in NF1 patients. The ADC of 0.7 is markedly below the 1.1 threshold (93% sensitivity, 95% specificity). ST-RADS 5 with urgent tissue diagnosis and sarcoma center referral."
  },
  {
    id: 40,
    category: "Nerve Sheath Tumors",
    question: "A 28-year-old woman presents with a 2 cm mass in the forearm. MRI shows a well-defined fusiform lesion along a peripheral nerve with the 'fascicular sign' — multiple small ring-like structures on axial images resembling nerve fascicles. T2 signal is mildly hyperintense. No edema. ADC is 1.6 × 10⁻³ mm²/s.\n\nWhat does the fascicular sign indicate?",
    options: ["High-grade malignancy with pseudocapsule", "Benign neurofibroma with preserved fascicular architecture", "Schwannoma with Antoni A and B patterns", "Malignant PNST with perineural invasion"],
    correctIndex: 1,
    explanation: "The fascicular sign — multiple ring-like structures on axial images representing preserved nerve fascicles within the tumor — is characteristic of neurofibroma. Unlike schwannomas which are eccentric to the nerve, neurofibromas are intimately intermixed with nerve fascicles. Combined with well-defined margins, high ADC (>1.5), and no edema, this is ST-RADS 2. The fascicular sign supports benign PNST and helps distinguish neurofibroma from schwannoma."
  },
  {
    id: 41,
    category: "Fibroblastic Tumors",
    question: "A 62-year-old man presents with a slowly enlarging painless mass in the anterior thigh. MRI shows a 9 cm heterogeneous mass centered in the subcutaneous fat extending along the deep fascia. On T2-weighted images, linear areas of high signal extend along fascial planes beyond the main tumor margins. Multiple satellite nodules are identified along the fascial surface. Mean ADC is 1.0 × 10⁻³ mm²/s.\n\nWhich diagnosis is MOST consistent with these imaging findings?",
    options: ["Undifferentiated pleomorphic sarcoma", "Myxofibrosarcoma", "Desmoid-type fibromatosis", "Elastofibroma dorsi"],
    correctIndex: 1,
    explanation: "The fascial 'tail sign' — perifascial T2 signal extension beyond the main tumor — is the hallmark of myxofibrosarcoma, present in 82% of cases (Kaya 2008). Combined with satellite nodules along fascial planes, heterogeneous enhancement, and low ADC (1.0 × 10⁻³), this is classic. While UPS can show the tail sign (~60%), the subcutaneous/fascial location with prominent tail sign and satellite nodules make myxofibrosarcoma the best answer."
  },
  {
    id: 42,
    category: "Fibroblastic Tumors",
    question: "A 28-year-old woman presents with a 3.5 cm firm, rapidly growing mass in the forearm that appeared 3 weeks ago. MRI shows a well-circumscribed lesion with heterogeneous T2 signal and well-defined borders. The lesion is in subcutaneous tissue adjacent to fascia. Moderate post-contrast enhancement is present.\n\nGiven the rapid onset and MRI characteristics, which diagnosis should be STRONGLY considered?",
    options: ["Synovial sarcoma", "Dermatofibrosarcoma protuberans", "Nodular fasciitis", "Fibrosarcoma"],
    correctIndex: 2,
    explanation: "Nodular fasciitis is a benign, self-limiting reactive process that characteristically presents as a rapidly growing mass in young adults. Key features: 100% show heterogeneous T2/STIR signal (Coyle 2013), 97% well-defined borders, typically <3 cm, subcutaneous/fascial, with rapid growth over weeks. Recognizing this entity prevents unnecessary radical surgery — many resolve spontaneously. ST-RADS 3 with short-interval follow-up to confirm stability or regression."
  },
  {
    id: 43,
    category: "Fibroblastic Tumors",
    question: "A 30-year-old woman presents with a firm, non-tender 5 cm mass in the abdominal wall. She is 6 months postpartum. MRI demonstrates an infiltrative mass that is T1 isointense to muscle and heterogeneously T2 hyperintense. The lesion extends across fascial planes with poorly defined margins. Post-contrast images show moderate heterogeneous enhancement. ADC is 1.2 × 10⁻³ mm²/s.\n\nWhat is the most likely diagnosis?",
    options: ["Rectus sheath hematoma", "Desmoid-type fibromatosis (aggressive fibromatosis)", "Endometriosis of the abdominal wall", "Low-grade fibromyxoid sarcoma"],
    correctIndex: 1,
    explanation: "Desmoid-type fibromatosis (aggressive fibromatosis) classically presents in young women of reproductive age, often postpartum or at sites of prior surgery. Key MRI features: infiltrative margins crossing fascial planes, T1 isointensity, heterogeneous T2 signal, and moderate enhancement. Despite locally aggressive behavior, desmoids are benign (no metastatic potential). This is ST-RADS 3-4 depending on features. The postpartum abdominal wall location is a classic presentation."
  },
  {
    id: 44,
    category: "Fibroblastic Tumors",
    question: "A 65-year-old man presents with a painless mass deep to the scapula bilaterally. MRI shows a lenticular (lens-shaped) mass between the serratus anterior and chest wall with alternating bands of T1 and T2 signal creating a 'layered' appearance. Minimal enhancement. The contralateral side shows a similar but smaller lesion.\n\nWhat is the most likely diagnosis?",
    options: ["Bilateral desmoid tumors", "Elastofibroma dorsi", "Bilateral lipomas", "Metastatic disease"],
    correctIndex: 1,
    explanation: "Elastofibroma dorsi has a pathognomonic presentation: bilateral (66% of cases), lenticular masses deep to the scapula between serratus anterior and chest wall, with alternating bands of fibrous and fatty tissue creating the 'layered' appearance. Common in older adults (>55). This is ST-RADS 2 — the appearance and location are diagnostic. No biopsy or follow-up is needed."
  },
  {
    id: 45,
    category: "Fibroblastic Tumors",
    question: "A 70-year-old man presents with a 10 cm mass in the thigh. MRI reveals a heterogeneous mass with extensive areas of necrosis, marked perilesional edema, and fascial tail sign present. The non-necrotic portions show marked enhancement and ADC of 0.75 × 10⁻³ mm²/s. The tumor extends across multiple fascial compartments.\n\nThe fascial tail sign raises concern for myxofibrosarcoma. However, which OTHER high-grade sarcoma also commonly demonstrates this sign?",
    options: ["Synovial sarcoma", "Undifferentiated pleomorphic sarcoma (UPS)", "Liposarcoma", "Leiomyosarcoma"],
    correctIndex: 1,
    explanation: "Undifferentiated pleomorphic sarcoma (UPS, formerly MFH) demonstrates the fascial tail sign in approximately 60% of cases, second only to myxofibrosarcoma (82%). The combination of necrosis, marked perilesional edema, fascial extension, and very low ADC (0.75 × 10⁻³) is consistent with either high-grade myxofibrosarcoma or UPS. Both are ST-RADS 5 requiring tissue diagnosis. The fascial tail sign, while most associated with myxofibrosarcoma, is not pathognomonic."
  },
  {
    id: 46,
    category: "Fibroblastic Tumors",
    question: "A 35-year-old man has a known desmoid-type fibromatosis of the mesentery being managed with observation. Follow-up MRI at 12 months shows the mass has decreased from 6 cm to 4 cm. The previously heterogeneous T2 signal is now predominantly T2 hypointense. Enhancement has decreased.\n\nWhat do the T2 signal changes indicate?",
    options: ["Malignant transformation — the mass is becoming more cellular", "Maturation with increasing collagen deposition — favorable response", "Necrosis from spontaneous infarction", "Desiccation artifact from prior biopsy"],
    correctIndex: 1,
    explanation: "In desmoid fibromatosis, progressive T2 hypointensity indicates increasing collagen deposition and maturation — a favorable sign suggesting disease stabilization or regression. Active desmoids tend to be T2 hyperintense (cellular, edematous), while mature/inactive desmoids become T2 hypointense (collagenous). Size decrease and decreasing enhancement further support favorable response. This guides management — observation can continue without intervention."
  },
  {
    id: 47,
    category: "Vascular Tumors",
    question: "A 35-year-old woman presents with a painful 2.5 cm subcutaneous nodule in the calf that worsens with cold exposure. MRI demonstrates a well-circumscribed, homogeneously T2 hyperintense lesion with avid homogeneous enhancement. On T2-weighted images, dark linear strands are seen within the lesion creating an internal reticular pattern. The mass is isointense to muscle on T1. ADC is 1.2 × 10⁻³ mm²/s.\n\nWhich diagnosis is BEST supported?",
    options: ["Glomus tumor", "Angioleiomyoma", "Hemangioma", "Angiosarcoma"],
    correctIndex: 1,
    explanation: "The 'dark reticular sign' on T2W imaging — dark linear strands within a T2 hyperintense mass — is characteristic of angioleiomyoma (56-76% of cases, Koga et al.). The clinical presentation (painful, worsens with cold) is classic due to smooth muscle contraction. While glomus tumors are also painful, they are typically subungual/upper extremity. Hemangiomas show serpiginous channels and phleboliths. ST-RADS 2-3."
  },
  {
    id: 48,
    category: "Vascular Tumors",
    question: "A 50-year-old woman presents with a painless scalp mass. MRI reveals a 4.5 cm heterogeneous mass with areas of intratumoral T2 hypointensity (87% show this) and mixed signal components (71% heterogeneous). Avid but heterogeneous enhancement. Areas suggesting hemorrhage and necrosis. No flow voids.\n\nWhich aggressive vascular neoplasm is MOST consistent?",
    options: ["Kaposi sarcoma", "Angiosarcoma", "Epithelioid hemangioendothelioma", "Alveolar soft part sarcoma"],
    correctIndex: 1,
    explanation: "Angiosarcoma is characterized by intratumoral T2 hypointensity (87%), heterogeneous components (71%), hemorrhage, and necrosis. The scalp is one of the most common locations. Unlike alveolar soft part sarcoma which shows flow voids (78-96%), angiosarcoma may or may not have flow voids but consistently shows T2 hypointensity. This helps distinguish angiosarcoma from squamous cell carcinoma. ST-RADS 5."
  },
  {
    id: 49,
    category: "Vascular Tumors",
    question: "A 15-year-old boy presents with a slowly growing mass in the forearm. MRI shows a 4 cm lobulated intramuscular lesion with serpiginous vascular channels, phleboliths (round T1/T2 hypointense foci), and heterogeneous T2 signal with areas of high and low signal. Post-contrast images show heterogeneous enhancement. No restricted diffusion.\n\nWhat is the most likely diagnosis?",
    options: ["Intramuscular hemangioma (venous malformation)", "Arteriovenous malformation", "Hemangiopericytoma", "Kaposiform hemangioendothelioma"],
    correctIndex: 0,
    explanation: "Intramuscular hemangioma (now classified as venous malformation) shows serpiginous vascular channels, phleboliths (pathognomonic), and heterogeneous T2 signal from variable flow rates and thrombosis. The adolescent age, intramuscular location, and slow growth are classic. Phleboliths are essentially diagnostic for venous malformation — no other soft-tissue tumor reliably shows them. ST-RADS 2 with classic features."
  },
  {
    id: 50,
    category: "Vascular Tumors",
    question: "A 25-year-old woman presents with a 3 cm mass in the hand with a bluish skin discoloration. MRI demonstrates a lobulated subcutaneous lesion with high T2 signal, no flow voids, slow enhancement on dynamic contrast-enhanced sequences, and a characteristic 'bag of worms' morphology. Multiple rounded low-signal foci consistent with phleboliths are present.\n\nWhat is the classification of this vascular lesion?",
    options: ["High-flow arteriovenous malformation", "Low-flow venous malformation", "Lymphatic malformation (macrocystic)", "Infantile hemangioma"],
    correctIndex: 1,
    explanation: "Low-flow venous malformation is characterized by: 'bag of worms' lobulated morphology, high T2 signal, NO flow voids (distinguishing from high-flow AVM), slow enhancement, and phleboliths. The bluish skin discoloration and hand location are classic. This is ST-RADS 2. Arteriovenous malformations would show flow voids from high-flow vessels. Lymphatic malformations typically show fluid-fluid levels without phleboliths."
  },
  {
    id: 51,
    category: "TGCT",
    question: "A 42-year-old woman presents with diffuse swelling and intermittent locking of the knee. MRI reveals a lobulated, infiltrative mass involving the synovium with extension into the suprapatellar recess and popliteal fossa. The mass demonstrates low signal on both T1 and T2 sequences with 'blooming' artifact on GRE. Scattered areas of intermediate T2 signal. Heterogeneous enhancement. ADC is 0.9 × 10⁻³ mm²/s.\n\nWhat is the MOST likely diagnosis?",
    options: ["Synovial sarcoma", "Diffuse-type tenosynovial giant cell tumor (TGCT)", "Synovial chondromatosis", "Rheumatoid pannus"],
    correctIndex: 1,
    explanation: "Diffuse-type TGCT shows: central hypointensity on T1 and T2 from hemosiderin (83%), infiltrative margins (83%), blooming on GRE (pathognomonic for hemosiderin), and universally low ADC (mean 0.9 × 10⁻³). The knee is the most common location. Despite low ADC suggesting malignancy by ST-RADS thresholds, TGCT is a notable exception — benign but locally aggressive. ST-RADS 3."
  },
  {
    id: 52,
    category: "TGCT",
    question: "A 35-year-old man presents with a 2 cm nodule near the second MCP joint. MRI shows a well-circumscribed, solid nodule adjacent to the flexor tendon sheath. The lesion is T1 intermediate and T2 hypointense with a peripheral hypointense rim. There is avid homogeneous enhancement. GRE shows mild blooming. ADC is 0.85 × 10⁻³ mm²/s.\n\nWhat is the diagnosis, and why is the low ADC NOT indicative of malignancy?",
    options: ["Giant cell tumor of tendon sheath (localized TGCT) — low ADC is from hemosiderin, not hypercellularity", "Fibroma of tendon sheath — low ADC indicates dehydrated collagen", "Glomus tumor — low ADC from smooth muscle content", "Tenosynovial chondroma — low ADC from cartilaginous matrix"],
    correctIndex: 0,
    explanation: "Localized TGCT (giant cell tumor of tendon sheath) shows: circumscribed morphology (100%), single nodule (82%), peripheral hypointense rim (86%), low T2 signal, blooming on GRE, and universally low ADC (mean 0.9 × 10⁻³). The low ADC is due to hemosiderin deposition and dense fibrous tissue, NOT malignant hypercellularity. This is a critical ST-RADS teaching point — ADC must be interpreted in clinical context, as TGCT is benign despite meeting the <1.1 malignancy threshold."
  },
  {
    id: 53,
    category: "TGCT",
    question: "A patient with known diffuse-type TGCT of the knee undergoes post-treatment MRI after synovectomy. The imaging shows residual synovial thickening with persistent hemosiderin staining (low T2, blooming on GRE) but no new nodular components. The overall volume has decreased by 40%.\n\nWhat ST-RADS category applies?",
    options: ["ST-RADS 3 — Known TGCT with residual disease", "ST-RADS 6A — No residual tumor", "ST-RADS 6B — Residual tumor with favorable response", "ST-RADS 6C — Progressive disease"],
    correctIndex: 2,
    explanation: "Post-treatment TGCT with residual synovial thickening but decreased volume and no new nodules is ST-RADS 6B — residual tumor present but responding favorably. The persistent hemosiderin staining is expected after synovectomy and does not indicate active disease. 6A would require no residual disease, and 6C would require growth or new nodules. Continued surveillance is appropriate."
  },
  {
    id: 54,
    category: "Vascular Tumors",
    question: "A 5-year-old boy presents with a rapidly growing soft mass in the parotid region. MRI demonstrates a well-defined lobulated mass that is T2 hyperintense with multiple internal flow voids. Dynamic contrast-enhanced MRI shows rapid early enhancement followed by washout. The lesion has been growing since birth but accelerated over the past 2 months.\n\nWhat is the most likely diagnosis?",
    options: ["Infantile hemangioma in proliferative phase", "Venous malformation", "Rhabdomyosarcoma", "Lymphatic malformation"],
    correctIndex: 0,
    explanation: "Infantile hemangioma in the proliferative phase shows: well-defined lobulated mass, T2 hyperintensity, flow voids (high-flow lesion), and rapid early enhancement. The parotid region is a common location. The natural history of rapid growth followed by gradual involution is characteristic. Flow voids distinguish this from low-flow venous malformations. While rhabdomyosarcoma is in the differential for pediatric head/neck masses, the imaging pattern with flow voids and enhancement kinetics favor hemangioma."
  },
  {
    id: 55,
    category: "Fibroblastic Tumors",
    question: "A 40-year-old woman presents with a slowly enlarging, skin-colored plaque on the trunk that has been present for years. MRI shows a superficial, infiltrative lesion extending through the dermis and subcutaneous tissue with a broad, plaque-like morphology. The lesion is T2 mildly hyperintense, T1 isointense, with moderate enhancement. Margins are poorly defined laterally.\n\nWhat is the most likely diagnosis?",
    options: ["Superficial fibromatosis (Dupuytren-like)", "Dermatofibrosarcoma protuberans (DFSP)", "Melanoma", "Superficial myxofibrosarcoma"],
    correctIndex: 1,
    explanation: "Dermatofibrosarcoma protuberans (DFSP) classically presents as a slowly growing, skin-colored plaque with infiltrative margins extending through dermis and subcutaneous tissue. MRI shows a broad-based superficial lesion with moderate enhancement and poorly defined lateral margins. Despite its infiltrative nature, DFSP has very low metastatic potential (<5%). Wide excision with clear margins is the treatment. This is a low-to-intermediate grade tumor — ST-RADS 4."
  },
  {
    id: 56,
    category: "Nerve Sheath Tumors",
    question: "A 50-year-old man presents with a 3.5 cm mass arising from the posterior tibial nerve. MRI demonstrates a well-defined, encapsulated mass that is eccentric to the nerve (the nerve drapes over one side). The lesion shows the 'split fat sign' and is heterogeneously T2 hyperintense with cystic and solid components. No target sign is present. Enhancement is heterogeneous. ADC is 1.35 × 10⁻³ mm²/s. No edema.\n\nWhat is the most likely diagnosis?",
    options: ["Schwannoma (Antoni A and B pattern)", "Neurofibroma", "Malignant PNST", "Perineurioma"],
    correctIndex: 0,
    explanation: "Schwannomas are characteristically eccentric to the nerve (the nerve drapes over the tumor, unlike neurofibromas which are central). The heterogeneous T2 signal with cystic and solid components reflects Antoni A (cellular, solid) and Antoni B (myxoid, cystic) patterns. The split fat sign, well-defined capsule, ADC >1.1, and absent edema all support benign PNST. Absent target sign is acceptable for schwannoma (target sign is more common in neurofibromas). ST-RADS 2-3."
  },
  {
    id: 57,
    category: "Vascular Tumors",
    question: "A 12-year-old girl presents with a painless mass in the neck. MRI shows a large, multiloculated cystic lesion with thin internal septations. The cystic spaces show variable signal — some T1 hypointense/T2 hyperintense (simple fluid), others T1 hyperintense (proteinaceous or hemorrhagic). Fluid-fluid levels are present in several loculations. The septations enhance but the cystic contents do not.\n\nWhat is the most likely diagnosis?",
    options: ["Branchial cleft cyst", "Lymphatic malformation (macrocystic)", "Cystic schwannoma", "Teratoma"],
    correctIndex: 1,
    explanation: "Macrocystic lymphatic malformation (formerly cystic hygroma) shows: multiloculated cystic lesion with thin enhancing septations, variable cyst signal (simple fluid vs. proteinaceous/hemorrhagic), and fluid-fluid levels from prior hemorrhage. The neck in a pediatric patient is the classic location. Septation enhancement with non-enhancing cystic contents distinguishes this from solid neoplasms. ST-RADS 2."
  },
  {
    id: 58,
    category: "Fibroblastic Tumors",
    question: "A 45-year-old construction worker presents with a painless palmar cord causing progressive flexion contracture of the ring and little fingers. MRI of the hand shows low T1 and low T2 signal nodular thickening along the palmar aponeurosis with mild enhancement.\n\nWhat is the diagnosis and MRI significance of the low T2 signal?",
    options: ["Dupuytren disease — low T2 reflects mature fibrous tissue", "Giant cell tumor of tendon sheath — low T2 from hemosiderin", "Palmar fibromatosis with malignant transformation — low T2 from necrosis", "Foreign body granuloma — low T2 from calcium"],
    correctIndex: 0,
    explanation: "Dupuytren disease (palmar fibromatosis) shows nodular thickening along the palmar aponeurosis. Low T2 signal indicates mature, collagen-rich fibrous tissue (similar to desmoid maturation). Active disease may show higher T2 signal. The progressive flexion contracture of ring and little fingers is the classic clinical presentation. ST-RADS 2 — this is a well-recognized benign condition."
  },
  {
    id: 59,
    category: "TGCT",
    question: "A 30-year-old woman presents with an ankle mass. MRI shows a 3 cm mass adjacent to the peroneal tendons. The lesion has mixed signal: predominantly T2 intermediate-to-low with scattered T2 bright foci. GRE sequences show prominent blooming artifact. The lesion extends along the tendon sheath in a semi-circumferential pattern but remains well-defined overall. ADC is 0.92 × 10⁻³ mm²/s.\n\nThis case illustrates which important ST-RADS principle?",
    options: ["All lesions with ADC <1.1 should be classified as ST-RADS 5", "ADC must be interpreted in clinical and imaging context — not in isolation", "Blooming artifact indicates metallic foreign body", "Extra-articular masses cannot be TGCT"],
    correctIndex: 1,
    explanation: "This TGCT along the peroneal tendon sheath illustrates that ADC must be interpreted in context. The ADC of 0.92 × 10⁻³ falls below the 1.1 malignancy threshold, but the hemosiderin (blooming on GRE, low T2 signal) and tendon sheath location are diagnostic of TGCT — a benign process. Applying the ADC threshold in isolation would falsely classify this as ST-RADS 5. TGCT is a key exception to the ADC rule."
  },
  {
    id: 60,
    category: "Nerve Sheath Tumors",
    question: "A 42-year-old woman presents with an enlarging 4 cm mass along the median nerve. MRI shows a fusiform, well-defined lesion that is T2 hyperintense. Notably, the lesion demonstrates the 'target sign' PLUS subtle perilesional edema that was not present on prior imaging 1 year ago. ADC is 1.2 × 10⁻³ mm²/s (decreased from 1.5 on prior exam).\n\nHow should the new findings be interpreted?",
    options: ["Target sign confirms benign — edema and ADC changes are insignificant", "New edema with decreasing ADC in a known PNST warrants upgrade to ST-RADS 4", "ADC >1.1 confirms benign regardless of trend", "Repeat MRI in 1 year to reassess"],
    correctIndex: 1,
    explanation: "While the target sign typically indicates benign PNST, INTERVAL CHANGES are critical in ST-RADS surveillance. New perilesional edema (previously absent) and decreasing ADC trend (1.5→1.2) in a growing PNST are concerning for early malignant transformation, even though the absolute ADC remains above 1.1. The TREND matters — this warrants upgrade to ST-RADS 4 with consideration of tissue diagnosis. Serial imaging changes may precede crossing the ADC threshold."
  },
  {
    id: 61,
    category: "Vascular Tumors",
    question: "A 40-year-old man presents with a pulsatile mass in the thigh. MRI demonstrates a 3 cm mass with multiple curvilinear flow voids on both T1 and T2 sequences. There is a prominent draining vein. The soft-tissue component is minimal. No solid enhancing mass is identified.\n\nWhat is the most likely diagnosis?",
    options: ["Soft-tissue sarcoma with tumor neovascularity", "Arteriovenous malformation (AVM)", "Alveolar soft part sarcoma", "Angiosarcoma"],
    correctIndex: 1,
    explanation: "A high-flow arteriovenous malformation (AVM) shows multiple curvilinear flow voids (high-flow vessels) on T1 and T2 with minimal soft-tissue component and prominent draining veins. The pulsatile nature clinically confirms high flow. AVMs are distinguished from alveolar soft part sarcoma (which also has flow voids) by the ABSENCE of a discrete solid mass — AVM is primarily a tangle of abnormal vessels. ST-RADS 2 when classic features are present."
  },
  {
    id: 62,
    category: "Fibroblastic Tumors",
    question: "A 55-year-old woman presents with a 7 cm mass in the lower leg. MRI shows a mass with predominantly low T2 signal containing scattered areas of T2 hyperintensity. The lesion demonstrates bands of low signal extending through the mass. Enhancement is heterogeneous. ADC is variable — low in the T2 dark areas (0.9 × 10⁻³) and higher in the T2 bright areas (1.4 × 10⁻³).\n\nThe low T2 signal bands most likely represent:",
    options: ["Hemosiderin deposition from prior hemorrhage", "Dense collagenous/fibrous tissue within the tumor", "Calcification or ossification", "Vascular flow voids"],
    correctIndex: 1,
    explanation: "In fibroblastic/myofibroblastic tumors, bands of low T2 signal represent dense collagenous tissue. This pattern — mixed T2 signal with low-signal fibrous bands — is seen in desmoid-type fibromatosis, solitary fibrous tumor, and other fibrous neoplasms. The variable ADC (low in fibrous areas, higher in cellular/myxoid areas) reflects tissue composition heterogeneity. This is distinct from hemosiderin (which shows blooming on GRE) and calcification (which shows signal void on all sequences)."
  },
  {
    id: 63,
    category: "Nerve Sheath Tumors",
    question: "A 25-year-old man with NF1 undergoes whole-body MRI screening. Numerous bilateral neurofibromas are identified (plexiform type). One lesion in the right thigh measures 8 cm and shows homogeneous T2 hyperintensity with well-defined margins, ADC of 1.3 × 10⁻³, and no edema. All other lesions are smaller and stable.\n\nWhat feature of this large plexiform neurofibroma would be MOST concerning for malignant transformation on follow-up?",
    options: ["Growth from 8 to 9 cm over 2 years", "Development of heterogeneous T2 signal with new perilesional edema", "Slight increase in enhancement on post-contrast images", "New mild discomfort at the lesion site"],
    correctIndex: 1,
    explanation: "In NF1 plexiform neurofibromas, the development of heterogeneous T2 signal (loss of homogeneity) combined with new perilesional edema is the most concerning imaging change for malignant PNST transformation. While size increase, increased enhancement, and pain can accompany malignant change, the combination of T2 heterogeneity and new edema most strongly predicts malignancy. ADC decrease below 1.1 × 10⁻³ would further confirm. Whole-body MRI with DWI is the standard surveillance for NF1."
  },
  {
    id: 64,
    category: "Vascular Tumors",
    question: "A 60-year-old man with a history of chronic lymphedema following inguinal lymph node dissection presents with a new 5 cm mass in the ipsilateral thigh. MRI shows a heterogeneous mass with multifocal areas of hemorrhage, skin thickening, and T2 hypointense areas within the tumor. Enhancement is heterogeneous and avid.\n\nThe association between chronic lymphedema and this tumor is known as:",
    options: ["Kasabach-Merritt phenomenon", "Stewart-Treves syndrome", "Maffucci syndrome", "Klippel-Trénaunay syndrome"],
    correctIndex: 1,
    explanation: "Stewart-Treves syndrome describes angiosarcoma arising in the setting of chronic lymphedema. This is classically seen after axillary lymph node dissection for breast cancer but can occur with any cause of chronic lymphedema. The heterogeneous mass with hemorrhage, skin changes, and T2 hypointensity (87% of angiosarcomas) is characteristic. This is ST-RADS 5 requiring urgent tissue diagnosis."
  },
  {
    id: 65,
    category: "TGCT",
    question: "A 28-year-old woman undergoes MRI for anterior knee pain. Imaging reveals diffuse synovial proliferation in the suprapatellar recess and intercondylar notch with a 'frond-like' morphology. The synovium is predominantly T2 hyperintense with scattered low-signal foci. GRE shows only mild, patchy blooming (less than expected for TGCT). Enhancement is prominent.\n\nWhich condition should be considered as an alternative to TGCT?",
    options: ["Lipoma arborescens", "Synovial hemangioma", "Rheumatoid arthritis with pannus formation", "Synovial chondromatosis"],
    correctIndex: 2,
    explanation: "Rheumatoid pannus can mimic diffuse TGCT with synovial proliferation and enhancement. However, pannus is typically T2 hyperintense (not T2 dark) and shows less hemosiderin than TGCT. The key differentiator is that TGCT shows marked hemosiderin (83% with central hypointensity, prominent GRE blooming) while pannus shows mild hemosiderin at best. The clinical history (inflammatory arthritis vs. mechanical symptoms) is also crucial. Both can be infiltrative, but the degree of hemosiderin on GRE is the most reliable distinguisher."
  },
  {
    id: 66,
    category: "Fibroblastic Tumors",
    question: "A 48-year-old man presents with a 6 cm mass in the retroperitoneum. MRI shows a well-defined, lobulated mass that is predominantly T2 hyperintense with areas of T2 hypointensity. On T1, the mass is isointense to muscle. Post-contrast images demonstrate avid, relatively homogeneous enhancement. ADC values are heterogeneous, ranging from 0.9 to 1.4 × 10⁻³ mm²/s.\n\nA hemangiopericytoma pattern is noted on CT. What is the current WHO classification of this tumor?",
    options: ["Hemangiopericytoma", "Solitary fibrous tumor", "Synovial sarcoma", "Angiosarcoma"],
    correctIndex: 1,
    explanation: "The WHO has reclassified hemangiopericytoma as solitary fibrous tumor (SFT). SFTs demonstrate avid enhancement (due to rich vascularity), heterogeneous T2 signal (fibrous and cellular areas), and variable ADC. The retroperitoneum is a less common but recognized location (most are pleural). SFTs range from benign to malignant — ST-RADS classification depends on size, mitotic activity indicators, and imaging aggressiveness (typically ST-RADS 3-4)."
  },
  {
    id: 67,
    category: "Nerve Sheath Tumors",
    question: "A 35-year-old man presents with a mass in the left paraspinal region. MRI shows a dumbbell-shaped mass extending through the neural foramen with both intraspinal and extraspinal components. The lesion is T2 hyperintense, well-defined, with the target sign in the extraspinal component. ADC is 1.4 × 10⁻³ mm²/s.\n\nWhat is the most likely diagnosis and what does the dumbbell shape indicate?",
    options: ["Meningioma — extending through the foramen", "Schwannoma — classic dumbbell morphology through neural foramen", "MPNST — aggressive extension through foramen", "Metastatic disease — following nerve roots"],
    correctIndex: 1,
    explanation: "The dumbbell-shaped mass extending through a neural foramen is classic for schwannoma (or neurofibroma). The intraspinal-extraspinal morphology results from growth along the nerve root through the foramen. The target sign and ADC >1.1 confirm benign PNST. This is ST-RADS 2 despite the intraspinal extension. The dumbbell shape itself is not a sign of malignancy — it simply reflects the anatomic path of the parent nerve."
  },
];