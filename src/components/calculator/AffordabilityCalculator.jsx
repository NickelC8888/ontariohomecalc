import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, RefreshCw, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import ResultsDisplay from './ResultsDisplay';

export default function AffordabilityCalculator() {
  // State
  const [price, setPrice] = useState(750000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.79);
  const [amortization, setAmortization] = useState(25);
  const [mortgageTerm, setMortgageTerm] = useState(5);
  const [mortgageType, setMortgageType] = useState("fixed");
  const [rateMode, setRateMode] = useState("lender"); // 'lender' or 'custom'
  const [lenderName, setLenderName] = useState("BMO");
  const [isToronto, setIsToronto] = useState(true);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  
  // New Mortgage Insurance State
  const [mortgageInsuranceType, setMortgageInsuranceType] = useState("auto"); // 'auto' or 'manual'
  const [manualMortgageInsurance, setManualMortgageInsurance] = useState(0);
  
  // Deposit Amount
  const [depositAmount, setDepositAmount] = useState(0);

  // Detailed Closing Costs
  const [closingCostBreakdown, setClosingCostBreakdown] = useState({
    legal: 1500,
    appraisal: 300,
    inspection: 500
  });
  
  // Save Scenario State
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Constants & Bank Data
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

  const STRESS_TEST_BENCHMARK = 5.25;

  // Derived Values
  const totalClosingCosts = Object.values(closingCostBreakdown).reduce((a, b) => a + b, 0);
  const downPaymentAmount = price * (downPaymentPercent / 100);
  
  // Calculate CMHC Insurance
  const calculateCMHC = () => {
    if (mortgageInsuranceType === 'manual') return manualMortgageInsurance;
    if (price >= 1000000) return 0; // No CMHC for properties >= 1M
    if (downPaymentPercent >= 20) return 0;
    
    let premiumRate = 0.04; // Default 4% for 5-9.99%
    if (downPaymentPercent >= 15) premiumRate = 0.028;
    else if (downPaymentPercent >= 10) premiumRate = 0.031;
    
    return (price - downPaymentAmount) * premiumRate;
  };

  const mortgageInsurance = calculateCMHC();
  const totalMortgageAmount = (price - downPaymentAmount) + mortgageInsurance;

  // Calculation Functions
  const calculatePayment = (principal, rate, years) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    if (rate === 0) return principal / numberOfPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  const calculateMortgagePayment = () => {
    return calculatePayment(totalMortgageAmount, interestRate, amortization);
  };

  // Stress Test Calculation
  const stressTestRate = Math.max(interestRate + 2, STRESS_TEST_BENCHMARK);
  const stressTestPayment = calculatePayment(totalMortgageAmount, stressTestRate, amortization);

  const calculateOntarioLTT = (price) => {
    let tax = 0;
    // Ontario Provincial LTT brackets
    if (price > 55000) {
      tax += (Math.min(price, 250000) - 55000) * 0.01;
    }
    if (price > 250000) {
      tax += (Math.min(price, 400000) - 250000) * 0.015;
    }
    if (price > 400000) {
      tax += (Math.min(price, 2000000) - 400000) * 0.02;
    }
    if (price > 2000000) {
      tax += (price - 2000000) * 0.025;
    }
    // First 55k is 0.5%
    if (price > 0) {
       tax += Math.min(price, 55000) * 0.005;
    }
    
    return tax;
  };

  const calculateTorontoLTT = (price) => {
    if (!isToronto) return 0;
    
    let tax = 0;
    // Toronto LTT brackets (roughly mirror Ontario's but separate admin)
    // 0.5% on first 55k
    if (price > 0) tax += Math.min(price, 55000) * 0.005;
    // 1% on 55k-250k
    if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
    // 1.5% on 250k-400k
    if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
    // 2% on 400k-2M
    if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
    // 2.5% over 2M
    if (price > 2000000) tax += (price - 2000000) * 0.025;

    return tax;
  };

  const calculateTotalLTT = () => {
    let ontarioTax = calculateOntarioLTT(price);
    let torontoTax = calculateTorontoLTT(price);

    // Rebates
    if (isFirstTimeBuyer) {
      ontarioTax = Math.max(0, ontarioTax - 4000);
      if (isToronto) {
        torontoTax = Math.max(0, torontoTax - 4475);
      }
    }

    return ontarioTax + torontoTax;
  };

  // Results
  const monthlyPayment = calculateMortgagePayment();
  
  // LTT Breakdown
  const rawOntarioLTT = calculateOntarioLTT(price);
  const rawTorontoLTT = calculateTorontoLTT(price);
  const ontarioRebate = isFirstTimeBuyer ? Math.min(rawOntarioLTT, 4000) : 0;
  const torontoRebate = (isToronto && isFirstTimeBuyer) ? Math.min(rawTorontoLTT, 4475) : 0;
  const totalLTT = (rawOntarioLTT - ontarioRebate) + (rawTorontoLTT - torontoRebate);
  
  const totalUpfront = downPaymentAmount + totalLTT + totalClosingCosts;

  // Handlers
  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setPrice(val);
  };
  
  const handleCostChange = (key, val) => {
    setClosingCostBreakdown(prev => ({ ...prev, [key]: Number(val) }));
  };

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) return;
    
    setIsSaving(true);
    try {
      await base44.entities.Scenario.create({
        name: scenarioName,
        property_price: price,
        down_payment_percent: downPaymentPercent,
        interest_rate: interestRate,
        amortization: amortization,
        mortgage_term: mortgageTerm,
        mortgage_type: mortgageType,
        lender_name: lenderName,
        mortgage_insurance_type: mortgageInsuranceType,
        is_toronto: isToronto,
        is_first_time_buyer: isFirstTimeBuyer,
        closing_costs: totalClosingCosts,
        closing_costs_breakdown: closingCostBreakdown,
        mortgage_insurance: mortgageInsurance,
        stress_test_rate: stressTestRate,
        stress_test_payment: stressTestPayment,
        monthly_payment: monthlyPayment,
        total_ltt: totalLTT,
        total_cash_needed: totalUpfront
      });
      setIsSaveDialogOpen(false);
      setScenarioName("");
      // Optional: Add toast notification here if available
      alert("Scenario saved successfully!");
    } catch (error) {
      console.error("Failed to save scenario:", error);
      alert("Failed to save scenario. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">Property Details</CardTitle>
            <CardDescription>Adjust the values to see how they impact your affordability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Purchase Price */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base font-semibold text-slate-700">Purchase Price</Label>
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={price} 
                    onChange={handlePriceChange}
                    className="pl-7 text-right font-semibold text-lg"
                  />
                </div>
              </div>
              <Slider 
                value={[price]} 
                min={100000} 
                max={3000000} 
                step={5000} 
                onValueChange={(val) => setPrice(val[0])}
                className="py-2"
              />
            </div>

            {/* Down Payment */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base font-semibold text-slate-700">
                  Down Payment 
                  <span className="ml-2 text-emerald-600 font-bold">({downPaymentPercent.toFixed(1)}%)</span>
                </Label>
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={Math.round(downPaymentAmount)} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDownPaymentPercent((val / price) * 100);
                    }}
                    className="pl-7 text-right font-semibold text-lg"
                  />
                </div>
              </div>
              <Slider 
                value={[downPaymentPercent]} 
                min={5} 
                max={100} 
                step={1} 
                onValueChange={(val) => setDownPaymentPercent(val[0])}
                className="py-2"
              />
              <div className="flex gap-2">
                 {[5, 10, 20].map(pct => (
                   <button 
                     key={pct}
                     onClick={() => setDownPaymentPercent(pct)}
                     className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                       Math.round(downPaymentPercent) === pct 
                       ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                       : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                     }`}
                   >
                     {pct}%
                   </button>
                 ))}
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <Label className="text-base font-semibold text-slate-700">Deposit Amount</Label>
                  <p className="text-xs text-slate-500 mt-1">Amount provided as deposit which is included in total Down Payment Amount</p>
                </div>
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="pl-7 text-right font-semibold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Land Transfer Tax Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base font-semibold text-slate-700">Land Transfer Tax</Label>
                <span className="font-bold text-slate-900 text-lg">
                    {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalLTT)}
                </span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-slate-700 cursor-pointer" htmlFor="toronto-switch">Property is in Toronto</Label>
                  <Switch 
                    id="toronto-switch"
                    checked={isToronto}
                    onCheckedChange={setIsToronto}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-slate-700 cursor-pointer" htmlFor="ftb-switch">First-Time Home Buyer</Label>
                  <Switch 
                    id="ftb-switch"
                    checked={isFirstTimeBuyer}
                    onCheckedChange={setIsFirstTimeBuyer}
                  />
                </div>

                {/* Tax Breakdown */}
                <div className="pt-2 border-t border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Ontario Tax</span>
                    <span>{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(rawOntarioLTT)}</span>
                  </div>
                  {isFirstTimeBuyer && rawOntarioLTT > 0 && (
                     <div className="flex justify-between text-emerald-600">
                       <span>Ontario Rebate</span>
                       <span>-{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(ontarioRebate)}</span>
                     </div>
                  )}
                  
                  {isToronto && (
                    <>
                      <div className="flex justify-between text-slate-600 mt-2">
                        <span>Toronto Tax</span>
                        <span>{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(rawTorontoLTT)}</span>
                      </div>
                      {isFirstTimeBuyer && rawTorontoLTT > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Toronto Rebate</span>
                          <span>-{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(torontoRebate)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mortgage Details */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <Label className="text-base font-semibold text-slate-700">Mortgage Details</Label>
                    <span className="font-bold text-slate-900 text-lg">
                        {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalMortgageAmount)}
                    </span>
                </div>

                {/* Mortgage Type */}
                <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">Mortgage Type</Label>
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        {['fixed', 'variable'].map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    setMortgageType(type);
                                    // Reset lender if current lender doesn't support new type (optional, but good UX)
                                    if (rateMode === 'lender') {
                                        const firstMatch = BANK_RATES.find(b => b.type === type);
                                        if (firstMatch) {
                                            setLenderName(firstMatch.name);
                                            setInterestRate(firstMatch.rate);
                                        }
                                    }
                                }}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                                    mortgageType === type 
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
                <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <div>
                            <Label className="text-slate-700 font-medium">Interest Rate Source</Label>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {rateMode === 'lender' ? 'Lowest Competitive Rates Shown' : 'Input Your Own Interest Rate'}
                            </p>
                        </div>
                        <div className="flex bg-slate-100 rounded-lg p-0.5">
                            <button
                                onClick={() => {
                                    setRateMode('lender');
                                    // Re-apply current selected lender rate for current type
                                    const match = BANK_RATES.find(b => b.name === lenderName && b.type === mortgageType) 
                                        || BANK_RATES.find(b => b.type === mortgageType);
                                    if (match) {
                                        setLenderName(match.name);
                                        setInterestRate(match.rate);
                                    }
                                }}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${rateMode === 'lender' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                            >
                                Lender
                            </button>
                            <button
                                onClick={() => {
                                    setRateMode('custom');
                                    setLenderName('Custom');
                                }}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${rateMode === 'custom' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                            >
                                Custom
                            </button>
                        </div>
                     </div>

                     {rateMode === 'lender' ? (
                        <div className="grid grid-cols-2 gap-3">
                            {BANK_RATES
                                .filter(bank => bank.type === mortgageType)
                                .sort((a, b) => a.rate - b.rate)
                                .slice(0, 4)
                                .map((bank) => (
                                    <button
                                        key={bank.name}
                                        onClick={() => {
                                            setLenderName(bank.name);
                                            setInterestRate(bank.rate);
                                        }}
                                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                                            lenderName === bank.name
                                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
                                        }`}
                                    >
                                        <div className="font-bold text-slate-900">{bank.name}</div>
                                        <div className="text-2xl font-bold text-emerald-600 mt-1">{bank.rate}%</div>
                                    </button>
                                ))}
                        </div>
                     ) : (
                        <div className="relative">
                            <Input 
                                type="number" 
                                value={interestRate} 
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                step="0.01"
                                className="font-semibold pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                        </div>
                     )}
                </div>

                {/* Amortization & Term */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-medium">Amortization</Label>
                        <Select value={String(amortization)} onValueChange={(val) => setAmortization(Number(val))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select years" />
                        </SelectTrigger>
                        <SelectContent>
                            {[15, 20, 25, 30].map(year => (
                            <SelectItem key={year} value={String(year)}>{year} Years</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-medium">Term</Label>
                        <Select value={String(mortgageTerm)} onValueChange={(val) => setMortgageTerm(Number(val))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 7, 10].map(year => (
                            <SelectItem key={year} value={String(year)}>{year} Years</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Mortgage Insurance Configuration */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                             <Label className="text-slate-700 font-medium">Mortgage Insurance (CMHC)</Label>
                             <TooltipProvider>
                                <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-4 h-4 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Required for down payments under 20%. Only available for properties under $1 Million.</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                         </div>
                         <span className="font-bold text-emerald-600">
                             {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(mortgageInsurance)}
                         </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg">
                        <div>
                             <Label className="text-xs text-slate-500 mb-2 block">Calculation Method</Label>
                             <div className="flex p-1 bg-white border border-slate-200 rounded-md">
                                {['auto', 'manual'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setMortgageInsuranceType(type)}
                                        className={`flex-1 py-1 text-xs font-medium rounded transition-all capitalize ${
                                            mortgageInsuranceType === type 
                                            ? 'bg-slate-900 text-white' 
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {mortgageInsuranceType === 'manual' && (
                             <div>
                                <Label className="text-xs text-slate-500 mb-2 block">Manual Amount</Label>
                                <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                    <Input 
                                        type="number" 
                                        value={manualMortgageInsurance} 
                                        onChange={(e) => setManualMortgageInsurance(Number(e.target.value))}
                                        className="pl-5 h-8 text-sm"
                                    />
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Closing Costs Breakdown */}
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold text-slate-700">Closing Costs</Label>
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger>
                                <Info className="w-4 h-4 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Detailed breakdown of estimated closing costs.</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="font-bold text-slate-900 text-lg">
                        {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalClosingCosts)}
                    </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Legal Fees</Label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                            <Input 
                                type="number" 
                                value={closingCostBreakdown.legal} 
                                onChange={(e) => handleCostChange('legal', e.target.value)}
                                className="pl-5 h-9 text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Appraisal</Label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                            <Input 
                                type="number" 
                                value={closingCostBreakdown.appraisal} 
                                onChange={(e) => handleCostChange('appraisal', e.target.value)}
                                className="pl-5 h-9 text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Inspection</Label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                            <Input 
                                type="number" 
                                value={closingCostBreakdown.inspection} 
                                onChange={(e) => handleCostChange('inspection', e.target.value)}
                                className="pl-5 h-9 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>



          </CardContent>
        </Card>

        {/* Assumptions / Disclaimer */}
        <p className="text-xs text-slate-400 px-4">
        *Calculations are estimates. Closing costs include legal fees, disbursements, and title insurance (estimated). Mortgage default insurance (CMHC) is not included in this simple calculation but applies if down payment is less than 20%.
        </p>
        </div>

        {/* Save Dialog */}
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Scenario</DialogTitle>
          <DialogDescription>
            Give this calculation a name to save it for later comparison.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Dream Condo"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveScenario} disabled={!scenarioName.trim() || isSaving}>
            {isSaving ? "Saving..." : "Save Scenario"}
          </Button>
        </DialogFooter>
        </DialogContent>
        </Dialog>

      {/* Results Section */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          <div className="flex justify-end">
             <Button 
               onClick={() => setIsSaveDialogOpen(true)}
               className="bg-slate-800 hover:bg-slate-900 text-white gap-2"
             >
               <Save className="w-4 h-4" />
               Save Scenario
             </Button>
          </div>

          <ResultsDisplay 
            propertyPrice={price}
            mortgagePayment={monthlyPayment}
            landTransferTax={totalLTT}
            totalUpfront={totalUpfront}
            mortgageAmount={totalMortgageAmount}
            downPaymentAmount={downPaymentAmount}
            closingCosts={totalClosingCosts}
            isFirstTimeBuyer={isFirstTimeBuyer}
            mortgageInsurance={mortgageInsurance}
            stressTestPayment={stressTestPayment}
            stressTestRate={stressTestRate}
          />
        </div>
      </div>
    </div>
  );
}