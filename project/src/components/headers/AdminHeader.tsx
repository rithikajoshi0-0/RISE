import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import RiseLogo from '../RiseLogo';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/admin" className="flex items-center">
            <RiseLogo />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin Panel</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
