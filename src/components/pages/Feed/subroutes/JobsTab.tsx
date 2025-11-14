import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  Check,
  FilePlus,
  Users,
  Trash2,
  Filter,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Container } from "../../../layout/container";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { checkIfApplied, deleteJob, fetchJobs } from "@/lib/jobs";
import { useNavigate } from "react-router-dom";
import { ApplicationModal } from "@/components/modals/ApplicationModel";
import { ConfirmationDialog } from "@/components/modals/ConfirmationDialog";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const jobCategories = [
  "All Categories",
  "Content Writing",
  "Technical Writing",
  "Copywriting",
  "Journalism",
  "Creative Writing",
  "Academic Writing",
  "Marketing",
  "Editorial",
];

const jobTypes = [
  "All Types",
  "Full-time",
  "Part-time",
  "Freelance",
  "Contract",
  "Remote",
  "Internship",
];

export function JobsTab() {
  const { user } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<
    Record<string, boolean>
  >({});
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkApplications = async () => {
      if (!user || jobs.length === 0) return;

      const status: Record<string, boolean> = {};
      for (const job of jobs) {
        const hasApplied = await checkIfApplied(job.id, user.id);
        status[job.id] = hasApplied;
      }
      setApplicationStatus(status);
    };

    checkApplications();
  }, [jobs, user]);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Fetch all jobs with current filters
        const allJobsData = await fetchJobs({
          search: searchQuery,
          category:
            selectedCategory === "All Categories"
              ? undefined
              : selectedCategory,
          type: selectedType === "All Types" ? undefined : selectedType,
          featured: showFeaturedOnly,
        });

        // Fetch featured jobs separately
        const featuredJobsData = await fetchJobs({
          featured: true,
          category:
            selectedCategory === "All Categories"
              ? undefined
              : selectedCategory,
          type: selectedType === "All Types" ? undefined : selectedType,
        });

        setJobs(allJobsData);
        setFeaturedJobs(featuredJobsData);
      } catch (error) {
        console.error("Failed to load jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [searchQuery, selectedCategory, selectedType, showFeaturedOnly]);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getSalaryDisplay = (job: any) => {
    if (job.salary_display) return job.salary_display;
    if (job.salary_min && job.salary_max) {
      return `${
        job.salary_currency || "$"
      }${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  useDocumentTitle('Jobs | Writers Ecosystem');

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return;

    try {
      await deleteJob(jobId);
      toast({
        title: "Job deleted",
        description: "The job posting has been removed",
      });
      // Refresh jobs list
      setJobs(jobs.filter((job) => job.id !== jobId));
      setFeaturedJobs(featuredJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete the job posting",
        variant: "destructive",
      });
    } finally {
      setJobToDelete(null);
    }
  };

  const handlePostJob = () => {
    navigate("/jobs/post");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full">
        <Container className="px-4 py-6 max-w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                Turn Your Passion Into Pay
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Discover premium writing opportunities that match your expertise
                and aspirations. Connect directly with top employers.
              </p>
            </div>

            {/* Hero Stats */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>5,000+ Jobs</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-green-400" />
                <span>10,000+ Writers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Matching</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="mb-6 md:mb-8 w-full">
            {/* Main Search Bar */}
            <div className="relative mb-6 w-full max-w-2xl mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20"></div>
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Grid - Mobile First */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    {jobCategories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-gray-900"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filters & Actions
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm ${
                      showFeaturedOnly
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-900/60 backdrop-blur-sm text-gray-300 hover:bg-gray-800/60 border border-gray-700/50"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        showFeaturedOnly ? "text-yellow-300" : ""
                      }`}
                    />
                    <span className="font-medium">Featured Only</span>
                  </button>

                  {user && (
                    <>
                      <Button
                        onClick={() => {
                          window.scroll(0, 0), navigate("/jobs/post");
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/25 text-sm px-3 py-2"
                      >
                        <FilePlus className="w-4 h-4 mr-2" />
                        Post Job
                      </Button>

                      <Button
                        onClick={() => {
                          window.scroll(0, 0), navigate("/jobs/applicants");
                        }}
                        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg shadow-purple-500/25 text-sm px-3 py-2"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Applicants
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Results Counter */}
            {!loading && (
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-full text-gray-300 text-sm">
                  <Filter className="w-4 h-4" />
                  {jobs.length} {showFeaturedOnly ? "featured" : ""} jobs found
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-gray-400 mt-4 text-lg">
                Finding perfect opportunities...
              </p>
            </div>
          ) : (
            <div className="w-full max-w-full">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
                {/* Main Job Listings */}
                <div className="lg:col-span-3 w-full min-w-0">
                  {/* Featured Jobs Section */}
                  {!showFeaturedOnly && featuredJobs.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <h2 className="text-xl md:text-2xl font-bold text-white">
                            Featured Opportunities
                          </h2>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
                      </div>

                      <div className="space-y-6">
                        {featuredJobs.map((job) => (
                          <div key={job.id} className="group relative">
                            {/* Animated Border */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>

                            <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 p-4 md:p-6 transition-all duration-500 group-hover:transform group-hover:scale-[1.02] w-full min-w-0">
                              {/* Job Header */}
                              <div className="mb-4">
                                <div className="mb-3">
                                  <div className="flex flex-wrap items-start gap-2 mb-2">
                                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer break-words min-w-0 flex-1">
                                      {job.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {job.urgent && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                                          <Zap className="w-3 h-3" />
                                          URGENT
                                        </span>
                                      )}
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                                        <Star className="w-3 h-3" />
                                        FEATURED
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-blue-300 font-semibold text-base md:text-lg mb-3 break-words">
                                    {job.company}
                                  </p>
                                  <p className="text-gray-300 leading-relaxed text-sm md:text-base break-words">
                                    {job.description}
                                  </p>
                                </div>
                              </div>

                              {/* Skills Section */}
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Briefcase className="w-4 h-4 text-blue-400" />
                                  <h4 className="font-semibold text-blue-300 text-sm">
                                    Required Skills
                                  </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {job.requirements?.map((skill: string) => (
                                    <span
                                      key={skill}
                                      className="px-3 py-1 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-100 text-xs font-medium rounded-xl border border-blue-700/30 hover:border-blue-600/50 hover:from-blue-800/60 hover:to-indigo-800/60 transition-all duration-300 transform hover:scale-105 break-words"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Job Details Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                <div className="flex items-center gap-2 text-gray-300 min-w-0">
                                  <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                  <span className="text-sm font-medium break-words">
                                    {job.job_type}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 min-w-0">
                                  <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  <span className="text-sm font-medium break-words">
                                    {job.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 min-w-0">
                                  <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  <span className="text-sm font-semibold text-emerald-300 break-words">
                                    {getSalaryDisplay(job)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 min-w-0">
                                  <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                  <span className="text-sm break-words">
                                    {formatDate(job.created_at)}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                  {user?.id === job.employer_id && (
                                    <button
                                      onClick={() => setJobToDelete(job.id)}
                                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-300 group/delete"
                                      title="Delete job"
                                    >
                                      <Trash2 className="w-4 h-4 group-hover/delete:animate-bounce" />
                                      <span className="text-sm font-medium">
                                        Delete
                                      </span>
                                    </button>
                                  )}
                                </div>

                                <div className="w-full sm:w-auto">
                                  {user?.id !== job.employer_id && (
                                    <>
                                      {applicationStatus[job.id] ? (
                                        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-300 rounded-xl border border-green-700/40 backdrop-blur-sm">
                                          <Check className="w-4 h-4 flex-shrink-0" />
                                          <span className="font-semibold text-sm">
                                            Applied
                                          </span>
                                        </div>
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            setSelectedJobId(job.id);
                                            setApplicationModalOpen(true);
                                          }}
                                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                                        >
                                          Apply Now
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Jobs Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl md:text-2xl font-bold text-white">
                        {showFeaturedOnly
                          ? "Featured Jobs"
                          : "All Opportunities"}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                      <span className="text-gray-400 text-sm font-medium">
                        {jobs.length} positions
                      </span>
                    </div>

                    {jobs.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                          <Search className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                          No jobs found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your search criteria or filters
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <div key={job.id} className="group w-full min-w-0">
                            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 p-4 md:p-6 transition-all duration-300 group-hover:transform group-hover:scale-[1.01] group-hover:shadow-xl group-hover:shadow-blue-500/10 w-full min-w-0">
                              {/* Job Header */}
                              <div className="mb-4">
                                <div className="mb-2">
                                  <div className="flex flex-wrap items-start gap-2 mb-2">
                                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer break-words min-w-0 flex-1">
                                      {job.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {job.urgent && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                                          <Zap className="w-3 h-3" />
                                          URGENT
                                        </span>
                                      )}
                                      {job.featured && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                                          <Star className="w-3 h-3" />
                                          FEATURED
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-blue-300 font-medium mb-3 break-words">
                                    {job.company}
                                  </p>
                                  <p className="text-gray-300 text-sm md:text-base leading-relaxed break-words">
                                    {job.description}
                                  </p>
                                </div>
                              </div>

                              {/* Skills */}
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                  <span className="text-sm font-medium text-blue-300">
                                    Skills:
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {job.requirements
                                    ?.slice(0, 5)
                                    .map((skill: string) => (
                                      <span
                                        key={skill}
                                        className="px-3 py-1 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-100 text-xs font-medium rounded-lg border border-blue-700/30 hover:border-blue-600/40 transition-all duration-200 break-words"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  {job.requirements?.length > 5 && (
                                    <span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs font-medium rounded-lg border border-gray-700/30 whitespace-nowrap">
                                      +{job.requirements.length - 5} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Job Details and Actions */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-700/30">
                                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 min-w-0">
                                  <span className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                                    <span className="break-words">
                                      {job.job_type}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="break-words">
                                      {job.location}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                    <DollarSign className="w-3 h-3 flex-shrink-0" />
                                    <span className="break-words">
                                      {getSalaryDisplay(job)}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                    <span className="break-words">
                                      {formatDate(job.created_at)}
                                    </span>
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  {user?.id === job.employer_id && (
                                    <button
                                      onClick={() => setJobToDelete(job.id)}
                                      className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                      title="Delete job"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}

                                  {user?.id !== job.employer_id && (
                                    <>
                                      {applicationStatus[job.id] ? (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-400 rounded-lg border border-green-700/30">
                                          <Check className="w-4 h-4 flex-shrink-0" />
                                          <span className="text-sm font-medium">
                                            Applied
                                          </span>
                                        </div>
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            setSelectedJobId(job.id);
                                            setApplicationModalOpen(true);
                                          }}
                                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 text-sm"
                                        >
                                          Apply Now
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Right Sidebar - Full Width Fixed */}
                <div className="lg:col-span-1 w-full">
                  <div className="space-y-6 w-full">
                    {/* Market Insights */}
                    <div className="w-full">
                      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <h3 className="text-base md:text-lg font-bold text-white">
                            Market Insights
                          </h3>
                        </div>
                        <div className="space-y-3 w-full">
                          <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                            <span className="text-gray-300 text-sm">
                              Total Jobs
                            </span>
                            <span className="font-bold text-blue-400">
                              {jobs.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                            <span className="text-gray-300 text-sm">
                              Remote Positions
                            </span>
                            <span className="font-bold text-green-400">
                              {jobs.filter((job) => job.remote).length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                            <span className="text-gray-300 text-sm">
                              Urgent Hiring
                            </span>
                            <span className="font-bold text-red-400">
                              {jobs.filter((job) => job.urgent).length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                            <span className="text-gray-300 text-sm">
                              Featured Jobs
                            </span>
                            <span className="font-bold text-yellow-400">
                              {jobs.filter((job) => job.featured).length}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Post Job CTA */}
                    {user && (
                      <div className="w-full">
                        <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-800/40 backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 w-full">
                          <div className="text-center w-full">
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <FilePlus className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-white mb-2">
                              Ready to Hire?
                            </h3>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                              Connect with thousands of qualified writers by
                              posting your opportunity.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/25"
                              onClick={handlePostJob}
                            >
                              Post a Job
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Success Tips */}
                    <div className="w-full">
                      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                        <h3 className="text-base md:text-lg font-bold text-white mb-4">
                          💡 Success Tips
                        </h3>
                        <div className="space-y-3 text-sm text-gray-300 w-full">
                          <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                            <p className="font-medium text-blue-300 mb-1">
                              Optimize Your Profile
                            </p>
                            <p>Complete profiles get 3x more responses</p>
                          </div>
                          <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                            <p className="font-medium text-green-300 mb-1">
                              Apply Early
                            </p>
                            <p>First 24 hours see highest acceptance rates</p>
                          </div>
                          <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                            <p className="font-medium text-purple-300 mb-1">
                              Customize Applications
                            </p>
                            <p>Tailored proposals stand out significantly</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Modals */}
      {selectedJobId && (
        <ApplicationModal
          jobId={selectedJobId}
          open={applicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          onSuccess={() => {
            // Update application status for this job
            setApplicationStatus((prev) => ({
              ...prev,
              [selectedJobId]: true,
            }));

            // Show success toast
            toast({
              title: "Application submitted!",
              description: "Your application has been successfully sent.",
              variant: "default",
            });
          }}
        />
      )}

      <ConfirmationDialog
        open={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={() => jobToDelete && handleDeleteJob(jobToDelete)}
        title="Delete Job Posting?"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
