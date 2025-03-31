import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaDesktop, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import './LoginHistory.css';

// このコンポーネントは実際のAPIが実装されたら接続する予定です
// 現在はダミーデータを使用しています
const LoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    // 実際のAPIが実装されたらここで取得します
    // 現在はダミーデータを使用
    const fetchLoginHistory = async () => {
      try {
        setLoading(true);
        // モックデータ
        const mockData = [
          {
            id: 1,
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            login_at: '2023-05-15T08:30:45Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            location: '東京, 日本'
          },
          {
            id: 2,
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            login_at: '2023-05-14T18:12:30Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
            location: '東京, 日本'
          },
          {
            id: 3,
            user_id: 2,
            username: 'admin_user',
            email: 'admin@example.com',
            login_at: '2023-05-15T10:45:22Z',
            ip_address: '192.168.2.2',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            location: '大阪, 日本'
          },
          {
            id: 4,
            user_id: 3,
            username: 'john_doe',
            email: 'john@example.com',
            login_at: '2023-05-13T09:20:15Z',
            ip_address: '192.168.3.3',
            user_agent: 'Mozilla/5.0 (Linux; Android 11)',
            location: '名古屋, 日本'
          },
          {
            id: 5,
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            login_at: '2023-05-12T14:05:50Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            location: '東京, 日本'
          }
        ];
        
        setLoginHistory(mockData);
      } catch (err) {
        setError('ログイン履歴の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  // 検索とフィルタリング
  const filteredHistory = loginHistory.filter(item => {
    const matchesSearch = 
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ip_address.includes(searchTerm) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = filterDate ? 
      new Date(item.login_at).toISOString().split('T')[0] === filterDate : true;
    
    return matchesSearch && matchesDate;
  });

  // 日付と時刻のフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // デバイスタイプの判定
  const getDeviceType = (userAgent) => {
    if (userAgent.includes('iPhone') || userAgent.includes('Android')) {
      return 'モバイル';
    } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
      return 'タブレット';
    } else {
      return 'デスクトップ';
    }
  };

  if (loading) return <div className="loading-spinner">履歴を読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="login-history-container">
      <h2 className="history-title">ログイン履歴</h2>
      
      <div className="history-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="ユーザー名、メール、IPアドレスで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="date-filter">
          <label>日付で絞り込み:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="date-input"
          />
          {filterDate && (
            <button 
              className="clear-filter" 
              onClick={() => setFilterDate('')}
            >
              クリア
            </button>
          )}
        </div>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="no-results">
          検索条件に一致する履歴がありません
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ユーザー</th>
                <th>ログイン日時</th>
                <th>IPアドレス</th>
                <th>デバイス</th>
                <th>場所</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(item => (
                <tr key={item.id}>
                  <td className="user-cell">
                    <div className="username">{item.username}</div>
                    <div className="email">{item.email}</div>
                  </td>
                  <td className="datetime-cell">
                    <div className="date">
                      <FaCalendarAlt />
                      {formatDate(item.login_at)}
                    </div>
                    <div className="time">
                      <FaClock />
                      {formatTime(item.login_at)}
                    </div>
                  </td>
                  <td>{item.ip_address}</td>
                  <td className="device-cell">
                    <FaDesktop />
                    {getDeviceType(item.user_agent)}
                  </td>
                  <td className="location-cell">
                    <FaMapMarkerAlt />
                    {item.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoginHistory; 