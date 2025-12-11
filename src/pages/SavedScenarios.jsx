import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Building, DollarSign, Calendar, MapPin, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SavedScenarios() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['scenarios', currentUser?.email],
    queryFn: async () => {
      if (!currentUser) return [];
      return base44.entities.Scenario.filter({ created_by: currentUser.email }, '-created_date', 100);
    },
    initialData: [],
    enabled: !!currentUser,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Scenario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectedScenarios = scenarios.filter(s => selectedIds.includes(s.id));

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading scenarios...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">My Saved Scenarios</h1>
            <p className="text-slate-500">Select multiple scenarios to compare them side-by-side</p>
        </div>
        {selectedIds.length > 1 && (
          <Button 
            onClick={() => setIsCompareOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 animate-in fade-in slide-in-from-right-4"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Compare ({selectedIds.length})
          </Button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Building className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No saved scenarios yet</h3>
            <p className="text-slate-500 mb-6">Go back to the calculator to save your first scenario.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {scenarios.map((scenario) => {
            const isSelected = selectedIds.includes(scenario.id);
            return (
            <Card 
                key={scenario.id} 
                className={`flex flex-col transition-all cursor-pointer border-2 ${
                    isSelected ? 'border-emerald-500 shadow-md bg-emerald-50/30' : 'border-transparent hover:border-slate-200 hover:shadow-md'
                }`}
                onClick={() => toggleSelection(scenario.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleSelection(scenario.id)}
                            className="mt-1 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-800">{scenario.name}</CardTitle>
                            <p className="text-xs text-slate-400 mt-1">
                                {format(new Date(scenario.created_date), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                    {scenario.is_toronto && (
                        <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Toronto
                        </div>
                    )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Property Price</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(scenario.property_price)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Payment</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(scenario.monthly_payment)}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Down Payment ({scenario.down_payment_percent.toFixed(1)}%)</span>
                        <span className="font-medium">{formatCurrency(scenario.property_price * (scenario.down_payment_percent/100))}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Upfront Cash Needed</span>
                        <span className="font-medium">{formatCurrency(scenario.total_cash_needed)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Rate / Term</span>
                        <span className="font-medium">{scenario.interest_rate}% ({scenario.mortgage_term}yr {scenario.mortgage_type})</span>
                    </div>
                    {scenario.mortgage_insurance > 0 && (
                         <div className="flex justify-between">
                            <span className="text-slate-600">CMHC Insurance</span>
                            <span className="font-medium text-emerald-600">{formatCurrency(scenario.mortgage_insurance)}</span>
                        </div>
                    )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-slate-100 mt-auto flex justify-end">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this scenario?')) {
                            if (selectedIds.includes(scenario.id)) {
                                setSelectedIds(prev => prev.filter(i => i !== scenario.id));
                            }
                            deleteMutation.mutate(scenario.id);
                        }
                    }}
                >
                    <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scenario Comparison</DialogTitle>
            <DialogDescription>
              Comparing {selectedScenarios.length} selected scenarios side-by-side.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] bg-slate-50 font-bold">Metric</TableHead>
                  {selectedScenarios.map(s => (
                    <TableHead key={s.id} className="font-bold text-slate-900 bg-slate-50 min-w-[180px]">
                      {s.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-slate-600">Price</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id} className="font-semibold text-lg">
                      {formatCurrency(s.property_price)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600">Monthly Payment</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id} className="font-bold text-emerald-600 text-lg">
                      {formatCurrency(s.monthly_payment)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-slate-600">Upfront Cash Needed</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id} className="font-bold">
                      {formatCurrency(s.total_cash_needed)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-slate-50/50">
                   <TableCell className="font-medium text-slate-600">Down Payment</TableCell>
                   {selectedScenarios.map(s => (
                    <TableCell key={s.id}>
                      {formatCurrency(s.property_price * (s.down_payment_percent/100))}
                      <span className="text-slate-400 text-xs ml-1">({s.down_payment_percent.toFixed(1)}%)</span>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-slate-600">Land Transfer Tax</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id}>
                      {formatCurrency(s.total_ltt)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600">Location</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id}>
                       {s.is_toronto ? 'Toronto' : 'Ontario'}
                    </TableCell>
                  ))}
                </TableRow>
                 <TableRow>
                  <TableCell className="font-medium text-slate-600">Interest Rate</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id}>
                       {s.interest_rate}%
                    </TableCell>
                  ))}
                </TableRow>
                 <TableRow className="bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600">Amortization</TableCell>
                  {selectedScenarios.map(s => (
                    <TableCell key={s.id}>
                       {s.amortization} Years
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}