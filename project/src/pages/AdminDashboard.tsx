import React, { useState, useEffect } from 'react';
import { Project, CustomProject, User, api } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package,
  MessageSquare,
  Users,
  Calendar,
  DollarSign,
  Download,
  Upload,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import ProjectAdminDashboard from './admin/ProjectAdminDashboard';
import PortfolioAdminDashboard from './admin/PortfolioAdminDashboard';
import PhDAdminDashboard from './admin/PhDAdminDashboard';

type AdminTab = 'projects' | 'portfolios' | 'papers' | 'custom-inbox' | 'developer-matching' | 'developer-uploads' | 'buyer-deliverables';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Package },
    { id: 'portfolios', label: 'Portfolios', icon: Briefcase },
    { id: 'papers', label: 'PhD Papers', icon: GraduationCap },
    { id: 'custom-inbox', label: 'Custom Inbox', icon: MessageSquare },
    { id: 'developer-matching', label: 'Developer Matching', icon: Users },
    { id: 'developer-uploads', label: 'Developer Uploads', icon: Upload },
    { id: 'buyer-deliverables', label: 'Buyer Deliverables', icon: Download }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProjects = await api.getProjects();
        setProjects(allProjects);
        const customProjs = await api.getCustomProjects();
        setCustomProjects(customProjs);
        const availableSellers = await api.getAvailableSellers('');
        setSellers(availableSellers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (projectId: string) => {
    if (!user) return;
    try {
      await api.approveProject(projectId, user.id);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleReject = async (projectId: string, feedback: string) => {
    try {
      await api.rejectProject(projectId, feedback);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectAdminDashboard
            projects={projects}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      case 'portfolios':
        return (
          <PortfolioAdminDashboard
            portfolios={projects}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      case 'papers':
        return (
          <PhDAdminDashboard
            papers={projects}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      // Add other tab content components here
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Custom Requests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customProjects.filter(p => p.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customProjects.filter(p => p.status === 'InProgress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$1,234</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3 py-2 font-medium text-sm rounded-md flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
