// src/views/HomeView.tsx
import React, { FC } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './HomeView.css';

const HomeView: FC = () => {
  const { setUser } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Token response:', tokenResponse); // デバッグ用

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
        console.log('Received user info:', userInfo); // デバッグ用

        if (!userInfo.name || !userInfo.email) {
          throw new Error('Invalid user info received');
        }

        const user = {
          displayName: userInfo.name,
          email: userInfo.email,
          photoURL: userInfo.picture || ''
        };

        console.log('Setting user:', user); // デバッグ用
        setUser(user);

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

  return (
    <div className="home-view">
      {/* 背景アニメーション用のコンテナ */}
      <div className="bg-container">
        <div className="bg-image bg1"></div>
        <div className="bg-image bg2"></div>
        <div className="bg-image bg3"></div>
        <div className="bg-image bg4"></div>
      </div>
      {/* 半透明オーバーレイ */}
      <div className="overlay">
        <div className="content">
          <h1 className="title">FastLife へようこそ</h1>
          <p className="subtitle">
            ファスティングで健康に。<br />
            ログインして、あなたの進捗を管理しましょう。
          </p>
          <button 
            className="google-login-btn" 
            onClick={() => {
              console.log('Login button clicked'); // デバッグ用
              login();
            }}
          >
            <img
              src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
              alt="Google Logo"
              className="google-logo"
            />
            Googleでログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
