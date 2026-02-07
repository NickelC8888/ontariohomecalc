import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '../../utils';

export default function MortgageWizard({ open, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    price: '',
    downPaymentPercent: 20,
    isToronto: null,
    isFirstTimeBuyer: null,
    mortgageType: null,
    rateMode: null
  });

  const handleNext = () => {
    if (step === 6) {
      // Navigate to calculator with pre-filled data
      navigate(createPageUrl('Home'), { 
        state: { 
          wizardData: answers
        } 
      });
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch(step) {
      case 1: return answers.price && answers.price > 0;
      case 2: return answers.downPaymentPercent > 0;
      case 3: return answers.isToronto !== null;
      case 4: return answers.isFirstTimeBuyer !== null;
      case 5: return answers.mortgageType !== null;
      case 6: return answers.rateMode !== null;
      default: return false;
    }
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Mortgage Wizard</span>
          </div>
          <h2 className="text-2xl font-bold">Step {step} of 6</h2>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Purchase Price */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">What is the purchase price of the property?</h3>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">$</span>
                    <Input 
                      type="number"
                      value={answers.price}
                      onChange={(e) => setAnswers({...answers, price: e.target.value})}
                      placeholder="750,000"
                      className="pl-10 text-xl h-14 text-center font-semibold"
                      autoFocus
                    />
                  </div>
                  {answers.price > 0 && (
                    <p className="text-center text-emerald-600 font-medium">
                      {formatCurrency(answers.price)}
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Down Payment */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">What is your down payment amount?</h3>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-emerald-600 mb-2">
                      {answers.downPaymentPercent}%
                    </div>
                    <div className="text-xl text-slate-600">
                      {formatCurrency(answers.price * (answers.downPaymentPercent / 100))}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(percent => (
                      <button
                        key={percent}
                        onClick={() => setAnswers({...answers, downPaymentPercent: percent})}
                        className={`py-4 px-3 rounded-lg font-semibold text-lg transition-all ${
                          answers.downPaymentPercent === percent
                            ? 'bg-emerald-600 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">Where is the property located?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAnswers({...answers, isToronto: true})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.isToronto === true
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      In Toronto
                    </button>
                    <button
                      onClick={() => setAnswers({...answers, isToronto: false})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.isToronto === false
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Outside Toronto
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: First-Time Buyer */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">Are you a first-time home buyer?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAnswers({...answers, isFirstTimeBuyer: true})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.isFirstTimeBuyer === true
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setAnswers({...answers, isFirstTimeBuyer: false})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.isFirstTimeBuyer === false
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Mortgage Type */}
              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">What type of mortgage do you prefer?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAnswers({...answers, mortgageType: 'fixed'})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.mortgageType === 'fixed'
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Fixed Rate
                    </button>
                    <button
                      onClick={() => setAnswers({...answers, mortgageType: 'variable'})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.mortgageType === 'variable'
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Variable Rate
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Rate Mode */}
              {step === 6 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">How would you like to set your interest rate?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAnswers({...answers, rateMode: 'lender'})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.rateMode === 'lender'
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Use Lowest Lender Rate
                    </button>
                    <button
                      onClick={() => setAnswers({...answers, rateMode: 'custom'})}
                      className={`p-8 rounded-xl font-semibold text-lg transition-all ${
                        answers.rateMode === 'custom'
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Enter Custom Rate
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              {step === 6 ? 'View Results' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}