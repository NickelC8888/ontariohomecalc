import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Home as HomeIcon, MapPin, User, LogOut, LogIn, DollarSign, Shield } from 'lucide-react';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdSenseBanner from '@/components/AdSenseBanner';

const NAV_PAGES = [
  { key: 'Home', label: 'Calculator', icon: null },
  { key: 'LandTransferTax', label: 'Land Transfer Tax', icon: null },
  { key: 'SavedScenarios', label: 'My Scenarios', icon: null },
  { key: 'MonthlyBudget', label: 'Monthly Budget Calculator', icon: null },
  { key: 'RentalCalculator', label: 'Rental Calculator', icon: null },
];

const DROPDOWN_PAGES = [
  { key: 'Profile', label: 'Profile', icon: User },
  { key: 'LandTransferTax', label: 'Land Transfer Tax', icon: DollarSign },
  { key: 'SavedScenarios', label: 'My Scenarios', icon: Calculator },
  { key: 'MonthlyBudget', label: 'Monthly Budget Calculator', icon: DollarSign },
  { key: 'RentalCalculator', label: 'Rental Calculator', icon: DollarSign },
];

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageVisibility, setPageVisibility] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        const settings = await base44.entities.AppSettings.filter({ setting_key: 'page_visibility' });
        if (settings.length > 0 && settings[0].page_visibility) {
          setPageVisibility(settings[0].page_visibility);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const isPageVisible = (pageKey) => {
    if (!pageVisibility || !user) return true;
    const role = user.role || 'user';
    const pageSetting = pageVisibility[pageKey];
    if (!pageSetting) return true;
    return pageSetting[role] !== false;
  };

  const handleSignOut = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const handleSignIn = () => {
    base44.auth.redirectToLogin(window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top AdSense Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-2">
          <AdSenseBanner slot="top-banner" format="horizontal" className="min-h-[90px]" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Ontario<span className="text-emerald-600">Home</span>Calc
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            {user && (
              <>
                {NAV_PAGES.filter(p => isPageVisible(p.key)).map(p => (
                  <Link
                    key={p.key}
                    to={createPageUrl(p.key)}
                    className="hidden md:block text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    {p.label}
                  </Link>
                ))}
                <Link 
                    to={createPageUrl('Profile')}
                    className="hidden md:block text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                >
                    Profile
                </Link>
              </>
            )}
            <div className="hidden md:flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
              Ontario, Canada
            </div>

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">{user.full_name || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {DROPDOWN_PAGES.filter(p => p.key === 'Profile' || isPageVisible(p.key)).map(p => (
                        <DropdownMenuItem key={p.key} asChild>
                          <Link to={createPageUrl(p.key)} className="cursor-pointer">
                            <p.icon className="w-4 h-4 mr-2" />
                            {p.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl('Admin')} className="cursor-pointer text-red-600">
                              <Shield className="w-4 h-4 mr-2" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={handleSignIn} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {children}
          </div>

          {/* Right Side AdSense Banner */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <AdSenseBanner slot="sidebar" format="vertical" className="min-h-[600px]" />
            </div>
          </aside>
        </div>
      </main>

      {/* Bottom AdSense Banner */}
      <div className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <AdSenseBanner slot="bottom-banner" format="horizontal" className="min-h-[90px]" />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} OntarioHomeCalc. For estimation purposes only.</p>
        </div>
      </footer>
    </div>
  );
}