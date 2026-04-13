'use client';

import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const apiToken = {
  set: (token: string) => {
    localStorage.setItem('token', token);
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  },
  delete: () => {
    localStorage.removeItem('token');
    api.defaults.headers['Authorization'] = '';
  },
  get: () => {
    localStorage.getItem('token');
  },
};

(() => {
  if (typeof localStorage != 'undefined') {
    const token = localStorage.getItem('token');
    if (token) apiToken.set(token);
  }
})();