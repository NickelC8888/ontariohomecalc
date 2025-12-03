import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, ArrowRight, Building, PiggyBank, Gavel } from 'lucide-react';
import { motion } from "framer-motion";

export default function ResultsDisplay({ 
  mortgagePayment, 
  landTransferTax, 
  totalUpfront, 
  mortgageAmount,
  downPaymentAmount,
  closingCosts,
  isFirstTimeBuyer,
  mortgageInsurance
}) {
  
  const upfrontData = [
    { name: 'Down Payment', value: downPaymentAmount, color: '#059669' }, // Emerald 600
    { name: 'Land Transfer Tax', value: landTransferTax, color: '#0891b2' }, // Cyan 600
    { name: 'Closing Costs', value: closingCosts, color: '#6366f1' }, // Indigo 500
  ];

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Monthly Payment Highlight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-emerald-100 font-medium mb-1">Estimated Monthly Payment</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {formatCurrency(mortgagePayment)}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-emerald-800 pt-4">
            <div>
              <p className="text-emerald-300">Total Mortgage</p>
              <p className="font-semibold text-lg">{formatCurrency(mortgageAmount)}</p>
              {mortgageInsurance > 0 && (
                <p className="text-xs text-emerald-400">(Incl. {formatCurrency(mortgageInsurance)} CMHC)</p>
              )}
            </div>
            <div>
              <p className="text-emerald-300">Interest Cost (5yr)</p>
              <p className="font-semibold text-lg">~{formatCurrency(mortgagePayment * 12 * 5 * 0.4)}</p> {/* Rough estimate for visual */}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upfront Costs Breakdown */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
            Total Cash Required Upfront
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={upfrontData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {upfrontData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <span className="text-sm font-medium text-slate-600">Down Payment</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(downPaymentAmount)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-600"></div>
                  <span className="text-sm font-medium text-slate-600">Land Transfer Tax</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{formatCurrency(landTransferTax)}</span>
                  {isFirstTimeBuyer && <span className="text-xs text-emerald-600 font-medium">Rebate Applied</span>}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-sm font-medium text-slate-600">Legal & Misc</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(closingCosts)}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-lg">Total Cash Needed</span>
                <span className="font-bold text-emerald-600 text-xl">{formatCurrency(totalUpfront)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}