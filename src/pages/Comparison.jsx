import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function Comparison() {
  const location = useLocation();
  const initialData = location.state || {};

  const [scenarios, setScenarios] = useState([
    {
      name: "Scenario 1",
      price: initialData.price || 750000,
      downPaymentPercent: initialData.downPaymentPercent || 20,
      interestRate: initialData.interestRate || 4.79,
      amortization: initialData.amortization || 25,
      mortgageTerm: initialData.mortgageTerm || 5,
      mortgageType: initialData.mortgageType || "fixed",
      rateMode: "lender",
      lenderName: "BMO",
      isToronto: initialData.isToronto || true,
      isFirstTimeBuyer: initialData.isFirstTimeBuyer || true,
    },
    {
      name: "Scenario 2",
      price: initialData.price || 750000,
      downPaymentPercent: 15,
      interestRate: initialData.interestRate || 4.79,
      amortization: initialData.amortization || 25,
      mortgageTerm: initialData.mortgageTerm || 5,
      mortgageType: initialData.mortgageType || "fixed",
      rateMode: "lender",
      lenderName: "BMO",
      isToronto: initialData.isToronto || true,
      isFirstTimeBuyer: initialData.isFirstTimeBuyer || true,
    },
    {
      name: "Scenario 3",
      price: initialData.price || 750000,
      downPaymentPercent: 25,
      interestRate: initialData.interestRate || 4.79,
      amortization: initialData.amortization || 25,
      mortgageTerm: initialData.mortgageTerm || 5,
      mortgageType: initialData.mortgageType || "fixed",
      rateMode: "lender",
      lenderName: "BMO",
      isToronto: initialData.isToronto || true,
      isFirstTimeBuyer: initialData.isFirstTimeBuyer || true,
    }
  ]);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  // Bank Rates Data
  const BANK_RATES = [
    // Fixed Rates
    { name: "RBC", rate: 4.84, type: "fixed" },
    { name: "TD", rate: 4.99, type: "fixed" },
    { name: "Scotiabank", rate: 5.09, type: "fixed" },
    { name: "BMO", rate: 4.79, type: "fixed" },
    { name: "CIBC", rate: 4.89, type: "fixed" },
    { name: "National Bank", rate: 4.94, type: "fixed" },
    { name: "EQ Bank", rate: 4.69, type: "fixed" },
    { name: "Tangerine", rate: 4.74, type: "fixed" },
    // Variable Rates
    { name: "RBC", rate: 6.35, type: "variable" },
    { name: "TD", rate: 6.45, type: "variable" },
    { name: "Scotiabank", rate: 6.50, type: "variable" },
    { name: "BMO", rate: 6.30, type: "variable" },
    { name: "CIBC", rate: 6.40, type: "variable" },
    { name: "National Bank", rate: 6.45, type: "variable" },
    { name: "EQ Bank", rate: 6.10, type: "variable" },
    { name: "Tangerine", rate: 6.15, type: "variable" }
  ];

  const calculatePayment = (principal, rate, years) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    if (rate === 0) return principal / numberOfPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  const calculateCMHC = (price, downPaymentPercent) => {
    if (price >= 1500000) return 0;
    if (downPaymentPercent >= 20) return 0;
    
    let premiumRate = 0.04;
    if (downPaymentPercent >= 15) premiumRate = 0.028;
    else if (downPaymentPercent >= 10) premiumRate = 0.031;
    
    const downPaymentAmount = price * (downPaymentPercent / 100);
    return (price - downPaymentAmount) * premiumRate;
  };

  const calculateOntarioLTT = (price) => {
    let tax = 0;
    if (price > 0) tax += Math.min(price, 55000) * 0.005;
    if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
    if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
    if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
    if (price > 2000000) tax += (price - 2000000) * 0.025;
    return tax;
  };

  const calculateTorontoLTT = (price, isToronto) => {
    if (!isToronto) return 0;
    let tax = 0;
    if (price > 0) tax += Math.min(price, 55000) * 0.005;
    if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
    if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
    if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
    if (price > 2000000) tax += (Math.min(price, 3000000) - 2000000) * 0.025;
    if (price > 3000000) tax += (Math.min(price, 4000000) - 3000000) * 0.035;
    if (price > 4000000) tax += (Math.min(price, 5000000) - 4000000) * 0.045;
    if (price > 5000000) tax += (Math.min(price, 10000000) - 5000000) * 0.055;
    if (price > 10000000) tax += (Math.min(price, 20000000) - 10000000) * 0.065;
    if (price > 20000000) tax += (price - 20000000) * 0.075;
    return tax;
  };

  const calculateTotalLTT = (price, isToronto, isFirstTimeBuyer) => {
    let ontarioTax = calculateOntarioLTT(price);
    let torontoTax = calculateTorontoLTT(price, isToronto);
    
    if (isFirstTimeBuyer) {
      ontarioTax = Math.max(0, ontarioTax - 4000);
      if (isToronto) {
        torontoTax = Math.max(0, torontoTax - 4475);
      }
    }
    
    return ontarioTax + torontoTax;
  };

  const updateScenario = (index, field, value) => {
    setScenarios(prev => {
      const newScenarios = [...prev];
      newScenarios[index] = { ...newScenarios[index], [field]: value };
      return newScenarios;
    });
  };

  const renderScenario = (scenario, index) => {
    const downPaymentAmount = scenario.price * (scenario.downPaymentPercent / 100);
    const mortgageInsurance = calculateCMHC(scenario.price, scenario.downPaymentPercent);
    const totalMortgageAmount = (scenario.price - downPaymentAmount) + mortgageInsurance;
    const monthlyPayment = calculatePayment(totalMortgageAmount, scenario.interestRate, scenario.amortization);
    const totalLTT = calculateTotalLTT(scenario.price, scenario.isToronto, scenario.isFirstTimeBuyer);
    const closingCosts = 2300; // Default estimate (legal + appraisal + inspection)
    const totalAmountDueOnClosing = downPaymentAmount + totalLTT + closingCosts;

    return (
      <Card key={index} className="border-2 border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-xl text-slate-900">{scenario.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* Monthly Payment Display */}
          <div className="bg-emerald-900 text-white rounded-lg p-4 text-center">
            <p className="text-sm text-emerald-100 mb-1">Monthly Payment</p>
            <p className="text-3xl font-bold">{formatCurrency(monthlyPayment)}</p>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Down Payment</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  type="number"
                  value={scenario.downPaymentPercent}
                  onChange={(e) => updateScenario(index, 'downPaymentPercent', Number(e.target.value))}
                  className="flex-1"
                  min="5"
                  max="100"
                />
                <span className="text-slate-600 font-medium">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{formatCurrency(downPaymentAmount)}</p>
            </div>

            {/* Mortgage Type */}
            <div>
              <Label className="text-sm font-medium text-slate-700">Mortgage Type</Label>
              <div className="flex p-1 bg-slate-100 rounded-lg mt-1">
                {['fixed', 'variable'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      updateScenario(index, 'mortgageType', type);
                      // Reset to first lender of new type if in lender mode
                      if (scenario.rateMode === 'lender') {
                        const firstMatch = BANK_RATES.find(b => b.type === type);
                        if (firstMatch) {
                          updateScenario(index, 'lenderName', firstMatch.name);
                          updateScenario(index, 'interestRate', firstMatch.rate);
                        }
                      }
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                      scenario.mortgageType === type 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate Source Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium text-slate-700">Interest Rate Source</Label>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => {
                      updateScenario(index, 'rateMode', 'lender');
                      const match = BANK_RATES.find(b => b.name === scenario.lenderName && b.type === scenario.mortgageType) 
                          || BANK_RATES.find(b => b.type === scenario.mortgageType);
                      if (match) {
                        updateScenario(index, 'lenderName', match.name);
                        updateScenario(index, 'interestRate', match.rate);
                      }
                    }}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                      scenario.rateMode === 'lender' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Lender
                  </button>
                  <button
                    onClick={() => {
                      updateScenario(index, 'rateMode', 'custom');
                      updateScenario(index, 'lenderName', 'Custom');
                    }}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                      scenario.rateMode === 'custom' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {scenario.rateMode === 'lender' ? (
                <Select 
                  value={scenario.lenderName} 
                  onValueChange={(name) => {
                    const selected = BANK_RATES.find(b => b.name === name && b.type === scenario.mortgageType);
                    if (selected) {
                      updateScenario(index, 'lenderName', selected.name);
                      updateScenario(index, 'interestRate', selected.rate);
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_RATES
                      .filter(bank => bank.type === scenario.mortgageType)
                      .sort((a, b) => a.rate - b.rate)
                      .slice(0, 5)
                      .map((bank) => (
                        <SelectItem key={bank.name} value={bank.name}>
                          {bank.name} - {bank.rate}%
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative mt-1">
                  <Input 
                    type="number" 
                    value={scenario.interestRate} 
                    onChange={(e) => updateScenario(index, 'interestRate', Number(e.target.value))}
                    step="0.01"
                    className="font-semibold pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Amortization</Label>
              <Select 
                value={String(scenario.amortization)} 
                onValueChange={(val) => updateScenario(index, 'amortization', Number(val))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 20, 25, 30].map(year => (
                    <SelectItem key={year} value={String(year)}>{year} Years</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Term</Label>
              <Select 
                value={String(scenario.mortgageTerm)} 
                onValueChange={(val) => updateScenario(index, 'mortgageTerm', Number(val))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 7, 10].map(year => (
                    <SelectItem key={year} value={String(year)}>{year} Years</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Property Price</span>
              <span className="font-medium">{formatCurrency(scenario.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Mortgage Amount</span>
              <span className="font-medium">{formatCurrency(scenario.price - downPaymentAmount)}</span>
            </div>
            {mortgageInsurance > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">CMHC Insurance</span>
                <span className="font-medium text-emerald-600">{formatCurrency(mortgageInsurance)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span className="text-slate-900">Total Mortgage</span>
              <span className="text-slate-900">{formatCurrency(totalMortgageAmount)}</span>
            </div>
          </div>

          {/* Amount Due on Closing */}
          <div className="border-t pt-4 space-y-2 text-sm bg-slate-50 -mx-6 px-6 py-4">
            <h4 className="font-semibold text-slate-900 mb-3">Amount Due on Closing</h4>
            <div className="flex justify-between">
              <span className="text-slate-600">Down Payment</span>
              <span className="font-medium">{formatCurrency(downPaymentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Land Transfer Tax</span>
              <span className="font-medium">{formatCurrency(totalLTT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Closing Costs</span>
              <span className="font-medium">{formatCurrency(closingCosts)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
              <span className="text-slate-900">Total Amount Due</span>
              <span className="text-emerald-600">{formatCurrency(totalAmountDueOnClosing)}</span>
            </div>
          </div>

        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scenario Comparison</h1>
          <p className="text-slate-500 mt-1">Compare different down payment and mortgage scenarios side-by-side</p>
        </div>
        <Link to={createPageUrl('Home')}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Calculator
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => renderScenario(scenario, index))}
      </div>
    </div>
  );
}