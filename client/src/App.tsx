// src/App.tsx
import React from 'react';
import { useState, FC } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import { useCourse } from './context/CourseContext';
import Hero from './components/Hero';
import TabMenu from './components/TabMenu';
import ManageView from './views/ManageView';
import SettingsView from './views/SettingsView';
import HomeView from './views/HomeView';
import CourseDashboard from './components/Dashboard/CourseDashboard';
import LoginHistory from './components/Auth/LoginHistory';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App: FC = () => {
  const { user } = useAuth();
  const { selectedCourse } = useCourse();
  const [activeTab, setActiveTab] = useState<string>('manage');

  // 未ログインなら HomeView を表示
  if (!user) {
    return (
      <BrowserRouter>
        <div className="app">
          <img src="/fastlife/fastlife-logo.svg" alt="FastLife" className="app-logo" />
          <HomeView />
        </div>
      </BrowserRouter>
    );
  }

  // ログイン済みだが、コースが未選択なら Hero を表示してコース選択を促す
  if (!selectedCourse) {
    return (
      <BrowserRouter>
        <div className="app">
          <img src="/fastlife/fastlife-logo.svg" alt="FastLife" className="app-logo" />
          <Hero />
        </div>
      </BrowserRouter>
    );
  }

  // コース選択済みの場合は、タブメニューにより「管理」と「設定」のコンテンツを表示
  const renderTabContent = () => {
    switch (activeTab) {
      case 'manage':
        return <ManageView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ManageView />;
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <img src="/fastlife/fastlife-logo.svg" alt="FastLife" className="app-logo" />
        
        <Routes>
          <Route path="/dashboard" element={<CourseDashboard />} />
          <Route path="/login-history" element={<LoginHistory />} />
          <Route path="/" element={
            <>
              <div className="tab-content">{renderTabContent()}</div>
              <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
