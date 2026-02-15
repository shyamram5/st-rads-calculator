import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from "@/api/base44Client";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MessageBubble from '../components/MessageBubble';
import { Send, Loader2, GraduationCap, BookOpen, Sparkles, BrainCircuit, MessageSquare, Crown, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PullToRefresh from '../components/PullToRefresh';
import QuizMode from '../components/study/QuizMode';

const MODES = [
  { id: "quiz", label: "Question Bank", icon: BrainCircuit, description: "100 clinical vignette questions" },
  { id: "chat", label: "AI Tutor", icon: MessageSquare, description: "Ask anything" },
];

const STARTER_PROMPTS = [
  { label: "Explain ST-RADS Categories", prompt: "Can you explain all the ST-RADS categories (0-6) and what each one means?" },
  { label: "Lipomatous Tumor Imaging", prompt: "What MRI features help distinguish a simple lipoma from an atypical lipomatous tumor?" },
  { label: "ADC Thresholds", prompt: "What ADC thresholds are used in ST-RADS to differentiate benign from malignant lesions?" },
  { label: "Fascial Tail Sign", prompt: "What is the fascial tail sign and which tumors is it associated with?" },
  { label: "Walk Me Through a Case", prompt: "Can you walk me through the ST-RADS flowchart for an intramuscular lesion with heterogeneous T2 signal and perilesional edema?" },
  { label: "Nerve Sheath Tumors", prompt: "How do I differentiate benign from malignant peripheral nerve sheath tumors on MRI?" },
];

function ChatMode({ user }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef(null);

  const initializeConversation = useCallback(async () => {
    setIsLoading(true);
    const conv = await base44.agents.createConversation({
      agent_name: "radiology_tutor",
      metadata: { name: `Study Session - ${new Date().toLocaleDateString()}` }
    });
    setConversation(conv);
    setIsLoading(false);
  }, []);

  useEffect(() => { initializeConversation(); }, [initializeConversation]);

  useEffect(() => {
    if (!conversation) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages.filter(m => m.role !== 'system'));
      setIsSending(data.status === 'running');
    });
    return () => unsubscribe();
  }, [conversation]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !conversation || isSending) return;
    const messageContent = input;
    setInput("");
    await base44.agents.addMessage(conversation, { role: "user", content: messageContent });
  };

  const handleStarterPrompt = async (prompt) => {
    if (!conversation || isSending) return;
    await base44.agents.addMessage(conversation, { role: "user", content: prompt });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="space-y-6">
              <Alert className="bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <AlertTitle className="font-semibold text-purple-800 dark:text-purple-200">AI Tutor</AlertTitle>
                <AlertDescription className="text-purple-700 dark:text-purple-300">
                  Ask me anything about ST-RADS, MRI findings, tumor subtypes, or differential diagnosis.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((item, i) => (
                  <button key={i} onClick={() => handleStarterPrompt(item.prompt)}
                    className="text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} userName={user.full_name} />
            ))
          )}
          {isSending && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <MessageBubble message={{role: 'assistant', content: 'Thinking...'}}/>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-gray-900/50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ST-RADS, MRI findings, tumor types..."
            className="flex-1 bg-white dark:bg-slate-800 min-h-[44px]" disabled={isSending} />
          <Button type="submit" disabled={!input.trim() || isSending} size="icon" className="w-11 h-11 min-h-[44px] rounded-full flex-shrink-0 bg-purple-600 hover:bg-purple-700">
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function StudyAssistantPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("quiz");

  useEffect(() => {
    const fetchUser = async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-200px)]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (!user) {
    return (
      <Card className="max-w-xl mx-auto mt-8">
        <CardHeader><CardTitle>Login Required</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">Log in to access the Study Assistant.</p>
          <Button onClick={() => User.login()}>Log In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Study Assistant</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">CORE-style ST-RADS question bank & AI tutor</p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {MODES.map(mode => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button key={mode.id} onClick={() => setActiveMode(mode.id)}
              className={`flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all text-center min-h-[44px] ${
                isActive
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-700"
              }`}>
              <Icon className={`w-5 h-5 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
              <span className="text-sm font-semibold">{mode.label}</span>
              <span className="text-[11px] opacity-70 hidden sm:block">{mode.description}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeMode === "chat" ? (
        <Card className="h-[calc(100vh-320px)] flex flex-col shadow-xl border-slate-200 dark:border-slate-800 overflow-hidden">
          <ChatMode user={user} />
        </Card>
      ) : (
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 sm:p-6">
            <QuizMode />
          </CardContent>
        </Card>
      )}
    </div>
  );
}