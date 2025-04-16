
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Save, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { pageVariants, itemVariants, buttonVariants, cardVariants } from "@/lib/animations";

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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setProfile({
            ...data,
            id: user.id,
            email: user.email || '',
          });
        } else {
          // Create new profile if it doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: '',
              phone: '',
              address: '',
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast({
              title: "Error",
              description: "Failed to create profile.",
              variant: "destructive",
            });
            return;
          }

          if (newProfile) {
            setProfile({
              ...newProfile,
              id: user.id,
              email: user.email || '',
            });
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }

    loadProfile();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;

    try {
      // Validate required fields
      if (!profile.full_name.trim()) {
        toast({
          title: "Error",
          description: "Full name is required.",
          variant: "destructive",
        });
        return;
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name.trim(),
          phone: profile.phone.trim(),
          address: profile.address.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfile({
          ...data,
          id: user.id,
          email: user.email || '',
        });
        
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  if (!user) return null;

  return (
    <motion.div 
      className="container-custom py-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold">My Profile</h1>
          <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
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
          </motion.div>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className="transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                  className="transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                  className="transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium">Member Since</label>
                <Input
                  value={new Date(user.created_at).toLocaleDateString()}
                  disabled
                  className="bg-muted"
                />
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                variants={itemVariants}
              >
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Enter new password"
                      className="transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Confirm new password"
                      className="transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                  <motion.div className="flex gap-2" variants={itemVariants}>
                    <motion.div
                      className="flex-1"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={handlePasswordChange}
                      >
                        Update Password
                      </Button>
                    </motion.div>
                    <motion.div
                      className="flex-1"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswords({ current: '', new: '', confirm: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
