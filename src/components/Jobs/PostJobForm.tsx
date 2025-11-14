import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Building,
  MapPin,
  DollarSign,
  Mail,
  Phone,
  Tag,
  Briefcase,
  FileText,
  CheckCircle,
  Star,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/lib/jobs";
import { Container } from "../layout/container";
import { toast } from "@/hooks/use-toast";

const jobTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

const tagOptions = [
  { value: "Content Writing", label: "Content Writing" },
  { value: "Technical Writing", label: "Technical Writing" },
  { value: "Copywriting", label: "Copywriting" },
  { value: "Journalism", label: "Journalism" },
  { value: "Creative Writing", label: "Creative Writing" },
  { value: "Academic Writing", label: "Academic Writing" },
  { value: "Marketing", label: "Marketing" },
  { value: "Editorial", label: "Editorial" },
];

const commonSkills = [
  "SEO Writing",
  "Technical Writing",
  "Creative Writing",
  "Copywriting",
  "Editing",
  "Proofreading",
  "Research",
  "Blogging",
  "Ghostwriting",
  "Academic Writing",
  "Journalism",
  "Content Strategy",
  "Social Media Writing",
  "Grant Writing",
  "Scriptwriting",
];

export function PostJobForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [availableSkills, setAvailableSkills] =
    useState<string[]>(commonSkills);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    jobType: "",
    location: "",
    remote: false,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryDisplay: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    urgent: false,
    featured: false,
    tags: [] as string[],
  });

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");

      if (!availableSkills.includes(trimmedSkill)) {
        setAvailableSkills([...availableSkills, trimmedSkill]);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const addCommonSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleTagToggle = (tagValue: string) => {
    const newTags = selectedTags.includes(tagValue)
      ? selectedTags.filter((tag) => tag !== tagValue)
      : [...selectedTags, tagValue];
    setSelectedTags(newTags);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to post a job");
      setLoading(false);
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one required skill");
      setLoading(false);
      return;
    }

    try {
      await createJob(
        {
          title: formData.title,
          company: formData.company,
          description: formData.description,
          requirements: skills,
          job_type: formData.jobType,
          location: formData.location,
          remote: formData.remote,
          salary_min: formData.salaryMin
            ? Number(formData.salaryMin)
            : undefined,
          salary_max: formData.salaryMax
            ? Number(formData.salaryMax)
            : undefined,
          salary_currency: formData.salaryCurrency,
          salary_display: formData.salaryDisplay,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone || undefined,
          urgent: formData.urgent,
          featured: formData.featured,
          tags: formData.tags,
        },
        user.id
      );

      toast({
        title: "Job posted successfully!",
        description: "Your job listing is now live.",
      });

      navigate("/jobs");
    } catch (err: any) {
      console.error("Error posting job:", err);
      setError(err.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Container className="py-8 px-4 sm:px-6 lg:px-8 max-w-8xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-6 sm:mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-lg font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Post New Job
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Create a compelling job listing to attract top talent and find your
            perfect candidate
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {/* Basic Information Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Senior Content Writer"
                    required
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Your company name"
                    required
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Job Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell us about this role, responsibilities, and what makes it exciting..."
                  rows={5}
                  required
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Required Skills
              </h2>
            </div>

            <div className="space-y-6">
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-full backdrop-blur-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-0.5 hover:bg-blue-500/20 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed min-w-[100px]"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {availableSkills.filter((skill) => !skills.includes(skill))
                .length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Suggested skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills
                      .filter((skill) => !skills.includes(skill))
                      .slice(0, 8)
                      .map((skill) => (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => addCommonSkill(skill)}
                          className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 text-sm"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Details Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Job Type
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                  required
                >
                  <option value="" className="bg-slate-800">
                    Select type
                  </option>
                  {jobTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-slate-800"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="New York, NY"
                  required
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                />
              </div>
            </div>
          </div>

          {/* Compensation Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Compensation</h2>
              <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                Optional
              </span>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMin: e.target.value })
                  }
                  placeholder="Min salary"
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                />
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMax: e.target.value })
                  }
                  placeholder="Max salary"
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                />
                <select
                  value={formData.salaryCurrency}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryCurrency: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                >
                  <option value="USD" className="bg-slate-800">
                    USD
                  </option>
                  <option value="EUR" className="bg-slate-800">
                    EUR
                  </option>
                  <option value="GBP" className="bg-slate-800">
                    GBP
                  </option>
                  <option value="CAD" className="bg-slate-800">
                    CAD
                  </option>
                  <option value="AUD" className="bg-slate-800">
                    AUD
                  </option>
                </select>
              </div>
              <input
                type="text"
                value={formData.salaryDisplay}
                onChange={(e) =>
                  setFormData({ ...formData, salaryDisplay: e.target.value })
                }
                placeholder="Or enter custom display text (e.g., 'Competitive salary')"
                className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
              />
            </div>
          </div>

          {/* Contact & Tags Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Contact & Tags
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    placeholder="hiring@company.com"
                    required
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <div className="relative z-50">
                  <div
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white cursor-pointer hover:border-slate-500/50 transition-all duration-200 min-h-[52px] flex items-center"
                    onClick={() => setIsTagsOpen(!isTagsOpen)}
                  >
                    {selectedTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-md border border-blue-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">
                        Select relevant categories
                      </span>
                    )}
                  </div>
                  {isTagsOpen && (
                    <div className="top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-3 z-50 shadow-xl">
                      <div className="space-y-2">
                        {tagOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(option.value)}
                              onChange={() => handleTagToggle(option.value)}
                              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-slate-300">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Options Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Additional Options
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <label className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) =>
                    setFormData({ ...formData, remote: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium">Remote Work</span>
                  <p className="text-sm text-slate-400">Allow remote work</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={(e) =>
                    setFormData({ ...formData, urgent: e.target.checked })
                  }
                  className="w-5 h-5 text-orange-600 bg-slate-700 border-slate-500 rounded focus:ring-orange-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    Urgent Hiring
                  </span>
                  <p className="text-sm text-slate-400">Priority listing</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-5 h-5 text-yellow-600 bg-slate-700 border-slate-500 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Featured Listing
                  </span>
                  <p className="text-sm text-slate-400">Premium placement</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              disabled={loading}
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
