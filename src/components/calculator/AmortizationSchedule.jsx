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
  monthlyPayment
}) {
  const [viewMode, setViewMode] = useState('yearly'); // 'monthly' or 'yearly'
  
  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(val);

  const generateSchedule = () => {
    const schedule = [];
    let balance = mortgageAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = amortization * 12;

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance
      });
    }

    return schedule;
  };

  const getYearlySchedule = (monthlySchedule) => {
    const yearly = [];
    for (let year = 1; year <= amortization; year++) {
      const yearData = monthlySchedule.slice((year - 1) * 12, year * 12);
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

  const monthlySchedule = generateSchedule();
  const yearlySchedule = getYearlySchedule(monthlySchedule);

  const totalPaid = monthlyPayment * amortization * 12;
  const totalInterest = totalPaid - mortgageAmount;

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
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Total Paid</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Interest</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Mortgage Amount</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(mortgageAmount)}</p>
          </div>
        </div>

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
            Monthly View
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="font-semibold">{viewMode === 'yearly' ? 'Year' : 'Month'}</TableHead>
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
                monthlySchedule.map((row) => (
                  <TableRow key={row.month} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {Math.floor((row.month - 1) / 12) + 1}-{((row.month - 1) % 12) + 1}
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