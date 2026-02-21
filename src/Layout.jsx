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
  { name: "Home", label: "Home", page: "Home" },
  { name: "CaseExamples", label: "Cases", page: "CaseExamples" },
  { name: "Billing", label: "Billing", page: "Billing" },
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

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === "system" ? "light" : prev === "light" ? "dark" : "system");
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200 relative overflow-x-hidden antialiased">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        :root {
          --sat: env(safe-area-inset-top);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
          --sar: env(safe-area-inset-right);
        }
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        code, pre, .mono { font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace; }
        html, body { overscroll-behavior-y: none; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        button, a, .interactive { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        @media (max-width: 767px) {
          button, [role="button"], input, select, textarea, [type="radio"], [type="checkbox"] { min-height: 44px; }
          input[type="number"], input[type="text"], input[type="email"], input[type="search"], textarea { font-size: 16px; }
        }
        .pt-safe { padding-top: var(--sat); }
        .pb-safe { padding-bottom: var(--sab); }
        .pb-safe-nav { padding-bottom: calc(var(--sab) + 4.5rem); }
      `}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-900 pt-safe bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              {location.pathname !== "/" && location.pathname !== "/Home" && (
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden -ml-2 text-gray-500 dark:text-gray-400 h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center">
                  <span className="text-[10px] font-black text-white dark:text-black leading-none">R</span>
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 tracking-tight hidden sm:inline">RADS Calculator</span>
              </Link>

              {/* Desktop Nav — right of logo */}
              <nav className="hidden lg:flex items-center gap-1 ml-4 border-l border-gray-100 dark:border-gray-800 pl-4">
                {NAV_ITEMS.map(item => {
                  const isActive = currentPageName === item.name;
                  return (
                    <Link key={item.name} to={createPageUrl(item.page)}>
                      <button className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150 ${
                        isActive
                          ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                      }`}>
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Button onClick={toggleTheme} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 h-8">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white dark:text-black">{user.full_name?.[0] || "U"}</span>
                      </div>
                      <span className="hidden sm:inline text-[13px] font-medium">{user.full_name}</span>
                      {user.subscription_tier === "premium" && <Crown className="h-3 w-3 text-amber-500" />}
                      <ChevronDown className="h-3 w-3 opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 w-48 rounded-xl shadow-lg">
                    <Link to={createPageUrl("Account")}>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 px-3 text-[13px]">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span>Account</span>
                        {user.subscription_tier === "premium" && <Crown className="h-3 w-3 text-amber-500 ml-auto" />}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer py-2.5 px-3 text-[13px] text-red-600 dark:text-red-400">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={(e) => { e.preventDefault(); User.login(); }} className="text-[13px] font-medium h-8 px-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Log In
                  </Button>
                  <Button onClick={(e) => { e.preventDefault(); User.login(); }}
                    className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-black h-8 px-4 rounded-lg text-[13px] font-medium transition-all shadow-none">
                    Sign Up
                  </Button>
                </div>
              )}

              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-900 overflow-hidden"
            >
              <nav className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-1">
                {NAV_ITEMS.map(item => {
                  const isActive = currentPageName === item.name;
                  return (
                    <Link key={item.name} to={createPageUrl(item.page)}>
                      <button className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
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
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10 pb-safe-nav md:pb-10 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -4, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-900 pb-safe z-50">
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
                className={`flex flex-col items-center py-1.5 px-4 min-h-[44px] text-[10px] font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                <TabIcon className={`w-5 h-5 mb-0.5 ${isActive ? "stroke-[2]" : "stroke-[1.5]"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/50 pb-24 md:pb-0">
        <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-gray-900 dark:bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-white dark:text-black leading-none">R</span>
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">RADS Calculator</span>
              </div>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                Evidence-based radiology risk stratification tools for clinical and educational use.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-[13px]">Resources</h4>
              <ul className="space-y-2.5 text-[13px] text-gray-500 dark:text-gray-400">
                <li><Link to={createPageUrl("Calculator")} className="hover:text-gray-900 dark:hover:text-white transition-colors">Calculator</Link></li>
                <li><Link to={createPageUrl("Premium")} className="hover:text-gray-900 dark:hover:text-white transition-colors">Premium</Link></li>
                <li><Link to={createPageUrl("Support")} className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</Link></li>
                <li><Link to={createPageUrl("Billing")} className="hover:text-gray-900 dark:hover:text-white transition-colors">Billing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-[13px]">Legal</h4>
              <ul className="space-y-2.5 text-[13px] text-gray-400 dark:text-gray-500">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 dark:border-gray-900">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-lg max-w-2xl">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-gray-600 dark:text-gray-300">Disclaimer:</strong> For educational and research purposes only. Not FDA approved. Not a diagnostic device.
                </p>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-600">
                © 2025 RADS Calculator
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}