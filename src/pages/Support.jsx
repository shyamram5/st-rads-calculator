import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Support
          </CardTitle>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Need help with the ST-RADS Calculator? We're here for you.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email us at</p>
              <a
                href="mailto:shyam1997ram@gmail.com"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg"
              >
                shyam1997ram@gmail.com
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            We typically respond within 24–48 hours. Please include as much detail as possible about your issue so we can assist you quickly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}