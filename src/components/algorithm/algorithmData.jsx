// ═══════════════════════════════════════════════════════════════════════
// INTERACTIVE BRANCHING ALGORITHM DATA
// Faithfully implements Figures 1, 2A, 2B, 2C, 2D from Chhabra et al.
// Each node has an id, question/label, and choices that lead to next nodes
// or terminal RADS categories.
// ═══════════════════════════════════════════════════════════════════════

export const ALGORITHM_NODES = {

  // ═══════════════════════════════════════════════════
  // FIGURE 1: General Diagnostic Algorithm
  // ═══════════════════════════════════════════════════

  "start": {
    figure: "Fig. 1",
    title: "Suspected Soft Tissue Lesion",
    question: "Is the MRI examination complete?",
    choices: [
      { label: "Incomplete imaging", next: "RADS-0" },
      { label: "Complete imaging", next: "fig1_lesion" }
    ]
  },

  "fig1_lesion": {
    figure: "Fig. 1",
    title: "Complete Imaging",
    question: "Is a soft-tissue lesion identified?",
    choices: [
      { label: "No soft tissue lesion", next: "RADS-1" },
      { label: "Soft tissue lesion present", next: "fig1_fat" }
    ]
  },

  "fig1_fat": {
    figure: "Fig. 1",
    title: "Soft Tissue Lesion Identified",
    question: "Does the lesion contain macroscopic fat on T1W (that suppresses on fat-suppression sequence)?",
    choices: [
      { label: "Macroscopic fat on T1W", next: "fig2a_start", badge: "→ Fig. 2A" },
      { label: "No macroscopic fat on T1W", next: "fig1_signal" }
    ]
  },

  "fig1_signal": {
    figure: "Fig. 1",
    title: "No Macroscopic Fat",
    question: "What are the T2 signal and enhancement characteristics?",
    choices: [
      { label: "Markedly high signal on T2W AND <20% enhancement on T1W+C", next: "fig2b_start", badge: "→ Fig. 2B" },
      { label: "No variable high signal on T2W OR >20% enhancement on T1W+C", next: "fig2cd_start", badge: "→ Figs. 2C/2D" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2A: Lipomatous Soft Tissue Lesion
  // ═══════════════════════════════════════════════════

  "fig2a_start": {
    figure: "Fig. 2A",
    title: "Lipomatous Soft Tissue Lesion",
    subtitle: "First exclude common benign lesions: elastofibroma dorsi, hemangioma, xanthoma, heterotopic ossification, lipomatosis of nerve, chondroid lipoma, hibernoma.",
    question: "What is the fat composition?",
    choices: [
      { label: "Predominantly lipomatous (>90%)", next: "fig2a_predominantly" },
      { label: "Not predominantly lipomatous (≤90%)", next: "fig2a_not_predominantly" }
    ]
  },

  "fig2a_predominantly": {
    figure: "Fig. 2A",
    title: "Predominantly Lipomatous (>90%)",
    question: "Assess septations and enhancement:",
    choices: [
      { label: "Thin septations (<2 mm) OR enhancement <10%", next: "fig2a_thin" },
      { label: "Thick septations (≥2 mm) OR enhancement >10%", next: "RADS-4-lip-thick" }
    ]
  },

  "fig2a_thin": {
    figure: "Fig. 2A",
    title: "Thin Septations / Low Enhancement",
    question: "Are many prominent vessels present?",
    choices: [
      { label: "Many prominent vessels", next: "RADS-2-lip" },
      { label: "Few prominent vessels", next: "RADS-3-lip" }
    ]
  },

  "fig2a_not_predominantly": {
    figure: "Fig. 2A",
    title: "Not Predominantly Lipomatous (≤90%)",
    question: "Assess enhancing nodules and component proportions:",
    choices: [
      { label: "No enhancing nodule(s) OR proportionately larger lipomatous component than soft tissue component", next: "RADS-4-lip-notpre" },
      { label: "Enhancing nodule(s) OR proportionately smaller lipomatous component than soft tissue component", next: "RADS-5-lip" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2B: Cyst-like / High Water Content
  // ═══════════════════════════════════════════════════

  "fig2b_start": {
    figure: "Fig. 2B",
    title: '"Cyst-like" or "High Water Content" Soft Tissue Lesion',
    question: "Does the lesion communicate with a joint/tendon sheath/bursa, OR is it cutaneous/subcutaneous, OR is it in an intraneural location?",
    choices: [
      { label: "Yes — Communicates with joint/tendon sheath/bursa OR cutaneous/subcutaneous OR intraneural location", next: "RADS-2-cyst-comm" },
      { label: "No — No communication; deeper (subfascial) location", next: "fig2b_deep" }
    ]
  },

  "fig2b_deep": {
    figure: "Fig. 2B",
    title: "Deep Cyst-like Lesion (No Communication)",
    question: "Is the lesion predominantly comprised of flow voids or fluid-fluid levels?",
    choices: [
      { label: "Predominantly comprised of flow voids or fluid-fluid levels", next: "RADS-2-cyst-flow" },
      { label: "Not predominantly comprised of flow voids or fluid-fluid levels", next: "fig2b_hematoma" }
    ]
  },

  "fig2b_hematoma": {
    figure: "Fig. 2B",
    title: "Not Predominantly Flow Voids",
    question: "Does the lesion have features suggesting hematoma?",
    choices: [
      { label: "Features suggesting hematoma", next: "RADS-3-cyst-hema" },
      { label: "No hematoma features", next: "fig2b_septations" }
    ]
  },

  "fig2b_septations": {
    figure: "Fig. 2B",
    title: "No Hematoma Features",
    question: "Assess for thick enhancing septations and mural nodules:",
    choices: [
      { label: "Absence of thick enhancing septations and small mural nodule(s) <1 cm", next: "RADS-3or4-cyst" },
      { label: "Presence of thick enhancing septations AND/OR mural nodule(s) ≥1 cm or larger soft tissue component", next: "RADS-5-cyst" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURES 2C/2D: Indeterminate Solid — Compartment Selection
  // ═══════════════════════════════════════════════════

  "fig2cd_start": {
    figure: "Figs. 2C/2D",
    title: "Indeterminate Solid Soft Tissue Lesion",
    subtitle: "Determine anatomic location of the epicenter.",
    question: "Select the anatomic compartment:",
    choices: [
      { label: "Intravascular or vessel-related", next: "fig2d_vasc", badge: "Fig. 2D" },
      { label: "Intraarticular", next: "fig2d_ia", badge: "Fig. 2D" },
      { label: "Intraneural or nerve-related", next: "fig2d_nerve", badge: "Fig. 2D" },
      { label: "Cutaneous or subcutaneous", next: "fig2d_cut", badge: "Fig. 2D" },
      { label: "Deep (subfascial) / intermuscular / intramuscular", next: "fig2c_deep", badge: "Fig. 2C" },
      { label: "Intratendinous or tendon-related", next: "fig2c_tendon", badge: "Fig. 2C" },
      { label: "Plantar or palmar fascial", next: "fig2c_fascial", badge: "Fig. 2C" },
      { label: "Subungual", next: "fig2c_subungual", badge: "Fig. 2C" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2D: Intravascular / Vessel-Related
  // ═══════════════════════════════════════════════════

  "fig2d_vasc": {
    figure: "Fig. 2D",
    title: "Intravascular or Vessel-Related",
    subtitle: "Excludes venous thrombosis, thrombophlebitis, (pseudo)aneurysm, vascular malformation.",
    question: "Describe the T2 signal, phleboliths, and mineralization:",
    choices: [
      { label: "Hyperintense lobules/tubules on T2W WITH hypointense phleboliths WITH fluid-fluid levels", next: "RADS-2-vasc-phleb" },
      { label: "Hyperintense lobules/tubules on T2W WITHOUT hypointense phleboliths, WITHOUT fluid-fluid levels", next: "RADS-4or5-vasc" },
      { label: "Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W", next: "fig2d_vasc_calc" },
      { label: "Not calcified/ossified on XR or CT OR predominantly hyperintense foci on T2W", next: "fig2d_vasc_notcalc" }
    ]
  },

  "fig2d_vasc_calc": {
    figure: "Fig. 2D",
    title: "Calcified/Ossified or Hypointense Foci",
    question: "Hemosiderin staining and GRE blooming?",
    choices: [
      { label: "Hemosiderin staining AS blooming on GRE", next: "RADS-2-vasc-hsb" },
      { label: "Hemosiderin staining WITHOUT blooming on GRE", next: "RADS-2-vasc-hsnb" }
    ]
  },

  "fig2d_vasc_notcalc": {
    figure: "Fig. 2D",
    title: "Not Calcified, Hyperintense Foci on T2W",
    question: "T2 signal and enhancement pattern:",
    choices: [
      { label: "Hyperintense on T2W and peripheral enhancement", next: "RADS-3-vasc" },
      { label: "Hypointense on T2W and no peripheral enhancement", next: "RADS-4-vasc-tsgct" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2D: Intraarticular
  // ═══════════════════════════════════════════════════

  "fig2d_ia": {
    figure: "Fig. 2D",
    title: "Intraarticular",
    question: "Calcification and T2 signal characteristics:",
    choices: [
      { label: "Calcified/ossified on XR or CT AND/OR predominantly hypointense foci on T2W", next: "fig2d_ia_calc" },
      { label: "Not calcified/ossified on XR or CT OR predominantly hyperintense foci on T2W", next: "fig2d_ia_notcalc" }
    ]
  },

  "fig2d_ia_calc": {
    figure: "Fig. 2D",
    title: "Intraarticular — Calcified/Hypointense",
    question: "Hemosiderin staining and GRE blooming?",
    choices: [
      { label: "Hemosiderin staining with blooming on GRE", next: "RADS-2-ia-hsb" },
      { label: "Hemosiderin staining without blooming on GRE", next: "RADS-2-ia-hsnb" }
    ]
  },

  "fig2d_ia_notcalc": {
    figure: "Fig. 2D",
    title: "Intraarticular — Not Calcified",
    question: "T2 signal and enhancement pattern:",
    choices: [
      { label: "Hyperintense on T2W and peripheral enhancement", next: "RADS-3-ia" },
      { label: "Hypointense on T2W and no peripheral enhancement", next: "RADS-4-ia" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2D: Intraneural / Nerve-Related
  // ═══════════════════════════════════════════════════

  "fig2d_nerve": {
    figure: "Fig. 2D",
    title: "Intraneural or Nerve-Related",
    subtitle: "Presence of tail sign and related to major named nerve.",
    question: "Is a target sign present?",
    choices: [
      { label: "Target sign present", next: "fig2d_nerve_adc" },
      { label: "No target sign", next: "RADS-3-nerve" }
    ]
  },

  "fig2d_nerve_adc": {
    figure: "Fig. 2D",
    title: "Target Sign Present",
    question: "ADC value:",
    choices: [
      { label: "ADC >1.1 × 10⁻³ mm²/s", next: "RADS-2-nerve" },
      { label: "ADC ≤1.1 × 10⁻³ mm²/s", next: "RADS-4or5-nerve" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2D: Cutaneous / Subcutaneous
  // ═══════════════════════════════════════════════════

  "fig2d_cut": {
    figure: "Fig. 2D",
    title: "Cutaneous or Subcutaneous",
    question: "Growth pattern:",
    choices: [
      { label: "Exophytic", next: "fig2d_cut_exo" },
      { label: "Endophytic", next: "RADS-5-cut-endo" }
    ]
  },

  "fig2d_cut_exo": {
    figure: "Fig. 2D",
    title: "Exophytic Cutaneous/Subcutaneous",
    question: "Enhancement pattern:",
    choices: [
      { label: "Peripheral enhancement", next: "RADS-2-cut" },
      { label: "Internal enhancement", next: "RADS-4or5-cut" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2C: Deep / Intermuscular / Intramuscular
  // ═══════════════════════════════════════════════════

  "fig2c_deep": {
    figure: "Fig. 2C",
    title: "Deep (Subfascial) / Intermuscular / Intramuscular",
    question: "Is a muscle signature present?",
    choices: [
      { label: "Muscle signature present", next: "fig2c_deep_muscle" },
      { label: "No muscle signature", next: "RADS-4or5-deep-nomuscle" }
    ]
  },

  "fig2c_deep_muscle": {
    figure: "Fig. 2C",
    title: "Muscle Signature Present",
    question: "Is there a history of prior injury WITH peritumoral edema AND mature peripheral mineralization?",
    choices: [
      { label: "Yes — All three present (history of injury + edema + mature mineralization)", next: "RADS-2-deep" },
      { label: "No — One or more absent", next: "RADS-4or5-deep-muscle" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2C: Intratendinous / Tendon-Related
  // ═══════════════════════════════════════════════════

  "fig2c_tendon": {
    figure: "Fig. 2C",
    title: "Intratendinous or Tendon-Related",
    question: "Tendon morphology:",
    choices: [
      { label: "Enlarged tendon with calcifications, cystic change, fat, or underlying history of amyloidosis/autoimmune disease", next: "RADS-2-tendon" },
      { label: "Normal size tendon without calcifications, cystic change, fat, or no underlying amyloidosis/autoimmune", next: "fig2c_tendon_normal" }
    ]
  },

  "fig2c_tendon_normal": {
    figure: "Fig. 2C",
    title: "Normal Size Tendon",
    question: "Hemosiderin staining and GRE blooming?",
    choices: [
      { label: "Hemosiderin staining with blooming on GRE", next: "RADS-3-tendon" },
      { label: "Hemosiderin staining without blooming on GRE", next: "RADS-4or5-tendon" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2C: Plantar / Palmar Fascial
  // ═══════════════════════════════════════════════════

  "fig2c_fascial": {
    figure: "Fig. 2C",
    title: "Plantar or Palmar Fascial",
    question: "Fascial nodule size:",
    choices: [
      { label: "Fascial nodule <2 cm in length", next: "fig2c_fascial_small" },
      { label: "Fascial nodule ≥2 cm in length", next: "fig2c_fascial_large" }
    ]
  },

  "fig2c_fascial_small": {
    figure: "Fig. 2C",
    title: "Fascial Nodule <2 cm",
    question: "Multifocal or conglomerate fascial nodules?",
    choices: [
      { label: "Multifocal or conglomerate fascial nodules", next: "RADS-2-fascial-small" },
      { label: "No — Solitary", next: "RADS-3-fascial-small" }
    ]
  },

  "fig2c_fascial_large": {
    figure: "Fig. 2C",
    title: "Fascial Nodule ≥2 cm",
    question: "Multifocal or conglomerate fascial nodules?",
    choices: [
      { label: "Multifocal or conglomerate fascial nodules", next: "RADS-3-fascial-large" },
      { label: "No — Solitary", next: "RADS-4or5-fascial" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // FIGURE 2C: Subungual
  // ═══════════════════════════════════════════════════

  "fig2c_subungual": {
    figure: "Fig. 2C",
    title: "Subungual",
    subtitle: "Hyperintense on T2W, diffuse enhancement on T1W+C.",
    question: "Lesion size:",
    choices: [
      { label: "Small (<1 cm)", next: "RADS-3or5-subungual" },
      { label: "Large (≥1 cm)", next: "RADS-3or4-subungual" }
    ]
  },

  // ═══════════════════════════════════════════════════
  // TERMINAL NODES (RADS categories)
  // ═══════════════════════════════════════════════════

  // --- RADS-0 / RADS-1 ---
  "RADS-0": { terminal: true, score: 0, label: "ST-RADS 0", color: "gray", risk: "N/A", meaning: "Incomplete imaging, limiting diagnostic interpretation.", management: "Recall for additional imaging and/or request prior examinations.", differentials: [] },
  "RADS-1": { terminal: true, score: 1, label: "ST-RADS 1", color: "green", risk: "N/A", meaning: "No soft-tissue tumor or tumor-like lesion identified on imaging.", management: "No further imaging follow-up recommended.", differentials: [] },

  // --- Fig 2A Lipomatous terminals ---
  "RADS-2-lip": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Predominantly lipomatous (>90%) with thin septations or <10% enhancement and many prominent vessels.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Lipoma (subcutaneous, inter- or intramuscular, including myolipoma)", "Lipoma of nerve (intraneural)", "Lipoma arborescens (intraarticular)"] },
  "RADS-3-lip": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Predominantly lipomatous (>90%) with thin septations or <10% enhancement and few prominent vessels.", management: "Imaging follow-up at 6 weeks to 3 months, 6 months, 1 year, and 2 years.", differentials: ["Angiolipoma"] },
  "RADS-4-lip-thick": { terminal: true, score: 4, label: "ST-RADS 4", color: "orange", risk: "Intermediate", meaning: "Predominantly lipomatous with thick septations (≥2 mm) or >10% enhancement increase.", management: "Image-guided biopsy, open biopsy, or follow-up imaging at 4–6 weeks. Tissue diagnosis for lesions ≥5 cm.", differentials: ["Atypical lipomatous tumor (ALT)", "Well-differentiated liposarcoma (WDL)"] },
  "RADS-4-lip-notpre": { terminal: true, score: 4, label: "ST-RADS 4", color: "orange", risk: "Intermediate", meaning: "Not predominantly lipomatous (≤90%) with no enhancing nodules or proportionately larger lipomatous component.", management: "Image-guided biopsy, open biopsy, or follow-up imaging. Tissue diagnosis for lesions ≥5 cm.", differentials: ["Atypical lipomatous tumor (ALT)", "Well-differentiated liposarcoma (WDL)"] },
  "RADS-5-lip": { terminal: true, score: 5, label: "ST-RADS 5", color: "red", risk: "High", meaning: "Not predominantly lipomatous (≤90%) with enhancing nodules or proportionately smaller lipomatous component. Other ancillary features (necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, metastasis) may be present.", management: "Tissue diagnosis and referral to a sarcoma center.", differentials: ["Dedifferentiated liposarcoma", "Myxoid liposarcoma", "Pleomorphic sarcoma"] },

  // --- Fig 2B Cyst-like terminals ---
  "RADS-2-cyst-comm": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Cyst-like lesion communicating with joint/tendon sheath/bursa, or cutaneous/subcutaneous, or intraneural location.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Ganglion", "Synovial cyst", "Geyser phenomenon", "Tenosynovitis", "Epidermoid cyst", "Bursitis", "Morel-Lavallée lesion", "Intraneural cyst"] },
  "RADS-2-cyst-flow": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Deep cyst-like lesion predominantly comprised of flow voids or fluid-fluid levels.", management: "Imaging follow-up at clinical team's discretion. Consult vascular interventionist.", differentials: ["Low-flow vascular malformation", "High-flow vascular malformation", "Aneurysm", "Thrombophlebitis"] },
  "RADS-3-cyst-hema": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Deep cyst-like lesion with features suggesting hematoma.", management: "Follow-up to resolution is important — hematoma may mask underlying neoplasm.", differentials: ["Hematoma", "Chronic expanding hematoma"] },
  "RADS-3or4-cyst": { terminal: true, score: "3 or 4", label: "ST-RADS 3 or 4", color: "yellow", risk: "Low to Intermediate", meaning: "Deep cyst-like lesion with absence of thick enhancing septations and small mural nodule(s) <1 cm. Radiologist's judgment determines category.", management: "RADS-3: Imaging follow-up. RADS-4: Biopsy or close follow-up imaging.", differentials: ["Intramuscular myxoma", "Benign peripheral nerve sheath tumor", "Cysticercosis", "Hydatid cyst", "Myxoid liposarcoma", "Myxofibrosarcoma"] },
  "RADS-5-cyst": { terminal: true, score: 5, label: "ST-RADS 5", color: "red", risk: "High", subtitle: "Subfascial", meaning: "Deep cyst-like lesion with thick enhancing septations and/or mural nodule(s) ≥1 cm or larger soft tissue component.", management: "Tissue diagnosis and referral to a sarcoma center.", differentials: ["Synovial sarcoma", "Hemangioendothelioma", "Angiosarcoma", "Extraskeletal myxoid chondrosarcoma", "Myxoinflammatory fibroblastic sarcoma", "Myxofibrosarcoma"] },

  // --- Fig 2D Intravascular terminals ---
  "RADS-2-vasc-phleb": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Hyperintense lobules/tubules on T2W with phleboliths and fluid-fluid levels.", management: "Imaging follow-up at clinical team's discretion. Consult vascular interventionist.", differentials: ["Venous malformation", "Venolymphatic malformation"] },
  "RADS-4or5-vasc": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Hyperintense lobules/tubules on T2W without phleboliths, without fluid-fluid levels. Features favoring RADS-5: internal hemorrhage, necrosis, peritumoral edema, crossing compartments, low ADC <1.1, rapid growth, metastasis.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center referral.", differentials: ["Hemangioendothelioma", "Kaposi sarcoma", "Angiosarcoma", "Leiomyosarcoma"] },
  "RADS-2-vasc-hsb": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Calcified/ossified with hemosiderin staining and blooming on GRE.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Synovial chondromatosis", "Synovial hemangioma"] },
  "RADS-2-vasc-hsnb": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Calcified/ossified with hemosiderin staining without blooming on GRE.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Gout", "Amyloid", "Xanthoma"] },
  "RADS-3-vasc": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Not calcified, hyperintense on T2W with peripheral enhancement.", management: "Imaging follow-up at 6 weeks to 3 months, 6 months, 1 year, and 2 years.", differentials: ["TSGCT", "Synovial chondromatosis"] },
  "RADS-4-vasc-tsgct": { terminal: true, score: 4, label: "ST-RADS 4", color: "orange", risk: "Intermediate", meaning: "Not calcified, hypointense on T2W with no peripheral enhancement.", management: "Image-guided biopsy, open biopsy, or follow-up imaging.", differentials: ["TSGCT"] },

  // --- Fig 2D Intraarticular terminals ---
  "RADS-2-ia-hsb": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Intraarticular, calcified with hemosiderin staining and blooming on GRE.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Synovial chondromatosis", "Synovial hemangioma"] },
  "RADS-2-ia-hsnb": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Intraarticular, calcified with hemosiderin staining without blooming on GRE.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Gout", "Amyloid", "Xanthoma"] },
  "RADS-3-ia": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Intraarticular, not calcified, hyperintense on T2W with peripheral enhancement.", management: "Imaging follow-up.", differentials: ["TSGCT", "Synovial chondromatosis"] },
  "RADS-4-ia": { terminal: true, score: 4, label: "ST-RADS 4", color: "orange", risk: "Intermediate", meaning: "Intraarticular, not calcified, hypointense on T2W with no peripheral enhancement.", management: "Biopsy or follow-up imaging.", differentials: ["TSGCT"] },

  // --- Fig 2D Intraneural terminals ---
  "RADS-2-nerve": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Nerve-related lesion with target sign and ADC >1.1. Classic benign peripheral nerve sheath tumor.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Schwannoma", "Neurofibroma"] },
  "RADS-3-nerve": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Nerve-related lesion without target sign.", management: "Imaging follow-up.", differentials: ["Perineurioma", "Ancient schwannoma", "Neurofibroma with degenerative change", "Atypical neurofibroma"] },
  "RADS-4or5-nerve": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Nerve-related with target sign but ADC ≤1.1. Features favoring RADS-5: size >4 cm, perilesional edema, necrosis, absence of target sign, rapid growth, growth along nerve, crossing compartments.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["Malignant peripheral nerve sheath tumor (MPNST)"] },

  // --- Fig 2D Cutaneous terminals ---
  "RADS-2-cut": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Exophytic cutaneous/subcutaneous with peripheral enhancement.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Sebaceous cyst", "Trichilemmal cyst", "Epidermoid cyst", "Retinacular cyst"] },
  "RADS-4or5-cut": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Exophytic cutaneous/subcutaneous with internal enhancement. Features favoring RADS-5: large size, rapid growth, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, metastasis.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["Wart", "Dermatofibrosarcoma protuberans", "Fibrosarcoma NOS"] },
  "RADS-5-cut-endo": { terminal: true, score: 5, label: "ST-RADS 5", color: "red", risk: "High", meaning: "Endophytic cutaneous/subcutaneous lesion. Highly suspicious for malignancy.", management: "Tissue diagnosis and referral to a sarcoma center.", differentials: ["T-cell lymphoma", "Merkel cell tumor", "Melanoma", "Cutaneous metastasis (lung, breast, renal)"] },

  // --- Fig 2C Deep terminals ---
  "RADS-2-deep": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Deep/intramuscular with muscle signature + history of injury + peritumoral edema + mature peripheral mineralization.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Hypertrophied muscle", "Myositis", "Myopathy", "Myonecrosis", "Myositis ossificans"] },
  "RADS-4or5-deep-nomuscle": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Deep/intramuscular without muscle signature. Features favoring RADS-5: solid enhancing nodules >2 cm for fascia-based lesions, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, metastasis.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"] },
  "RADS-4or5-deep-muscle": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Deep/intramuscular with muscle signature but lacking the benign triad. Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, metastasis.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["Desmoid", "Fibromyxoid sarcoma", "Fibrosarcoma NOS", "Extraskeletal osteosarcoma", "Undifferentiated pleomorphic sarcoma"] },

  // --- Fig 2C Tendon terminals ---
  "RADS-2-tendon": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Enlarged tendon with calcifications, cystic change, fat, or amyloidosis/autoimmune history.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Gout", "Amyloid", "Xanthoma"] },
  "RADS-3-tendon": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Normal-size tendon with hemosiderin staining and blooming on GRE.", management: "Imaging follow-up.", differentials: ["TSGCT"] },
  "RADS-4or5-tendon": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Normal-size tendon with hemosiderin staining without blooming on GRE.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["TSGCT"] },

  // --- Fig 2C Fascial terminals ---
  "RADS-2-fascial-small": { terminal: true, score: 2, label: "ST-RADS 2", color: "emerald", risk: "Very Low", meaning: "Fascial nodule <2 cm, multifocal/conglomerate.", management: "Imaging follow-up at clinical team's discretion.", differentials: ["Fibroma"] },
  "RADS-3-fascial-small": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Fascial nodule <2 cm, solitary.", management: "Imaging follow-up.", differentials: ["Fibromatosis"] },
  "RADS-3-fascial-large": { terminal: true, score: 3, label: "ST-RADS 3", color: "yellow", risk: "Low", meaning: "Fascial nodule ≥2 cm, multifocal/conglomerate.", management: "Imaging follow-up.", differentials: ["Fibromatosis"] },
  "RADS-4or5-fascial": { terminal: true, score: "4 or 5", label: "ST-RADS 4 or 5", color: "orange", risk: "Intermediate to High", meaning: "Fascial nodule ≥2 cm, solitary. Features favoring RADS-5: solid enhancing nodules >2 cm, fascial tails, extra-compartmental extension, necrosis, hemorrhage, peritumoral edema, low ADC <1.1, rapid growth, metastasis.", management: "RADS-4: Biopsy or follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["Desmoid", "Synovial sarcoma", "Epithelioid sarcoma", "Myxoinflammatory fibroblastic sarcoma", "Clear cell sarcoma"] },

  // --- Fig 2C Subungual terminals ---
  "RADS-3or5-subungual": { terminal: true, score: "3 or 5", label: "ST-RADS 3 or 5", color: "yellow", risk: "Low to High", meaning: "Small subungual lesion (<1 cm). Radiologist's judgment.", management: "RADS-3: Imaging follow-up. RADS-5: Tissue diagnosis and sarcoma center.", differentials: ["Glomus tumor NOS"] },
  "RADS-3or4-subungual": { terminal: true, score: "3 or 4", label: "ST-RADS 3 or 4", color: "yellow", risk: "Low to Intermediate", meaning: "Larger subungual lesion (≥1 cm).", management: "RADS-3: Imaging follow-up. RADS-4: Biopsy or follow-up.", differentials: ["Glomus tumor NOS", "Glomus tumor—malignant"] },
};