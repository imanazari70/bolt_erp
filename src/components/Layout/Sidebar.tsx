import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  Mail, 
  MessageCircle, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/staff', icon: Users, label: 'Staff' },
  { path: '/projects', icon: FolderOpen, label: 'Projects' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/timesheets', icon: Clock, label: 'Timesheets' },
  { path: '/mails', icon: Mail, label: 'Mails' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
];

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold">ERP System</h1>
          )}
        </div>
      </div>

      <nav className="mt-8">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="px-2">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;