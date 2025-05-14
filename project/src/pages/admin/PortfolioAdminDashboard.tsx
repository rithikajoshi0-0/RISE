import React, { useState, useEffect } from 'react';
import { Project, api } from '../../lib/supabase';
import { CheckCircle, XCircle, MessageSquare, AlertCircle, Briefcase } from 'lucide-react';
import Button from '../../components/Button';

const PortfolioAdminDashboard: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Project[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const allProjects = await api.getProjects();
        setPortfolios(allProjects.filter(p => p.status === 'Pending'));
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleApprove = async (portfolioId: string) => {
    try {
      await api.approveProject(portfolioId, 'admin');
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    } catch (error) {
      console.error('Error approving portfolio:', error);
    }
  };

  const handleReject = async (portfolioId: string, feedback: string) => {
    try {
      await api.rejectProject(portfolioId, feedback);
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
      setSelectedPortfolio(null);
      setFeedback('');
    } catch (error) {
      console.error('Error rejecting portfolio:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Portfolio Reviews</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {portfolios.map(portfolio => (
          <div key={portfolio.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{portfolio.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">{portfolio.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {portfolio.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-6 flex space-x-3">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(portfolio.id)}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setSelectedPortfolio(portfolio)}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`/portfolios/${portfolio.id}`, '_blank')}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>
        ))}

        {portfolios.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No pending portfolios to review
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Reject Portfolio
                  </h3>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide feedback for rejection..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Button
                  variant="danger"
                  onClick={() => {
                    handleReject(selectedPortfolio.id, feedback);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedPortfolio(null);
                    setFeedback('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAdminDashboard;
