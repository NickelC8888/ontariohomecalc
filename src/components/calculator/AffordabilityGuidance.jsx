import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, TrendingUp, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { base44 } from "@/api/base44Client";

export default function AffordabilityGuidance({ 
  propertyPrice,
  monthlyPayment,
  downPaymentPercent,
  totalMortgageAmount,
  stressTestPayment,
  mortgageInsurance
}) {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [otherDebts, setOtherDebts] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [guidance, setGuidance] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!monthlyIncome || !otherDebts || !creditScore) {
      alert('Please fill in all fields to get personalized guidance.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const income = Number(monthlyIncome);
      const debts = Number(otherDebts);
      const score = Number(creditScore);

      // Calculate key metrics
      const totalMonthlyDebt = monthlyPayment + debts;
      const gds = (monthlyPayment / income) * 100;
      const tds = (totalMonthlyDebt / income) * 100;
      const stressTestGDS = (stressTestPayment / income) * 100;
      
      const prompt = `You are a Canadian mortgage advisor. Analyze this home buyer's financial situation and provide clear, actionable guidance.

Property Details:
- Purchase Price: $${propertyPrice.toLocaleString()}
- Down Payment: ${downPaymentPercent.toFixed(1)}%
- Monthly Mortgage Payment: $${monthlyPayment.toLocaleString()}
- Total Mortgage: $${totalMortgageAmount.toLocaleString()}
- Mortgage Insurance: $${mortgageInsurance.toLocaleString()}

Buyer's Finances:
- Monthly Gross Income: $${income.toLocaleString()}
- Other Monthly Debts: $${debts.toLocaleString()}
- Credit Score: ${score}

Calculated Ratios:
- GDS (Gross Debt Service): ${gds.toFixed(1)}% (target: under 32%)
- TDS (Total Debt Service): ${tds.toFixed(1)}% (target: under 40%)
- Stress Test GDS: ${stressTestGDS.toFixed(1)}%

Provide guidance in the following format:

1. **Affordability Assessment**: Is this property affordable? Rate as Excellent/Good/Fair/Concerning and explain why in 2-3 sentences.

2. **Key Financial Metrics**: Explain their GDS and TDS ratios in simple terms, what they mean for mortgage approval, and whether they're in healthy ranges.

3. **Credit Score Impact**: Explain how their ${score} credit score affects their mortgage application, interest rates, and approval chances. Be specific about whether this is excellent (740+), good (680-739), fair (620-679), or poor (below 620).

4. **Improvement Strategies**: Give 3-4 specific, actionable steps they can take to improve their borrowing power or financial position. Consider their specific ratios and credit score.

5. **Monthly Budget Reality Check**: Explain what percentage of income is going to housing and total debt, and whether this leaves enough for other expenses, savings, and emergencies.

Keep the tone friendly, clear, and encouraging. Use Canadian mortgage standards and regulations.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setGuidance({
        content: response,
        metrics: {
          gds: gds.toFixed(1),
          tds: tds.toFixed(1),
          stressTestGDS: stressTestGDS.toFixed(1),
          income,
          debts,
          score
        }
      });
    } catch (error) {
      console.error('Failed to analyze:', error);
      alert('Failed to generate guidance. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMetricColor = (value, threshold) => {
    return value <= threshold ? 'text-green-600' : value <= threshold + 10 ? 'text-yellow-600' : 'text-red-600';
  };

  const getMetricIcon = (value, threshold) => {
    if (value <= threshold) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (value <= threshold + 10) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">AI-Powered Affordability Guidance</CardTitle>
            <CardDescription>Get personalized insights about your borrowing power</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!guidance ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income" className="text-sm font-medium">Monthly Gross Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="8,000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="debts" className="text-sm font-medium">Other Monthly Debts</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input
                    id="debts"
                    type="number"
                    placeholder="500"
                    value={otherDebts}
                    onChange={(e) => setOtherDebts(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-slate-500">Car loans, credit cards, etc.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credit" className="text-sm font-medium">Credit Score</Label>
                <Input
                  id="credit"
                  type="number"
                  placeholder="720"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                />
                <p className="text-xs text-slate-500">Estimated credit score (300-900)</p>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !monthlyIncome || !otherDebts || !creditScore}
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Your Finances...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get AI-Powered Guidance
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getMetricIcon(Number(guidance.metrics.gds), 32)}
                  <p className="text-xs text-slate-500">GDS Ratio</p>
                </div>
                <p className={`text-2xl font-bold ${getMetricColor(Number(guidance.metrics.gds), 32)}`}>
                  {guidance.metrics.gds}%
                </p>
                <p className="text-xs text-slate-400">Target: ≤32%</p>
              </div>

              <div className="text-center border-x border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getMetricIcon(Number(guidance.metrics.tds), 40)}
                  <p className="text-xs text-slate-500">TDS Ratio</p>
                </div>
                <p className={`text-2xl font-bold ${getMetricColor(Number(guidance.metrics.tds), 40)}`}>
                  {guidance.metrics.tds}%
                </p>
                <p className="text-xs text-slate-400">Target: ≤40%</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-slate-500">Credit Score</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {guidance.metrics.score}
                </p>
                <p className="text-xs text-slate-400">
                  {guidance.metrics.score >= 740 ? 'Excellent' : 
                   guidance.metrics.score >= 680 ? 'Good' : 
                   guidance.metrics.score >= 620 ? 'Fair' : 'Poor'}
                </p>
              </div>
            </div>

            {/* AI Guidance Content */}
            <div className="prose prose-sm max-w-none bg-white rounded-lg p-6 border border-slate-200">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {guidance.content}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setGuidance(null);
                  setMonthlyIncome('');
                  setOtherDebts('');
                  setCreditScore('');
                }}
                variant="outline"
                className="flex-1"
              >
                Analyze Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}