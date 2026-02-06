import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from "@/api/base44Client";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from '../components/MessageBubble';
import { Send, Loader2, FileSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PullToRefresh from '../components/PullToRefresh';

export default function CaseReviewPage() {
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
                agent_name: "case_review_agent",
                metadata: { name: `Case Review for ${currentUser.email}` }
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
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !conversation || isSending) return;

        const messageContent = input;
        setInput("");
        
        await base44.agents.addMessage(conversation, {
            role: "user",
            content: messageContent,
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
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You must be logged in to access the Case Review Agent.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-[calc(100vh-150px)] max-w-4xl mx-auto flex flex-col shadow-2xl border-slate-200 dark:border-slate-800">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                    <FileSearch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    AI Case Review Agent
                </CardTitle>
                <CardDescription>Ask questions about your past ST-RADS analyses.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <PullToRefresh onRefresh={initializeConversation} className="flex-1 p-4">
                    <div className="space-y-6" ref={scrollAreaRef}>
                        {messages.length === 0 ? (
                            <Alert className="bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60">
                                <AlertTitle className="font-semibold text-blue-800 dark:text-blue-200">Welcome to the Case Review Agent!</AlertTitle>
                                <AlertDescription className="text-blue-700 dark:text-blue-300">
                                    You can ask questions about your analysis history. Here are some examples:
                                    <ul className="list-disc pl-5 mt-2">
                                        <li>"Show me all my cases with a score of 4 or higher."</li>
                                        <li>"Summarize my last 3 analyses."</li>
                                        <li>"Did I have any cases with a differential diagnosis of lipoma?"</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
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
                            placeholder="Ask about your analysis history..."
                            className="flex-1 bg-white dark:bg-slate-800 min-h-[44px]"
                            disabled={isSending}
                        />
                        <Button type="submit" disabled={!input.trim() || isSending} size="icon" className="w-11 h-11 min-h-[44px] rounded-full flex-shrink-0">
                            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}