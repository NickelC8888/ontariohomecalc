import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Trash2, Building, DollarSign, Calendar, MapPin, ArrowRightLeft, CheckCircle2, ExternalLink, Filter, Copy, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import { format } from 'date-fns';
import { createPageUrl } from '../utils';
import ComparisonView from '../components/comparison/ComparisonView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SavedScenarios() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();
  
  // Filtering state
  const [filters, setFilters] = useState({
    location: 'all', // all, toronto, ontario
    mortgageType: 'all', // all, fixed, variable
    firstTimeBuyer: 'all', // all, yes, no
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('created_date');
  const [sortOrder, setSortOrder] = useState('desc');

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

  const duplicateMutation = useMutation({
    mutationFn: async (scenario) => {
      const { id, created_date, updated_date, created_by, ...scenarioData } = scenario;
      return base44.entities.Scenario.create({
        ...scenarioData,
        name: `${scenarioData.name} (Copy)`
      });
    },
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

  const handleDuplicate = (scenario, e) => {
    e.stopPropagation();
    if (confirm(`Create a copy of "${scenario.name}"?`)) {
      duplicateMutation.mutate(scenario);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      location: 'all',
      mortgageType: 'all',
      firstTimeBuyer: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = filters.location !== 'all' || filters.mortgageType !== 'all' || 
                          filters.firstTimeBuyer !== 'all' || filters.dateFrom || filters.dateTo;

  // Apply filters
  const filteredScenarios = scenarios.filter(scenario => {
    // Location filter
    if (filters.location === 'toronto' && !scenario.is_toronto) return false;
    if (filters.location === 'ontario' && scenario.is_toronto) return false;
    
    // Mortgage type filter
    if (filters.mortgageType !== 'all' && scenario.mortgage_type !== filters.mortgageType) return false;
    
    // First-time buyer filter
    if (filters.firstTimeBuyer === 'yes' && !scenario.is_first_time_buyer) return false;
    if (filters.firstTimeBuyer === 'no' && scenario.is_first_time_buyer) return false;
    
    // Date range filter
    if (filters.dateFrom) {
      const scenarioDate = new Date(scenario.created_date);
      const fromDate = new Date(filters.dateFrom);
      if (scenarioDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const scenarioDate = new Date(scenario.created_date);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (scenarioDate > toDate) return false;
    }
    
    return true;
  });

  // Apply sorting
  const sortedScenarios = [...filteredScenarios].sort((a, b) => {
    let aVal, bVal;
    
    switch(sortBy) {
      case 'created_date':
        aVal = new Date(a.created_date).getTime();
        bVal = new Date(b.created_date).getTime();
        break;
      case 'property_price':
        aVal = a.property_price;
        bVal = b.property_price;
        break;
      case 'monthly_payment':
        aVal = a.monthly_payment;
        bVal = b.monthly_payment;
        break;
      case 'total_cash_needed':
        aVal = a.total_cash_needed;
        bVal = b.total_cash_needed;
        break;
      case 'total_ltt':
        aVal = a.total_ltt;
        bVal = b.total_ltt;
        break;
      case 'interest_rate':
        aVal = a.interest_rate;
        bVal = b.interest_rate;
        break;
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const selectedScenarios = sortedScenarios.filter(s => selectedIds.includes(s.id));

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading scenarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">My Saved Scenarios</h1>
            <p className="text-slate-500">
              {sortedScenarios.length} scenario{sortedScenarios.length !== 1 ? 's' : ''}
              {scenarios.length !== sortedScenarios.length && ` (${scenarios.length} total)`}
            </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant={hasActiveFilters ? "default" : "outline"}
            className={`gap-2 ${hasActiveFilters ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && <Badge className="ml-1 bg-white text-emerald-600">{Object.values(filters).filter(v => v && v !== 'all').length}</Badge>}
          </Button>
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
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Filter Scenarios</h3>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={filters.location} onValueChange={(val) => setFilters({...filters, location: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="toronto">Toronto Only</SelectItem>
                  <SelectItem value="ontario">Ontario (excl. Toronto)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mortgage Type</Label>
              <Select value={filters.mortgageType} onValueChange={(val) => setFilters({...filters, mortgageType: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fixed">Fixed Rate</SelectItem>
                  <SelectItem value="variable">Variable Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>First-Time Buyer</Label>
              <Select value={filters.firstTimeBuyer} onValueChange={(val) => setFilters({...filters, firstTimeBuyer: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date From</Label>
              <Input 
                type="date" 
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Input 
                type="date" 
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Sorting Options */}
      <Card className="p-4 bg-white">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Sort by:</span>
          </div>
          {[
            { value: 'created_date', label: 'Date Created' },
            { value: 'name', label: 'Name' },
            { value: 'property_price', label: 'Price' },
            { value: 'monthly_payment', label: 'Monthly Payment' },
            { value: 'total_cash_needed', label: 'Upfront Cost' },
            { value: 'total_ltt', label: 'Land Transfer Tax' },
            { value: 'interest_rate', label: 'Interest Rate' }
          ].map(option => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleSort(option.value)}
              className={`gap-1 ${sortBy === option.value ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            >
              {option.label}
              {sortBy === option.value && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
          ))}
        </div>
      </Card>

      {sortedScenarios.length === 0 && scenarios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Building className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No saved scenarios yet</h3>
            <p className="text-slate-500 mb-6">Go back to the calculator to save your first scenario.</p>
        </div>
      ) : sortedScenarios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Filter className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No scenarios match your filters</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filter criteria.</p>
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedScenarios.map((scenario) => {
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
              <CardFooter className="pt-2 border-t border-slate-100 mt-auto flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={(e) => {
                          e.stopPropagation();
                          navigate(createPageUrl('Home'), {
                            state: {
                              loadScenario: scenario
                            }
                          });
                      }}
                  >
                      <ExternalLink className="w-4 h-4" /> Open
                  </Button>
                  <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={(e) => handleDuplicate(scenario, e)}
                      disabled={duplicateMutation.isPending}
                  >
                      <Copy className="w-4 h-4" />
                  </Button>
                </div>
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
                    <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Scenario Comparison</DialogTitle>
            <DialogDescription>
              Analyzing {selectedScenarios.length} scenarios with sortable metrics and visual insights
            </DialogDescription>
          </DialogHeader>
          
          <ComparisonView 
            scenarios={selectedScenarios}
            onClose={() => setIsCompareOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}