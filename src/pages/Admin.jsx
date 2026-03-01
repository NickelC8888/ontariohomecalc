import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';

const PAGES = [
  { key: 'Home', label: 'Mortgage Calculator (Home)', description: 'Main affordability calculator' },
  { key: 'LandTransferTax', label: 'Land Transfer Tax', description: 'Ontario & Toronto LTT calculator' },
  { key: 'SavedScenarios', label: 'Saved Scenarios', description: 'View and compare saved scenarios' },
  { key: 'MonthlyBudget', label: 'Monthly Budget Calculator', description: 'Budget planning tool' },
  { key: 'RentalCalculator', label: 'Rental Calculator', description: 'Investment property analysis' },
  { key: 'Comparison', label: 'Compare Scenarios', description: 'Side-by-side scenario comparison' },
];

const ROLES = ['admin', 'user'];

const DEFAULT_VISIBILITY = {};
PAGES.forEach(p => {
  DEFAULT_VISIBILITY[p.key] = { admin: true, user: true };
});

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser?.role !== 'admin') {
          window.location.href = createPageUrl('Home');
          return;
        }
        const settings = await base44.entities.AppSettings.filter({ setting_key: 'page_visibility' });
        if (settings.length > 0) {
          setSettingsId(settings[0].id);
          const merged = { ...DEFAULT_VISIBILITY };
          const stored = settings[0].page_visibility || {};
          Object.keys(stored).forEach(key => {
            if (merged[key]) {
              merged[key] = { ...merged[key], ...stored[key] };
            }
          });
          setVisibility(merged);
        }
      } catch {
        window.location.href = createPageUrl('Home');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const toggleVisibility = (pageKey, role) => {
    setVisibility(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [role]: !prev[pageKey][role]
      }
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (settingsId) {
      await base44.entities.AppSettings.update(settingsId, { page_visibility: visibility });
    } else {
      const created = await base44.entities.AppSettings.create({ setting_key: 'page_visibility', page_visibility: visibility });
      setSettingsId(created.id);
    }
    setSaving(false);
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-red-600 p-2.5 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 mt-0.5">Manage page visibility by user role</p>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Page Visibility Settings</CardTitle>
          <CardDescription>
            Enable or disable calculator pages per role. Disabled pages will be hidden from navigation for that role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_100px] gap-4 pb-3 border-b border-slate-200 mb-2">
            <div className="text-sm font-semibold text-slate-700">Page</div>
            {ROLES.map(role => (
              <div key={role} className="text-center">
                <Badge variant={role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                  {role === 'admin' ? 'Admin' : 'User'}
                </Badge>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1">
            {PAGES.map(page => (
              <div key={page.key} className="grid grid-cols-[1fr_100px_100px] gap-4 items-center py-3 hover:bg-slate-50 rounded-lg px-2 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">{page.label}</p>
                  <p className="text-xs text-slate-500">{page.description}</p>
                </div>
                {ROLES.map(role => (
                  <div key={role} className="flex justify-center">
                    <Switch
                      checked={visibility[page.key]?.[role] ?? true}
                      onCheckedChange={() => toggleVisibility(page.key, role)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-4">
            {saved && <p className="text-sm text-emerald-600 font-medium">Settings saved successfully!</p>}
            {!saved && <div />}
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}