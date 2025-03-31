import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api';
import { FaBell, FaCheckDouble, FaExclamationCircle, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import './NotificationList.css';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      setError('通知の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      // 通知の状態を更新
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, is_read: true } : notif
      ));
    } catch (err) {
      console.error('通知の既読処理に失敗しました', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      // すべての通知を既読に
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
    } catch (err) {
      console.error('全通知の既読処理に失敗しました', err);
    }
  };

  // 未読の通知数をカウント
  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  // 通知のアイコンを取得
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'alert':
        return <FaExclamationCircle className="notification-icon alert" />;
      case 'reminder':
        return <FaCalendarAlt className="notification-icon reminder" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info" />;
      default:
        return <FaBell className="notification-icon default" />;
    }
  };

  // 日付を整形
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading-spinner">通知を読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>通知一覧</h2>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
        
        {notifications.length > 0 && unreadCount > 0 && (
          <button 
            className="mark-all-read-button"
            onClick={handleMarkAllAsRead}
          >
            <FaCheckDouble /> すべて既読にする
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          通知はありません
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
            >
              {getNotificationIcon(notification.type)}
              
              <div className="notification-content">
                <div className="notification-text">
                  {notification.content}
                </div>
                <div className="notification-time">
                  {formatDate(notification.created_at)}
                </div>
              </div>
              
              {!notification.is_read && (
                <div className="notification-status">
                  <span className="unread-dot"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList; 