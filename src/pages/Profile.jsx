import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { User, Mail, Phone, Save, Loader2, UserCircle } from 'lucide-react';
import { toast } from "sonner";
import { createPageUrl } from '../utils';
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    telephone: "",
    enable_property_lookup: false
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const isIncomplete = !currentUser.first_name || !currentUser.last_name || !currentUser.telephone;
      setIsNewUser(isIncomplete);
      setFormData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        telephone: currentUser.telephone || "",
        enable_property_lookup: currentUser.enable_property_lookup || false
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      base44.auth.redirectToLogin(window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.telephone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.telephone)) {
      toast.error("Please enter a valid telephone number");
      return;
    }

    setSaving(true);
    try {
      await base44.auth.updateMe(formData);
      
      if (isNewUser) {
        toast.success("Profile completed successfully! You can now save scenarios.");
        navigate(createPageUrl('Home'));
      } else {
        toast.success("Profile updated successfully");
      }
      setIsNewUser(false);
      loadUser();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {isNewUser && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <UserCircle className="w-16 h-16 mx-auto text-emerald-600 mb-3" />
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Welcome to OntarioHomeCalc!</h2>
          <p className="text-emerald-700">Complete your profile to start saving and comparing mortgage scenarios</p>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">{isNewUser ? 'Complete Your Profile' : 'My Profile'}</h1>
        <p className="text-slate-500 mt-1">
          {isNewUser ? 'Please provide your information to unlock all features' : 'Manage your personal information'}
        </p>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">Personal Information</CardTitle>
          <CardDescription>
            {isNewUser ? 'All fields are required to save scenarios' : 'Update your profile details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input 
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-slate-50"
              />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Telephone */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telephone Number <span className="text-red-500">*</span>
              </Label>
              <Input 
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                placeholder="(416) 555-1234"
                required
              />
            </div>

            {/* Property Lookup Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="space-y-0.5">
                <Label htmlFor="property-lookup" className="text-base font-medium cursor-pointer">
                  Enable Property Address Lookup
                </Label>
                <p className="text-sm text-slate-500">
                  Show property search feature in the calculator
                </p>
              </div>
              <Switch
                id="property-lookup"
                checked={formData.enable_property_lookup}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, enable_property_lookup: checked })
                }
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isNewUser ? 'Complete Profile & Continue' : 'Save Profile'}
                  </>
                )}
              </Button>
              
              {!isNewUser && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(createPageUrl('Home'))}
                >
                  Back to Calculator
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}