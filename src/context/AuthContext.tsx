import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, full_name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ exists: boolean }>;
  refreshUserAvatar: (userId: string) => Promise<{ success: boolean; message: string; newUrl?: string }>;
  intendedRoute: string | null;
  setIntendedRoute: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storeGoogleAvatar = async (userId: string, googleAvatarUrl: string): Promise<string> => {
  try {
    // First try to fetch directly with proper referrer policy
    const response = await fetch(googleAvatarUrl, {
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google avatar directly');
    }

    const blob = await response.blob();
    
    // Create path that matches your RLS policy: avatars/[user_id]/filename.jpg
    const fileExt = 'jpg';
    const filePath = `avatars/${userId}/avatar.${fileExt}`;
    
    // Upload to Supabase storage with user-specific folder
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        upsert: true,
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      // Handle specific error cases
      if (uploadError.message.includes('already exists')) {
        console.log('Avatar already exists in storage');
      } else {
        throw uploadError;
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (directError) {
    console.log('Direct fetch failed, trying proxy method:', directError);
    
    // Fallback to proxy method
    try {
      const proxyResponse = await fetch(`https://images.weserv.nl/?url=${encodeURIComponent(googleAvatarUrl)}&w=300&h=300&fit=cover`);
      
      if (!proxyResponse.ok) {
        throw new Error('Failed to fetch via proxy');
      }

      const proxyBlob = await proxyResponse.blob();
      
      // Use same user-specific path for proxy fallback
      const filePath = `${userId}/avatar.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, proxyBlob, {
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (proxyError) {
      console.error('Both direct and proxy methods failed:', proxyError);
      // Return original Google URL as fallback
      return googleAvatarUrl;
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);

  const generateUsername = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '') 
      + '-' + Math.random().toString(36).substring(2, 6);
  };

  const createProfileFromGoogle = async (user: User) => {
  if (user.app_metadata?.provider !== 'google') return;
  if (!user.email) return;

  try {
    // 1. First check if profile exists and get current data
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('full_name, username, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    
    // 2. Only handle avatar if this is a new profile or avatar is missing
    let avatarUrl = existingProfile?.avatar_url || null;
    if ((!existingProfile || !existingProfile.avatar_url) && 
        user.user_metadata?.avatar_url) {
      try {
        avatarUrl = await storeGoogleAvatar(user.id, user.user_metadata.avatar_url);
      } catch (avatarError) {
        console.error('Avatar storage failed:', avatarError);
        avatarUrl = user.user_metadata.avatar_url; // Fallback to original
      }
    }

    // 3. Prepare the data for upsert
    const profileData = {
      user_id: user.id,
      email: user.email,
      updated_at: new Date().toISOString(),
      // Only update full_name if it doesn't exist in the profile
      full_name: existingProfile?.full_name || 
                user.user_metadata?.full_name || 
                user.email.split('@')[0],
      // Only generate username if it doesn't exist
      username: existingProfile?.username || 
               generateUsername(user.user_metadata?.full_name || user.email.split('@')[0]),
      avatar_url: avatarUrl
    };

    // 4. Use upsert but only update missing fields
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'user_id',
        // This ensures we don't overwrite existing values with nulls
        ignoreDuplicates: false
      });

    if (upsertError) throw upsertError;

  } catch (error) {
    console.error('Error in createProfileFromGoogle:', error);
  }
};

  const refreshUserAvatar = async (userId: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw error || new Error('No user found');
      
      if (user.app_metadata.provider === 'google' && user.user_metadata.avatar_url) {
        const newAvatarUrl = await storeGoogleAvatar(userId, user.user_metadata.avatar_url);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('user_id', userId);
          
        if (updateError) throw updateError;
        
        return {
          success: true,
          newUrl: newAvatarUrl,
          message: 'Avatar updated successfully'
        };
      }
      
      return {
        success: false,
        message: 'Not a Google user or no avatar available'
      };
    } catch (error) {
      console.error('Error refreshing avatar:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to refresh avatar'
      };
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        if (data.session.user.app_metadata?.provider === 'google') {
          await createProfileFromGoogle(data.session.user);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          setUser(session.user);
          if (session.user.app_metadata?.provider === 'google') {
             createProfileFromGoogle(session.user);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Google sign-in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, full_name: string): Promise<void> => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!user) throw new Error("User creation failed");

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email,
          full_name,
          username: generateUsername(full_name),
        });

      if (profileError) throw profileError;

      toast({
        title: 'Account created',
        description: 'Welcome to the platform!',
      });
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Signed out',
      description: 'You have been logged out.',
    });

    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ exists: boolean }> => {
    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return { exists: false };

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { exists: true };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        refreshUserAvatar,
        intendedRoute,
        setIntendedRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};