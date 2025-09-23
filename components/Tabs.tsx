'use client';

import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export default function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-3 px-4 md:py-4 md:px-6 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 rounded-t-lg ${
                  isActive
                    ? 'border-[#296AFF] text-white bg-[#0B0B0C]'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-8">
        {activeTabContent}
      </div>
    </div>
  );
}
