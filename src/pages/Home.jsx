import React from 'react';
import AffordabilityCalculator from '../components/calculator/AffordabilityCalculator';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">True Affordability</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Understand the full picture of buying a home in Ontario. Calculate mortgage payments, land transfer taxes, and upfront cash requirements in seconds.
        </p>
      </div>
      
      <AffordabilityCalculator />
    </div>
  );
}