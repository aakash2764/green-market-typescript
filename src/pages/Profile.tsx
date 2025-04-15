
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Save, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react"; // Add this import

// Remove the duplicate Supabase client creation
// Update the interface
interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    full_name: '',
    phone: '',
    address: '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile({
          ...data,
          id: user.id,
          email: user.email || '',
        });
      } else {
        // Create initial profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: '',
            phone: '',
            address: '',
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    }

    loadProfile();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;

    try {
      // First try to update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        // If update fails, try to insert
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: profile.full_name,
            phone: profile.phone,
            address: profile.address,
            email: user.email,
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Add this function
  const handlePasswordChange = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session?.access_token || sessionError) {
        await signOut();
        navigate('/login');
        throw new Error("Please login again to change your password");
      }
  
      if (passwords.new.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
  
      if (passwords.new !== passwords.confirm) {
        throw new Error("New passwords don't match");
      }
  
      // Fixed: Removed the headers from the options parameter
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });
  
      if (error) throw error;
  
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
  
      setIsChangingPassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button
            variant="outline"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Member Since</label>
              <Input
                value={new Date(user.created_at).toLocaleDateString()}
                disabled
                className="bg-muted"
              />
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handlePasswordChange}
                    >
                      Update Password
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswords({ current: '', new: '', confirm: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
