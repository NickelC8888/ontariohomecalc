import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DollarSign, Home, Wifi, Phone, Tv, PiggyBank, TrendingUp, AlertCircle, CheckCircle, PieChart, Car, Bus, Save, LineChart, Lightbulb } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';

export default function MonthlyBudget() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const { data: budgetHistory = [] } = useQuery({
    queryKey: ['budgetHistory', currentUser?.email],
    queryFn: async () => {
      if (!currentUser) return [];
      const snapshots = await base44.entities.BudgetSnapshot.filter({ created_by: currentUser.email }, '-snapshot_date', 12);
      return snapshots;
    },
    enabled: !!currentUser,
  });

  const saveBudgetMutation = useMutation({
    mutationFn: async (budgetData) => {
      return base44.entities.BudgetSnapshot.create(budgetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetHistory'] });
    },
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

  const handleSaveBudget = async () => {
    if (!currentUser) {
      alert('Please sign in to save your budget');
      return;
    }

    setIsSaving(true);
    try {
      await saveBudgetMutation.mutateAsync({
        snapshot_date: new Date().toISOString().split('T')[0],
        monthly_income: budget.monthlyIncome,
        mortgage_payment: budget.mortgagePayment,
        maintenance_fee: budget.maintenanceFee,
        property_tax: budget.propertyTax,
        utilities: budget.utilities,
        insurance: budget.insurance,
        cable: budget.cable,
        internet: budget.internet,
        telephone: budget.telephone,
        groceries: budget.groceries,
        transportation: budget.transportation,
        transportation_type: transportationType,
        other_expenses: budget.otherExpenses,
        savings: budget.savings,
        total_housing: housingCosts,
        total_living: livingCosts,
        total_expenses: totalExpenses,
        remaining_income: remainingIncome
      });
      alert('Budget saved successfully!');
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('Failed to save budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare chart data
  const chartData = budgetHistory.map(snapshot => ({
    date: format(new Date(snapshot.snapshot_date), 'MMM yy'),
    housing: snapshot.total_housing || 0,
    living: snapshot.total_living || 0,
    savings: snapshot.savings || 0,
    income: snapshot.monthly_income || 0,
    remaining: snapshot.remaining_income || 0
  })).reverse();

  // Generate recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    if (budget.monthlyIncome > 0) {
      const housingRatio = (housingCosts / budget.monthlyIncome) * 100;
      const savingsRatio = (budget.savings / budget.monthlyIncome) * 100;
      const transportRatio = (budget.transportation / budget.monthlyIncome) * 100;

      if (housingRatio > 35) {
        recommendations.push({
          type: 'warning',
          title: 'Housing costs are high',
          message: `Your housing costs (${housingRatio.toFixed(1)}%) exceed the recommended 30% of income. Consider refinancing or finding ways to reduce utilities and insurance.`,
          icon: Home
        });
      } else if (housingRatio <= 30) {
        recommendations.push({
          type: 'success',
          title: 'Excellent housing budget',
          message: `Your housing costs (${housingRatio.toFixed(1)}%) are within the ideal range. This leaves room for savings and other goals.`,
          icon: CheckCircle
        });
      }

      if (savingsRatio < 10) {
        recommendations.push({
          type: 'warning',
          title: 'Increase your savings rate',
          message: `Aim to save at least 20% of your income. You're currently at ${savingsRatio.toFixed(1)}%. Try to reduce discretionary spending by ${formatCurrency((budget.monthlyIncome * 0.2) - budget.savings)}/month.`,
          icon: PiggyBank
        });
      } else if (savingsRatio >= 20) {
        recommendations.push({
          type: 'success',
          title: 'Great savings habit!',
          message: `You're saving ${savingsRatio.toFixed(1)}% of your income - excellent! Keep this up to build wealth over time.`,
          icon: TrendingUp
        });
      }

      if (transportationType === 'car' && transportRatio > 15) {
        recommendations.push({
          type: 'tip',
          title: 'High transportation costs',
          message: `Car expenses (${transportRatio.toFixed(1)}%) are above 15% of income. Consider public transit on some days or carpooling to reduce costs by ~${formatCurrency(budget.transportation * 0.3)}/month.`,
          icon: Car
        });
      }

      if (remainingIncome < 0) {
        recommendations.push({
          type: 'urgent',
          title: 'Budget deficit detected',
          message: `You're spending ${formatCurrency(Math.abs(remainingIncome))} more than you earn. Review discretionary expenses like cable, dining out, and entertainment.`,
          icon: AlertCircle
        });
      }

      if (budgetHistory.length >= 3) {
        const avgRemaining = budgetHistory.slice(0, 3).reduce((sum, s) => sum + (s.remaining_income || 0), 0) / 3;
        if (remainingIncome > avgRemaining * 1.2) {
          recommendations.push({
            type: 'success',
            title: 'Budget improving!',
            message: `Your remaining income has increased significantly compared to your 3-month average. Consider putting the extra ${formatCurrency(remainingIncome - avgRemaining)} toward debt or investments.`,
            icon: TrendingUp
          });
        }
      }
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'info',
        title: 'Start tracking your budget',
        message: 'Enter your income and expenses to get personalized recommendations for improving your financial health.',
        icon: Lightbulb
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

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
          {/* Save Budget Button */}
          <Button 
            onClick={handleSaveBudget} 
            disabled={isSaving || !currentUser}
            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Current Budget Snapshot'}
          </Button>
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

            {/* Personalized Recommendations */}
            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Your Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, idx) => {
                  const Icon = rec.icon;
                  const colors = {
                    urgent: 'border-red-200 bg-red-50 text-red-900',
                    warning: 'border-orange-200 bg-orange-50 text-orange-900',
                    tip: 'border-blue-200 bg-blue-50 text-blue-900',
                    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
                    info: 'border-slate-200 bg-slate-50 text-slate-900'
                  };
                  return (
                    <div key={idx} className={`p-3 rounded-lg border ${colors[rec.type]}`}>
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">{rec.title}</p>
                          <p className="text-xs mt-1 opacity-90">{rec.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Analytics Section - Historical Data */}
      {budgetHistory.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Budget Analytics & Trends
            </CardTitle>
            <CardDescription>Track your spending patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trends">Spending Trends</TabsTrigger>
                <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
                <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="housing" stroke="#10b981" strokeWidth={2} name="Housing" />
                      <Line type="monotone" dataKey="living" stroke="#3b82f6" strokeWidth={2} name="Living" />
                      <Line type="monotone" dataKey="savings" stroke="#a855f7" strokeWidth={2} name="Savings" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="housing" fill="#10b981" name="Housing" />
                      <Bar dataKey="living" fill="#3b82f6" name="Living" />
                      <Bar dataKey="savings" fill="#a855f7" name="Savings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#059669" strokeWidth={3} name="Income" />
                      <Line type="monotone" dataKey="remaining" stroke={chartData.some(d => d.remaining < 0) ? "#ef4444" : "#10b981"} strokeWidth={2} name="Remaining" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Avg Monthly Income</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(chartData.reduce((sum, d) => sum + d.income, 0) / chartData.length)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Avg Remaining</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(chartData.reduce((sum, d) => sum + d.remaining, 0) / chartData.length)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Best Month</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {chartData.length > 0 ? chartData.reduce((max, d) => d.remaining > max.remaining ? d : max, chartData[0]).date : 'N/A'}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}