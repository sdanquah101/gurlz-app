import React from 'react';
import { X } from 'lucide-react';
import AnalyticsView from './AnalyticsView';
import ResourcesView from './ResourcesView';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'analytics' | 'resources';
  onTabChange: (tab: 'analytics' | 'resources') => void;
  className?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className={`animate-slideIn ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'analytics'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onTabChange('resources')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'resources'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resources
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transform transition-transform hover:scale-110"
          aria-label="Close panel"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Panel Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
        {activeTab === 'analytics' ? (
          <AnalyticsView />
        ) : (
          <ResourcesView />
        )}
      </div>
    </div>
  );
};

export default SidePanel;