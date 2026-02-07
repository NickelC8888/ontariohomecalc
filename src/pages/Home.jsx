import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import AffordabilityCalculator from '../components/calculator/AffordabilityCalculator';
import MortgageWizard from '../components/wizard/MortgageWizard';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Top Ad Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-400 mb-2">Advertisement</p>
        <div className="bg-white border border-dashed border-slate-300 rounded h-24 flex items-center justify-center">
          <span className="text-slate-400 text-sm">AdSense Ad Space (728x90)</span>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">True Affordability</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Understand the full picture of buying a home in Ontario. Calculate mortgage payments, land transfer taxes, and upfront cash requirements in seconds.
        </p>
      </div>
      
      <AffordabilityCalculator />

      {/* Bottom Ad Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-400 mb-2">Advertisement</p>
        <div className="bg-white border border-dashed border-slate-300 rounded h-24 flex items-center justify-center">
          <span className="text-slate-400 text-sm">AdSense Ad Space (728x90)</span>
        </div>
      </div>
    </div>
  );
}