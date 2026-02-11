import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from 'lucide-react';

export default function AmortizationSchedule({ 
  open, 
  onClose, 
  mortgageAmount,
  interestRate,
  amortization,
  monthlyPayment,
  paymentFrequency = 'monthly'
}) {
  const [viewMode, setViewMode] = useState('yearly'); // 'monthly' or 'yearly'
  
  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(val);

  const generateSchedule = () => {
    const schedule = [];
    let balance = mortgageAmount;
    
    if (paymentFrequency === 'monthly') {
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = amortization * 12;

      for (let month = 1; month <= totalPayments; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance = Math.max(0, balance - principalPayment);

        schedule.push({
          period: month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance
        });
      }
    } else {
      // Biweekly
      const monthlyRate = interestRate / 100 / 12;
      const biweeklyRate = monthlyRate / 2;
      const totalPayments = amortization * 26; // 26 biweekly payments per year

      for (let period = 1; period <= totalPayments; period++) {
        const interestPayment = balance * biweeklyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance = Math.max(0, balance - principalPayment);

        schedule.push({
          period,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance
        });
        
        if (balance === 0) break;
      }
    }

    return schedule;
  };

  const getYearlySchedule = (periodSchedule) => {
    const yearly = [];
    const periodsPerYear = paymentFrequency === 'monthly' ? 12 : 26;
    const numYears = Math.ceil(periodSchedule.length / periodsPerYear);
    
    for (let year = 1; year <= numYears; year++) {
      const yearData = periodSchedule.slice((year - 1) * periodsPerYear, year * periodsPerYear);
      if (yearData.length === 0) break;
      
      const totalPayment = yearData.reduce((sum, m) => sum + m.payment, 0);
      const totalPrincipal = yearData.reduce((sum, m) => sum + m.principal, 0);
      const totalInterest = yearData.reduce((sum, m) => sum + m.interest, 0);
      const endBalance = yearData[yearData.length - 1]?.balance || 0;

      yearly.push({
        year,
        totalPayment,
        totalPrincipal,
        totalInterest,
        balance: endBalance
      });
    }
    return yearly;
  };

  const periodSchedule = generateSchedule();
  const yearlySchedule = getYearlySchedule(periodSchedule);

  const totalPaid = periodSchedule.reduce((sum, p) => sum + p.payment, 0);
  const totalInterest = totalPaid - mortgageAmount;
  const actualYears = periodSchedule.length / (paymentFrequency === 'monthly' ? 12 : 26);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Amortization Schedule
          </DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Payment Frequency</p>
            <p className="text-lg font-bold text-slate-900 capitalize">{paymentFrequency}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Actual Payoff Time</p>
            <p className="text-lg font-bold text-emerald-600">{actualYears.toFixed(1)} years</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Interest</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Paid</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
        
        {paymentFrequency === 'biweekly' && actualYears < amortization && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
            <strong>Savings with Biweekly Payments:</strong> Pay off your mortgage {(amortization - actualYears).toFixed(1)} years earlier!
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-center gap-2 py-2">
          <Button
            variant={viewMode === 'yearly' ? 'default' : 'outline'}
            onClick={() => setViewMode('yearly')}
            size="sm"
            className={viewMode === 'yearly' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          >
            Yearly View
          </Button>
          <Button
            variant={viewMode === 'monthly' ? 'default' : 'outline'}
            onClick={() => setViewMode('monthly')}
            size="sm"
            className={viewMode === 'monthly' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          >
            {paymentFrequency === 'monthly' ? 'Monthly' : 'Biweekly'} View
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="font-semibold">{viewMode === 'yearly' ? 'Year' : 'Period'}</TableHead>
                <TableHead className="text-right font-semibold">Payment</TableHead>
                <TableHead className="text-right font-semibold">Principal</TableHead>
                <TableHead className="text-right font-semibold">Interest</TableHead>
                <TableHead className="text-right font-semibold">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewMode === 'yearly' ? (
                yearlySchedule.map((row) => (
                  <TableRow key={row.year} className="hover:bg-slate-50">
                    <TableCell className="font-medium">Year {row.year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.totalPayment)}</TableCell>
                    <TableCell className="text-right text-emerald-600">{formatCurrency(row.totalPrincipal)}</TableCell>
                    <TableCell className="text-right text-red-600">{formatCurrency(row.totalInterest)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))
              ) : (
                periodSchedule.map((row) => (
                  <TableRow key={row.period} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {paymentFrequency === 'monthly' 
                        ? `${Math.floor((row.period - 1) / 12) + 1}-${((row.period - 1) % 12) + 1}`
                        : `${Math.floor((row.period - 1) / 26) + 1}-${((row.period - 1) % 26) + 1}`}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(row.payment)}</TableCell>
                    <TableCell className="text-right text-emerald-600">{formatCurrency(row.principal)}</TableCell>
                    <TableCell className="text-right text-red-600">{formatCurrency(row.interest)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}