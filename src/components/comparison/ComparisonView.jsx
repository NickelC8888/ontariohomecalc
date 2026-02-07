import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  ChevronUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function ComparisonView({ scenarios, onClose }) {
  const [sortBy, setSortBy] = useState('monthly_payment');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedMetrics, setExpandedMetrics] = useState({});

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Detailed Table</TabsTrigger>
          <TabsTrigger value="charts">Visual Comparison</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
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
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}