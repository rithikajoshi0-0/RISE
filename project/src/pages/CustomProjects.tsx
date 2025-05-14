import React from 'react';
import { Settings } from 'lucide-react';

const CustomProjects: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-primary-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Custom Project Requests
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Request custom projects tailored to your specific needs
          </p>
        </div>

        {/* Content will be added in the next iteration */}
        <div className="mt-12 bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">Custom project request form coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default CustomProjects;
