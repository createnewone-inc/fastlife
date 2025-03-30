// src/components/TabMenu.tsx
import React from 'react';

interface TabMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// "start" タブを削除して、"manage" と "settings" のみを使用する
const tabs = [
  { id: 'manage', label: '管理' },
  { id: 'settings', label: '設定' }
];

const TabMenu: React.FC<TabMenuProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-menu">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
