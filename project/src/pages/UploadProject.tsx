import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Link as LinkIcon, Tag as TagIcon, DollarSign, Image as ImageIcon, FileUp, Github, RefreshCw, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/supabase';
import Button from '../components/Button';
import { Octokit } from '@octokit/rest';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import Modal from 'react-modal';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type UploadType = 'Project' | 'Portfolio' | 'PhD Paper';

interface CommonFormData {
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
}

interface ProjectFormData extends CommonFormData {
  github_link: string;
  deliveryTimeline: string;
  demoUrl?: string;
}

interface PortfolioFormData extends CommonFormData {
  developerBio: string;
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  resumeFile?: File;
}

interface PhDFormData extends CommonFormData {
  abstract: string;
  domain: string;
  yearCompleted: number;
  university: string;
  authorName?: string;
  isPeerReviewed: boolean;
  pdfFile?: File;
  previewPages: number[];
}

Modal.setAppElement('#root');

const UploadProject: React.FC = () => {
  const [uploadType, setUploadType] = useState<UploadType>('Project');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [projectData, setProjectData] = useState<ProjectFormData>({
    title: '',
    description: '',
    tags: [''],
    github_link: '',
    image: '',
    price: 0,
    deliveryTimeline: '1-2 weeks',
    demoUrl: ''
  });
  const [portfolioData, setPortfolioData] = useState<PortfolioFormData>({
    title: '',
    description: '',
    tags: [''],
    image: '',
    price: 0,
    developerBio: '',
    skills: [''],
    linkedinUrl: '',
    githubUrl: ''
  });
  const [phdData, setPhdData] = useState<PhDFormData>({
    title: '',
    description: '',
    tags: [''],
    image: '',
    price: 0,
    abstract: '',
    domain: '',
    yearCompleted: new Date().getFullYear(),
    university: '',
    authorName: '',
    isPeerReviewed: false,
    previewPages: [1, 2]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip', '.rar'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.type.includes('pdf')) {
        setPhdData(prev => ({ ...prev, pdfFile: file }));
      } else if (file.type.includes('image')) {
        const imageUrl = URL.createObjectURL(file);
        if (uploadType === 'Project') {
          setProjectData(prev => ({ ...prev, image: imageUrl }));
        } else if (uploadType === 'Portfolio') {
          setPortfolioData(prev => ({ ...prev, image: imageUrl }));
        } else {
          setPhdData(prev => ({ ...prev, image: imageUrl }));
        }
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let uploadData;
      switch (uploadType) {
        case 'Project':
          uploadData = { ...projectData, type: 'project', user_id: user.id };
          break;
        case 'Portfolio':
          uploadData = { ...portfolioData, type: 'portfolio', user_id: user.id };
          break;
        case 'PhD Paper':
          uploadData = { ...phdData, type: 'phd', user_id: user.id };
          break;
      }

      await api.createProject(uploadData);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError('Failed to upload content');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const renderUploadForm = () => {
    switch (uploadType) {
      case 'Project':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={projectData.title}
                onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Describe your project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
              <div className="mt-1 space-y-2">
                {projectData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...projectData.tags];
                        newTags[index] = e.target.value;
                        setProjectData({ ...projectData, tags: newTags });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Enter technology"
                    />
                    {index === projectData.tags.length - 1 && (
                      <Button
                        onClick={() => setProjectData({ ...projectData, tags: [...projectData.tags, ''] })}
                        variant="secondary"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub Repository URL</label>
              <input
                type="url"
                value={projectData.github_link}
                onChange={(e) => setProjectData({ ...projectData, github_link: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="https://github.com/username/repository"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={projectData.price}
                onChange={(e) => setProjectData({ ...projectData, price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Files</label>
              <div 
                {...getRootProps()} 
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary-500 transition-colors cursor-pointer bg-gray-50"
              >
                <input {...getInputProps()} />
                <div className="space-y-1">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your project files here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500">
                    (ZIP, RAR, or PDF files up to 50MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Portfolio':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Portfolio form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Developer Bio</label>
              <textarea
                value={portfolioData.developerBio}
                onChange={(e) => setPortfolioData({ ...portfolioData, developerBio: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <div className="mt-1 space-y-2">
                {portfolioData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...portfolioData.skills];
                        newSkills[index] = e.target.value;
                        setPortfolioData({ ...portfolioData, skills: newSkills });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Enter skill"
                    />
                    {index === portfolioData.skills.length - 1 && (
                      <Button
                        onClick={() => setPortfolioData({ ...portfolioData, skills: [...portfolioData.skills, ''] })}
                        variant="secondary"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Portfolio Files</label>
              <div 
                {...getRootProps()} 
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary-500 transition-colors cursor-pointer bg-gray-50"
              >
                <input {...getInputProps()} />
                <div className="space-y-1">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Upload your portfolio files
                  </p>
                  <p className="text-xs text-gray-500">
                    (PDF or Image files)
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PhD Paper':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* PhD Paper form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Paper Title</label>
              <input
                type="text"
                value={phdData.title}
                onChange={(e) => setPhdData({ ...phdData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter paper title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Abstract</label>
              <textarea
                value={phdData.abstract}
                onChange={(e) => setPhdData({ ...phdData, abstract: e.target.value })}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter paper abstract"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">PDF Upload</label>
              <div 
                {...getRootProps()} 
                className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary-500 transition-colors cursor-pointer bg-gray-50"
              >
                <input {...getInputProps()} />
                <div className="space-y-1">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Upload your PhD paper
                  </p>
                  <p className="text-xs text-gray-500">
                    (PDF format only)
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
              <div className="flex items-center space-x-2">
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as UploadType)}
                  className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="Project">Project</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="PhD Paper">PhD Paper</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderUploadForm()}

              <div className="mt-8">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                  leftIcon={<Upload className="h-5 w-5" />}
                >
                  Upload {uploadType}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={handleCloseSuccessModal}
        className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Upload Successful!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your {uploadType.toLowerCase()} has been submitted for review. Our admin team will verify it within 24 hours.
            </p>
            <div className="mt-6">
              <Button onClick={handleCloseSuccessModal} fullWidth>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadProject;
