import axios from 'axios';

export const publicAxios = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPrivateAxios = (username: string, password: string) => {
  return axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
    auth: {
      username,
      password,
    },
  });
};
