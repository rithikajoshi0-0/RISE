import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, GraduationCap, Code } from 'lucide-react';
import RiseLogo from '../RiseLogo';

const GuestHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <RiseLogo />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              Projects
            </Link>
            <Link to="/portfolios" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <Settings className="h-4 w-4 mr-1" />
              Portfolios
            </Link>
            <Link to="/phd-projects" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <GraduationCap className="h-4 w-4 mr-1" />
              PhD Projects
            </Link>
            <Link to="/custom-projects" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <Code className="h-4 w-4 mr-1" />
              Custom Projects
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;
