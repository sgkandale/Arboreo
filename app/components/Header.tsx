import { Search, Users, Calendar, Moon, Sun, ChevronDown, BarChart3, TreePine, Bell, LogOut, Upload, Download } from 'lucide-react';
import { ViewMode } from '../types/FamilyTree';
import { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onEventsToggle: () => void;
  onLogout: () => void;
  onImport: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  darkMode,
  onDarkModeToggle,
  onEventsToggle,
  onLogout,
  onImport,
  onExport,
}) => {
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [importExportDropdownOpen, setImportExportDropdownOpen] = useState(false);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const importExportDropdownRef = useRef<HTMLDivElement>(null);

  const viewOptions = [
    { value: 'graph', label: 'Graph View', icon: Users },
    { value: 'timeline', label: 'Timeline View', icon: Calendar },
    { value: 'generational', label: 'Generational Chart', icon: TreePine },
    { value: 'dashboard', label: 'Statistics Dashboard', icon: BarChart3 }
  ];

  const currentView = viewOptions.find(option => option.value === viewMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target as Node)) {
        setViewDropdownOpen(false);
      }
      if (importExportDropdownRef.current && !importExportDropdownRef.current.contains(event.target as Node)) {
        setImportExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-purple-600" />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Family Tree</h1>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 pr-4 py-2 w-80 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="relative" ref={viewDropdownRef}>
            <button
              onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              {currentView && <currentView.icon className="w-4 h-4" />}
              <span>{currentView?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {viewDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 border rounded-lg shadow-lg z-50 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}>
                {viewOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onViewModeChange(option.value as ViewMode);
                      setViewDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      viewMode === option.value
                        ? `${darkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-50 text-purple-600'}`
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={importExportDropdownRef}>
            <button
              onClick={() => setImportExportDropdownOpen(!importExportDropdownOpen)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Import/Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {importExportDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 border rounded-lg shadow-lg z-50 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}>
                <button
                  onClick={() => { onImport(); setImportExportDropdownOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Import GEDCOM</span>
                </button>
                <button
                  onClick={() => { onExport(); setImportExportDropdownOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export GEDCOM</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onEventsToggle}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
            }`}
            title="Upcoming Events"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={onDarkModeToggle}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onLogout}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-red-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-red-600 hover:bg-gray-200'
            }`}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}