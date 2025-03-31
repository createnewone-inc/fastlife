import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../../services/api';
import { FaBell, FaImage, FaGlobe, FaSave } from 'react-icons/fa';
import './UserSettings.css';

const UserSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    notifications_enabled: true,
    auto_background: true,
    language: 'ja'
  });

  // 言語オプション
  const languageOptions = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getUserSettings();
        setSettings(response.data);
        setFormData({
          notifications_enabled: response.data.notifications_enabled,
          auto_background: response.data.auto_background,
          language: response.data.language
        });
      } catch (err) {
        setError('設定の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await updateUserSettings(formData);
      setSettings(response.data);
      alert('設定を保存しました');
    } catch (err) {
      setError('設定の保存に失敗しました');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner">読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>アプリケーション設定</h2>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-section">
          <div className="section-title">
            <FaBell />
            <h3>通知設定</h3>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>通知</h4>
              <p>アプリケーションからの通知を受け取る</p>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formData.notifications_enabled}
                  onChange={() => handleToggleChange('notifications_enabled')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-title">
            <FaImage />
            <h3>表示設定</h3>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>背景画像の自動変更</h4>
              <p>ログインするたびに背景画像を変更する</p>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formData.auto_background}
                  onChange={() => handleToggleChange('auto_background')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-title">
            <FaGlobe />
            <h3>言語設定</h3>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>表示言語</h4>
              <p>アプリケーションの表示言語を選択する</p>
            </div>
            <div className="setting-control">
              <select
                name="language"
                value={formData.language}
                onChange={handleSelectChange}
                className="language-select"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? (
              <>保存中...</>
            ) : (
              <>
                <FaSave /> 設定を保存
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings; 