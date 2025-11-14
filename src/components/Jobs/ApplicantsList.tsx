import { useEffect, useState } from "react";
import { fetchEmployerApplications, JobApplication } from "@/lib/jobs";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { 
  Mail, 
  Phone, 
  BookOpen, 
  FileSearch, 
  User, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Briefcase,
  Building,
  Calendar,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export function ApplicantsList() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPostedJobs, setHasPostedJobs] = useState(false);
  const [expandedCoverLetters, setExpandedCoverLetters] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleCoverLetter = (applicationId: string) => {
    const newExpanded = new Set(expandedCoverLetters);
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId);
    } else {
      newExpanded.add(applicationId);
    }
    setExpandedCoverLetters(newExpanded);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // First check if user has any jobs posted
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("id")
          .eq("employer_id", user.id);

        if (jobsError) throw jobsError;

        if (!jobs || jobs.length === 0) {
          setHasPostedJobs(false);
          setApplications([]);
          return;
        }

        setHasPostedJobs(true);

        // Then fetch applications
        const data = await fetchEmployerApplications(user.id);
        console.log(data);
        setApplications(data);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to fetch applicant information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasPostedJobs) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mb-6">
            <FileSearch className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No Job Postings Found
          </h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            You haven't posted any jobs yet. Create your first job posting to start receiving applications from talented candidates.
          </p>
          <button 
            onClick={() => navigate("/jobs/post")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Briefcase className="w-5 h-5" />
            Post Your First Job
          </button>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6 border border-blue-500/30">
            <Clock className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No Applications Yet
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Your job postings are live! Applications from interested candidates will appear here as they come in.
          </p>
        </div>
      </div>
    );
  }

  // Group applications by job
  const applicationsByJob: Record<string, JobApplication[]> = {};
  applications.forEach((app) => {
    if (!applicationsByJob[app.job_id]) {
      applicationsByJob[app.job_id] = [];
    }
    applicationsByJob[app.job_id].push(app);
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'accepted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(applicationsByJob).map(([jobId, jobApplications]) => (
        <div key={jobId} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Job Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50 flex-col lg:flex-row">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">
                {jobApplications[0].jobs.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                {jobApplications.length} applicant{jobApplications.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="grid gap-6">
            {jobApplications.map((application) => (
              <div key={application.id} className="bg-slate-900/50 border border-slate-600/50 rounded-2xl p-6 hover:border-slate-500/50 transition-all duration-200">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-start gap-4 flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                      {application.profiles.avatar_url ? (
                        <img 
                          src={application.profiles.avatar_url} 
                          alt={application.profiles.full_name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        application.profiles.full_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-white mb-1 break-words">
                        {application.profiles.full_name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          Applied {formatDistanceToNow(new Date(application.created_at))} ago
                        </span>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`mailto:${application.contact_email}`}
                        className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 group"
                      >
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-slate-300 group-hover:text-white transition-colors text-sm break-all">
                          {application.contact_email}
                        </span>
                      </a>

                      {application.contact_number && (
                        <a
                          href={`tel:${application.contact_number}`}
                          className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 group"
                        >
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                            <Phone className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-slate-300 group-hover:text-white transition-colors text-sm">
                            {application.contact_number}
                          </span>
                        </a>
                      )}
                    </div>

                    {/* Cover Letter */}
                    {application.cover_letter && (
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleCoverLetter(application.id)}
                          className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 group w-full sm:w-auto"
                        >
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                            View Cover Letter
                          </span>
                          {expandedCoverLetters.has(application.id) ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                          )}
                        </button>
                        
                        {expandedCoverLetters.has(application.id) && (
                          <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                              {application.cover_letter}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}