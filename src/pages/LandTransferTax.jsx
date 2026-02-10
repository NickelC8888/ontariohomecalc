import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function LandTransferTax() {
  const [price, setPrice] = useState(750000);
  const [isToronto, setIsToronto] = useState(true);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  const calculateOntarioLTT = (price) => {
    const brackets = [
      { range: 'Up to $55,000', min: 0, max: 55000, rate: 0.005, label: '0.5%' },
      { range: '$55,001 - $250,000', min: 55000, max: 250000, rate: 0.01, label: '1.0%' },
      { range: '$250,001 - $400,000', min: 250000, max: 400000, rate: 0.015, label: '1.5%' },
      { range: '$400,001 - $2,000,000', min: 400000, max: 2000000, rate: 0.02, label: '2.0%' },
      { range: 'Over $2,000,000', min: 2000000, max: Infinity, rate: 0.025, label: '2.5%' }
    ];

    let total = 0;
    const breakdown = brackets
      .filter(b => price > b.min)
      .map(b => {
        const applicableAmount = Math.max(0, Math.min(price, b.max) - b.min);
        const tax = applicableAmount * b.rate;
        total += tax;
        return { ...b, applicableAmount, tax };
      });

    return { total, breakdown };
  };

  const calculateTorontoLTT = (price) => {
    if (!isToronto) return { total: 0, breakdown: [] };

    const brackets = [
      { range: 'Up to $55,000', min: 0, max: 55000, rate: 0.005, label: '0.5%' },
      { range: '$55,001 - $250,000', min: 55000, max: 250000, rate: 0.01, label: '1.0%' },
      { range: '$250,001 - $400,000', min: 250000, max: 400000, rate: 0.015, label: '1.5%' },
      { range: '$400,001 - $2,000,000', min: 400000, max: 2000000, rate: 0.02, label: '2.0%' },
      { range: '$2,000,001 - $3,000,000', min: 2000000, max: 3000000, rate: 0.025, label: '2.5%' },
      { range: '$3,000,001 - $4,000,000', min: 3000000, max: 4000000, rate: 0.035, label: '3.5%' },
      { range: '$4,000,001 - $5,000,000', min: 4000000, max: 5000000, rate: 0.045, label: '4.5%' },
      { range: '$5,000,001 - $10,000,000', min: 5000000, max: 10000000, rate: 0.055, label: '5.5%' },
      { range: '$10,000,001 - $20,000,000', min: 10000000, max: 20000000, rate: 0.065, label: '6.5%' },
      { range: 'Over $20,000,000', min: 20000000, max: Infinity, rate: 0.075, label: '7.5%' }
    ];

    let total = 0;
    const breakdown = brackets
      .filter(b => price > b.min)
      .map(b => {
        const applicableAmount = Math.max(0, Math.min(price, b.max) - b.min);
        const tax = applicableAmount * b.rate;
        total += tax;
        return { ...b, applicableAmount, tax };
      });

    return { total, breakdown };
  };

  const ontarioLTT = calculateOntarioLTT(price);
  const torontoLTT = calculateTorontoLTT(price);
  
  const ontarioRebate = isFirstTimeBuyer ? Math.min(ontarioLTT.total, 4000) : 0;
  const torontoRebate = (isToronto && isFirstTimeBuyer) ? Math.min(torontoLTT.total, 4475) : 0;
  
  const finalOntarioTax = ontarioLTT.total - ontarioRebate;
  const finalTorontoTax = torontoLTT.total - torontoRebate;
  const totalTax = finalOntarioTax + finalTorontoTax;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Land Transfer Tax Calculator</h1>
        <p className="text-slate-500 mt-2">Calculate Ontario and Toronto land transfer taxes with detailed breakdowns</p>
      </div>

      {/* Input Section */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">Property Details</CardTitle>
          <CardDescription>Enter your property information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Purchase Price */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <Label className="text-base font-semibold text-slate-700">Purchase Price</Label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <Input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(Number(e.target.value))}
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

          {/* Toggles */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-slate-700 cursor-pointer" htmlFor="toronto-switch">
                Property in City of Toronto?
              </Label>
              <Switch 
                id="toronto-switch"
                checked={isToronto}
                onCheckedChange={setIsToronto}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="font-medium text-slate-700 cursor-pointer" htmlFor="ftb-switch">
                  First-Time Home Buyer?
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">First-time buyers receive rebates: up to $4,000 Ontario rebate and up to $4,475 Toronto rebate (if applicable)</p>
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

      {/* Total Summary */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
        <p className="text-sm text-emerald-700 font-medium mb-2">Total Land Transfer Tax</p>
        <p className="text-4xl font-bold text-emerald-900">{formatCurrency(totalTax)}</p>
        {(ontarioRebate > 0 || torontoRebate > 0) && (
          <p className="text-xs text-emerald-600 mt-2">
            Includes first-time buyer rebates
          </p>
        )}
      </div>

      {/* Breakdown Section */}
      <div className={`grid ${isToronto ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}
        {/* Ontario LTT */}
        <Card className="border-2 border-slate-200">
            <CardHeader className="bg-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-900">Ontario Land Transfer Tax</CardTitle>
                <Badge variant="outline" className="text-base font-bold">
                  {formatCurrency(finalOntarioTax)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                {ontarioLTT.breakdown.map((bracket, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{bracket.range}</p>
                        <p className="text-xs text-slate-500">Rate: {bracket.label}</p>
                      </div>
                      <Badge className="bg-slate-200 text-slate-900">
                        {formatCurrency(bracket.tax)}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600">
                      Taxable amount: {formatCurrency(bracket.applicableAmount)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(ontarioLTT.total)}</span>
                </div>
                {isFirstTimeBuyer && ontarioRebate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-emerald-700">First-Time Buyer Rebate</span>
                    <span className="font-semibold text-emerald-700">-{formatCurrency(ontarioRebate)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-900">Total Ontario LTT</span>
                  <span className="font-bold text-slate-900">{formatCurrency(finalOntarioTax)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Toronto LTT */}
        {isToronto && (
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-900">Toronto Municipal Land Transfer Tax</CardTitle>
                  <Badge variant="outline" className="text-base font-bold">
                    {formatCurrency(finalTorontoTax)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  {torontoLTT.breakdown.map((bracket, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{bracket.range}</p>
                          <p className="text-xs text-slate-500">Rate: {bracket.label}</p>
                        </div>
                        <Badge className="bg-blue-200 text-blue-900">
                          {formatCurrency(bracket.tax)}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600">
                        Taxable amount: {formatCurrency(bracket.applicableAmount)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-blue-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(torontoLTT.total)}</span>
                  </div>
                  {isFirstTimeBuyer && torontoRebate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-emerald-700">First-Time Buyer Rebate</span>
                      <span className="font-semibold text-emerald-700">-{formatCurrency(torontoRebate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base pt-2 border-t border-blue-100">
                    <span className="font-bold text-slate-900">Total Toronto LTT</span>
                    <span className="font-bold text-slate-900">{formatCurrency(finalTorontoTax)}</span>
                  </div>
                </div>
              </CardContent>
          </Card>
        )}
      </div>

      {/* Info Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold">Important Information:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>All property buyers in Ontario must pay provincial Land Transfer Tax</li>
                <li>Toronto residents pay an additional municipal Land Transfer Tax</li>
                <li>First-time home buyers may qualify for rebates (up to $4,000 provincial, $4,475 Toronto)</li>
                <li>These are estimates only. Actual tax amounts may vary based on specific circumstances</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}