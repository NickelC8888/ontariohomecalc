import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { UserPlus, LogIn, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Registration() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    telephone: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData({
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          telephone: currentUser.telephone || ''
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.telephone.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.telephone)) {
      alert("Please enter a valid telephone number.");
      return;
    }

    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        first_name: formData.first_name,
        last_name: formData.last_name,
        telephone: formData.telephone
      });
      alert("Profile completed successfully!");
      navigate(createPageUrl('Home'));
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - Show sign-in/register options
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to <span className="text-emerald-600">OntarioHomeCalc</span>
          </h1>
          <p className="text-lg text-slate-600">
            Sign in or create a new account to save scenarios, compare options, and get personalized mortgage calculations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-slate-200 hover:border-emerald-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Already have an account? Sign in to access your saved scenarios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => base44.auth.redirectToLogin(createPageUrl('Registration'))}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-500 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                New here? Create a free account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => base44.auth.redirectToLogin(createPageUrl('Registration'))}
                className="w-full bg-slate-800 hover:bg-slate-900"
              >
                Create New Account
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-slate-50 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Why Create an Account?</h3>
          <ul className="space-y-3">
            {[
              'Save and compare multiple mortgage scenarios',
              'Email detailed calculations to yourself',
              'Access your saved scenarios from any device',
              'Track your home buying journey'
            ].map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Logged in - Check if profile is complete
  const isProfileComplete = user.first_name && user.last_name && user.telephone;

  if (isProfileComplete) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">You're All Set!</h1>
        <p className="text-lg text-slate-600 mb-8">
          Your profile is complete. You can now save scenarios, compare options, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate(createPageUrl('Home'))}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Go to Calculator
          </Button>
          <Button 
            onClick={() => navigate(createPageUrl('SavedScenarios'))}
            variant="outline"
          >
            View Saved Scenarios
          </Button>
        </div>
      </div>
    );
  }

  // Logged in but profile incomplete - Show profile completion form
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide some basic information to get started. This will help us personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">Your email is verified and cannot be changed.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
              <Input 
                id="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
              <Input 
                id="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Phone Number <span className="text-red-500">*</span></Label>
            <Input 
              id="telephone"
              type="tel"
              placeholder="(416) 555-1234"
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              required
            />
            <p className="text-xs text-slate-500">We'll use this to contact you about your mortgage inquiries.</p>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg h-12"
            >
              {isSaving ? "Saving..." : "Complete Registration"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}