import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Home as HomeIcon, MapPin } from 'lucide-react';
import { createPageUrl } from './utils';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
                to={createPageUrl('SavedScenarios')}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
                My Scenarios
            </Link>
            <Link 
                to={createPageUrl('Profile')}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
                Profile
            </Link>
            <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
              Ontario, Canada
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} OntarioHomeCalc. For estimation purposes only.</p>
        </div>
      </footer>
    </div>
  );
}