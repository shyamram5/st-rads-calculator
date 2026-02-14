import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, ChevronDown, Crown, User as UserIcon, AlertTriangle, Info, Home, Calculator, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const TAB_ROOTS = {
  Home: "Home",
  Calculator: "Calculator",
  Account: "Account",
};

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("system");
  const location = useLocation();
  const navigate = useNavigate();
  const prevTabRef = React.useRef(currentPageName);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
        if (theme === "system") {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(e.matches ? "dark" : "light");
        }
    };
    
    // Initial set
    if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Handle manual theme overrides
  useEffect(() => {
    if (theme !== "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(prev => {
        if (prev === "system") return "light";
        if (prev === "light") return "dark";
        return "system";
    });
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
                  :root {
                      --sat: env(safe-area-inset-top);
                      --sab: env(safe-area-inset-bottom);
                      --sal: env(safe-area-inset-left);
                      --sar: env(safe-area-inset-right);
                  }
                  body, h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label {
                      font-family: 'Inter', sans-serif;
                  }
                  html, body {
                      overscroll-behavior-y: none; /* Disable pull-to-refresh/bounce */
                  }
                  button, a, .interactive {
                     user-select: none;
                     -webkit-user-select: none;
                     -webkit-touch-callout: none;
                  }
                  /* Mobile touch targets - min 44px */
                  @media (max-width: 767px) {
                     button, [role="button"], input, select, textarea, [type="radio"], [type="checkbox"] {
                         min-height: 44px;
                     }
                     input[type="number"], input[type="text"], input[type="email"], input[type="search"], textarea {
                         font-size: 16px; /* Prevent iOS zoom */
                     }
                  }
                  .page-content {
                      /* Removed legacy animation for Framer Motion */
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
                  /* Safe area padding classes */
                  .pt-safe { padding-top: var(--sat); }
                  .pb-safe { padding-bottom: var(--sab); }
                  .pl-safe { padding-left: var(--sal); }
                  .pr-safe { padding-right: var(--sar); }
                  .pb-safe-nav { padding-bottom: calc(var(--sab) + 4rem); } /* For bottom tab bar spacing */
              `}</style>
            <header className="glass-panel sticky top-4 z-50 mx-4 sm:mx-8 rounded-2xl mt-4 transition-all duration-300 pt-safe">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-4">
                            {/* Back Button (Mobile Only, not on Home) */}
                            {location.pathname !== "/" && location.pathname !== "/Home" && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate(-1)}
                                    className="md:hidden -ml-2 text-slate-700 dark:text-slate-200"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}
                            
                            <Link to={createPageUrl("Home")} className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100">
                                {/* You can add a logo here in the future */}
                                RADS Calc
                            </Link>
                        </div>
                        
                        <nav className="hidden md:flex items-center gap-2">
                             <Link to={createPageUrl("Home")}>
                                <Button variant={currentPageName === 'Home' ? 'secondary' : 'ghost'} className="font-semibold">Home</Button>
                            </Link>
                             <Link to={createPageUrl("Calculator")}>
                                <Button variant={currentPageName === 'Calculator' ? 'secondary' : 'ghost'} className="font-semibold">Calculator</Button>
                            </Link>
                            <Link to={createPageUrl("CaseExamples")}>
                                                  <Button variant={currentPageName === 'CaseExamples' ? 'secondary' : 'ghost'} className="font-semibold">Cases</Button>
                                              </Link>
                                              <Link to={createPageUrl("StudyAssistant")}>
                                                  <Button variant={currentPageName === 'StudyAssistant' ? 'secondary' : 'ghost'} className="font-semibold">Study</Button>
                                              </Link>
                                               <Link to={createPageUrl("Billing")}>
                                                  <Button variant={currentPageName === 'Billing' ? 'secondary' : 'ghost'} className="font-semibold">Billing</Button>
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
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-safe-nav md:pb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

             {/* Mobile Bottom Tab Bar */}
             <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
                 <div className="flex justify-around items-center p-2">
                     {[
                       { name: "Home", icon: Home, label: "Home" },
                       { name: "Calculator", icon: Calculator, label: "Calc" },
                        { name: "Account", icon: UserIcon, label: "Account" },
                     ].map(tab => {
                       const isActive = currentPageName === tab.name;
                       const TabIcon = tab.icon;
                       return (
                         <button
                           key={tab.name}
                           onClick={() => {
                             if (isActive) {
                               // Re-tap active tab: scroll to top & navigate to root
                               window.scrollTo({ top: 0, behavior: "smooth" });
                               navigate(createPageUrl(tab.name), { replace: true });
                             } else {
                               navigate(createPageUrl(tab.name));
                             }
                           }}
                           className={`flex flex-col items-center p-2 min-h-[44px] text-xs font-medium transition-colors ${
                             isActive
                               ? "text-blue-600 dark:text-blue-400"
                               : "text-slate-500 dark:text-slate-400"
                           }`}
                         >
                           <TabIcon className="w-6 h-6 mb-1" />
                           {tab.label}
                         </button>
                       );
                     })}
                 </div>
             </div>

             <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm pb-24 md:pb-0">
                 <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                     <div className="grid md:grid-cols-4 gap-8 mb-8">
                         <div className="col-span-2">
                             <Link to={createPageUrl("Home")} className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-4 block">
                                 RADS Calculator
                             </Link>
                             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                 Evidence-based radiology risk stratification tools — ST-RADS, LI-RADS, BI-RADS and more.
                             </p>
                         </div>
                         <div>
                             <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Resources</h4>
                             <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">

                                 <li><Link to={createPageUrl("Calculator")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Calculator</Link></li>
                                 <li><Link to={createPageUrl("Premium")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Premium</Link></li>
                                 <li><Link to={createPageUrl("StudyAssistant")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Study Assistant</Link></li>
                                      <li><Link to={createPageUrl("Support")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</Link></li>
                                      <li><Link to={createPageUrl("Billing")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Billing</Link></li>
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
                                   © 2025 RADS Calculator. All rights reserved.
                               </p>
                          </div>
                     </div>
                 </div>
             </footer>
        </div>
  );
}