import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, ChevronDown, Crown, User as UserIcon, AlertTriangle, Info, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark"); // Defaulting to dark

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // Not logged in
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme) {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-x-hidden">

            {/* Liquid Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/20 blur-[120px] animate-pulse-slow" style={{animationDelay: "2s"}}></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[100px] animate-pulse-slow" style={{animationDelay: "4s"}}></div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body, h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label {
                    font-family: 'Inter', sans-serif;
                }
                .page-content {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-pulse-slow {
                    animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
                .dark .glass-panel {
                    background: rgba(17, 24, 39, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                }
            `}</style>
            <header className="glass-panel sticky top-4 z-50 mx-4 sm:mx-8 rounded-2xl mt-4 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-4">
                            <Link to={createPageUrl("Home")} className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100">
                                {/* You can add a logo here in the future */}
                                ST-RADS Calc
                            </Link>
                        </div>
                        
                        <nav className="hidden md:flex items-center gap-2">
                             <Link to={createPageUrl("Home")}>
                                <Button variant={currentPageName === 'Home' ? 'secondary' : 'ghost'} className="font-semibold">Home</Button>
                            </Link>
                             <Link to={createPageUrl("Calculator")}>
                                <Button variant={currentPageName === 'Calculator' ? 'secondary' : 'ghost'} className="font-semibold">Calculator</Button>
                            </Link>
                            {user && user.subscription_tier === 'premium' && (
                                <Link to={createPageUrl("CaseReview")}>
                                    <Button variant={currentPageName === 'CaseReview' ? 'secondary' : 'ghost'} className="font-semibold">AI Review</Button>
                                </Link>
                            )}
                             <Link to={createPageUrl("About")}>
                                <Button variant={currentPageName === 'About' ? 'secondary' : 'ghost'} className="font-semibold">About</Button>
                            </Link>
                        </nav>
                        
                        <div className="flex items-center gap-2">
                            {user && user.subscription_tier !== "premium" &&
                                <Link to={createPageUrl("Premium")}>
                                    <Button variant="ghost" className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400 px-4 py-2 flex items-center gap-2 transition-colors rounded-full font-semibold border border-amber-200 dark:border-amber-800">
                                        <Crown className="w-4 h-4" />
                                        Upgrade
                                    </Button>
                                </Link>
                            }
                             <Button onClick={toggleTheme} variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-500/10 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                            {user ?
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors">
                                            <span className="font-medium">{user.full_name}</span>
                                            {user.subscription_tier === "premium" && <Crown className="h-4 w-4 text-amber-500" />}
                                            <ChevronDown className="h-4 w-4 opacity-70" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 w-48">
                                        <Link to={createPageUrl("Account")}>
                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:!bg-slate-100 focus:!bg-slate-100 dark:hover:!bg-slate-800 dark:focus:!bg-slate-800 py-2 px-3">
                                                <UserIcon className="h-4 w-4 text-slate-500" />
                                                <span>Account</span>
                                                {user.subscription_tier === "premium" && <Crown className="h-3 w-3 text-amber-500 ml-auto" />}
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer hover:!bg-slate-100 focus:!bg-slate-100 dark:hover:!bg-slate-800 dark:focus:!bg-slate-800 py-2 px-3">
                                            <LogOut className="h-4 w-4 text-slate-500" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> :
                                <div className="flex items-center gap-2">
                                     <Button
                                        variant="ghost"
                                        onClick={() => User.login()}
                                        className="font-semibold"
                                     >
                                        Log In
                                    </Button>
                                    <Button
                                        onClick={() => User.login()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
                                        Sign Up Free
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
                {children}
            </main>
             <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
                 <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                     <div className="grid md:grid-cols-4 gap-8 mb-8">
                         <div className="col-span-2">
                             <Link to={createPageUrl("Home")} className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-4 block">
                                 ST-RADS Calculator
                             </Link>
                             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                 Advanced AI-powered analysis for soft tissue lesions using the latest ST-RADS v2025 guidelines.
                             </p>
                         </div>
                         <div>
                             <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Resources</h4>
                             <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                 <li><Link to={createPageUrl("About")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
                                 <li><Link to={createPageUrl("Calculator")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Calculator</Link></li>
                                 <li><Link to={createPageUrl("Premium")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Premium</Link></li>
                             </ul>
                         </div>
                         <div>
                             <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Legal</h4>
                             <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                 <li><span className="cursor-not-allowed opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</span></li>
                                 <li><span className="cursor-not-allowed opacity-70 hover:opacity-100 transition-opacity">Terms of Service</span></li>
                             </ul>
                         </div>
                     </div>
                     <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                               <div className="flex items-start gap-3 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-5 py-4 rounded-xl border border-amber-100 dark:border-amber-900/50 max-w-2xl">
                                   <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                   <p className="text-xs leading-relaxed">
                                       <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. Not FDA approved. Not a diagnostic device. Results cannot replace professional medical evaluation.
                                   </p>
                               </div>
                               <p className="text-xs text-slate-400 font-medium">
                                   © 2025 ST-RADS Calculator. All rights reserved.
                               </p>
                          </div>
                     </div>
                 </div>
             </footer>
        </div>
  );
}