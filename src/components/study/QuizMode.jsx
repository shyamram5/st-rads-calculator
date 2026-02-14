import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, ChevronRight } from "lucide-react";
import { QUIZ_QUESTIONS } from "./quizData";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizMode() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = [...new Set(QUIZ_QUESTIONS.map(q => q.category))];
    return ["All", ...cats];
  }, []);

  const filteredQuestions = useMemo(() => {
    if (categoryFilter === "All") return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter(q => q.category === categoryFilter);
  }, [categoryFilter]);

  const currentQ = filteredQuestions[currentIndex];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    setAnswered(a => a + 1);
    if (index === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= filteredQuestions.length) {
      setQuizComplete(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const pct = Math.round((score / answered) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Complete!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          You scored <span className="font-bold text-purple-600">{score}/{answered}</span> ({pct}%)
        </p>
        <div className="text-sm text-slate-500">
          {pct >= 90 ? "Outstanding! You're mastering ST-RADS." : 
           pct >= 70 ? "Great work! Keep studying to reach expert level." : 
           pct >= 50 ? "Good effort. Review the explanations to strengthen weak areas." : 
           "Keep studying! Review the flashcards and try again."}
        </div>
        <Button onClick={handleRestart} className="bg-purple-600 hover:bg-purple-700">
          <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
        </Button>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="text-center py-12 text-slate-500">
        No questions available for this category.
        <Button variant="outline" className="mt-4 block mx-auto" onClick={() => setCategoryFilter("All")}>Show All</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => { setCategoryFilter(cat); handleRestart(); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[32px] ${
              categoryFilter === cat ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
        <span className="font-medium text-purple-600">{score}/{answered} correct</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-5 space-y-4">
              <Badge variant="outline" className="text-xs">{currentQ.category}</Badge>
              <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">{currentQ.question}</p>
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
                {currentIndex + 1 >= filteredQuestions.length ? "See Results" : "Next Question"} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}