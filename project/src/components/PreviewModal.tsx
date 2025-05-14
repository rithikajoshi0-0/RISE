import React from 'react';
import Modal from 'react-modal';
import CodePreview from './CodePreview';
import { Project } from '../lib/supabase';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, project }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Live Preview: {project.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>
        {project.language && (
          <CodePreview projectId={project.id} language={project.language} />
        )}
      </div>
    </Modal>
  );
};

export default PreviewModal;