import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import { FLASHCARDS } from "./quizData";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashcardMode() {
  const [cards, setCards] = useState(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleShuffle = () => {
    const shuffled = [...FLASHCARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex(i => (i - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex(i => (i + 1) % cards.length);
  };

  const card = cards[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <Button variant="outline" size="sm" onClick={handleShuffle} className="gap-2">
          <Shuffle className="w-3.5 h-3.5" /> Shuffle
        </Button>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
      </div>

      <div className="perspective-[1000px] min-h-[280px] sm:min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (flipped ? "-back" : "-front")}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setFlipped(f => !f)}
            className="cursor-pointer select-none"
          >
            <div className={`rounded-2xl border-2 p-6 sm:p-8 min-h-[260px] flex flex-col justify-center items-center text-center transition-colors ${
              flipped
                ? "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            }`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                {flipped ? "Answer" : "Term / Concept"}
              </p>
              <p className={`leading-relaxed whitespace-pre-line ${
                flipped 
                  ? "text-sm sm:text-base text-purple-900 dark:text-purple-100" 
                  : "text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
              }`}>
                {flipped ? card.back : card.front}
              </p>
              <p className="text-xs text-slate-400 mt-6">{flipped ? "Tap to see term" : "Tap to reveal answer"}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={handlePrev} className="w-12 h-12 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setFlipped(f => !f)} className="w-12 h-12 rounded-full">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} className="w-12 h-12 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}