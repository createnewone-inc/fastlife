// src/components/GoogleAuth.tsx
import { FC } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './GoogleAuth.css';

const GoogleAuth: FC = () => {
  const { user, setUser } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Accept': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user info: ${response.status}`);
        }

        const userInfo = await response.json();
        setUser({
          displayName: userInfo.name,
          email: userInfo.email,
          photoURL: userInfo.picture || ''
        });
      } catch (error) {
        console.error('Error during authentication:', error);
        alert('ログインに失敗しました。もう一度お試しください。');
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  });

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      googleLogout();
      setUser(null);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <p className="auth-message">Googleアカウントでログインしてください</p>
        <button className="google-login-btn" onClick={() => login()}>
          <img
            src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
            alt="Google Logo"
            className="google-logo"
          />
          Googleでログイン
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="user-info">
        <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
        <div className="user-details">
          <p className="user-name">{user.displayName}</p>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">
        ログアウト
      </button>
    </div>
  );
};

export default GoogleAuth;
