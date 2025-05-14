import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../lib/supabase';
import { Bookmark, Eye } from 'lucide-react';
import Button from './Button';
import Modal from 'react-modal';
import CodePreview from './CodePreview';

interface ProjectCardProps {
  project: Project;
  formatPrice: (price: number) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, formatPrice }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-500">{project.domain}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {project.price === 0 ? 'Free' : formatPrice(project.price)}
        </span>
        <div className="flex space-x-2">
          {project.hasPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreview(true)}
              leftIcon={<Eye className="h-4 w-4" />}
            >
              Preview
            </Button>
          )}
          <Link
            to={`/projects/${project.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      <Modal
        isOpen={showPreview}
        onRequestClose={() => setShowPreview(false)}
        className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Live Preview: {project.title}
            </h2>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <CodePreview projectId={project.id} language={project.language} />
        </div>
      </Modal>
    </div>
  );
};

export default ProjectCard;