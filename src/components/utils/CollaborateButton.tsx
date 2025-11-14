import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const CollaborateButton = ({ email }: { email: string }) => {
  const handleCollaborate = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Button
      onClick={handleCollaborate}
      variant="ghost"
      className="ml-2 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-700/90 hover:to-indigo-700/90 text-white px-4 py-2 font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-95"
    >
      <Mail className="w-4 h-4 mr-2" />
      Collaborate
    </Button>
  );
};
