import React, { useState, useEffect } from "react";
import { User } from "@/components/User";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, ChevronDown, Crown, User as UserIcon, AlertTriangle, Home, Calculator, ArrowLeft, Menu, X } from "lucide-react";
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

const NAV_ITEMS = [
  { name: "Home", label: "Home", page: "Home", color: "" },
  { name: "Calculator", label: "ST-RADS", page: "Calculator", color: "text-blue-600 dark:text-blue-400" },
  { name: "TIRADSCalculator", label: "TI-RADS", page: "TIRADSCalculator", color: "text-amber-600 dark:text-amber-400" },
  { name: "LIRADSCalculator", label: "LI-RADS", page: "LIRADSCalculator", color: "text-emerald-600 dark:text-emerald-400" },
  { name: "BIRADSCalculator", label: "BI-RADS", page: "BIRADSCalculator", color: "text-pink-600 dark:text-pink-400" },
  { name: "LungRADSCalculator", label: "Lung-RADS", page: "LungRADSCalculator", color: "text-teal-600 dark:text-teal-400" },
  { name: "PIRADSCalculator", label: "PI-RADS", page: "PIRADSCalculator", color: "text-violet-600 dark:text-violet-400" },
  { name: "ORADSCalculator", label: "O-RADS", page: "ORADSCalculator", color: "text-rose-600 dark:text-rose-400" },
  { name: "CaseExamples", label: "Cases", page: "CaseExamples", color: "" },
  { name: "Billing", label: "Billing", page: "Billing", color: "" },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("system");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      }
    };
    if (theme === "system") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    }
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      try { setUser(await User.me()); } catch {}
    };
    fetchUser();
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === "system" ? "light" : prev === "light" ? "dark" : "system");
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-x-hidden">

      {/* Background Ambient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-400/[0.07] dark:bg-blue-600/[0.08] blur-[140px]"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-400/[0.07] dark:bg-indigo-600/[0.08] blur-[140px]"></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --sat: env(safe-area-inset-top);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
          --sar: env(safe-area-inset-right);
        }
        body, h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        html, body { overscroll-behavior-y: none; }
        button, a, .interactive { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        @media (max-width: 767px) {
          button, [role="button"], input, select, textarea, [type="radio"], [type="checkbox"] { min-height: 44px; }
          input[type="number"], input[type="text"], input[type="email"], input[type="search"], textarea { font-size: 16px; }
        }
        .glass-panel { background: rgba(255,255,255,0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
        .dark .glass-panel { background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
        .pt-safe { padding-top: var(--sat); }
        .pb-safe { padding-bottom: var(--sab); }
        .pb-safe-nav { padding-bottom: calc(var(--sab) + 4.5rem); }
      `}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 pt-safe" style={{ background: "rgba(248,250,252,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <style>{`.dark header[style] { background: rgba(3,7,18,0.85) !important; }`}</style>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Left: Logo + Back */}
            <div className="flex items-center gap-3">
              {location.pathname !== "/" && location.pathname !== "/Home" && (
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden -ml-2 text-slate-600 dark:text-slate-300 h-9 w-9">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 font-extrabold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                  RADS Calculator
                </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map(item => {
                const isActive = currentPageName === item.name;
                return (
                  <Link key={item.name} to={createPageUrl(item.page)}>
                    <button className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                        : `${item.color || "text-slate-500 dark:text-slate-400"} hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800`
                    }`}>
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              <Button onClick={toggleTheme} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 h-9">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{user.full_name?.[0] || "U"}</span>
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">{user.full_name}</span>
                      {user.subscription_tier === "premium" && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 w-48">
                    <Link to={createPageUrl("Account")}>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 px-3">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        <span>Account</span>
                        {user.subscription_tier === "premium" && <Crown className="h-3 w-3 text-amber-500 ml-auto" />}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer py-2.5 px-3 text-red-600 dark:text-red-400">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={(e) => { e.preventDefault(); User.login(); }} className="text-sm font-semibold h-9 px-3">
                    Log In
                  </Button>
                  <Button onClick={(e) => { e.preventDefault(); User.login(); }}
                    className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 h-9 px-4 rounded-full text-sm font-semibold transition-all">
                    Sign Up Free
                  </Button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
            >
              <nav className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-1.5">
                {NAV_ITEMS.map(item => {
                  const isActive = currentPageName === item.name;
                  return (
                    <Link key={item.name} to={createPageUrl(item.page)}>
                      <button className={`w-full px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                        isActive
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                          : `${item.color || "text-slate-600 dark:text-slate-300"} bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700`
                      }`}>
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-safe-nav md:pb-8 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 pb-safe z-50">
        <div className="flex justify-around items-center py-1.5 px-2">
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
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    navigate(createPageUrl(tab.name), { replace: true });
                  } else {
                    navigate(createPageUrl(tab.name));
                  }
                }}
                className={`flex flex-col items-center py-1.5 px-4 min-h-[44px] text-[10px] font-semibold rounded-xl transition-all ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <TabIcon className={`w-5 h-5 mb-0.5 ${isActive ? "" : "stroke-[1.5]"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-gray-950/40 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 font-extrabold text-lg text-slate-900 dark:text-slate-100 mb-3">
                  RADS Calculator
                </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Evidence-based radiology risk stratification tools — ST-RADS, TI-RADS, LI-RADS, BI-RADS and more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-xs uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to={createPageUrl("Calculator")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Calculator</Link></li>
                <li><Link to={createPageUrl("Premium")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Premium</Link></li>
                <li><Link to={createPageUrl("Support")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</Link></li>
                <li><Link to={createPageUrl("Billing")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Billing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                <li><span className="opacity-60">Privacy Policy</span></li>
                <li><span className="opacity-60">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-2.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 rounded-xl border border-amber-100 dark:border-amber-900/50 max-w-2xl">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. Not FDA approved. Not a diagnostic device. Results cannot replace professional medical evaluation.
                </p>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                © 2025 RADS Calculator. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}