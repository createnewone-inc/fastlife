import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// ユーザープロフィール
export const getUserProfile = () => api.get('/profile');
export const updateUserProfile = (data) => api.put('/profile', data);

// ユーザー設定
export const getUserSettings = () => api.get('/settings');
export const updateUserSettings = (data) => api.put('/settings', data);

// 通知
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');

// コース
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getUserCourses = () => api.get('/courses/user/my-courses');
export const getActiveCourse = () => api.get('/courses/user/active');
export const enrollCourse = (data) => api.post('/courses/user/enroll', data);
export const updateUserCourse = (id, data) => api.put(`/courses/user/${id}`, data);

// 日次ログ
export const addDailyLog = (userCourseId, data) => api.post(`/courses/user/${userCourseId}/logs`, data);
export const getDailyLogs = (userCourseId) => api.get(`/courses/user/${userCourseId}/logs`);

// 背景画像
export const getRandomBackgroundImage = () => api.get('/background-image');

// 認証関連
export const getAuthUser = () => api.get('/auth/user');
export const logoutUser = () => api.get('/auth/logout');

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 認証切れの場合はリダイレクト
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 