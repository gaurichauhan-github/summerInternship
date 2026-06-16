import { AUTH_TOKEN_KEY } from '../constants/config.js';

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
