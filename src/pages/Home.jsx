import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, User as UserIcon, FileUp, ClipboardCheck, Activity, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getStats } from "@/functions/getStats";


export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      }
    };
    checkUser();

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const { data } = await getStats();
        if (data) {
          setTotalAnalyses(data.totalAnalyses || 0);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-16 relative">
                 {/* Grid pattern overlay - background removed to show global liquid effect */}
                 <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none">
                    <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 </div>
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Badge className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 text-xs font-medium border border-blue-200 dark:border-blue-800 rounded-full shadow-sm">
                        ✨ AI-Powered ST-RADS v2025 Analysis
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 via-blue-800 to-slate-600 dark:from-white dark:via-blue-100 dark:to-blue-300 bg-clip-text text-transparent leading-[1.1] pb-2 drop-shadow-sm">
                        ST-RADS Calculator
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Instant, AI-powered ST-RADS v2025 classification for soft tissue lesions using MRI imaging.
                    </p>
                 </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <Link to={createPageUrl("Calculator")}>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 rounded-full hover:-translate-y-0.5">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Start Analysis
                        </Button>
                    </Link>
                    {!user &&
                <Button
                variant="outline"
                size="lg"
                onClick={() => User.login()}
                className="py-6 px-8 text-lg font-medium border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 rounded-full hover:-translate-y-0.5">
                            <UserIcon className="mr-2 h-5 w-5" />
                            Sign Up Free
                        </Button>
                }
                </div>
            </div>

            {/* Community Stats */}
            <Card className="glass-panel max-w-sm mx-auto overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                    <div className="relative p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-full w-fit mx-auto mb-4 ring-1 ring-indigo-100 dark:ring-indigo-900">
                      <Activity className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  {statsLoading ?
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto my-2" /> :
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                      {totalAnalyses.toLocaleString()}
                    </p>
                  }
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Total Analyses Performed
                  </p>
                </div>
                <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Launch Date: July 21, 2025</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How It Works Section */}
            <div className="text-center space-y-12">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                        How It Works
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Three simple steps to get your analysis</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Step 1 */}
                    <Card className="group glass-panel hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl w-fit mx-auto group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors duration-300">
                                <FileUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Upload MRI Slices</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Securely upload T1, T2, and post-contrast MRI images for comprehensive analysis.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 2 */}
                    <Card className="group glass-panel hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl w-fit mx-auto group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                                <ClipboardCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Follow Flowchart</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Follow the interactive ST-RADS algorithm to pinpoint key imaging characteristics.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 3 */}
                    <Card className="group glass-panel hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl w-fit mx-auto group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors duration-300">
                                <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. AI Analysis</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Receive an instant, detailed ST-RADS score and management recommendation.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

             <div className="py-12">
                <div className="flex justify-center">
                    <Link to={createPageUrl("Calculator")}>
                        <Button size="lg" className="bg-blue-600 text-white px-8 py-3 text-base font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full ring-offset-background transition-all duration-300 hover:bg-blue-700 h-12 shadow-lg hover:shadow-xl">
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Start Your First Analysis
                        </Button>
                    </Link>
                </div>
            </div>
        </div>);
}