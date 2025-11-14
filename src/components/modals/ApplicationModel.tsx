// components/ApplicationModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { createJobApplication } from "@/lib/jobs";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function ApplicationModal({
  jobId,
  open,
  onClose,
  onSuccess
}: {
  jobId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await createJobApplication({
        jobId,
        applicantId: user.id,
        contactEmail,
        contactPhone,
        coverLetter
      });
      
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the employer.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for this Position</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email*</label>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cover Letter</label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a good fit for this position?"
              rows={5}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}