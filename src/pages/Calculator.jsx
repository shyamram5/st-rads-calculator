import React, { useState, useEffect, useCallback } from "react";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { LesionAnalysis } from "@/entities/LesionAnalysis";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, FileUp, Loader2, AlertCircle, Sparkles, CheckCircle, Info, X, UploadCloud } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import StructuredReport from "../components/StructuredReport";
import ImageCharacteristics from "../components/ImageCharacteristics";
import PremiumUpgrade from "../components/PremiumUpgrade";
import UsageTracker from "../components/UsageTracker";
import FeedbackSection from "../components/FeedbackSection";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ProgressStepper from "../components/ProgressStepper";

export default function CalculatorPage() {
  const [files, setFiles] = useState({ t1: [], t2: [], contrast: [] });
  const [previews, setPreviews] = useState({ t1: [], t2: [], contrast: [] });
  const [notes, setNotes] = useState("");
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [analysesUsed, setAnalysesUsed] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  const fileInputRefs = {
    t1: React.useRef(null),
    t2: React.useRef(null),
    contrast: React.useRef(null)
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setAnalysesUsed(currentUser.analyses_used || 0);
      } catch (e) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // Add effect for global paste handling
  useEffect(() => {
    const handleGlobalPaste = (e) => {
      // Only handle if we're in the calculator page and have focused upload areas
      const activeElement = document.activeElement;
      if (!activeElement || !activeElement.dataset.pasteType) return;
      
      const type = activeElement.dataset.pasteType;
      if (files[type].length >= 2) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      let imageFile = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          imageFile = items[i].getAsFile();
          break;
        }
      }

      if (imageFile) {
        e.preventDefault();
        
        const newFiles = [...files[type], imageFile].slice(0, 2);
        
        // Revoke old preview URLs to prevent memory leaks
        previews[type].forEach(url => URL.revokeObjectURL(url));
        
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        
        setFiles(prev => ({ ...prev, [type]: newFiles }));
        setPreviews(prev => ({ ...prev, [type]: newPreviews }));
        
        setAnalysis(null);
        setError(null);
        setShowUpgrade(false);
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [files, previews]);


  const handleFileChange = (type, e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files[type];
    const currentPreviews = previews[type];

    // Limit to 2 files maximum
    const newFiles = [...currentFiles, ...selectedFiles].slice(0, 2);
    const newPreviews = newFiles.map((file) =>
      currentFiles.includes(file) ?
        currentPreviews[currentFiles.indexOf(file)] :
        URL.createObjectURL(file)
    );

    setFiles((prev) => ({ ...prev, [type]: newFiles }));
    setPreviews((prev) => ({ ...prev, [type]: newPreviews }));
    setAnalysis(null);
    setError(null);
    setShowUpgrade(false);

    // Clear the input value so the same file can be selected again
    e.target.value = '';
  };

  const triggerFileSelect = (type) => fileInputRefs[type].current.click();

  const removeImage = (type, index) => {
    const currentFiles = [...files[type]];
    const currentPreviews = [...previews[type]];

    // Revoke the URL for the preview being removed
    if (currentPreviews[index]) {
      URL.revokeObjectURL(currentPreviews[index]);
    }

    currentFiles.splice(index, 1);
    currentPreviews.splice(index, 1);

    setFiles((prev) => ({ ...prev, [type]: currentFiles }));
    setPreviews((prev) => ({ ...prev, [type]: currentPreviews }));
  };

  const handleAnalysis = async () => {
    const hasAnyFile = Object.values(files).some((fileArray) => fileArray.length > 0);
    const hasCharacteristics = selectedCharacteristics.length > 0;
    
    if (!hasAnyFile && !hasCharacteristics) {
      setError("Please either upload at least one MRI image file or select imaging characteristics from the algorithm.");
      return;
    }
    
    if (!user) {
      setError("Please log in to use the analysis feature.");
      User.login();
      return;
    }

    // Check usage limits for free users
    const isPremium = user.subscription_tier === "premium";
    if (!isPremium && analysesUsed >= 5) {
      setShowUpgrade(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const fileUrls = {};
      const uploadedFiles = [];

      // Upload all selected files (if any)
      if (hasAnyFile) {
        for (const [type, fileArray] of Object.entries(files)) {
          if (fileArray.length > 0) {
            const typeUrls = [];
            for (const file of fileArray) {
              const { file_url } = await UploadFile({ file });
              typeUrls.push(file_url);
              uploadedFiles.push(file_url);
            }
            fileUrls[type] = typeUrls;
          }
        }
      }

      const processedCharacteristics = selectedCharacteristics.map((char) => {
        const parts = char.split('::');
        if (parts.length === 3) {
          return `${parts[0]} > ${parts[1]}: ${parts[2]}`;
        } else if (parts.length === 2) {
          return `${parts[0]}: ${parts[1]}`;
        }
        return char;
      }).join('\n- ');

      const characteristicsText = selectedCharacteristics.length > 0 ?
        `The user has selected the following imaging characteristics following the ST-RADS diagnostic flowchart:\n- ${processedCharacteristics}\n\nPlease incorporate these specific findings into your analysis.` :
        "No specific imaging characteristics were selected by the user.";

      // Create detailed description of provided images
      const imageDescriptions = [];
      for (const [type, urls] of Object.entries(fileUrls)) {
        if (urls.length > 0) {
          imageDescriptions.push(`${urls.length} ${type.toUpperCase()}-weighted image${urls.length > 1 ? 's' : ''}`);
        }
      }

      const imageTypesText = hasAnyFile ?
        (imageDescriptions.length > 0 ?
          `The user has provided the following MRI sequences: ${imageDescriptions.join(', ')}. **CRITICAL INSTRUCTION: Analyze ALL provided images with EQUAL WEIGHT. Each image should contribute equally to your diagnostic assessment regardless of sequence type or image quality. Do not favor one image over another - synthesize findings from all images comprehensively.**` :
          "Images provided for analysis.") :
        "No images provided - analysis based solely on selected imaging characteristics from the ST-RADS flowchart.";

      const prompt = `
You are an expert radiologist AI with a deep, nuanced understanding of the entire ST-RADS v2025 research paper and guidelines. Your primary task is to perform a comprehensive, holistic analysis by strictly following the official diagnostic flowcharts and using the detailed guidelines provided below as your source of truth.

**SOURCE OF TRUTH: ST-RADS SCORING GUIDELINES AND MANAGEMENT**
Use the following detailed scoring categories, characteristics, and management recommendations as the definitive guide for your entire analysis.

**Score 0: Incomplete**
- **Category:** Incomplete imaging limiting the diagnostic interpretation.
- **Risk of malignancy:** N/A
- **Typical imaging characteristics:** N/A
- **Management:** Recall for additional imaging and/or await prior examinations.

**Score 1: Negative**
- **Category:** Negative for tumor or tumor-like lesion.
- **Risk of malignancy:** None
- **Typical imaging characteristics:** No imaging evidence of a focal or diffuse lesion.
- **Management:** No further imaging follow-up recommended.

**Score 2: Definitely benign**
- **Category:** Definitely benign tumor or tumor-like lesion.
- **Risk of malignancy:** Extremely low
- **Typical imaging characteristics:** Tumor-like lesions with classic features, if present. Lipomatous tumors upto 10cm showing features of thin or no septations, appearance like subcutaneous fat, absence of nodules or enhancement<10%. Cyst-like or high-water content lesions, especially those communicating with joint, tendon sheath and bursa like ganglion or epidermoid cyst and vascular malformations with flow voids, phleboliths, and intense contrast enhancement.
- **Management:** Imaging follow-up as per clinical team recommendations.

**Score 3: Probably benign**
- **Category:** Probably benign tumor or tumor-like lesion.
- **Risk of malignancy:** Low
- **Typical imaging characteristics:** Tumors with classic-known imaging features or locations for benign tumors with some doubt on the interpreter's mind about the true histology.
- **Management:** Imaging follow-up can be considered in: 6 weeks to 3 months, 6 months, 1 year, 2 years or shorter-term follow-up if the lesion resolves or significantly regresses.

**Score 4: Suspicious for malignancy**
- **Category:** Suspicious for malignancy, indeterminate, or aggressive.
- **Risk of malignancy:** Intermediate
- **Typical imaging characteristics:** Locally aggressive tumors or indeterminate with suspicion of malignancy.
- **Management:** Tissue diagnosis or referral to a sarcoma center for further management.

**Score 5: Highly suggestive of malignancy**
- **Category:** Highly suggestive of malignancy.
- **Risk of malignancy:** High
- **Typical imaging characteristics:** Pathognomonic features of a soft tissue malignancy or sarcoma, such as large mass, peritumoral edema, internal necrosis or hemorrhage, fascial tails, crossing fascial compartments, low ADC<1.1, rapid increase in size or symptoms, or locoregional/distant metastasis.
- **Management:** Tissue diagnosis and further management in a sarcoma center.

**USER INPUT:**
- **Clinical Notes:** "${notes || 'No clinical notes provided.'}"
- **Selected Imaging Characteristics:** ${characteristicsText}
- **MRI Sequences:** ${imageTypesText}

**ANALYSIS REQUIREMENTS (Output JSON):**
1. **score:** The final ST-RADS score (0-5) based on your analysis.
2. **explanation:** A concise explanation of the key findings justifying the score.
3. **recommendation:** The official management recommendation for the assigned score, taken directly from the guidelines above.
4. **limitations:** Specific limitations of photograph vs proper imaging analysis.
5. **differential_diagnosis:** The single most likely diagnosis.
      `;

      const response_json_schema = {
        type: "object",
        properties: {
          score: { type: "number", description: "ST-RADS score (0-5) based on equal-weight analysis of ALL images" },
          explanation: { type: "string", description: "A concise explanation of the key findings justifying the score." },
          recommendation: { type: "string", description: "Official ST-RADS management recommendation" },
          limitations: { type: "string", description: "Specific limitations of photograph vs proper imaging analysis" },
          differential_diagnosis: { "type": "string", "description": "The single most likely diagnosis selected from the provided guidelines." }
        },
        required: ["score", "explanation", "recommendation", "limitations"]
      };

      const result = await InvokeLLM({
        prompt,
        file_urls: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        response_json_schema,
        temperature: 0
      });

      // Store all image URLs as a comma-separated string (or empty if no images)
      const allImageUrls = Object.values(fileUrls).flat().join(', ') || '';

      const analysisData = {
        image_url: allImageUrls,
        user_notes: notes,
        strads_score: result.score,
        explanation: result.explanation,
        recommendation: result.recommendation,
        limitations: result.limitations || (hasAnyFile ? 
          "This analysis is based on visual assessment of 2D photographs and cannot replace proper cross-sectional imaging (MRI/CT) evaluation." :
          "This analysis is based solely on selected imaging characteristics from the ST-RADS flowchart without visual image assessment."),
        differential_diagnosis: result.differential_diagnosis || "Not specified"
      };

      const createdAnalysis = await LesionAnalysis.create(analysisData);
      setAnalysis({ ...analysisData, id: createdAnalysis.id });

      // Update user's usage count
      const newUsageCount = analysesUsed + 1;
      await User.updateMyUserData({ analyses_used: newUsageCount });
      setAnalysesUsed(newUsageCount);

    } catch (err) {
      console.error(err);
      setError("An error occurred during analysis. Please try again. This may be due to the complexity of the request or image quality.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate current step based on user progress
  const getCurrentStep = () => {
    const hasAnyFile = Object.values(files).some((fileArray) => fileArray.length > 0);
    const hasCharacteristics = selectedCharacteristics.length > 0;
    
    if (analysis) return 4; // Report is ready
    if (isLoading) return 3; // Currently analyzing
    if (hasAnyFile || hasCharacteristics) return 2; // Either images or characteristics provided
    return 1; // Initial state
  };

  const isPremium = user?.subscription_tier === "premium";
  const canAnalyze = !user || isPremium || analysesUsed < 5;
  const hasAnyFile = Object.values(files).some((fileArray) => fileArray.length > 0);

  return (
    <div className="min-h-screen space-y-8">
      {/* Usage Tracker */}
      {user &&
        <UsageTracker user={user} analysesUsed={analysesUsed} />
      }

      {!user &&
        <div className="bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Ready to start analyzing?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Create a free account to get 5 analyses and save your results.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => User.login()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 whitespace-nowrap rounded-full">
              Create Free Account
            </Button>
          </div>
        </div>
      }

      {/* Show upgrade prompt if user has exceeded free limit */}
      {showUpgrade && user && !isPremium &&
        <PremiumUpgrade analysesUsed={analysesUsed} />
      }

      {/* Main Analysis Card */}
      <Card className="glass-panel shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-white/30 dark:bg-gray-800/30 p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">ST-RADS Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <ProgressStepper currentStep={getCurrentStep()} />
          
          <div className="space-y-12 mt-8">
            {/* Step 1: MRI Images Upload Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Upload MRI Images</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Upload up to 2 images for each MRI sequence type for comprehensive analysis.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* T1 Weighted */}
                <MRIImageUpload
                  type="t1"
                  title="T1 Weighted"
                  description="T1-weighted images"
                  files={files.t1}
                  previews={previews.t1}
                  onFileSelect={() => triggerFileSelect('t1')}
                  onRemove={(index) => removeImage('t1', index)}
                  color="blue" />

                {/* T2 Weighted */}
                <MRIImageUpload
                  type="t2"
                  title="T2 Weighted"
                  description="T2-weighted images"
                  files={files.t2}
                  previews={previews.t2}
                  onFileSelect={() => triggerFileSelect('t2')}
                  onRemove={(index) => removeImage('t2', index)}
                  color="green" />

                {/* Contrast Enhanced */}
                <MRIImageUpload
                  type="contrast"
                  title="Contrast Enhanced"
                  description="Post-contrast images"
                  files={files.contrast}
                  previews={previews.contrast}
                  onFileSelect={() => triggerFileSelect('contrast')}
                  onRemove={(index) => removeImage('contrast', index)}
                  color="purple" />
              </div>

              <div className="space-y-3">
                <label className="text-base font-semibold text-slate-800 dark:text-slate-100 block">Clinical History (Optional)</label>
                <Textarea
                  placeholder="Enter any relevant clinical information, patient history, or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 rounded-xl text-base transition-all duration-300" />
              </div>
            </div>

            {/* Step 2: Diagnostic Algorithm */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Follow ST-RADS Diagnostic Algorithm</h2>
                <p className="text-slate-600 dark:text-slate-400">Follow the official ST-RADS v2025 diagnostic flowchart to identify imaging characteristics.</p>
              </div>
              <ImageCharacteristics
                selectedCharacteristics={selectedCharacteristics}
                onCharacteristicsChange={setSelectedCharacteristics} />
            </div>

            {/* Step 3: Run Analysis */}
            {(hasAnyFile || selectedCharacteristics.length > 0) &&
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <div className="text-center">
                  <Button
                    onClick={handleAnalysis}
                    disabled={isLoading || (!hasAnyFile && selectedCharacteristics.length === 0) || !canAnalyze}
                    size="lg" className="bg-red-600 text-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h11 from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-full">

                    {isLoading ?
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Analyzing...
                      </> :
                      !canAnalyze ?
                        "Upgrade to Continue" :
                        <>
                          <Sparkles className="mr-3 h-6 w-6" />
                          Run ST-RADS Analysis
                        </>
                    }
                  </Button>
                </div>
              </div>
            }

            {error &&
              <Alert variant="destructive" className="border-2 border-red-300 bg-red-50 dark:bg-red-950/60 dark:border-red-800/80 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-300" />
                <AlertTitle className="text-lg text-red-800 dark:text-red-100">Analysis Error</AlertTitle>
                <AlertDescription className="text-base text-red-700 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            }
          </div>
        </CardContent>
      </Card>

      {/* File inputs for each MRI type */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange('t1', e)}
        className="hidden"
        ref={fileInputRefs.t1} />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange('t2', e)}
        className="hidden"
        ref={fileInputRefs.t2} />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange('contrast', e)}
        className="hidden"
        ref={fileInputRefs.contrast} />


      {/* Loading State */}
      {isLoading &&
        <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0 [animation-duration:1s]"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Processing Analysis</h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg">AI is evaluating the provided images...</p>
                <div className="flex justify-center mt-4">
                  <p className="text-sm text-slate-500">This may take up to 30 seconds.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }

      {/* Results Section */}
      {analysis &&
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 dark:from-blue-200 dark:to-cyan-200 bg-clip-text text-transparent mb-2">
              Analysis Results
            </h2>
            <p className="text-blue-600 dark:text-blue-300 text-lg">AI-generated ST-RADS classification report</p>
          </div>
          <StructuredReport analysis={analysis} />

          {/* Feedback Section */}
          <FeedbackSection analysisId={analysis.id} />
        </div>
      }
    </div>);

}

// MRI Image Upload Component - Updated with better paste handling
function MRIImageUpload({ type, title, description, files, previews, onFileSelect, onRemove, color }) {
  const colorClasses = {
    blue: "border-blue-300 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20",
    green: "border-green-300 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 bg-green-50/50 dark:bg-green-950/20",
    purple: "border-purple-300 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-purple-50/50 dark:bg-purple-950/20"
  };

  const maxFiles = 2;
  const canAddMore = files.length < maxFiles;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">({files.length}/{maxFiles} images)</p>
      </div>

      {/* Display uploaded images */}
      {previews.length > 0 &&
        <div className="grid grid-cols-2 gap-2">
          {previews.map((preview, index) =>
            <div key={index} className="relative group">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img 
                  src={preview} 
                  alt={`${title} ${index + 1}`} 
                  className="w-full h-full object-contain rounded-lg" 
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      }

      {/* Upload area */}
      {canAddMore &&
        <div
          className={`relative group aspect-square border border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm ${colorClasses[color].replace('bg-', 'bg-opacity-30 bg-')} hover:backdrop-blur-md shadow-inner`}
          onClick={onFileSelect}
          tabIndex={0}
          data-paste-type={type}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFileSelect();
            }
          }}
          onFocus={(e) => {
            // Visual indication that this area can receive paste
            e.target.style.outline = '2px solid #3b82f6';
            e.target.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.target.style.outline = 'none';
          }}>

          <div className="text-center p-4 space-y-2">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full mb-3 shadow-sm mx-auto w-fit border border-slate-200 dark:border-slate-700">
              <UploadCloud className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {files.length === 0 ? "Click to upload" : "Add another image"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click here, then paste (Ctrl+V) or drag files
            </p>
          </div>
        </div>
      }
    </div>
  );
}