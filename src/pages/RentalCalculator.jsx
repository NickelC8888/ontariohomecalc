import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown, Home, DollarSign, Building, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';

const fmt = (val) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

const fmtPct = (val) => `${val.toFixed(2)}%`;

function MetricCard({ label, value, sub, positive, neutral, tooltip }) {
  const color = neutral ? 'text-slate-900' : positive ? 'text-emerald-600' : 'text-red-600';
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 cursor-help shadow-sm">
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              {label} {tooltip && <Info className="w-3 h-3" />}
            </p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-slate-400">{sub}</p>}
          </div>
        </TooltipTrigger>
        {tooltip && <TooltipContent className="max-w-xs"><p>{tooltip}</p></TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}

export default function RentalCalculator() {
  // Property
  const [price, setPrice] = useState(750000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [amortization, setAmortization] = useState(25);
  const [isToronto, setIsToronto] = useState(true);

  // Income
  const [monthlyRent, setMonthlyRent] = useState(3000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [requiredCapRate, setRequiredCapRate] = useState(5);

  // Annual Expenses
  const [propertyTax, setPropertyTax] = useState(5000);
  const [insurance, setInsurance] = useState(1500);
  const [maintenance, setMaintenance] = useState(3000);
  const [additionalExpenses, setAdditionalExpenses] = useState([]);

  const EXPENSE_OPTIONS = [
    'Utilities',
    'Landscaping',
    'Snow Removal',
    'Property Management Fees',
    'Advertising',
    'Legal Fees',
    'Accounting Fees',
    'Office Expenses',
    'Travel',
    'Salaries & Wages',
  ];

  const addExpense = (category) => {
    if (!category) return;
    setAdditionalExpenses(prev => [...prev, { category, amount: 0 }]);
  };

  const updateExpenseAmount = (index, amount) => {
    setAdditionalExpenses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], amount: Number(amount) };
      return updated;
    });
  };

  const removeExpense = (index) => {
    setAdditionalExpenses(prev => prev.filter((_, i) => i !== index));
  };

  const additionalExpensesTotal = additionalExpenses.reduce((sum, e) => sum + e.amount, 0);

  // --- Calculations ---
  const downPaymentAmount = price * (downPaymentPercent / 100);

  // CMHC
  const calcCMHC = () => {
    if (price >= 1500000 || downPaymentPercent >= 20) return 0;
    let rate = 0.04;
    if (downPaymentPercent >= 15) rate = 0.028;
    else if (downPaymentPercent >= 10) rate = 0.031;
    return (price - downPaymentAmount) * rate;
  };
  const cmhc = calcCMHC();
  const totalMortgage = (price - downPaymentAmount) + cmhc;

  // Monthly mortgage payment
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = amortization * 12;
  const mortgagePayment = interestRate === 0
    ? totalMortgage / numPayments
    : (totalMortgage * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

  // LTT (Ontario + optional Toronto)
  const calcOntarioLTT = (p) => {
    let t = 0;
    if (p > 0) t += Math.min(p, 55000) * 0.005;
    if (p > 55000) t += (Math.min(p, 250000) - 55000) * 0.01;
    if (p > 250000) t += (Math.min(p, 400000) - 250000) * 0.015;
    if (p > 400000) t += (Math.min(p, 2000000) - 400000) * 0.02;
    if (p > 2000000) t += (p - 2000000) * 0.025;
    return t;
  };
  const calcTorontoLTT = (p) => {
    if (!isToronto) return 0;
    let t = 0;
    if (p > 0) t += Math.min(p, 55000) * 0.005;
    if (p > 55000) t += (Math.min(p, 250000) - 55000) * 0.01;
    if (p > 250000) t += (Math.min(p, 400000) - 250000) * 0.015;
    if (p > 400000) t += (Math.min(p, 2000000) - 400000) * 0.02;
    if (p > 2000000) t += (Math.min(p, 3000000) - 2000000) * 0.025;
    return t;
  };
  const totalLTT = calcOntarioLTT(price) + calcTorontoLTT(price);
  const closingCosts = 2300;
  const totalCashInvested = downPaymentAmount + totalLTT + closingCosts;

  // Income
  const effectiveMonthlyRent = monthlyRent * (1 - vacancyRate / 100);
  const grossAnnualRent = effectiveMonthlyRent * 12;

  // Expenses
  const totalAnnualExpenses = propertyTax + insurance + maintenance + additionalExpensesTotal;

  // NOI & Cap Rate
  const noi = grossAnnualRent - totalAnnualExpenses;
  const capRate = price > 0 ? (noi / price) * 100 : 0;

  // Cash Flow
  const annualMortgage = mortgagePayment * 12;
  const annualCashFlow = noi - annualMortgage;
  const monthlyCashFlow = annualCashFlow / 12;

  // Cash-on-Cash
  const cashOnCash = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

  // Gross Yield
  const grossYield = price > 0 ? ((monthlyRent * 12) / price) * 100 : 0;

  // Required rent to hit target cap rate
  const requiredNOI = price * (requiredCapRate / 100);
  const requiredGrossRent = requiredNOI + totalAnnualExpenses;
  const requiredMonthlyRent = requiredGrossRent / 12 / (1 - vacancyRate / 100);

  const capRateMet = capRate >= requiredCapRate;
  const cashFlowPositive = annualCashFlow >= 0;

  const pieData = [
    { name: 'Net Operating Income', value: Math.max(0, noi), color: '#10b981' },
    { name: 'Annual Mortgage', value: annualMortgage, color: '#3b82f6' },
    { name: 'Operating Expenses', value: totalAnnualExpenses, color: '#f59e0b' },
    { name: 'Vacancy Loss', value: (monthlyRent * 12) - grossAnnualRent, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-xl">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rental Property Calculator</h1>
          <p className="text-slate-500 mt-0.5">Analyze rental income, cap rate, and cash flow for investment properties</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-6">

          {/* Property Details */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-blue-600" /> Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purchase Price */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <Label className="font-semibold text-slate-700">Purchase Price</Label>
                  <div className="relative w-40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="pl-7 text-right font-semibold" />
                  </div>
                </div>
                <Slider value={[price]} min={100000} max={3000000} step={5000} onValueChange={(v) => setPrice(v[0])} />
              </div>

              {/* Down Payment */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <Label className="font-semibold text-slate-700">Down Payment <span className="text-blue-600 font-bold">({downPaymentPercent}%)</span></Label>
                  <span className="font-semibold text-slate-700">{fmt(downPaymentAmount)}</span>
                </div>
                <Slider value={[downPaymentPercent]} min={5} max={80} step={1} onValueChange={(v) => setDownPaymentPercent(v[0])} />
                <div className="flex gap-2 flex-wrap">
                  {[20, 25, 30, 35, 40, 50].map(p => (
                    <button key={p} onClick={() => setDownPaymentPercent(p)}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${downPaymentPercent === p ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Interest Rate</Label>
                  <div className="relative">
                    <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} step="0.01" className="pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Amortization</Label>
                  <Select value={String(amortization)} onValueChange={(v) => setAmortization(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[15, 20, 25, 30].map(y => <SelectItem key={y} value={String(y)}>{y} Years</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <Label className="font-medium text-slate-700 cursor-pointer">Property in City of Toronto?</Label>
                <Switch checked={isToronto} onCheckedChange={setIsToronto} />
              </div>
            </CardContent>
          </Card>

          {/* Rental Income */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-600" /> Rental Income</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <Label className="font-semibold text-slate-700">Monthly Lease Rate</Label>
                  <div className="relative w-40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="pl-7 text-right font-semibold" />
                  </div>
                </div>
                <Slider value={[monthlyRent]} min={500} max={10000} step={50} onValueChange={(v) => setMonthlyRent(v[0])} />
                <p className="text-xs text-slate-500">Annual gross rent: {fmt(monthlyRent * 12)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-1">
                    <Label className="font-semibold text-slate-700">Vacancy Rate</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Info className="w-4 h-4 text-slate-400" /></TooltipTrigger>
                        <TooltipContent><p>Expected % of time the property sits vacant. Typical: 3-8%.</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="font-semibold text-slate-700">{vacancyRate}%</span>
                </div>
                <Slider value={[vacancyRate]} min={0} max={20} step={1} onValueChange={(v) => setVacancyRate(v[0])} />
                <p className="text-xs text-slate-500">Effective annual rent (after vacancy): {fmt(grossAnnualRent)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-1">
                    <Label className="font-semibold text-slate-700">Required Cap Rate</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Info className="w-4 h-4 text-slate-400" /></TooltipTrigger>
                        <TooltipContent><p>Your minimum acceptable cap rate. The calculator shows the rent needed to achieve it.</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative w-32">
                    <Input type="number" value={requiredCapRate} onChange={(e) => setRequiredCapRate(Number(e.target.value))} step="0.1" className="pr-8 text-right" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>
                <Slider value={[requiredCapRate]} min={1} max={15} step={0.5} onValueChange={(v) => setRequiredCapRate(v[0])} />
              </div>
            </CardContent>
          </Card>

          {/* Operating Expenses */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" /> Annual Operating Expenses</CardTitle>
              <CardDescription>Expenses paid by the landlord (not included in rent)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Property Tax', key: 'propertyTax', value: propertyTax, setter: setPropertyTax },
                { label: 'Insurance', key: 'insurance', value: insurance, setter: setInsurance },
                { label: 'Maintenance / Repairs', key: 'maintenance', value: maintenance, setter: setMaintenance },
              ].map(({ label, key, value, setter }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <Label className="text-slate-700 w-48">{label}</Label>
                  <div className="relative w-40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input type="number" value={value} onChange={(e) => setter(Number(e.target.value))} className="pl-7 text-right" />
                  </div>
                </div>
              ))}

              {/* Dynamic Additional Expenses */}
              {additionalExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => removeExpense(index)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Label className="text-slate-700 truncate">{expense.category}</Label>
                  </div>
                  <div className="relative w-40 flex-shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateExpenseAmount(index, e.target.value)}
                      className="pl-7 text-right"
                    />
                  </div>
                </div>
              ))}

              {/* Add Expense Button */}
              <div className="flex items-center gap-2">
                <Select onValueChange={(val) => addExpense(val)} value="">
                  <SelectTrigger className="flex-1 border-dashed border-slate-300 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Expense Category</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-semibold text-slate-900">
                <span>Total Annual Expenses</span>
                <span className="text-red-600">{fmt(totalAnnualExpenses)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">

            {/* Key Metrics */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="Cap Rate"
                    value={fmtPct(capRate)}
                    sub={`Target: ${requiredCapRate}%`}
                    positive={capRateMet}
                    neutral={false}
                    tooltip="Net Operating Income ÷ Property Value. Higher is better for investors."
                  />
                  <MetricCard
                    label="Monthly Cash Flow"
                    value={fmt(monthlyCashFlow)}
                    sub={monthlyCashFlow >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                    positive={cashFlowPositive}
                    neutral={false}
                    tooltip="Rent collected minus all expenses and mortgage payment each month."
                  />
                  <MetricCard
                    label="Cash-on-Cash Return"
                    value={fmtPct(cashOnCash)}
                    sub="Annual return on cash invested"
                    positive={cashOnCash >= 0}
                    neutral={false}
                    tooltip="Annual cash flow ÷ total cash invested (down payment + LTT + closing costs)."
                  />
                  <MetricCard
                    label="Gross Rental Yield"
                    value={fmtPct(grossYield)}
                    sub="Before expenses & vacancy"
                    positive={grossYield >= 5}
                    neutral={grossYield < 5 && grossYield > 0}
                    tooltip="Annual gross rent ÷ property price. Does not account for expenses."
                  />
                </div>

                {/* Cap Rate Status Banner */}
                <div className={`rounded-xl p-4 flex items-center gap-3 ${capRateMet ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  {capRateMet
                    ? <TrendingUp className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    : <TrendingDown className="w-6 h-6 text-red-600 flex-shrink-0" />}
                  <div>
                    <p className={`font-semibold ${capRateMet ? 'text-emerald-700' : 'text-red-700'}`}>
                      {capRateMet ? `Cap Rate Target Met (${fmtPct(capRate)} ≥ ${requiredCapRate}%)` : `Cap Rate Below Target (${fmtPct(capRate)} < ${requiredCapRate}%)`}
                    </p>
                    {!capRateMet && (
                      <p className="text-xs text-red-600 mt-0.5">
                        Required monthly rent to hit {requiredCapRate}% cap rate: <strong>{fmt(requiredMonthlyRent)}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-sm border-t pt-4">
                  {[
                    { label: 'Gross Annual Rent', value: fmt(monthlyRent * 12), neutral: true },
                    { label: `Vacancy Loss (${vacancyRate}%)`, value: `-${fmt((monthlyRent * 12) - grossAnnualRent)}`, negative: true },
                    { label: 'Effective Annual Rent', value: fmt(grossAnnualRent), bold: true },
                    { label: 'Total Operating Expenses', value: `-${fmt(totalAnnualExpenses)}`, negative: true },
                    { label: 'Net Operating Income (NOI)', value: fmt(noi), bold: true, positive: noi >= 0 },
                    { label: 'Annual Mortgage Payments', value: `-${fmt(annualMortgage)}`, negative: true },
                    { label: 'Annual Cash Flow', value: fmt(annualCashFlow), bold: true, positive: annualCashFlow >= 0 },
                  ].map((row, i) => (
                    <div key={i} className={`flex justify-between ${row.bold ? 'font-bold pt-1 border-t border-slate-200' : ''}`}>
                      <span className="text-slate-600">{row.label}</span>
                      <span className={row.negative ? 'text-red-600' : row.positive ? 'text-emerald-600' : 'text-slate-900'}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upfront Costs */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Total Cash Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  { label: 'Down Payment', value: fmt(downPaymentAmount) },
                  ...(cmhc > 0 ? [{ label: 'CMHC Insurance (added to mortgage)', value: fmt(cmhc) }] : []),
                  { label: 'Land Transfer Tax', value: fmt(totalLTT) },
                  { label: 'Closing Costs (est.)', value: fmt(closingCosts) },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-600">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                  <span>Total Cash Invested</span>
                  <span className="text-blue-600">{fmt(totalCashInvested)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Annual Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(v) => fmt(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}