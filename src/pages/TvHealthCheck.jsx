import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp, TrendingDown, Minus, Activity, AlertTriangle,
  CheckCircle2, XCircle, Loader2, RefreshCw, BarChart2, Info
} from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';

const SIGNAL_CONFIG = {
  STRONG_BUY: { label: 'Strong Buy', color: 'bg-emerald-600', textColor: 'text-emerald-700', bg: 'bg-emerald-50', icon: TrendingUp },
  BUY: { label: 'Buy', color: 'bg-emerald-400', textColor: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp },
  NEUTRAL: { label: 'Neutral', color: 'bg-slate-400', textColor: 'text-slate-600', bg: 'bg-slate-50', icon: Minus },
  SELL: { label: 'Sell', color: 'bg-red-400', textColor: 'text-red-600', bg: 'bg-red-50', icon: TrendingDown },
  STRONG_SELL: { label: 'Strong Sell', color: 'bg-red-600', textColor: 'text-red-700', bg: 'bg-red-50', icon: TrendingDown },
};

const WIN_RATE_COLORS = {
  high: 'text-emerald-600',
  medium: 'text-amber-500',
  low: 'text-red-500',
};

function SignalBadge({ signal }) {
  const cfg = SIGNAL_CONFIG[signal] || SIGNAL_CONFIG.NEUTRAL;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.textColor}`}>
      <Icon className="w-4 h-4" />
      {cfg.label}
    </span>
  );
}

function MetricCard({ label, value, sub, signal }) {
  const cfg = signal ? (SIGNAL_CONFIG[signal] || SIGNAL_CONFIG.NEUTRAL) : null;
  return (
    <div className={`rounded-xl border p-4 ${cfg ? cfg.bg : 'bg-white'}`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${cfg ? cfg.textColor : 'text-slate-800'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function SetupCard({ setup }) {
  const winRateNum = parseInt(setup.win_rate);
  const winClass = winRateNum >= 65 ? WIN_RATE_COLORS.high : winRateNum >= 50 ? WIN_RATE_COLORS.medium : WIN_RATE_COLORS.low;

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-800">{setup.name}</span>
        <span className={`text-lg font-bold ${winClass}`}>{setup.win_rate} Win Rate</span>
      </div>
      <p className="text-sm text-slate-600">{setup.description}</p>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Entry Zone</p>
          <p className="font-medium text-slate-700">{setup.entry_zone}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Stop Loss</p>
          <p className="font-medium text-red-600">{setup.stop_loss}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Target</p>
          <p className="font-medium text-emerald-600">{setup.target}</p>
        </div>
      </div>
      {setup.conditions && (
        <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
          <span className="font-medium">Conditions: </span>{setup.conditions}
        </div>
      )}
    </div>
  );
}

export default function TvHealthCheck() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await InvokeLLM({
        prompt: `You are an expert NQ (NASDAQ 100 E-mini futures) day trader and technical analyst.

Search the web for the most current NQ futures price and market data right now. Then perform a comprehensive technical health check to assess whether this is a high-probability trade entry point.

Analyze the following:
1. Current NQ price and today's price action (open, high, low, current)
2. Key technical indicators:
   - EMA 9, 21, 50, 200 levels and price relative to them
   - RSI (14-period) value and trend
   - VWAP and price relative to VWAP
   - Recent volume vs average
3. Market structure: trend direction, recent swing highs/lows, key support/resistance
4. Overall market sentiment (VIX level, ES correlation, pre-market gap)
5. High-probability trade setups currently available

Return a JSON object with this exact structure:
{
  "nq_price": "current NQ price as string (e.g. '21,450.25')",
  "price_change": "today's change as string (e.g. '+125.50 (+0.59%)')",
  "trend": "UP | DOWN | SIDEWAYS",
  "overall_signal": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL",
  "win_rate_estimate": "estimated win rate for best current setup (e.g. '68%')",
  "confidence": "HIGH | MEDIUM | LOW",
  "summary": "2-3 sentence plain-English summary of current NQ conditions and trade outlook",
  "risk_note": "one key risk or caveat to watch for right now",
  "indicators": [
    { "name": "RSI (14)", "value": "value as string", "signal": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL", "note": "brief explanation" },
    { "name": "EMA 9/21 Cross", "value": "value or status", "signal": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL", "note": "brief explanation" },
    { "name": "VWAP", "value": "price relative to VWAP", "signal": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL", "note": "brief explanation" },
    { "name": "Volume", "value": "vs average", "signal": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL", "note": "brief explanation" },
    { "name": "Market Structure", "value": "trend description", "signal": "STRONG_BUY | BUY | NEUTRAL | SELL | STRONG_SELL", "note": "brief explanation" }
  ],
  "setups": [
    {
      "name": "Setup name (e.g. 'VWAP Reclaim Long')",
      "description": "brief description of the setup",
      "win_rate": "estimated win rate (e.g. '65-70%')",
      "entry_zone": "price level or condition",
      "stop_loss": "price level or ATR-based",
      "target": "price level or R:R ratio",
      "conditions": "specific conditions that must be met"
    }
  ],
  "key_levels": [
    { "level": "price as string", "type": "RESISTANCE | SUPPORT | VWAP | EMA | PIVOT", "significance": "brief note" }
  ],
  "data_timestamp": "when this data is from"
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            nq_price: { type: 'string' },
            price_change: { type: 'string' },
            trend: { type: 'string' },
            overall_signal: { type: 'string' },
            win_rate_estimate: { type: 'string' },
            confidence: { type: 'string' },
            summary: { type: 'string' },
            risk_note: { type: 'string' },
            indicators: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'string' },
                  signal: { type: 'string' },
                  note: { type: 'string' }
                }
              }
            },
            setups: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  win_rate: { type: 'string' },
                  entry_zone: { type: 'string' },
                  stop_loss: { type: 'string' },
                  target: { type: 'string' },
                  conditions: { type: 'string' }
                }
              }
            },
            key_levels: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  level: { type: 'string' },
                  type: { type: 'string' },
                  significance: { type: 'string' }
                }
              }
            },
            data_timestamp: { type: 'string' }
          },
          required: ['nq_price', 'overall_signal', 'summary', 'indicators', 'setups']
        }
      });
      setAnalysis(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch NQ analysis. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overallCfg = analysis ? (SIGNAL_CONFIG[analysis.overall_signal] || SIGNAL_CONFIG.NEUTRAL) : null;
  const OverallIcon = overallCfg?.icon || Activity;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">NQ Trade Health Check</h1>
            <p className="text-slate-500 mt-0.5">Real-time NASDAQ 100 futures analysis &amp; high-probability trade setups</p>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-xs text-slate-400 text-right mt-1">
            Last updated<br />
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Educational use only.</strong> This tool provides AI-generated technical analysis for informational purposes.
          It is not financial advice. Always manage your risk and trade with a plan.
        </p>
      </div>

      {/* Run Button */}
      {!analysis && !loading && (
        <Card className="border-none shadow-lg text-center py-12">
          <CardContent className="space-y-4">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Ready to Analyze NQ</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Click below to fetch live NQ data and get AI-powered trade setup recommendations with estimated win rates.
            </p>
            <Button onClick={runAnalysis} size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2 mt-4">
              <Activity className="w-5 h-5" />
              Run Health Check
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-none shadow-lg text-center py-16">
          <CardContent className="space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
            <p className="text-slate-600 font-medium">Fetching live NQ data and analyzing market conditions…</p>
            <p className="text-sm text-slate-400">This may take a few seconds</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-none shadow-lg">
          <CardContent className="flex items-center gap-3 py-6 text-red-600">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <Button onClick={runAnalysis} variant="outline" className="ml-auto gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {analysis && !loading && (
        <>
          {/* Overall Signal Banner */}
          <div className={`rounded-2xl p-6 ${overallCfg.bg} border border-opacity-20`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`${overallCfg.color} p-3 rounded-xl`}>
                  <OverallIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Overall Signal</p>
                  <div className="flex items-center gap-3 mt-1">
                    <SignalBadge signal={analysis.overall_signal} />
                    {analysis.confidence && (
                      <Badge variant="outline" className="text-xs">
                        {analysis.confidence} Confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Best Setup Win Rate</p>
                <p className={`text-3xl font-extrabold ${WIN_RATE_COLORS[parseInt(analysis.win_rate_estimate) >= 65 ? 'high' : parseInt(analysis.win_rate_estimate) >= 50 ? 'medium' : 'low']}`}>
                  {analysis.win_rate_estimate || '—'}
                </p>
              </div>
            </div>
            <Separator className="my-4 opacity-30" />
            <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
            {analysis.risk_note && (
              <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Watch out:</strong> {analysis.risk_note}</span>
              </div>
            )}
          </div>

          {/* Price Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard label="NQ Price" value={analysis.nq_price || '—'} />
            <MetricCard label="Today's Change" value={analysis.price_change || '—'} />
            <MetricCard label="Trend" value={analysis.trend || '—'} signal={
              analysis.trend === 'UP' ? 'BUY' : analysis.trend === 'DOWN' ? 'SELL' : 'NEUTRAL'
            } />
            <MetricCard
              label="Data As Of"
              value={analysis.data_timestamp ? analysis.data_timestamp.split(' ')[0] : '—'}
              sub={analysis.data_timestamp?.split(' ').slice(1).join(' ')}
            />
          </div>

          {/* Indicators */}
          {analysis.indicators?.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.indicators.map((ind, i) => {
                    const cfg = SIGNAL_CONFIG[ind.signal] || SIGNAL_CONFIG.NEUTRAL;
                    return (
                      <div key={i} className={`grid grid-cols-[1fr_auto] gap-4 items-center p-3 rounded-lg ${cfg.bg}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800">{ind.name}</span>
                            <span className="text-sm text-slate-500">— {ind.value}</span>
                          </div>
                          {ind.note && <p className="text-xs text-slate-500 mt-0.5">{ind.note}</p>}
                        </div>
                        <SignalBadge signal={ind.signal} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trade Setups */}
          {analysis.setups?.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">High-Probability Trade Setups</CardTitle>
                <CardDescription>Current setups ranked by estimated win rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.setups.map((setup, i) => (
                    <SetupCard key={i} setup={setup} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Levels */}
          {analysis.key_levels?.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Key Price Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.key_levels.map((lvl, i) => {
                    const isResistance = lvl.type === 'RESISTANCE';
                    const isSupport = lvl.type === 'SUPPORT';
                    return (
                      <div key={i} className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
                        <div>
                          <span className={`text-xs font-semibold uppercase tracking-wide ${
                            isResistance ? 'text-red-500' : isSupport ? 'text-emerald-600' : 'text-blue-600'
                          }`}>{lvl.type}</span>
                          <p className="text-slate-500 text-xs">{lvl.significance}</p>
                        </div>
                        <span className="text-lg font-bold text-slate-800">{lvl.level}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refresh */}
          <div className="flex justify-center pb-4">
            <Button onClick={runAnalysis} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Analysis
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
