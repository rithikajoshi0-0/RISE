import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, GraduationCap, MessageSquare, Users, Download } from 'lucide-react';
import RiseLogo from '../RiseLogo';

interface PhDAdminHeaderProps {
  onLogout: () => void;
}

const PhDAdminHeader: React.FC<PhDAdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/admin/phd" className="flex items-center">
            <RiseLogo />
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/admin/phd"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <GraduationCap className="h-4 w-4 mr-1" />
              PhD Paper Reviews
            </Link>
            <Link
              to="/admin/research-requests"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Research Requests
            </Link>
            <Link
              to="/admin/researcher-matching"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Users className="h-4 w-4 mr-1" />
              Researcher Matching
            </Link>
            <Link
              to="/admin/research-deliverables"
              className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Research Deliverables
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

export default PhDAdminHeader;
