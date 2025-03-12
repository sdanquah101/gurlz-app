import React from 'react';
import { motion } from 'framer-motion';
import { Image, MessageCircle, Activity } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwnProfile: boolean;
}

export default function ProfileTabs({ activeTab, onTabChange, isOwnProfile }: ProfileTabsProps) {
  const tabs = [
    { id: 'posts', label: 'Posts', icon: Image },
    ...(isOwnProfile ? [
      { id: 'chats', label: 'Chats', icon: MessageCircle }
    ] : [])
  ];

  return (
    <div className="border-b">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors relative
                ${activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Icon size={18} />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}