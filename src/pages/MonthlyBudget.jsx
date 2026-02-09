import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Wifi, 
  Phone, 
  Tv, 
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function MonthlyBudget() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Budget inputs
  const [monthlyMortgage, setMonthlyMortgage] = useState(0);
  const [propertyPrice, setPropertyPrice] = useState(0);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(0);
  const [isToronto, setIsToronto] = useState(false);
  const [maintenanceFee, setMaintenanceFee] = useState(0);
  const [cable, setCable] = useState(0);
  const [internet, setInternet] = useState(0);
  const [telephone, setTelephone] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const [savings, setSavings] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // Load data from calculator if available
  useEffect(() => {
    if (location.state?.fromCalculator) {
      const data = location.state;
      setMonthlyMortgage(data.monthlyMortgage || 0);
      setPropertyPrice(data.propertyPrice || 0);
      setIsToronto(data.isToronto || false);
      
      // Auto-calculate property tax if price is available
      if (data.propertyPrice) {
        const estimatedTax = calculatePropertyTax(data.propertyPrice, data.isToronto);
        setAnnualPropertyTax(estimatedTax);
      }
    }
  }, [location.state]);

  const calculatePropertyTax = (price, isTorontoProperty) => {
    // Toronto average tax rate: ~0.66%
    // Ontario average tax rate: ~1.0%
    const taxRate = isTorontoProperty ? 0.0066 : 0.01;
    return price * taxRate;
  };

  const monthlyPropertyTax = annualPropertyTax / 12;

  const totalExpenses = monthlyMortgage + monthlyPropertyTax + maintenanceFee + 
                        cable + internet + telephone + otherExpenses + savings;
  
  const netCashFlow = monthlyIncome - totalExpenses;
  const isPositive = netCashFlow >= 0;
  const utilizationRate = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  const formatPercent = (val) => `${val.toFixed(1)}%`;

  // Chart data
  const expenseBreakdown = [
    { name: 'Mortgage', value: monthlyMortgage, color: '#10b981' },
    { name: 'Property Tax', value: monthlyPropertyTax, color: '#3b82f6' },
    { name: 'Maintenance', value: maintenanceFee, color: '#f59e0b' },
    { name: 'Cable', value: cable, color: '#8b5cf6' },
    { name: 'Internet', value: internet, color: '#ec4899' },
    { name: 'Telephone', value: telephone, color: '#14b8a6' },
    { name: 'Savings', value: savings, color: '#6366f1' },
    { name: 'Other', value: otherExpenses, color: '#6b7280' }
  ].filter(item => item.value > 0);

  const comparisonData = [
    { name: 'Income', amount: monthlyIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpenses, fill: '#ef4444' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Monthly Budget Planner</h1>
        <p className="text-slate-500">Track your monthly income and expenses to ensure affordability</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-emerald-200 bg-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{formatCurrency(monthlyIncome)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${isPositive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-2xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(netCashFlow)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alert */}
      {utilizationRate > 0 && (
        <Card className={`border-2 ${
          utilizationRate > 50 ? 'border-red-200 bg-red-50' : 
          utilizationRate > 35 ? 'border-amber-200 bg-amber-50' : 
          'border-emerald-200 bg-emerald-50'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {utilizationRate > 50 ? (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              ) : utilizationRate > 35 ? (
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-semibold ${
                  utilizationRate > 50 ? 'text-red-900' : 
                  utilizationRate > 35 ? 'text-amber-900' : 
                  'text-emerald-900'
                }`}>
                  {utilizationRate > 50 ? 'High Debt-to-Income Ratio' : 
                   utilizationRate > 35 ? 'Moderate Debt-to-Income Ratio' : 
                   'Healthy Debt-to-Income Ratio'}
                </p>
                <p className={`text-sm mt-1 ${
                  utilizationRate > 50 ? 'text-red-700' : 
                  utilizationRate > 35 ? 'text-amber-700' : 
                  'text-emerald-700'
                }`}>
                  You're spending <strong>{formatPercent(utilizationRate)}</strong> of your monthly income. 
                  {utilizationRate > 50 && ' This may be difficult to sustain long-term.'}
                  {utilizationRate > 35 && utilizationRate <= 50 && ' Consider reducing expenses or increasing income.'}
                  {utilizationRate <= 35 && ' You have a comfortable margin for unexpected expenses.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Gross Monthly Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={monthlyIncome} 
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-slate-700" />
                Housing Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Mortgage Payment</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={monthlyMortgage} 
                    onChange={(e) => setMonthlyMortgage(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Property Tax (Annual)</Label>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-slate-600">Toronto</Label>
                    <Switch 
                      checked={isToronto}
                      onCheckedChange={(checked) => {
                        setIsToronto(checked);
                        if (propertyPrice > 0) {
                          setAnnualPropertyTax(calculatePropertyTax(propertyPrice, checked));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={annualPropertyTax} 
                    onChange={(e) => setAnnualPropertyTax(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Monthly: {formatCurrency(monthlyPropertyTax)}
                  {propertyPrice > 0 && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 ml-2 text-xs"
                      onClick={() => setAnnualPropertyTax(calculatePropertyTax(propertyPrice, isToronto))}
                    >
                      Auto-calculate
                    </Button>
                  )}
                </p>
              </div>

              {propertyPrice === 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">Property Price (for tax calculation)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input 
                      type="number" 
                      value={propertyPrice} 
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setPropertyPrice(price);
                        if (price > 0) {
                          setAnnualPropertyTax(calculatePropertyTax(price, isToronto));
                        }
                      }}
                      className="pl-7 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Monthly Maintenance/Condo Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={maintenanceFee} 
                    onChange={(e) => setMaintenanceFee(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-slate-700" />
                Utilities & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tv className="w-4 h-4" />
                  Cable/Streaming
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={cable} 
                    onChange={(e) => setCable(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  Internet
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={internet} 
                    onChange={(e) => setInternet(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telephone/Mobile
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={telephone} 
                    onChange={(e) => setTelephone(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-slate-700" />
                Other
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4" />
                  Monthly Savings Goal
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={savings} 
                    onChange={(e) => setSavings(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Other Monthly Expenses</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" 
                    value={otherExpenses} 
                    onChange={(e) => setOtherExpenses(Number(e.target.value))}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500">Food, transportation, insurance, etc.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>Monthly comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-4 space-y-2">
                    {expenseBreakdown.map((item) => (
                      <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-700">{item.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  Enter your expenses to see the breakdown
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-slate-600">Monthly Income</span>
                <span className="font-bold text-emerald-600">{formatCurrency(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-slate-600">Total Expenses</span>
                <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-slate-900">Remaining</span>
                <span className={`font-bold text-lg ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netCashFlow)}
                </span>
              </div>
              {monthlyIncome > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Expense Ratio</span>
                    <Badge className={`${
                      utilizationRate > 50 ? 'bg-red-100 text-red-700' :
                      utilizationRate > 35 ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {formatPercent(utilizationRate)}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}