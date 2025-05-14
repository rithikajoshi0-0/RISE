import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Project, Purchase, api } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, ShoppingCart, AlertCircle, Plus, Download, ExternalLink, DollarSign, Calendar, Trash2 } from 'lucide-react';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'purchases'>(
    user?.role === 'Seller' ? 'projects' : 'purchases'
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        if (user.role === 'Seller') {
          const userProjects = await api.getUserProjects(user.id);
          setProjects(userProjects);
        }

        const userPurchases = await api.getUserPurchases(user.id);
        setPurchases(userPurchases);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteProject = async (projectId: string) => {
    if (!user) return;

    try {
      await api.deleteProject(projectId, user.id);
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
    } catch (error: any) {
      if (error.message.includes('Deletion limit')) {
        setShowUpgradeModal(true);
      }
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;

    try {
      await api.upgradeToPremium(user.id);
      setShowUpgradeModal(false);
      // Refresh the page to update user status
      window.location.reload();
    } catch (error) {
      console.error('Error upgrading account:', error);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your {user?.role === 'Seller' ? 'projects and ' : ''}purchases
          </p>
        </div>

        {user?.role === 'Seller' && !user.isPremium && (
          <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
            <p className="mb-4">
              You have uploaded {user.projectUploads}/3 projects and deleted {user.projectDeletions}/3 projects.
              Upgrade to premium for unlimited uploads and deletions!
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {user.role === 'Seller' && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Package className="h-5 w-5 mr-2" />
                My Projects
              </button>
            )}
            <button
              onClick={() => setActiveTab('purchases')}
              className={`${
                activeTab === 'purchases'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              My Purchases
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : activeTab === 'projects' && user.role === 'Seller' ? (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Your Projects</h2>
              <Link to="/upload">
                <Button 
                  leftIcon={<Plus className="h-4 w-4" />}
                  disabled={!user.isPremium && user.projectUploads >= 3}
                >
                  Add New Project
                </Button>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-6">Start selling by uploading your first project.</p>
                <Link to="/upload">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>Upload a Project</Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-md object-cover"
                                src={project.image}
                                alt={project.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 truncate">{project.title}</div>
                              <div className="flex mt-1">
                                <span className="flex items-center text-sm text-gray-500">
                                  <DollarSign className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                                  {project.price === 0 ? 'Free' : `$${project.price}`}
                                </span>
                                <span className="ml-4 flex items-center text-sm text-gray-500">
                                  Status: {project.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 space-x-2">
                            <Link
                              to={`/projects/${project.id}`}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              disabled={!user.isPremium && user.projectDeletions >= 3}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Your Purchases</h2>

            {purchases.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
                <p className="text-gray-600 mb-6">Browse the marketplace to find projects.</p>
                <Link to="/">
                  <Button>Explore Projects</Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <li key={purchase.id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-md object-cover"
                                src={purchase.project?.image}
                                alt={purchase.project?.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {purchase.project?.title}
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                                Purchased on{' '}
                                {new Date(purchase.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                            <div className="flex space-x-2">
                              <Button
                                variant="success"
                                size="sm"
                                leftIcon={<Download className="h-4 w-4" />}
                                onClick={() => purchase.project && api.downloadProject(purchase.project.id)}
                              >
                                Download
                              </Button>
                              <Link to={`/projects/${purchase.project_id}`}>
                                <Button variant="secondary" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Upgrade to Premium
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        For just $1, you'll get:
                        <ul className="list-disc list-inside mt-2">
                          <li>Unlimited project uploads</li>
                          <li>Unlimited project deletions</li>
                          <li>Priority support</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    onClick={handleUpgrade}
                  >
                    Upgrade Now
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
