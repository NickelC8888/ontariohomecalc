import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home,
  Calendar,
  Percent,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

export default function ComparisonView({ scenarios, onClose }) {
  const [sortBy, setSortBy] = useState('monthly_payment');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [sensitivityMetric, setSensitivityMetric] = useState('interest_rate');

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedScenarios = [...scenarios].sort((a, b) => {
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Find best/worst scenarios
  const findBest = (field) => {
    return scenarios.reduce((best, curr) => 
      (!best || curr[field] < best[field]) ? curr : best
    , null);
  };

  const findWorst = (field) => {
    return scenarios.reduce((worst, curr) => 
      (!worst || curr[field] > worst[field]) ? curr : worst
    , null);
  };

  const bestMonthly = findBest('monthly_payment');
  const bestUpfront = findBest('total_cash_needed');
  const bestLTT = findBest('total_ltt');

  // Prepare chart data
  const monthlyPaymentData = scenarios.map(s => ({
    name: s.name,
    value: s.monthly_payment
  }));

  const upfrontCostsData = scenarios.map(s => ({
    name: s.name,
    'Down Payment': s.property_price * (s.down_payment_percent / 100),
    'LTT': s.total_ltt,
    'Closing Costs': s.closing_costs || 2300
  }));

  const pieColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

  const toggleMetric = (metric) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const calculateDifference = (field) => {
    const values = scenarios.map(s => s[field]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max, diff: max - min, percentage: ((max - min) / min * 100).toFixed(1) };
  };

  // Calculation helpers for sensitivity analysis
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

  // Sensitivity Analysis
  const generateSensitivityData = () => {
    if (sensitivityMetric === 'interest_rate') {
      const steps = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
      return steps.map(adjustment => {
        const dataPoint = { adjustment: `${adjustment >= 0 ? '+' : ''}${adjustment}%` };
        scenarios.forEach(scenario => {
          const newRate = scenario.interest_rate + adjustment;
          const downPaymentAmount = scenario.property_price * (scenario.down_payment_percent / 100);
          const mortgageInsurance = calculateCMHC(scenario.property_price, scenario.down_payment_percent);
          const totalMortgage = (scenario.property_price - downPaymentAmount) + mortgageInsurance;
          const payment = calculatePayment(totalMortgage, newRate, scenario.amortization);
          dataPoint[scenario.name] = payment;
        });
        return dataPoint;
      });
    } else if (sensitivityMetric === 'property_price') {
      const steps = [-20, -15, -10, -5, 0, 5, 10, 15, 20];
      return steps.map(adjustmentPercent => {
        const dataPoint = { adjustment: `${adjustmentPercent >= 0 ? '+' : ''}${adjustmentPercent}%` };
        scenarios.forEach(scenario => {
          const newPrice = scenario.property_price * (1 + adjustmentPercent / 100);
          const downPaymentAmount = newPrice * (scenario.down_payment_percent / 100);
          const mortgageInsurance = calculateCMHC(newPrice, scenario.down_payment_percent);
          const totalMortgage = (newPrice - downPaymentAmount) + mortgageInsurance;
          const payment = calculatePayment(totalMortgage, scenario.interest_rate, scenario.amortization);
          dataPoint[scenario.name] = payment;
        });
        return dataPoint;
      });
    } else if (sensitivityMetric === 'down_payment') {
      const steps = [-10, -5, -2.5, 0, 2.5, 5, 10, 15, 20];
      return steps.map(adjustmentPercent => {
        const dataPoint = { adjustment: `${adjustmentPercent >= 0 ? '+' : ''}${adjustmentPercent}%` };
        scenarios.forEach(scenario => {
          const newDownPayment = Math.max(5, Math.min(100, scenario.down_payment_percent + adjustmentPercent));
          const downPaymentAmount = scenario.property_price * (newDownPayment / 100);
          const mortgageInsurance = calculateCMHC(scenario.property_price, newDownPayment);
          const totalMortgage = (scenario.property_price - downPaymentAmount) + mortgageInsurance;
          const payment = calculatePayment(totalMortgage, scenario.interest_rate, scenario.amortization);
          dataPoint[scenario.name] = payment;
        });
        return dataPoint;
      });
    }
    return [];
  };

  // Stress Test Analysis (Interest Rate +/- 2%)
  const generateStressTestData = () => {
    return scenarios.map(scenario => {
      const downPaymentAmount = scenario.property_price * (scenario.down_payment_percent / 100);
      const mortgageInsurance = calculateCMHC(scenario.property_price, scenario.down_payment_percent);
      const totalMortgage = (scenario.property_price - downPaymentAmount) + mortgageInsurance;
      
      const currentPayment = scenario.monthly_payment;
      const rateMinus2 = calculatePayment(totalMortgage, scenario.interest_rate - 2, scenario.amortization);
      const ratePlus2 = calculatePayment(totalMortgage, scenario.interest_rate + 2, scenario.amortization);
      
      return {
        name: scenario.name,
        'Rate -2%': rateMinus2,
        'Current': currentPayment,
        'Rate +2%': ratePlus2,
        savingsIfLower: currentPayment - rateMinus2,
        increaseIfHigher: ratePlus2 - currentPayment
      };
    });
  };

  const sensitivityData = generateSensitivityData();
  const stressTestData = generateStressTestData();

  return (
    <div className="space-y-6">
      {/* Header with Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Best Monthly Payment</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">
                  {formatCurrency(bestMonthly?.monthly_payment)}
                </p>
                <p className="text-xs text-emerald-600 mt-1">{bestMonthly?.name}</p>
              </div>
              <TrendingDown className="w-10 h-10 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Best Upfront Cash</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {formatCurrency(bestUpfront?.total_cash_needed)}
                </p>
                <p className="text-xs text-blue-600 mt-1">{bestUpfront?.name}</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Lowest LTT</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {formatCurrency(bestLTT?.total_ltt)}
                </p>
                <p className="text-xs text-purple-600 mt-1">{bestLTT?.name}</p>
              </div>
              <TrendingDown className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="table">Detailed Table</TabsTrigger>
          <TabsTrigger value="charts">Visual Comparison</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
          <TabsTrigger value="stress">Stress Test</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ArrowUpDown className="w-4 h-4" />
            <span>Click column headers to sort</span>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold w-[180px]">Scenario</TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('property_price')}>
                    <div className="flex items-center justify-center gap-1">
                      Property Price
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('monthly_payment')}>
                    <div className="flex items-center justify-center gap-1">
                      Monthly Payment
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('total_cash_needed')}>
                    <div className="flex items-center justify-center gap-1">
                      Upfront Cash
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('down_payment_percent')}>
                    <div className="flex items-center justify-center gap-1">
                      Down Payment
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('interest_rate')}>
                    <div className="flex items-center justify-center gap-1">
                      Rate
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('total_ltt')}>
                    <div className="flex items-center justify-center gap-1">
                      LTT
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedScenarios.map((scenario, idx) => (
                  <TableRow key={scenario.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <TableCell className="font-semibold">
                      <div>
                        <div className="text-slate-900">{scenario.name}</div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {scenario.mortgage_type}
                          </Badge>
                          {scenario.is_toronto && (
                            <Badge variant="outline" className="text-xs">Toronto</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(scenario.property_price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-bold text-emerald-600">
                        {formatCurrency(scenario.monthly_payment)}
                      </div>
                      {scenario.id === bestMonthly?.id && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs mt-1">Best</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-bold">
                        {formatCurrency(scenario.total_cash_needed)}
                      </div>
                      {scenario.id === bestUpfront?.id && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">Best</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {scenario.down_payment_percent.toFixed(1)}%
                      <div className="text-xs text-slate-500">
                        {formatCurrency(scenario.property_price * (scenario.down_payment_percent / 100))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {scenario.interest_rate}%
                    </TableCell>
                    <TableCell className="text-center">
                      {formatCurrency(scenario.total_ltt)}
                      {scenario.id === bestLTT?.id && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">Best</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Payment Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPaymentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upfront Costs Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={upfrontCostsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Bar dataKey="Down Payment" stackId="a" fill="#10b981" />
                  <Bar dataKey="LTT" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="Closing Costs" stackId="a" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Payment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={monthlyPaymentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {monthlyPaymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-4">
          {/* Expandable Insights */}
          {[
            { 
              key: 'monthly', 
              icon: Home, 
              title: 'Monthly Payment Analysis',
              field: 'monthly_payment',
              color: 'emerald'
            },
            { 
              key: 'upfront', 
              icon: DollarSign, 
              title: 'Upfront Cash Analysis',
              field: 'total_cash_needed',
              color: 'blue'
            },
            { 
              key: 'rate', 
              icon: Percent, 
              title: 'Interest Rate Impact',
              field: 'interest_rate',
              color: 'purple'
            }
          ].map(({ key, icon: Icon, title, field, color }) => {
            const stats = calculateDifference(field);
            const isExpanded = expandedMetrics[key];
            
            return (
              <Card key={key} className={`border-${color}-200 bg-${color}-50/30 cursor-pointer hover:shadow-md transition-shadow`} onClick={() => toggleMetric(key)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${color}-100`}>
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      <CardTitle className="text-base">{title}</CardTitle>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Lowest</p>
                          <p className="text-lg font-bold text-emerald-600">
                            {field === 'interest_rate' ? `${stats.min}%` : formatCurrency(stats.min)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Highest</p>
                          <p className="text-lg font-bold text-red-600">
                            {field === 'interest_rate' ? `${stats.max}%` : formatCurrency(stats.max)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Difference</p>
                          <p className="text-lg font-bold text-slate-900">
                            {field === 'interest_rate' ? `${stats.diff.toFixed(2)}%` : formatCurrency(stats.diff)}
                          </p>
                          <p className="text-xs text-slate-500">{stats.percentage}% variance</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        {scenarios.map(s => (
                          <div key={s.id} className="flex justify-between py-2 text-sm">
                            <span className="text-slate-600">{s.name}</span>
                            <span className="font-semibold">
                              {field === 'interest_rate' ? `${s[field]}%` : formatCurrency(s[field])}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Overall Recommendation */}
          <Card className="border-slate-300 bg-slate-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                Overall Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-slate-700">
                  Based on your comparison, <span className="font-bold text-emerald-600">{bestMonthly?.name}</span> offers the best monthly affordability at {formatCurrency(bestMonthly?.monthly_payment)}/month.
                </p>
                {bestUpfront?.id !== bestMonthly?.id && (
                  <p className="text-slate-700">
                    However, <span className="font-bold text-blue-600">{bestUpfront?.name}</span> requires the least upfront cash at {formatCurrency(bestUpfront?.total_cash_needed)}.
                  </p>
                )}
                <div className="pt-3 border-t border-slate-200">
                  <p className="font-medium text-slate-900 mb-2">Consider these factors:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Your available cash for down payment</li>
                    <li>Monthly budget and income stability</li>
                    <li>Long-term financial goals (building equity vs. cash flow)</li>
                    <li>Market conditions and rate lock-in opportunities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensitivity" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Sensitivity Analysis
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">See how changes in key metrics impact monthly payments</p>
                </div>
                <Select value={sensitivityMetric} onValueChange={setSensitivityMetric}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interest_rate">Interest Rate</SelectItem>
                    <SelectItem value="property_price">Property Price</SelectItem>
                    <SelectItem value="down_payment">Down Payment %</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sensitivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="adjustment" />
                  <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(1)}k`} />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Legend />
                  {scenarios.map((scenario, idx) => (
                    <Line 
                      key={scenario.id}
                      type="monotone"
                      dataKey={scenario.name}
                      stroke={pieColors[idx % pieColors.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">What This Shows:</h4>
                <p className="text-sm text-blue-800">
                  {sensitivityMetric === 'interest_rate' && 'How monthly payments change if interest rates rise or fall by up to 2%. Steeper lines indicate greater sensitivity to rate changes.'}
                  {sensitivityMetric === 'property_price' && 'How monthly payments change with different property prices. This helps you understand affordability at various price points.'}
                  {sensitivityMetric === 'down_payment' && 'How increasing or decreasing your down payment percentage affects monthly payments. Larger down payments reduce CMHC insurance and mortgage amounts.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sensitivity Summary Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-bold">Scenario</TableHead>
                      <TableHead className="text-center">Current Payment</TableHead>
                      <TableHead className="text-center">Best Case</TableHead>
                      <TableHead className="text-center">Worst Case</TableHead>
                      <TableHead className="text-center">Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map(scenario => {
                      const scenarioData = sensitivityData.map(d => d[scenario.name]);
                      const minPayment = Math.min(...scenarioData);
                      const maxPayment = Math.max(...scenarioData);
                      const currentPayment = scenario.monthly_payment;
                      
                      return (
                        <TableRow key={scenario.id}>
                          <TableCell className="font-semibold">{scenario.name}</TableCell>
                          <TableCell className="text-center font-bold text-slate-900">
                            {formatCurrency(currentPayment)}
                          </TableCell>
                          <TableCell className="text-center text-emerald-600 font-semibold">
                            {formatCurrency(minPayment)}
                          </TableCell>
                          <TableCell className="text-center text-red-600 font-semibold">
                            {formatCurrency(maxPayment)}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {formatCurrency(maxPayment - minPayment)}
                            <div className="text-xs text-slate-500">
                              {(((maxPayment - minPayment) / currentPayment) * 100).toFixed(1)}% variance
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="space-y-6 mt-4">
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Interest Rate Stress Test (+/- 2%)
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Canadian mortgage stress test: What if rates change by 2%?
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stressTestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(1)}k`} />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Legend />
                  <Bar dataKey="Rate -2%" fill="#10b981" name="If Rate Drops 2%" />
                  <Bar dataKey="Current" fill="#3b82f6" name="Current Rate" />
                  <Bar dataKey="Rate +2%" fill="#ef4444" name="If Rate Rises 2%" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Stress Test Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stressTestData.map((data, idx) => {
                  const scenario = scenarios[idx];
                  return (
                    <div key={scenario.id} className="p-4 border rounded-lg bg-white">
                      <h4 className="font-bold text-slate-900 mb-3">{data.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <p className="text-xs text-emerald-600 font-medium mb-1">If Rates Drop 2%</p>
                          <p className="text-xl font-bold text-emerald-700">
                            {formatCurrency(data['Rate -2%'])}
                          </p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Save {formatCurrency(data.savingsIfLower)}/month
                          </p>
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs mt-2">
                            Rate: {(scenario.interest_rate - 2).toFixed(2)}%
                          </Badge>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-600 font-medium mb-1">Current Rate</p>
                          <p className="text-xl font-bold text-blue-700">
                            {formatCurrency(data.Current)}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Baseline payment</p>
                          <Badge className="bg-blue-100 text-blue-700 text-xs mt-2">
                            Rate: {scenario.interest_rate}%
                          </Badge>
                        </div>
                        
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="text-xs text-red-600 font-medium mb-1">If Rates Rise 2%</p>
                          <p className="text-xl font-bold text-red-700">
                            {formatCurrency(data['Rate +2%'])}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            +{formatCurrency(data.increaseIfHigher)}/month
                          </p>
                          <Badge className="bg-red-100 text-red-700 text-xs mt-2">
                            Rate: {(scenario.interest_rate + 2).toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                        <p>
                          <strong>Impact Range:</strong> {formatCurrency(data.increaseIfHigher + data.savingsIfLower)} 
                          <span className="text-slate-500 ml-1">
                            ({(((data.increaseIfHigher + data.savingsIfLower) / data.Current) * 100).toFixed(1)}% of current payment)
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Understanding the Stress Test</h4>
                <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                  <li>Canadian mortgage qualification requires affordability at a higher "stress test" rate</li>
                  <li>The stress test rate is your rate + 2% or 5.25%, whichever is higher</li>
                  <li>This ensures you can afford payments even if rates increase</li>
                  <li>Consider your budget flexibility when rates change - can you handle the +2% scenario?</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}