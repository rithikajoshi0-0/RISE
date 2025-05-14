import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Package, MessageSquare, Users, Briefcase, GraduationCap } from 'lucide-react';
import RiseLogo from '../RiseLogo';

interface ProjectAdminHeaderProps {
  onLogout: () => void;
}

const ProjectAdminHeader: React.FC<ProjectAdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/admin/projects" className="flex items-center">
            <RiseLogo />
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/admin/projects"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Package className="h-4 w-4 mr-1" />
              Project Reviews
            </Link>
            <Link
              to="/admin/custom-projects"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Custom Projects
            </Link>
            <Link
              to="/admin/developer-matching"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Users className="h-4 w-4 mr-1" />
              Developer Matching
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ProjectAdminHeader;
