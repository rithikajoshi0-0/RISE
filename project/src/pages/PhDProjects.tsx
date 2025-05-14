import React, { useState } from 'react';
import { GraduationCap, Search, Filter, Download, Eye, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Modal from 'react-modal';

interface PhDProject {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  university: string;
  year: number;
  isPeerReviewed: boolean;
  price: number;
  rating: number;
  reviews: number;
  tags: string[];
  previewUrl: string;
}

const mockProjects: PhDProject[] = [
  {
    id: '1',
    title: 'Optimizing Deep Learning Models for Climate Forecasting',
    abstract: 'This research presents a novel approach to climate forecasting using advanced deep learning models. We propose a hybrid architecture that combines transformer networks with traditional meteorological data processing to improve long-term weather prediction accuracy.',
    domain: 'Artificial Intelligence',
    university: 'Stanford University',
    year: 2023,
    isPeerReviewed: true,
    price: 299,
    rating: 4.8,
    reviews: 12,
    tags: ['Deep Learning', 'Climate Science', 'IEEE Certified', 'Peer Reviewed'],
    previewUrl: 'https://example.com/preview/1'
  },
  {
    id: '2',
    title: 'Quantum Computing Applications in Cryptography',
    abstract: 'An investigation into the implications of quantum computing on modern cryptographic systems. This research explores post-quantum cryptography methods and proposes new algorithms resistant to quantum attacks.',
    domain: 'Quantum Computing',
    university: 'MIT',
    year: 2024,
    isPeerReviewed: true,
    price: 349,
    rating: 4.9,
    reviews: 8,
    tags: ['Quantum Computing', 'Cryptography', 'ACM Published', 'Peer Reviewed'],
    previewUrl: 'https://example.com/preview/2'
  }
];

const domains = [
  'Artificial Intelligence',
  'Machine Learning',
  'Quantum Computing',
  'Cybersecurity',
  'Data Science',
  'Blockchain',
  'Internet of Things',
  'Robotics',
  'Natural Language Processing'
];

const PhDProjects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [yearRange, setYearRange] = useState<[number, number]>([2020, 2025]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [peerReviewedOnly, setPeerReviewedOnly] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PhDProject | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePreview = (project: PhDProject) => {
    setSelectedProject(project);
    setShowPreviewModal(true);
  };

  const handlePurchase = (project: PhDProject) => {
    setSelectedProject(project);
    setShowTermsModal(true);
  };

  const handleConfirmPurchase = () => {
    // Handle purchase logic here
    setShowTermsModal(false);
    // Show success message or redirect to payment
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = !selectedDomain || project.domain === selectedDomain;
    const matchesYear = project.year >= yearRange[0] && project.year <= yearRange[1];
    const matchesPrice = project.price >= priceRange[0] && project.price <= priceRange[1];
    const matchesPeerReview = !peerReviewedOnly || project.isPeerReviewed;

    return matchesSearch && matchesDomain && matchesYear && matchesPrice && matchesPeerReview;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <GraduationCap className="mx-auto h-12 w-12 text-primary-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            PhD Research Projects
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Access peer-reviewed academic research and doctoral projects
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                {/* Domain Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Fields</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                {/* Year Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="2020"
                      max="2025"
                      value={yearRange[0]}
                      onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min="2020"
                      max="2025"
                      value={yearRange[1]}
                      onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range ($)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Peer Review Filter */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={peerReviewedOnly}
                      onChange={(e) => setPeerReviewedOnly(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Peer-reviewed only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredProjects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{project.university} • {project.year}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-yellow-400 mr-1">⭐</span>
                        <span className="font-medium">{project.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({project.reviews})</span>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-600 line-clamp-3">{project.abstract}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${project.price}</span>
                      <div className="flex space-x-4">
                        <Button
                          variant="secondary"
                          onClick={() => handlePreview(project)}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          Preview
                        </Button>
                        <Button
                          onClick={() => handlePurchase(project)}
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreviewModal}
          onRequestClose={() => setShowPreviewModal(false)}
          className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Preview: {selectedProject?.title}
              </h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
            <div 
              className="relative bg-gray-100 rounded-lg overflow-hidden p-6"
              onContextMenu={e => e.preventDefault()}
              style={{ userSelect: 'none' }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="text-gray-400 transform rotate-45 text-9xl opacity-10"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  PREVIEW ONLY
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-4">Abstract</h3>
                <p className="text-gray-600">{selectedProject?.abstract}</p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Terms Modal */}
        <Modal
          isOpen={showTermsModal}
          onRequestClose={() => setShowTermsModal(false)}
          className="max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Terms & Conditions</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This content is protected by copyright and is subject to strict usage terms.
                        Misuse may result in legal action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <p>By purchasing this research paper, you agree to the following terms:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Content is for personal reference and research purposes only</li>
                  <li>No redistribution or resale is permitted</li>
                  <li>No plagiarism or academic misconduct</li>
                  <li>One-time download link that expires after use</li>
                  <li>All usage is logged and tracked</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowTermsModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPurchase}
              >
                Accept & Purchase
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PhDProjects;
