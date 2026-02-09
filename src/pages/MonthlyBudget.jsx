import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Home, Wifi, Phone, Tv, PiggyBank, TrendingUp, AlertCircle, CheckCircle, PieChart, Car, Bus } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function MonthlyBudget() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Budget inputs
  const [budget, setBudget] = useState({
    mortgagePayment: 0,
    maintenanceFee: 0,
    propertyTax: 0,
    cable: 0,
    internet: 0,
    telephone: 0,
    utilities: 0,
    insurance: 0,
    groceries: 0,
    transportation: 0,
    otherExpenses: 0,
    savings: 0,
    monthlyIncome: 0
  });
  const [transportationType, setTransportationType] = useState('car'); // 'car' or 'transit'

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    loadUser();
  }, []);

  const { data: scenarios } = useQuery({
    queryKey: ['scenarios', currentUser?.email],
    queryFn: async () => {
      if (!currentUser) return [];
      return base44.entities.Scenario.filter({ created_by: currentUser.email }, '-created_date', 100);
    },
    initialData: [],
    enabled: !!currentUser,
  });

  const handleScenarioSelect = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      
      // Calculate monthly property tax based on location
      const estimatedAnnualTax = scenario.is_toronto 
        ? scenario.property_price * 0.006135 // Toronto avg rate
        : scenario.property_price * 0.01; // Ontario avg rate
      const monthlyTax = estimatedAnnualTax / 12;

      setBudget(prev => ({
        ...prev,
        mortgagePayment: scenario.monthly_payment,
        propertyTax: Math.round(monthlyTax)
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setBudget(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  // Calculations
  const housingCosts = budget.mortgagePayment + budget.maintenanceFee + budget.propertyTax + budget.utilities + budget.insurance;
  const livingCosts = budget.cable + budget.internet + budget.telephone + budget.groceries + budget.transportation + budget.otherExpenses;
  const totalExpenses = housingCosts + livingCosts + budget.savings;
  const remainingIncome = budget.monthlyIncome - totalExpenses;
  const budgetHealth = budget.monthlyIncome > 0 ? ((remainingIncome / budget.monthlyIncome) * 100) : 0;

  const expenseCategories = [
    { name: 'Housing', value: housingCosts, icon: Home, color: 'bg-emerald-500' },
    { name: 'Living', value: livingCosts, icon: TrendingUp, color: 'bg-blue-500' },
    { name: 'Savings', value: budget.savings, icon: PiggyBank, color: 'bg-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Monthly Budget Calculator</h1>
        <p className="text-slate-500">Plan your monthly finances and compare income vs expenses</p>
      </div>

      {/* Scenario Selector */}
      {scenarios.length > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg">Load from Saved Scenario</CardTitle>
            <CardDescription>Auto-fill mortgage and property tax from your saved calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleScenarioSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario..." />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map(scenario => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name} - {formatCurrency(scenario.monthly_payment)}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          {/* Income */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <Input 
                  type="number"
                  value={budget.monthlyIncome || ''}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  placeholder="0"
                  className="pl-7 text-lg font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Housing Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-slate-700" />
                Housing Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mortgage Payment</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.mortgagePayment || ''}
                      onChange={(e) => handleInputChange('mortgagePayment', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.maintenanceFee || ''}
                      onChange={(e) => handleInputChange('maintenanceFee', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Property Tax (Monthly)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.propertyTax || ''}
                      onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Utilities</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.utilities || ''}
                      onChange={(e) => handleInputChange('utilities', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Home Insurance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.insurance || ''}
                      onChange={(e) => handleInputChange('insurance', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Housing:</span>
                  <span className="text-emerald-600">{formatCurrency(housingCosts)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Living Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-slate-700" />
                Living Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Internet
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.internet || ''}
                      onChange={(e) => handleInputChange('internet', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Tv className="w-3 h-3" /> Cable/Streaming
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.cable || ''}
                      onChange={(e) => handleInputChange('cable', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Telephone/Mobile
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.telephone || ''}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Groceries</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.groceries || ''}
                      onChange={(e) => handleInputChange('groceries', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Transportation</Label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={transportationType === 'car' ? 'default' : 'outline'}
                      onClick={() => setTransportationType('car')}
                      className="flex-1"
                    >
                      <Car className="w-3 h-3 mr-1" />
                      Car Payment
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={transportationType === 'transit' ? 'default' : 'outline'}
                      onClick={() => setTransportationType('transit')}
                      className="flex-1"
                    >
                      <Bus className="w-3 h-3 mr-1" />
                      Public Transit
                    </Button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.transportation || ''}
                      onChange={(e) => handleInputChange('transportation', e.target.value)}
                      placeholder={transportationType === 'car' ? 'Monthly car payment + insurance + gas' : 'Monthly transit pass'}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Other Expenses</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <Input 
                      type="number"
                      value={budget.otherExpenses || ''}
                      onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Living:</span>
                  <span className="text-blue-600">{formatCurrency(livingCosts)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-purple-600" />
                Monthly Savings Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <Input 
                  type="number"
                  value={budget.savings || ''}
                  onChange={(e) => handleInputChange('savings', e.target.value)}
                  className="pl-7"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            {/* Budget Health */}
            <Card className={`border-2 ${remainingIncome >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {remainingIncome >= 0 ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  Budget Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Remaining After Expenses</p>
                  <p className={`text-4xl font-bold ${remainingIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(remainingIncome)}
                  </p>
                </div>
                {budget.monthlyIncome > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Budget Health</span>
                      <span className="font-medium">{budgetHealth.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.max(0, budgetHealth)} 
                      className={`h-3 ${remainingIncome >= 0 ? '[&>div]:bg-emerald-600' : '[&>div]:bg-red-600'}`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Income vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="font-medium text-slate-700">Total Income</span>
                    <span className="font-bold text-emerald-600 text-lg">{formatCurrency(budget.monthlyIncome)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Total Expenses</span>
                    <span className="font-bold text-slate-900 text-lg">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  {expenseCategories.map(category => {
                    const percentage = totalExpenses > 0 ? (category.value / totalExpenses * 100) : 0;
                    return (
                      <div key={category.name}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${category.color}`} />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(category.value)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="text-xs text-slate-500 w-12 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {budget.monthlyIncome > 0 && (
                  <div className="pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Housing as % of Income</span>
                      <span className="font-medium">{((housingCosts / budget.monthlyIncome) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Savings Rate</span>
                      <span className="font-medium">{((budget.savings / budget.monthlyIncome) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Tips */}
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-slate-900">💡 Financial Tips</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Housing costs should be ≤ 30% of income</li>
                    <li>• Aim to save at least 20% monthly</li>
                    <li>• Keep emergency fund of 3-6 months expenses</li>
                    <li>• Review and adjust budget quarterly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}