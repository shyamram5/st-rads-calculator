import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900 max-w-md w-full text-center">
                 <CardHeader>
                    <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-4 border-4 border-red-200 dark:border-red-800">
                        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">Payment Canceled</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Your transaction was not completed. You can return to the previous page to try again.
                    </p>
                    <Link to={createPageUrl("Premium")}>
                        <Button 
                            variant="outline"
                            size="lg"
                            className="w-full py-3"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return to Upgrade Page
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}