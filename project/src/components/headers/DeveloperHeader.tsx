import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Settings, Upload, Code, GraduationCap, Briefcase } from 'lucide-react';
import RiseLogo from '../RiseLogo';

interface DeveloperHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DeveloperHeader: React.FC<DeveloperHeaderProps> = ({ userName, onLogout }) => {
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
            <Link to="/dashboard" className="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/my-projects" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <Code className="h-4 w-4 mr-1" />
              My Projects
            </Link>
            <Link to="/assignments" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <Briefcase className="h-4 w-4 mr-1" />
              Assignments
            </Link>
            <Link to="/research" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <GraduationCap className="h-4 w-4 mr-1" />
              Research
            </Link>
            <Link to="/upload" className="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
              <Upload className="h-4 w-4 mr-1" />
              Upload Project
            </Link>
            <div className="relative ml-3 flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{userName}</span>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DeveloperHeader;
