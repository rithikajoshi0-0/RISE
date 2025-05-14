import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Briefcase, MessageSquare, Users, Download } from 'lucide-react';
import RiseLogo from '../RiseLogo';

interface PortfolioAdminHeaderProps {
  onLogout: () => void;
}

const PortfolioAdminHeader: React.FC<PortfolioAdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/admin/portfolios" className="flex items-center">
            <RiseLogo />
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/admin/portfolios"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Portfolio Reviews
            </Link>
            <Link
              to="/admin/portfolio-requests"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Custom Requests
            </Link>
            <Link
              to="/admin/developer-assignments"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Users className="h-4 w-4 mr-1" />
              Developer Assignments
            </Link>
            <Link
              to="/admin/deliverables"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Deliverables
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

export default PortfolioAdminHeader;
