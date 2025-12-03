import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Building, DollarSign, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function SavedScenarios() {
  const queryClient = useQueryClient();

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: () => base44.entities.Scenario.list('-created_date', 50),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Scenario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading scenarios...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">My Saved Scenarios</h1>
            <p className="text-slate-500">Compare your property affordability calculations</p>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Building className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No saved scenarios yet</h3>
            <p className="text-slate-500 mb-6">Go back to the calculator to save your first scenario.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-800">{scenario.name}</CardTitle>
                        <p className="text-xs text-slate-400 mt-1">
                            {format(new Date(scenario.created_date), 'MMM d, yyyy')}
                        </p>
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
                        <span className="text-slate-600">Interest Rate</span>
                        <span className="font-medium">{scenario.interest_rate}%</span>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-slate-100 mt-auto flex justify-end">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this scenario?')) {
                            deleteMutation.mutate(scenario.id);
                        }
                    }}
                >
                    <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}