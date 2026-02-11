import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Edit2, Check, BarChart3 } from 'lucide-react';
import { createPageUrl } from '../utils';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Comparison() {
  const location = useLocation();
  const initialData = location.state || {};
  const queryClient = useQueryClient();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savingScenarioIndex, setSavingScenarioIndex] = useState(null);
  const [scenarioName, setScenarioName] = useState("");
  const [editingScenarioName, setEditingScenarioName] = useState(null);
  const [tempName, setTempName] = useState("");

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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
        const savedScenarios = await base44.entities.Scenario.filter({ created_by: user.email });
        setSavedCount(savedScenarios.length);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    loadUser();
  }, []);

  const saveScenarioMutation = useMutation({
    mutationFn: (data) => base44.entities.Scenario.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      setSavedCount(prev => prev + 1);
      setSaveDialogOpen(false);
      setScenarioName("");
      alert("Scenario saved successfully!");
    },
  });

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

  const handleEditScenarioName = (index) => {
    setEditingScenarioName(index);
    setTempName(scenarios[index].name);
  };

  const handleSaveScenarioName = (index) => {
    if (tempName.trim()) {
      updateScenario(index, 'name', tempName.trim());
    }
    setEditingScenarioName(null);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const getChartData = () => {
    return scenarios.map((scenario, index) => {
      const metrics = getScenarioMetrics(scenario);
      return {
        name: scenario.name,
        'Monthly Payment': Math.round(metrics.monthlyPayment),
        'Total Interest': Math.round(metrics.totalInterest),
        'Upfront Costs': Math.round(metrics.totalUpfront),
        'Down Payment': Math.round(metrics.downPaymentAmount),
        color: COLORS[index]
      };
    });
  };

  const getInterestPieData = () => {
    return scenarios.map((scenario, index) => ({
      name: scenario.name,
      value: Math.round(getScenarioMetrics(scenario).totalInterest),
      color: COLORS[index]
    }));
  };

  const getPayoffData = () => {
    return scenarios.map((scenario, index) => ({
      name: scenario.name,
      years: scenario.amortization,
      color: COLORS[index]
    }));
  };

  const handleSaveScenario = (index) => {
    if (!currentUser) {
      base44.auth.redirectToLogin(createPageUrl('Profile'));
      return;
    }

    if (!currentUser.first_name || !currentUser.last_name || !currentUser.telephone) {
      alert("Please complete your profile before saving scenarios.");
      window.location.href = createPageUrl('Profile');
      return;
    }

    if (savedCount >= 3) {
      alert("You can only save up to 3 scenarios. Please delete an existing scenario to save a new one.");
      return;
    }

    setSavingScenarioIndex(index);
    setScenarioName(scenarios[index].name);
    setSaveDialogOpen(true);
  };

  const confirmSaveScenario = () => {
    if (!scenarioName.trim()) return;

    const scenario = scenarios[savingScenarioIndex];
    const downPaymentAmount = scenario.price * (scenario.downPaymentPercent / 100);
    const mortgageInsurance = calculateCMHC(scenario.price, scenario.downPaymentPercent);
    const totalMortgageAmount = (scenario.price - downPaymentAmount) + mortgageInsurance;
    const monthlyPayment = calculatePayment(totalMortgageAmount, scenario.interestRate, scenario.amortization);
    const totalLTT = calculateTotalLTT(scenario.price, scenario.isToronto, scenario.isFirstTimeBuyer);
    const closingCosts = 2300;
    const STRESS_TEST_BENCHMARK = 5.25;
    const stressTestRate = Math.max(scenario.interestRate + 2, STRESS_TEST_BENCHMARK);
    const stressTestPayment = calculatePayment(totalMortgageAmount, stressTestRate, scenario.amortization);

    saveScenarioMutation.mutate({
      name: scenarioName,
      property_price: scenario.price,
      down_payment_percent: scenario.downPaymentPercent,
      interest_rate: scenario.interestRate,
      amortization: scenario.amortization,
      mortgage_term: scenario.mortgageTerm,
      mortgage_type: scenario.mortgageType,
      lender_name: scenario.lenderName,
      is_toronto: scenario.isToronto,
      is_first_time_buyer: scenario.isFirstTimeBuyer,
      closing_costs: closingCosts,
      closing_costs_breakdown: {
        legal: 1500,
        appraisal: 300,
        inspection: 500
      },
      mortgage_insurance: mortgageInsurance,
      stress_test_rate: stressTestRate,
      stress_test_payment: stressTestPayment,
      monthly_payment: monthlyPayment,
      total_ltt: totalLTT,
      total_cash_needed: downPaymentAmount + totalLTT + closingCosts
    });
  };

  const calculateTotalInterest = (monthlyPayment, amortization, mortgageAmount) => {
    const totalPaid = monthlyPayment * amortization * 12;
    return totalPaid - mortgageAmount;
  };

  const getScenarioMetrics = (scenario) => {
    const downPaymentAmount = scenario.price * (scenario.downPaymentPercent / 100);
    const mortgageInsurance = calculateCMHC(scenario.price, scenario.downPaymentPercent);
    const totalMortgageAmount = (scenario.price - downPaymentAmount) + mortgageInsurance;
    const monthlyPayment = calculatePayment(totalMortgageAmount, scenario.interestRate, scenario.amortization);
    const totalInterest = calculateTotalInterest(monthlyPayment, scenario.amortization, totalMortgageAmount);
    const totalLTT = calculateTotalLTT(scenario.price, scenario.isToronto, scenario.isFirstTimeBuyer);
    const totalUpfront = downPaymentAmount + totalLTT + 2300;
    
    return { monthlyPayment, downPaymentAmount, totalInterest, totalUpfront, interestRate: scenario.interestRate, amortization: scenario.amortization };
  };

  const renderScenario = (scenario, index) => {
    const downPaymentAmount = scenario.price * (scenario.downPaymentPercent / 100);
    const mortgageInsurance = calculateCMHC(scenario.price, scenario.downPaymentPercent);
    const totalMortgageAmount = (scenario.price - downPaymentAmount) + mortgageInsurance;
    const monthlyPayment = calculatePayment(totalMortgageAmount, scenario.interestRate, scenario.amortization);
    const totalInterest = calculateTotalInterest(monthlyPayment, scenario.amortization, totalMortgageAmount);
    const totalLTT = calculateTotalLTT(scenario.price, scenario.isToronto, scenario.isFirstTimeBuyer);
    const closingCosts = 2300;
    const totalAmountDueOnClosing = downPaymentAmount + totalLTT + closingCosts;

    return (
      <Card key={index} className="border-2 border-slate-200">
        <CardHeader className="bg-slate-50">
          <div className="flex items-center justify-between">
            {editingScenarioName === index ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveScenarioName(index);
                    if (e.key === 'Escape') setEditingScenarioName(null);
                  }}
                  className="text-lg font-semibold"
                  autoFocus
                />
                <Button size="sm" onClick={() => handleSaveScenarioName(index)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <CardTitle className="text-xl text-slate-900">{scenario.name}</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEditScenarioName(index)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
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
                  onFocus={(e) => e.target.select()}
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
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-600">Total Interest Over {scenario.amortization} Years</span>
              <span className="font-medium text-red-600">{formatCurrency(totalInterest)}</span>
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
        <CardFooter className="pt-2 border-t border-slate-100">
          <Button 
            onClick={() => handleSaveScenario(index)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            disabled={savedCount >= 3}
          >
            <Save className="w-4 h-4" />
            {savedCount >= 3 ? 'Limit Reached (3/3)' : `Save Scenario (${savedCount}/3)`}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Ad Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-400 mb-2">Advertisement</p>
        <div className="bg-white border border-dashed border-slate-300 rounded h-24 flex items-center justify-center">
          <span className="text-slate-400 text-sm">AdSense Ad Space (728x90)</span>
        </div>
      </div>

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

      {/* Visual Comparison with Tabs */}
      <Card className="border-2 border-emerald-200">
        <CardHeader className="bg-emerald-50">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <CardTitle className="text-2xl text-slate-900">Scenario Comparison</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="charts">Visual Charts</TabsTrigger>
              <TabsTrigger value="table">Data Table</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-6">
              {/* Monthly Payment Comparison */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Payment Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="Monthly Payment" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Total Interest Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Total Interest Paid</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={getInterestPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getInterestPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Payoff Time (Years)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={getPayoffData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="years" fill="#3b82f6">
                        {getPayoffData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upfront Costs Comparison */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Upfront Costs Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Down Payment" fill="#10b981" />
                    <Bar dataKey="Upfront Costs" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-emerald-200">
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Metric</th>
                  {scenarios.map((scenario, idx) => (
                    <th key={idx} className="text-right py-3 px-2 font-semibold text-slate-700">
                      {scenario.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    label: 'Monthly Payment',
                    getValue: (s) => getScenarioMetrics(s).monthlyPayment,
                    highlight: true
                  },
                  { 
                    label: 'Down Payment',
                    getValue: (s) => getScenarioMetrics(s).downPaymentAmount
                  },
                  { 
                    label: 'Total Interest Paid',
                    getValue: (s) => getScenarioMetrics(s).totalInterest,
                    isNegative: true
                  },
                  { 
                    label: 'Upfront Costs',
                    getValue: (s) => getScenarioMetrics(s).totalUpfront
                  },
                  { 
                    label: 'Interest Rate',
                    getValue: (s) => s.interestRate,
                    isPercent: true
                  },
                  { 
                    label: 'Amortization',
                    getValue: (s) => s.amortization,
                    isYears: true
                  }
                ].map((row, idx) => {
                  const values = scenarios.map(s => row.getValue(s));
                  const minValue = Math.min(...values);
                  const maxValue = Math.max(...values);
                  
                  return (
                    <tr key={idx} className="border-b border-emerald-100">
                      <td className="py-3 px-2 font-medium text-slate-700">{row.label}</td>
                      {scenarios.map((scenario, sIdx) => {
                        const value = values[sIdx];
                        const isBest = row.isNegative ? value === minValue : value === minValue;
                        const isWorst = row.isNegative ? value === maxValue : value === maxValue;
                        
                        return (
                          <td 
                            key={sIdx} 
                            className={`text-right py-3 px-2 font-semibold ${
                              row.highlight ? 'text-emerald-700 text-base' :
                              isBest && values.some((v, i) => v !== values[i]) ? 'text-green-600' :
                              isWorst && values.some((v, i) => v !== values[i]) ? 'text-red-600' :
                              'text-slate-900'
                            }`}
                          >
                            {row.isPercent ? `${value.toFixed(2)}%` :
                             row.isYears ? `${value} yrs` :
                             formatCurrency(value)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-slate-600 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-100 border border-green-600 rounded"></span>
                  Best Value
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-100 border border-red-600 rounded"></span>
                  Highest Cost
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => renderScenario(scenario, index))}
      </div>

      {/* Bottom Ad Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-400 mb-2">Advertisement</p>
        <div className="bg-white border border-dashed border-slate-300 rounded h-24 flex items-center justify-center">
          <span className="text-slate-400 text-sm">AdSense Ad Space (728x90)</span>
        </div>
      </div>

      {/* Save Scenario Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Scenario</DialogTitle>
            <DialogDescription>
              Give this scenario a name to save it for later comparison.
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
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmSaveScenario} disabled={!scenarioName.trim() || saveScenarioMutation.isPending}>
              {saveScenarioMutation.isPending ? "Saving..." : "Save Scenario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      );
      }