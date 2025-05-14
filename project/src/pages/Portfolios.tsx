import React, { useState } from 'react';
import { Briefcase, Search, Star, Eye, Lock, Download } from 'lucide-react';
import Button from '../components/Button';
import Modal from 'react-modal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Portfolio {
  id: string;
  title: string;
  tagline: string;
  image: string;
  screenshots: string[];
  livePreviewUrl: string;
  price: number;
  rating: number;
  tags: string[];
  techStack: string[];
  designType: string;
  useCase: string;
}

const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    title: 'Modern UX Designer Portfolio',
    tagline: 'Built with React + Tailwind',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    screenshots: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
      'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg'
    ],
    livePreviewUrl: 'https://example.com/preview/1',
    price: 49,
    rating: 4.8,
    tags: ['Responsive', 'UI/UX', 'Personal Branding'],
    techStack: ['React', 'Tailwind CSS', 'Framer Motion'],
    designType: 'Minimal',
    useCase: 'Designer'
  },
  {
    id: '2',
    title: 'Developer Portfolio Pro',
    tagline: 'Clean & Professional Design',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    screenshots: [
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg'
    ],
    livePreviewUrl: 'https://example.com/preview/2',
    price: 39,
    rating: 4.6,
    tags: ['Code Projects', 'Blog Ready', 'Dark Mode'],
    techStack: ['Next.js', 'TypeScript', 'Styled Components'],
    designType: 'Dark Theme',
    useCase: 'Developer'
  },
  {
    id: '3',
    title: 'Creative Photography Portfolio',
    tagline: 'Stunning Image Galleries',
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
    screenshots: [
      'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg'
    ],
    livePreviewUrl: 'https://example.com/preview/3',
    price: 29,
    rating: 4.7,
    tags: ['Gallery', 'Animations', 'Contact Form'],
    techStack: ['HTML/CSS', 'JavaScript', 'Lightbox'],
    designType: 'Animated',
    useCase: 'Photographer'
  }
];

Modal.setAppElement('#root');

const Portfolios: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedDesignType, setSelectedDesignType] = useState<string>('');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  const techStackOptions = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'JavaScript'];
  const designTypeOptions = ['Minimal', 'Animated', 'Dark Theme', 'Corporate'];
  const useCaseOptions = ['Developer', 'Designer', 'Freelancer', 'Photographer'];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  const filteredPortfolios = mockPortfolios.filter(portfolio => {
    const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = portfolio.price >= priceRange[0] && portfolio.price <= priceRange[1];
    const matchesTechStack = selectedTechStack.length === 0 || 
                            selectedTechStack.some(tech => portfolio.techStack.includes(tech));
    const matchesDesignType = !selectedDesignType || portfolio.designType === selectedDesignType;
    const matchesUseCase = !selectedUseCase || portfolio.useCase === selectedUseCase;

    return matchesSearch && matchesPrice && matchesTechStack && matchesDesignType && matchesUseCase;
  });

  const openPreview = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setPreviewModalOpen(true);
  };

  const openScreenshots = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowScreenshotModal(true);
  };

  const preventCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Briefcase className="mx-auto h-12 w-12 text-primary-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Developer Portfolios
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Discover professional portfolio templates designed for developers, designers, and creatives
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-6">
                {/* Tech Stack Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tech Stack</h3>
                  <div className="space-y-2">
                    {techStackOptions.map(tech => (
                      <label key={tech} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTechStack.includes(tech)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTechStack([...selectedTechStack, tech]);
                            } else {
                              setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
                            }
                          }}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-600">{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Design Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Design Type</h3>
                  <select
                    value={selectedDesignType}
                    onChange={(e) => setSelectedDesignType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Types</option>
                    {designTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Use Case Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Use Case</h3>
                  <select
                    value={selectedUseCase}
                    onChange={(e) => setSelectedUseCase(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Use Cases</option>
                    {useCaseOptions.map(useCase => (
                      <option key={useCase} value={useCase}>{useCase}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
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
                  placeholder="Search portfolios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map(portfolio => (
                <div key={portfolio.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={portfolio.image}
                      alt={portfolio.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openScreenshots(portfolio)}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          Screenshots
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openPreview(portfolio)}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          Live Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{portfolio.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{portfolio.tagline}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {portfolio.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {portfolio.rating}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ${portfolio.price}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        fullWidth
                        leftIcon={<Download className="h-4 w-4" />}
                      >
                        Purchase & Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onRequestClose={() => setPreviewModalOpen(false)}
        className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Live Preview: {selectedPortfolio?.title}
            </h2>
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div 
            className="relative bg-gray-100 rounded-lg overflow-hidden"
            onContextMenu={e => e.preventDefault()}
            onCopy={preventCopyPaste}
            onPaste={preventCopyPaste}
            onCut={preventCopyPaste}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-gray-400 transform rotate-45 text-9xl opacity-10">
                PREVIEW ONLY
              </div>
            </div>
            <iframe
              src={selectedPortfolio?.livePreviewUrl}
              className="w-full h-[600px]"
              sandbox="allow-same-origin allow-scripts"
              title="Portfolio Preview"
            />
          </div>
        </div>
      </Modal>

      {/* Screenshots Modal */}
      <Modal
        isOpen={showScreenshotModal}
        onRequestClose={() => setShowScreenshotModal(false)}
        className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Screenshots: {selectedPortfolio?.title}
            </h2>
            <button
              onClick={() => setShowScreenshotModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div 
            className="relative bg-gray-100 rounded-lg overflow-hidden"
            onContextMenu={e => e.preventDefault()}
          >
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="h-full w-full flex items-center justify-center">
                <div 
                  className="text-white text-2xl font-bold opacity-50 transform rotate-45"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  RISE - Sample Preview Only
                </div>
              </div>
            </div>
            <Slider {...sliderSettings}>
              {selectedPortfolio?.screenshots.map((screenshot, index) => (
                <div key={index} className="relative">
                  <img
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-[600px] object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Portfolios;
