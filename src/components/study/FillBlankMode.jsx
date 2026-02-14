import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Lightbulb, Eye } from "lucide-react";
import { FILL_IN_BLANKS } from "./quizData";
import { motion, AnimatePresence } from "framer-motion";

export default function FillBlankMode() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [complete, setComplete] = useState(false);

  const questions = FILL_IN_BLANKS;
  const current = questions[currentIndex];

  const isCorrect = useMemo(() => {
    if (!submitted) return null;
    return userAnswer.trim().toLowerCase() === current.answer.toLowerCase();
  }, [submitted, userAnswer, current]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || submitted) return;
    setSubmitted(true);
    setAnswered(a => a + 1);
    if (userAnswer.trim().toLowerCase() === current.answer.toLowerCase()) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setComplete(true);
    } else {
      setCurrentIndex(i => i + 1);
      setUserAnswer("");
      setSubmitted(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setShowHint(false);
    setScore(0);
    setAnswered(0);
    setComplete(false);
  };

  if (complete) {
    const pct = Math.round((score / answered) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Done!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          You got <span className="font-bold text-emerald-600">{score}/{answered}</span> correct ({pct}%)
        </p>
        <Button onClick={handleRestart} className="bg-purple-600 hover:bg-purple-700">
          <RotateCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  const parts = current.text.split("___");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span className="font-medium text-purple-600">{score}/{answered} correct</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-5 space-y-5">
              <Badge variant="outline" className="text-xs">{current.category}</Badge>
              
              <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
                {parts[0]}
                <span className={`inline-block mx-1 px-3 py-1 rounded-lg border-2 border-dashed min-w-[60px] text-center font-bold ${
                  submitted
                    ? isCorrect
                      ? "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                      : "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 line-through"
                    : "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300"
                }`}>
                  {submitted ? (isCorrect ? userAnswer : userAnswer || "?") : "___"}
                </span>
                {submitted && !isCorrect && (
                  <span className="inline-block mx-1 px-3 py-1 rounded-lg border-2 border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 font-bold">
                    {current.answer}
                  </span>
                )}
                {parts[1]}
              </p>

              {!submitted && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 bg-white dark:bg-slate-800"
                    autoFocus
                  />
                  <Button type="submit" disabled={!userAnswer.trim()} className="bg-purple-600 hover:bg-purple-700">
                    Check
                  </Button>
                </form>
              )}

              {!submitted && !showHint && (
                <button onClick={() => setShowHint(true)} className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  <Lightbulb className="w-3.5 h-3.5" /> Show hint
                </button>
              )}

              {showHint && !submitted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-sm text-amber-800 dark:text-amber-200">
                  <Lightbulb className="w-4 h-4 inline mr-2" />{current.hint}
                </motion.div>
              )}

              {submitted && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium ${
                    isCorrect ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                  }`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
                  {isCorrect ? "Correct!" : `The answer is: ${current.answer}`}
                </motion.div>
              )}
            </CardContent>
          </Card>
          {submitted && (
            <div className="flex justify-end mt-3">
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                {currentIndex + 1 >= questions.length ? "See Results" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}