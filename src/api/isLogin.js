'use strict';

import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;

const isLogin = async () => {
  let refreshToken;

  // refreshToken을 localStorage 또는 sessionStorage에서 가져옴
  if (localStorage.getItem('refreshToken')) {
    refreshToken = localStorage.getItem('refreshToken');
  } else {
    refreshToken = sessionStorage.getItem('refreshToken');
  }

  // refreshToken이 없을 경우 false 반환
  if (!refreshToken) {
    console.error('refresh token을 찾을 수 없습니다.');
    return false;
  }

  try {
    const response = await axios.get(`${apiUrl}/auth/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientId,
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    // 응답에서 새로운 accessToken 받아서 저장
    const newAccessToken = response.data.accessToken;

    // 새로운 토큰을 저장
    if (localStorage.getItem('refreshToken')) {
      localStorage.setItem('accessToken', newAccessToken);
    } else {
      sessionStorage.setItem('accessToken', newAccessToken);
    }

    return true;
  } catch (err) {
    // storage 정리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('image');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('authorId');
    localStorage.removeItem('posts');
    localStorage.removeItem('id');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('image');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('id');
    console.error('Token refresh failed:', err);
    return false;
  }
};

export default isLogin;
