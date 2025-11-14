import { supabase } from '../lib/supabaseClient';

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  job_type: string;
  location: string;
  remote: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_display?: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  status: string;
  urgent: boolean;
  featured: boolean;
  tags: string[];
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  contact_email: string;
  contact_number: string | null;
  cover_letter: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    email: string;
  };
  jobs: {
    title: string;
    company: string;
  };
}

// lib/jobs.ts
export const fetchEmployerApplications = async (employerId: string) => {
  // First check if user has any posted jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id')
    .eq('employer_id', employerId);

  if (jobsError) {
    console.error('Error checking jobs:', jobsError);
    throw jobsError;
  }

  // If no jobs posted, return empty array
  if (!jobs || jobs.length === 0) {
    return [];
  }

  // Then fetch applications for those jobs
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      profiles:applicant_id(full_name, avatar_url, email),
      jobs:job_id(title, company)
    `)
    .in('job_id', jobs.map(job => job.id))
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }

  return data as JobApplication[];
};

export const fetchJobs = async (filters: {
  search?: string;
  category?: string;
  type?: string;
  featured?: boolean;
}) => {
  let query = supabase
    .from('jobs')
    .select(`
      *,
      profiles:profiles!employer_id(full_name, avatar_url)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters.category && filters.category !== 'All Categories') {
    query = query.contains('tags', [filters.category]);
  }

  if (filters.type && filters.type !== 'All Types') {
    query = query.eq('job_type', filters.type.toLowerCase());
  }

  if (filters.featured) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }

  return data as Job[];
};

export const fetchJobById = async (id: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      profiles:profiles!employer_id(full_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching job:', error);
    throw error;
  }

  return data as Job;
};

export const createJob = async (jobData: {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  job_type: string;
  location: string;
  remote: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_display?: string;
  contact_email: string;
  contact_phone?: string;
  urgent?: boolean;
  featured?: boolean;
  tags?: string[];
}, userId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      ...jobData,
      employer_id: userId,
      status: 'active'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return data as Job;
};

export const checkIfApplied = async (jobId: string, userId: string) => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('applicant_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

// lib/jobs.ts
export const createJobApplication = async (applicationData: {
  jobId: string;
  applicantId: string;
  contactEmail: string;
  contactPhone?: string;
  coverLetter?: string;
}) => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      job_id: applicationData.jobId,
      applicant_id: applicationData.applicantId,
      contact_email: applicationData.contactEmail,
      contact_number: applicationData.contactPhone || null,
      cover_letter: applicationData.coverLetter || null,
      status: 'submitted'
    })
    .select()
    .single();

  if (error) {
    console.error('Detailed error:', error);
    throw error;
  }
  
  return data;
};
export const deleteJob = async (jobId: string) => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
  return true;
};