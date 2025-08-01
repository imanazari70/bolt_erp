import React from 'react';
import { Menu, Bell, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">داشبورد ERP</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            title={isDark ? 'حالت روز' : 'حالت شب'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;