import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight, Loader2, BarChart3 } from "lucide-react";
import { QUIZ_QUESTIONS } from "./quizData";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/components/User";

export default function QuizMode() {
  const [completedMap, setCompletedMap] = useState({}); // { [questionId]: { selected, correct } }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const user = await User.me();
      if (user?.quiz_progress) {
        setCompletedMap(user.quiz_progress);
      }
      setLoading(false);
    };
    loadProgress();
  }, []);

  // Save progress to user entity
  const saveProgress = useCallback(async (newMap) => {
    await User.updateMyUserData({ quiz_progress: newMap });
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(QUIZ_QUESTIONS.map(q => q.category))];
    return ["All", ...cats];
  }, []);

  const filteredQuestions = useMemo(() => {
    const base = categoryFilter === "All" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.category === categoryFilter);
    return base;
  }, [categoryFilter]);

  // Find first unanswered question in filtered set
  const unansweredQuestions = useMemo(() => {
    return filteredQuestions.filter(q => !completedMap[q.id]);
  }, [filteredQuestions, completedMap]);

  const currentQ = unansweredQuestions[currentIndex];

  // Stats
  const totalCompleted = Object.keys(completedMap).length;
  const totalCorrect = Object.values(completedMap).filter(v => v.correct).length;
  const filteredCompleted = filteredQuestions.filter(q => completedMap[q.id]).length;
  const filteredCorrect = filteredQuestions.filter(q => completedMap[q.id]?.correct).length;

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    const correct = index === currentQ.correctIndex;
    const newMap = { ...completedMap, [currentQ.id]: { selected: index, correct } };
    setCompletedMap(newMap);
    saveProgress(newMap);
  };

  const handleNext = () => {
    // Check if there are more unanswered questions (recalculate since we just answered one)
    const remaining = filteredQuestions.filter(q => !completedMap[q.id] && q.id !== currentQ.id);
    if (remaining.length === 0) {
      setQuizComplete(true);
    } else {
      setCurrentIndex(0); // always 0 since unansweredQuestions recalculates
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    // Clear progress for current filter
    const idsToRemove = filteredQuestions.map(q => q.id);
    const newMap = { ...completedMap };
    idsToRemove.forEach(id => delete newMap[id]);
    setCompletedMap(newMap);
    saveProgress(newMap);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  const handleResetAll = () => {
    setCompletedMap({});
    saveProgress({});
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizComplete(false);
    setShowStats(false);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>;
  }

  // Stats view
  if (showStats) {
    const catStats = categories.filter(c => c !== "All").map(cat => {
      const qs = QUIZ_QUESTIONS.filter(q => q.category === cat);
      const done = qs.filter(q => completedMap[q.id]).length;
      const right = qs.filter(q => completedMap[q.id]?.correct).length;
      return { cat, total: qs.length, done, right };
    });
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h3>
          <Button variant="outline" size="sm" onClick={() => setShowStats(false)}>Back to Quiz</Button>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <span className="font-semibold text-purple-800 dark:text-purple-200">Overall</span>
            <span className="font-bold text-purple-600">{totalCorrect}/{totalCompleted} correct ({QUIZ_QUESTIONS.length - totalCompleted} remaining)</span>
          </div>
          {catStats.map(s => (
            <div key={s.cat} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-700 dark:text-slate-300">{s.cat}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${(s.done / s.total) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-20 text-right">{s.right}/{s.done} of {s.total}</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="destructive" size="sm" onClick={handleResetAll} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" /> Reset All Progress
        </Button>
      </div>
    );
  }

  // All done for current filter
  if (quizComplete || unansweredQuestions.length === 0) {
    const pct = filteredCompleted > 0 ? Math.round((filteredCorrect / filteredCompleted) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {categoryFilter === "All" ? "All Questions Complete!" : `${categoryFilter} Complete!`}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          You scored <span className="font-bold text-purple-600">{filteredCorrect}/{filteredCompleted}</span> ({pct}%)
        </p>
        <div className="text-sm text-slate-500">
          {pct >= 90 ? "Outstanding! You're mastering ST-RADS." : 
           pct >= 70 ? "Great work! Keep studying to reach expert level." : 
           pct >= 50 ? "Good effort. Review the explanations to strengthen weak areas." : 
           "Keep studying! Review the questions and try again."}
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRestart} className="bg-purple-600 hover:bg-purple-700">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake {categoryFilter === "All" ? "All" : categoryFilter}
          </Button>
          <Button variant="outline" onClick={() => setShowStats(true)}>
            <BarChart3 className="w-4 h-4 mr-2" /> View Stats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category filters + stats button */}
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        {categories.map(cat => (
          <button key={cat} onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[32px] ${
              categoryFilter === cat ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}>
            {cat}
          </button>
        ))}
        <button onClick={() => setShowStats(true)}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 min-h-[32px] flex items-center gap-1.5 ml-auto">
          <BarChart3 className="w-3.5 h-3.5" /> {totalCompleted}/{QUIZ_QUESTIONS.length}
        </button>
      </div>

      {/* Progress info */}
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{filteredCompleted} of {filteredQuestions.length} completed ({unansweredQuestions.length} remaining)</span>
        <span className="font-medium text-purple-600">{filteredCorrect}/{filteredCompleted} correct</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${(filteredCompleted / filteredQuestions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{currentQ.category}</Badge>
                <span className="text-xs text-slate-400">Q{currentQ.id}</span>
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">{currentQ.question}</p>
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  const isCorrect = i === currentQ.correctIndex;
                  const isSelected = i === selectedAnswer;
                  let style = "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-slate-800";
                  if (showExplanation) {
                    if (isCorrect) style = "border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-700";
                    else if (isSelected && !isCorrect) style = "border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-700";
                    else style = "border-slate-200 dark:border-slate-700 opacity-50";
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={showExplanation}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${style}`}>
                      <span className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                      {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {showExplanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </motion.div>
              )}
            </CardContent>
          </Card>
          {showExplanation && (
            <div className="flex justify-end mt-3">
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                {unansweredQuestions.length <= 1 ? "See Results" : "Next Question"} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}