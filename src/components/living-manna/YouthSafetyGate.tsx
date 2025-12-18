import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Shield, AlertTriangle, CheckCircle2, Lock, 
  User, Calendar, Phone, Mail, Loader2
} from "lucide-react";

interface YouthSafetyGateProps {
  churchId: string;
  children: React.ReactNode;
}

interface SafetyProfile {
  id: string;
  user_id: string;
  date_of_birth: string | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  parental_consent_given: boolean;
  consent_date: string | null;
  age_verified: boolean;
  is_minor: boolean;
}

export function YouthSafetyGate({ churchId, children }: YouthSafetyGateProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null);
  const [showConsentForm, setShowConsentForm] = useState(false);
  
  // Form state
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      checkSafetyProfile();
    }
  }, [user]);

  const checkSafetyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('youth_safety_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      setSafetyProfile(data);
      
      if (!data || !data.age_verified) {
        setShowConsentForm(true);
      }
    } catch (error) {
      console.error('Error checking safety profile:', error);
      setShowConsentForm(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmitConsent = async () => {
    if (!dateOfBirth) {
      toast.error("Please enter your date of birth");
      return;
    }

    const age = calculateAge(dateOfBirth);
    const isMinor = age < 18;

    if (isMinor) {
      if (!parentName || !parentEmail) {
        toast.error("Parent/Guardian information is required for minors");
        return;
      }
      if (!consentChecked) {
        toast.error("Parental consent is required");
        return;
      }
    }

    if (!safetyChecked) {
      toast.error("Please acknowledge the safety guidelines");
      return;
    }

    setSubmitting(true);
    try {
      const profileData = {
        user_id: user!.id,
        date_of_birth: dateOfBirth,
        parent_name: isMinor ? parentName : null,
        parent_email: isMinor ? parentEmail : null,
        parent_phone: isMinor ? parentPhone : null,
        parental_consent_given: isMinor ? consentChecked : true,
        consent_date: new Date().toISOString(),
        age_verified: true,
        is_minor: isMinor
      };

      const { data, error } = await supabase
        .from('youth_safety_profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setSafetyProfile(data);
      setShowConsentForm(false);
      toast.success("Safety profile verified!");
    } catch (error: any) {
      console.error('Error submitting consent:', error);
      toast.error(error.message || "Failed to submit consent");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If safety profile exists and is verified, show children
  if (safetyProfile?.age_verified && !showConsentForm) {
    return <>{children}</>;
  }

  // Show safety gate / consent form
  return (
    <div className="space-y-6">
      <Card variant="glass" className="border-amber-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Shield className="h-7 w-7 text-amber-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Youth Safety Verification
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-500">
                  Required
                </Badge>
              </CardTitle>
              <CardDescription>
                To access Youth Space, we need to verify your age and collect necessary consent
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Safety Guidelines */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Youth Safety Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                All youth leaders have passed background checks
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                Two-adult rule enforced for all youth activities
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                No private messaging between adults and minors
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                All activities are supervised and monitored
              </li>
            </ul>
          </div>

          {/* Age Verification */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="max-w-xs"
              />
            </div>

            {dateOfBirth && calculateAge(dateOfBirth) < 18 && (
              <Card variant="glass" className="border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    Parent/Guardian Information
                  </CardTitle>
                  <CardDescription>
                    Required for participants under 18 years old
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Parent/Guardian Name
                    </Label>
                    <Input
                      id="parentName"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parentEmail" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Parent Email
                      </Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentPhone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Parent Phone (Optional)
                      </Label>
                      <Input
                        id="parentPhone"
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Checkbox
                      id="consent"
                      checked={consentChecked}
                      onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                    />
                    <label htmlFor="consent" className="text-sm text-foreground/80 leading-relaxed cursor-pointer">
                      I am the parent/guardian of this minor and I give consent for them to participate 
                      in youth activities. I understand that all activities are supervised and follow 
                      church safety protocols.
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safety Acknowledgment */}
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Checkbox
                id="safety"
                checked={safetyChecked}
                onCheckedChange={(checked) => setSafetyChecked(checked as boolean)}
              />
              <label htmlFor="safety" className="text-sm text-foreground/80 leading-relaxed cursor-pointer">
                I have read and understand the youth safety guidelines. I agree to follow community 
                standards and report any concerns to church leadership immediately.
              </label>
            </div>
          </div>

          <Button 
            onClick={handleSubmitConsent} 
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Verify & Continue
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
