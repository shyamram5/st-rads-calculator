import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock, User, Bot } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FunctionDisplay = ({ toolCall }) => {
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;
    
    const parsedResults = (() => {
        if (!results) return null;
        try {
            return typeof results === 'string' ? JSON.parse(results) : results;
        } catch {
            return results;
        }
    })();
    
    const isError = status === 'failed' || status === 'error' || (parsedResults?.success === false);
    
    const statusConfig = {
        pending: { icon: Clock, color: 'text-slate-400', text: 'Pending' },
        running: { icon: Loader2, color: 'text-slate-500', text: 'Running...', spin: true },
        in_progress: { icon: Loader2, color: 'text-slate-500', text: 'Running...', spin: true },
        completed: isError ? 
            { icon: AlertCircle, color: 'text-red-500', text: 'Failed' } : 
            { icon: CheckCircle2, color: 'text-green-600', text: 'Success' },
        success: { icon: CheckCircle2, color: 'text-green-600', text: 'Success' },
        failed: { icon: AlertCircle, color: 'text-red-500', text: 'Failed' },
        error: { icon: AlertCircle, color: 'text-red-500', text: 'Failed' }
    }[status] || { icon: Zap, color: 'text-slate-500', text: '' };
    
    const Icon = statusConfig.icon;
    const formattedName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all w-full text-left",
                    "hover:bg-slate-50 dark:hover:bg-slate-700/50",
                    expanded ? "bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                )}
            >
                <Icon className={cn("h-4 w-4", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{formattedName}</span>
                {statusConfig.text && (
                    <span className={cn("text-slate-500 dark:text-slate-400", isError && "text-red-600")}>
                        • {statusConfig.text}
                    </span>
                )}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (
                    <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform ml-auto", 
                        expanded && "rotate-90")} />
                )}
            </button>
            
            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 py-2">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Parameters:</div>
                            <pre className="bg-slate-100 dark:bg-slate-900 rounded-md p-2 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2);
                                    } catch {
                                        return toolCall.arguments_string;
                                    }
                                })()}
                            </pre>
                        </div>
                    )}
                    {parsedResults && (
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Result:</div>
                            <pre className="bg-slate-100 dark:bg-slate-900 rounded-md p-2 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap max-h-48 overflow-auto">
                                {typeof parsedResults === 'object' ? 
                                    JSON.stringify(parsedResults, null, 2) : String(parsedResults)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function MessageBubble({ message, userName }) {
    const isUser = message.role === 'user';
    const isAgent = message.role === 'assistant';

    return (
        <div className={cn("flex items-start gap-3 w-full", isUser ? "justify-end" : "")}>
            {isAgent && (
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                        <Bot className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={cn("flex flex-col gap-1.5 max-w-[85%]", isUser ? "items-end" : "items-start")}>
                {message.content && (
                    <div className={cn(
                        "rounded-xl px-4 py-2.5",
                        isUser 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none"
                    )}>
                        <ReactMarkdown 
                            className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                            components={{
                                code: ({ inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="relative group/code my-2">
                                            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs overflow-x-auto">
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover/code:opacity-100 bg-slate-800 hover:bg-slate-700"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                                    toast.success('Code copied');
                                                }}
                                            >
                                                <Copy className="h-3 w-3 text-slate-400" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono">
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({ children, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}</a>,
                                p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-1">{children}</ol>,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
                
                {message.tool_calls?.length > 0 && (
                    <div className="space-y-1 w-full mt-1">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}
            </div>
            {isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        <User className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}