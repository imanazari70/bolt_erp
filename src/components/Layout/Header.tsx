import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-xl font-semibold text-slate-800">ERP Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <User className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;