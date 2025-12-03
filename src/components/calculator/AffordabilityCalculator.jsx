import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ResultsDisplay from './ResultsDisplay';

export default function AffordabilityCalculator() {
  // State
  const [price, setPrice] = useState(750000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [amortization, setAmortization] = useState(25);
  const [isToronto, setIsToronto] = useState(true);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [closingCosts, setClosingCosts] = useState(2000); // Default estimation for legal/misc

  // Derived Values
  const downPaymentAmount = price * (downPaymentPercent / 100);
  const mortgageAmount = price - downPaymentAmount;

  // Calculation Functions
  const calculateMortgagePayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = amortization * 12;
    if (interestRate === 0) return mortgageAmount / numberOfPayments;
    
    return (mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

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
  const totalLTT = calculateTotalLTT();
  const totalUpfront = downPaymentAmount + totalLTT + closingCosts;

  // Handlers
  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setPrice(val);
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

            {/* Interest Rate & Amortization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Interest Rate (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step="0.1"
                    className="font-semibold pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Amortization Period</Label>
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
            </div>

            {/* Closing Costs */}
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                    <Label className="text-slate-700 font-medium">Est. Closing Costs</Label>
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Legal fees, title insurance, home inspection, etc.</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                   </div>
                   <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input 
                        type="number" 
                        value={closingCosts} 
                        onChange={(e) => setClosingCosts(Number(e.target.value))}
                        className="pl-7 text-right font-semibold"
                    />
                   </div>
                </div>
                <Slider 
                    value={[closingCosts]} 
                    min={0} 
                    max={5000} 
                    step={100} 
                    onValueChange={(val) => setClosingCosts(val[0])}
                    className="py-2"
                />
            </div>

            {/* Location & Buyer Status */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="font-medium text-slate-700 cursor-pointer" htmlFor="toronto-switch">Property is in Toronto</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                         <Info className="w-4 h-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toronto has an additional Municipal Land Transfer Tax.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch 
                  id="toronto-switch"
                  checked={isToronto}
                  onCheckedChange={setIsToronto}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="font-medium text-slate-700 cursor-pointer" htmlFor="ftb-switch">First-Time Home Buyer</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                         <Info className="w-4 h-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eligible for LTT rebates (up to $4,000 Ontario + $4,475 Toronto).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch 
                  id="ftb-switch"
                  checked={isFirstTimeBuyer}
                  onCheckedChange={setIsFirstTimeBuyer}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Assumptions / Disclaimer */}
        <p className="text-xs text-slate-400 px-4">
          *Calculations are estimates. Closing costs include legal fees, disbursements, and title insurance (estimated). Mortgage default insurance (CMHC) is not included in this simple calculation but applies if down payment is less than 20%.
        </p>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-5">
        <div className="sticky top-24">
          <ResultsDisplay 
            mortgagePayment={monthlyPayment}
            landTransferTax={totalLTT}
            totalUpfront={totalUpfront}
            mortgageAmount={mortgageAmount}
            downPaymentAmount={downPaymentAmount}
            closingCosts={closingCosts}
            isFirstTimeBuyer={isFirstTimeBuyer}
          />
        </div>
      </div>
    </div>
  );
}