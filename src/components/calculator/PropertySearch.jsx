import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, DollarSign, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { base44 } from "@/api/base44Client";

export default function PropertySearch({ onPropertyFound }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await base44.functions.invoke('fetchPropertyDetails', { address });

      if (response.data.success && response.data.data.found) {
        const data = response.data.data;
        setResult(data);
        
        // Auto-fill calculator if property found
        if (onPropertyFound && data.price) {
          onPropertyFound({
            price: data.price,
            isToronto: data.isToronto,
            address: data.address,
            propertyType: data.propertyType,
            annualPropertyTax: data.annualPropertyTax
          });
        }
      } else {
        setError('Property not found. Please check the address or enter details manually.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search property. Please try again or enter details manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Property Address Lookup
        </CardTitle>
        <CardDescription>
          Enter an Ontario property address to auto-fill calculator with real listing data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="e.g., 123 Main St, Toronto, ON"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="pr-10"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={loading || !address.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-white border-2 border-emerald-200 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-slate-900">Property Found</span>
              </div>
              <Badge className={`${
                result.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' :
                result.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {result.confidence} confidence
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{result.address}</p>
                  {result.isToronto && (
                    <Badge variant="outline" className="text-xs mt-1">City of Toronto</Badge>
                  )}
                </div>
              </div>

              {result.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Price:</span>{' '}
                    {new Intl.NumberFormat('en-CA', { 
                      style: 'currency', 
                      currency: 'CAD', 
                      maximumFractionDigits: 0 
                    }).format(result.price)}
                  </p>
                </div>
              )}

              {result.propertyType && (
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Type:</span> {result.propertyType}
                  </p>
                </div>
              )}

              {result.annualPropertyTax && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Annual Property Tax:</span>{' '}
                    {new Intl.NumberFormat('en-CA', { 
                      style: 'currency', 
                      currency: 'CAD', 
                      maximumFractionDigits: 0 
                    }).format(result.annualPropertyTax)}
                  </p>
                </div>
              )}
            </div>

            {result.details && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-600">{result.details}</p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs text-slate-500">
                ✓ Calculator fields have been auto-filled with this property data
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="font-medium text-slate-700 mb-1">Note:</p>
          <p>
            Data is fetched from public sources and may not reflect the most current information. 
            For accurate details, consult with a real estate professional or visit official MLS listings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}