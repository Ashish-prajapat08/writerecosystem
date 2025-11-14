import { Container } from '@/components/layout/container';
import { ApplicantsList } from './ApplicantsList';
import { ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function ApplicantsPage() {
  const navigate = useNavigate();
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Job Applicants
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Review and manage applications for your posted job opportunities
          </p>
        </div>
        
        <ApplicantsList />
      </Container>
    </div>
  );
}