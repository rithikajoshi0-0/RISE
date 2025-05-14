import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-gray-900">RISE</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Empowering innovation through research and collaboration. Your trusted platform for academic and professional project solutions.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Solutions
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/portfolios" className="text-gray-600 hover:text-primary-500 text-sm">
                  Developer Portfolios
                </Link>
              </li>
              <li>
                <Link to="/phd-projects" className="text-gray-600 hover:text-primary-500 text-sm">
                  PhD Research Projects
                </Link>
              </li>
              <li>
                <Link to="/custom-projects" className="text-gray-600 hover:text-primary-500 text-sm">
                  Custom Development
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-primary-500 text-sm">
                  Join as Developer
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} RISE - Research Innovation Solutions Exchange. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://github.com/rise-platform" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com/riseplatform" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com/company/rise-platform" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
