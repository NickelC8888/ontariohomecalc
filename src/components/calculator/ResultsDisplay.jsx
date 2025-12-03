import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, ArrowRight, Building, PiggyBank, Gavel } from 'lucide-react';
import { motion } from "framer-motion";

export default function ResultsDisplay({ 
  propertyPrice,
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

  const mortgagePrincipal = propertyPrice - downPaymentAmount;

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

      {/* Purchase Price Summary */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-600" />
            Purchase Price Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-2">
             <span className="text-slate-600">Down Payment</span>
             <span className="font-bold">{formatCurrency(downPaymentAmount)}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
             <span className="text-slate-600">Mortgage Amount</span>
             <span className="font-bold">{formatCurrency(mortgagePrincipal)}</span>
          </div>
          <div className="flex justify-between items-center p-2 border-t border-slate-100 mt-2">
             <span className="font-bold text-slate-900">Total Purchase Price</span>
             <span className="font-bold text-slate-900 text-lg">{formatCurrency(propertyPrice)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Closing Costs Breakdown */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Gavel className="w-5 h-5 text-emerald-600" />
            Amount Due on Closing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-3">
              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex flex-col">
                    <span className="text-slate-700 font-medium">Down Payment</span>
                    <span className="text-xs text-slate-500">Provided by User</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(downPaymentAmount)}</span>
              </div>

              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex flex-col">
                    <span className="text-slate-700 font-medium">Land Transfer Tax</span>
                    <span className="text-xs text-slate-500">Provided by User</span>
                </div>
                <div className="text-right">
                    <span className="font-bold text-slate-900 block">{formatCurrency(landTransferTax)}</span>
                    {isFirstTimeBuyer && <span className="text-xs text-emerald-600 font-medium">Rebate Applied</span>}
                </div>
              </div>

              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex flex-col">
                    <span className="text-slate-700 font-medium">Legal & Misc</span>
                    <span className="text-xs text-slate-500">Provided by User</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(closingCosts)}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg transition-colors border border-emerald-100">
                <div className="flex flex-col">
                    <span className="text-slate-700 font-medium">Mortgage</span>
                    <span className="text-xs text-emerald-600 font-medium">Provided by Lending Institution</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(mortgagePrincipal)}</span>
              </div>
           </div>

           <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg">Total Amount</span>
                <span className="text-xs text-slate-500">Purchase Price + Closing Costs</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">
                  {formatCurrency(propertyPrice + landTransferTax + closingCosts)}
              </span>
           </div>
        </CardContent>
      </Card>
      
      {/* Visual Breakdown (Optional - Kept minimal) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
         <h4 className="text-sm font-semibold text-slate-700 mb-4">Cash Required Upfront (User)</h4>
         <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={upfrontData}
                innerRadius={50}
                outerRadius={70}
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
         <div className="text-center mt-2">
             <span className="text-sm text-slate-500">Total Cash Needed: </span>
             <span className="font-bold text-slate-900">{formatCurrency(totalUpfront)}</span>
         </div>
      </div>

    </div>
  );
}