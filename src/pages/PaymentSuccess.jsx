import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentSuccessPage() {
    
    // Optional: Add confetti effect on mount
    useEffect(() => {
        // A simple confetti implementation
        const confettiCount = 100;
        const parent = document.getElementById('success-card');
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.innerHTML = ['🎉', '🎊', '🥳', '✨', '💖'][Math.floor(Math.random() * 5)];
            confetti.style.position = 'absolute';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${-20 + Math.random() * 120}%`;
            confetti.style.fontSize = `${1 + Math.random() * 2}rem`;
            confetti.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            parent.appendChild(confetti);
        }
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card id="success-card" className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center relative overflow-hidden">
                <CardHeader>
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4 border-4 border-green-200 dark:border-green-800">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Welcome to Premium! Your account has been upgraded. You now have unlimited access to all features.
                    </p>
                    <Link to={createPageUrl("Calculator")}>
                        <Button 
                            size="lg"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3"
                        >
                            <PartyPopper className="mr-2 h-5 w-5"/>
                            Start Analyzing
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}