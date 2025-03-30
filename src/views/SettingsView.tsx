// src/views/SettingsView.tsx - Modernized
import React, { FC, useState, useEffect } from 'react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import GoogleAuth from '../components/GoogleAuth';
import './SettingsView.css';

const SettingsView: FC = () => {
  const { setSelectedCourse } = useCourse();
  const { user } = useAuth();
  const [fadeIn, setFadeIn] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setFadeIn(true);
    
    // Load saved notification settings
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setDailyReminder(parsed.dailyReminder || false);
    }
  }, []);

  // Save notification settings
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify({
      dailyReminder
    }));
  }, [dailyReminder]);

  const handleResetCourse = () => {
    if (window.confirm('本当にコースをリセットしますか？全ての記録が削除されます。')) {
      setSelectedCourse(null);
      localStorage.removeItem('weightRecords');
      
      // Show toast message instead of alert
      const toast = document.createElement('div');
      toast.className = 'toast success';
      toast.textContent = 'コースがリセットされました';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  };

  const toggleDailyReminder = () => {
    setDailyReminder(!dailyReminder);
  };

  return (
    <div className={`settings-view ${fadeIn ? 'fade-in' : ''}`}>
      <div className="settings-container">
        <h1 className="settings-title">設定</h1>
        
        <section className="settings-card user-profile">
          <div className="profile-header">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="プロフィール画像" className="profile-image" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
            )}
            <div className="profile-info">
              <h2>{user?.displayName || 'ゲストユーザー'}</h2>
              <p>{user?.email || 'ログインしていません'}</p>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h3 className="section-title">
            <span className="section-icon">🔄</span>
            コース設定
          </h3>
          <div className="settings-content">
            <div className="setting-option">
              <div className="setting-description">
                <h4>コースのリセット</h4>
                <p>全ての進捗と記録を消去し、新しく始めます</p>
              </div>
              <button onClick={handleResetCourse} className="danger-button">
                リセット
              </button>
            </div>
            <p className="warning-text">※この操作は取り消せません</p>
          </div>
        </section>

        <section className="settings-card">
          <h3 className="section-title">
            <span className="section-icon">🔔</span>
            通知設定
          </h3>
          <div className="settings-content">
            <div className="setting-option notification-option">
              <div className="setting-description">
                <h4>毎日のリマインダー</h4>
                <p>トレーニングと体重記録の通知を受け取る</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={dailyReminder}
                  onChange={toggleDailyReminder}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h3 className="section-title">
            <span className="section-icon">👤</span>
            アカウント管理
          </h3>
          <div className="settings-content">
            <GoogleAuth />
          </div>
        </section>
        
        <div className="settings-footer">
          <p>FastingTracker Pro v1.0.0</p>
          <p><a href="#" className="footer-link">プライバシーポリシー</a> • <a href="#" className="footer-link">利用規約</a></p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;