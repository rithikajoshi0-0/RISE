import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, api } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  Calendar, 
  Tag as TagIcon, 
  Github, 
  ShoppingCart, 
  Download, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Clock,
  HardDrive,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Button from '../components/Button';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [error, setError] = useState('');
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [votes, setVotes] = useState({ up: 42, down: 3 });
  const [hasVoted, setHasVoted] = useState<'up' | 'down' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const fetchedProject = await api.getProject(id);
        setProject(fetchedProject);
        
        if (user) {
          const purchased = await api.hasPurchased(user.id, id);
          setHasPurchased(purchased);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!project || !termsAccepted) return;

    setPurchasing(true);
    try {
      await api.purchaseProject(user.id, project.id);
      setHasPurchased(true);
    } catch (error) {
      console.error('Error purchasing project:', error);
      setError('Failed to purchase project');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!project) return;
    try {
      await api.downloadProject(project.id);
      setHasDownloaded(true);
    } catch (error) {
      console.error('Error downloading project:', error);
      setError('Failed to download project');
    }
  };

  const handleVote = (type: 'up' | 'down') => {
    if (!hasPurchased) return;
    
    setVotes(prev => ({
      up: prev.up + (type === 'up' ? 1 : 0) - (hasVoted === 'up' ? 1 : 0),
      down: prev.down + (type === 'down' ? 1 : 0) - (hasVoted === 'down' ? 1 : 0)
    }));
    setHasVoted(type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>Back to Marketplace</Button>
          </div>
        </div>
      </div>
    );
  }

  const rating = votes.up / (votes.up + votes.down) * 5;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Project Image */}
          <div className="w-full h-64 sm:h-96 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  <TagIcon className="h-4 w-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-yellow-400 mr-1">⭐</span>
                  <span className="font-medium">{rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleVote('up')}
                    disabled={!hasPurchased || hasVoted === 'up'}
                    className={`p-1 rounded ${hasVoted === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium">{votes.up}</span>
                  <button 
                    onClick={() => handleVote('down')}
                    disabled={!hasPurchased || hasVoted === 'down'}
                    className={`p-1 rounded ${hasVoted === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <ThumbsDown className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium">{votes.down}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="prose max-w-none mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
                </div>

                {project.github_link && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Repository</h2>
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      View on GitHub
                    </a>
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-5 w-5 mr-2 text-gray-400" />
                        <span>Type: Source Code</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-gray-400" />
                        <span>Delivery: Instant Download</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <HardDrive className="h-5 w-5 mr-2 text-gray-400" />
                        <span>Size: {project.files?.[0]?.size || '~20MB'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {project.price === 0 ? 'Free' : `$${project.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!hasPurchased && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        📜 Terms and Conditions
                      </h3>
                      <div className="bg-white rounded p-4 text-sm text-gray-600 space-y-2">
                        <p>❌ No resale, redistribution, or plagiarism.</p>
                        <p>📥 Only one download allowed.</p>
                        <p>🚫 Misuse = ban + possible legal action.</p>
                        <p>🛡 Company is not responsible after download.</p>
                      </div>
                      <label className="flex items-center mt-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I agree to the terms and conditions
                        </span>
                      </label>
                    </div>
                  )}

                  {hasPurchased ? (
                    <div className="space-y-4">
                      <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                              Purchase Complete
                            </h3>
                            <div className="mt-2 text-sm text-green-700">
                              <p>You can now download the project files.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        fullWidth
                        variant="success"
                        leftIcon={<Download className="h-5 w-5" />}
                        onClick={handleDownload}
                        disabled={hasDownloaded}
                      >
                        {hasDownloaded ? 'Already Downloaded' : 'Download Project'}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      isLoading={purchasing}
                      leftIcon={<ShoppingCart className="h-5 w-5" />}
                      onClick={handlePurchase}
                      disabled={!termsAccepted}
                    >
                      {user ? `Buy Now - $${project.price}` : 'Log in to Purchase'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Misuse of purchased content for academic fraud, plagiarism, or resale may result in account suspension or legal consequences. Your actions are logged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
