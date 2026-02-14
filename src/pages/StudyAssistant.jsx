import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from "@/api/base44Client";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MessageBubble from '../components/MessageBubble';
import { Send, Loader2, GraduationCap, BookOpen, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PullToRefresh from '../components/PullToRefresh';

const STARTER_PROMPTS = [
  { label: "Explain ST-RADS Categories", prompt: "Can you explain all the ST-RADS categories (0-6) and what each one means?" },
  { label: "Lipomatous Tumor Imaging", prompt: "What MRI features help distinguish a simple lipoma from an atypical lipomatous tumor?" },
  { label: "ADC Thresholds", prompt: "What ADC thresholds are used in ST-RADS to differentiate benign from malignant lesions?" },
  { label: "Fascial Tail Sign", prompt: "What is the fascial tail sign and which tumors is it associated with?" },
  { label: "Walk Me Through a Case", prompt: "Can you walk me through the ST-RADS flowchart for an intramuscular lesion with heterogeneous T2 signal and perilesional edema?" },
  { label: "Nerve Sheath Tumors", prompt: "How do I differentiate benign from malignant peripheral nerve sheath tumors on MRI?" },
];

export default function StudyAssistantPage() {
    const [user, setUser] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const scrollAreaRef = useRef(null);

    const initializeConversation = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);

            const conv = await base44.agents.createConversation({
                agent_name: "radiology_tutor",
                metadata: { name: `Study Session - ${new Date().toLocaleDateString()}` }
            });
            setConversation(conv);
        } catch (error) {
            console.error("Initialization failed:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeConversation();
    }, [initializeConversation]);

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
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || !conversation || isSending) return;

        const messageContent = input;
        setInput("");
        
        await base44.agents.addMessage(conversation, {
            role: "user",
            content: messageContent,
        });
    };

    const handleStarterPrompt = async (prompt) => {
        if (!conversation || isSending) return;
        setInput("");
        await base44.agents.addMessage(conversation, {
            role: "user",
            content: prompt,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }
    
    if (!user) {
        return (
            <Card className="max-w-xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Login Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">You must be logged in to access the Study Assistant.</p>
                    <Button onClick={() => User.login()}>Log In</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[calc(100vh-150px)] max-w-4xl mx-auto flex flex-col shadow-2xl border-slate-200 dark:border-slate-800">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 py-4">
                <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    Radiology Study Assistant
                </CardTitle>
                <CardDescription>Learn about ST-RADS, MRI findings, tumor subtypes, and differential diagnosis.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <PullToRefresh onRefresh={initializeConversation} className="flex-1 p-4">
                    <div className="space-y-6" ref={scrollAreaRef}>
                        {messages.length === 0 ? (
                            <div className="space-y-6">
                                <Alert className="bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    <AlertTitle className="font-semibold text-purple-800 dark:text-purple-200">Welcome to the Study Assistant</AlertTitle>
                                    <AlertDescription className="text-purple-700 dark:text-purple-300">
                                        I'm your radiology tutor powered by the latest ST-RADS literature. Ask me anything about soft-tissue tumor imaging, the ST-RADS categories, MRI findings, or differential diagnosis.
                                    </AlertDescription>
                                </Alert>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> Quick Start Topics
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {STARTER_PROMPTS.map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleStarterPrompt(item.prompt)}
                                                className="text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700"
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <MessageBubble key={index} message={msg} userName={user.full_name} />
                            ))
                        )}
                        {isSending && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                             <div className="flex items-start gap-3 w-full">
                                <MessageBubble message={{role: 'assistant', content: 'Thinking...'}}/>
                             </div>
                        )}
                    </div>
                </PullToRefresh>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-gray-900/50">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about ST-RADS, MRI findings, tumor types..."
                            className="flex-1 bg-white dark:bg-slate-800 min-h-[44px]"
                            disabled={isSending}
                        />
                        <Button type="submit" disabled={!input.trim() || isSending} size="icon" className="w-11 h-11 min-h-[44px] rounded-full flex-shrink-0 bg-purple-600 hover:bg-purple-700">
                            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}