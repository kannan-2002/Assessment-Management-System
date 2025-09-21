import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  User,
  Activity
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assessment-types', label: 'Assessment Types', icon: FileText },
    { path: '/create-assessment', label: 'Create Assessment', icon: PlusCircle }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800">AssessmentPro</span>
              <span className="text-xs text-slate-500 -mt-1">Management System</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg">
                <User className="h-4 w-4 text-slate-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">{user?.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-slate-200 py-2">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;