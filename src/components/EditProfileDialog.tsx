import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { User } from "lucide-react";

interface Profile {
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onProfileUpdated: (updatedProfile: Profile) => void;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  onProfileUpdated,
}: EditProfileDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    location: profile.location || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.avatar_url
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !profile.avatar_url) return;

    setIsRemovingAvatar(true);
    try {
      // Remove from storage if it's not a Google avatar
      if (!profile.avatar_url.includes("googleusercontent.com")) {
        const oldAvatarPath = profile.avatar_url.split("avatars/").pop();
        if (oldAvatarPath) {
          await supabase.storage.from("avatars").remove([oldAvatarPath]);
        }
      }

      // Update profile to remove avatar
      const { data, error } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setPreviewUrl(null);
      onProfileUpdated(data);
      toast({
        title: "Success",
        description: "Avatar removed successfully",
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Error",
        description: "Failed to remove avatar",
        variant: "destructive",
      });
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Trim whitespace from all fields
    const trimmedData = {
      full_name: formData.full_name.trim(),
      username: formData.username.trim(), // This fixes the issue
      bio: formData.bio.trim(),
      location: formData.location.trim(),
    };

    // Basic validation
    if (!trimmedData.full_name) {
      toast({
        title: "Validation Error",
        description: "Full name is required",
        variant: "destructive",
      });
      return;
    }

    if (!trimmedData.username) {
      toast({
        title: "Validation Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    // Additional username validation
    if (trimmedData.username.includes(" ")) {
      toast({
        title: "Validation Error",
        description: "Username cannot contain spaces",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let avatarUrl = profile.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

        // Remove old avatar if it exists
        if (
          profile.avatar_url &&
          !profile.avatar_url.includes("googleusercontent.com")
        ) {
          const oldAvatarPath = profile.avatar_url.split("avatars/").pop();
          if (oldAvatarPath) {
            await supabase.storage.from("avatars").remove([oldAvatarPath]);
          }
        }

        // Upload new avatar
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = urlData.publicUrl;
      }

      // Update profile in database
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedData.full_name,
          username: trimmedData.username, // Use the trimmed username
          bio: trimmedData.bio,
          location: trimmedData.location,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdated(data);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);

      if (
        error.code === "23505" &&
        error.message?.includes("profiles_username_key")
      ) {
        toast({
          title: "Username Taken",
          description:
            "This username is already in use. Please choose another.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // For username field, remove spaces as user types
    if (id === "username") {
      setFormData(prev => ({ ...prev, [id]: value.replace(/\s/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const renderAvatar = () => {
    if (previewUrl) {
      return (
        <img
          src={previewUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => setPreviewUrl(null)}
        />
      );
    }

    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-full">
        <User className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {user?.app_metadata.provider !== "google" && (
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  {renderAvatar()}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="max-w-xs"
                  />
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      disabled={isRemovingAvatar}
                    >
                      {isRemovingAvatar ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Remove Avatar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="No spaces allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};