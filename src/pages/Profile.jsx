import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    telephone: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        address: currentUser.address || "",
        telephone: currentUser.telephone || ""
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error("First Name and Last Name are required");
      return;
    }

    setSaving(true);
    try {
      await base44.auth.updateMe(formData);
      toast.success("Profile updated successfully");
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information</p>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
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
                Telephone Number
              </Label>
              <Input 
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                placeholder="(416) 555-1234"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Textarea 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter your address"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
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
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}