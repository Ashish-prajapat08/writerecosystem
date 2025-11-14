import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  company_name: string;
  company_logo_url?: string;
  job_type: string;
  salary_range?: string;
  location: string;
  is_remote: boolean;
  is_featured: boolean;
  is_urgent: boolean;
  created_at: string;
  expires_at?: string;
  requirements?: string[];
  tags?: string[];
}

interface JobsContextType {
  jobs: Job[];
  featuredJobs: Job[];
  savedJobs: string[];
  appliedJobs: string[];
  stats: {
    total: number;
    remote: number;
    featured: number;
    urgent: number;
  };
  loading: boolean;
  fetchJobs: (filters?: JobFilters) => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  getJobById: (id: string) => Promise<Job | null>;
}

interface JobFilters {
  search?: string;
  jobType?: string;
  isFeatured?: boolean;
  isRemote?: boolean;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    remote: 0,
    featured: 0,
    urgent: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchJobs();
    fetchStats();
    
    if (user) {
      fetchSavedJobs();
      fetchAppliedJobs();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const jobsChannel = supabase
      .channel('jobs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs'
      }, () => {
        fetchJobs();
        fetchStats();
      })
      .subscribe();

    const savedJobsChannel = supabase
      .channel('saved_jobs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'saved_jobs'
      }, () => {
        fetchSavedJobs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(savedJobsChannel);
    };
  }, [user]);

  const fetchJobs = async (filters: JobFilters = {}) => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
        );
      }

      if (filters.jobType) {
        query = query.eq('job_type', filters.jobType);
      }

      if (filters.isFeatured) {
        query = query.eq('is_featured', true);
      }

      if (filters.isRemote) {
        query = query.eq('is_remote', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

      const { count: remote } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_remote', true);

      const { count: featured } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

      const { count: urgent } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_urgent', true);

      setStats({
        total: total || 0,
        remote: remote || 0,
        featured: featured || 0,
        urgent: urgent || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedJobs(data?.map(item => item.job_id) || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setAppliedJobs(data?.map(item => item.job_id) || []);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  const saveJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save jobs',
        variant: 'destructive',
      });
      return;
    }

    try {
      const isSaved = savedJobs.includes(jobId);
      
      if (isSaved) {
        // Unsave the job
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        // Save the job
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, job_id: jobId });

        if (error) throw error;
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error('Error toggling saved job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update saved job',
        variant: 'destructive',
      });
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to apply for jobs',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert({ user_id: user.id, job_id: jobId });

      if (error) throw error;
      
      setAppliedJobs(prev => [...prev, jobId]);
      toast({
        title: 'Application submitted',
        description: 'Your application has been received',
      });
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive',
      });
    }
  };

  const getJobById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  };

  const featuredJobs = jobs.filter(job => job.is_featured);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        featuredJobs,
        savedJobs,
        appliedJobs,
        stats,
        loading,
        fetchJobs,
        saveJob,
        applyToJob,
        getJobById
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};