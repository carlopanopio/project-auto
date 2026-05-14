const KEY = 'ah_token';

export function saveToken(token) {
  localStorage.setItem(KEY, token);
}

export function getToken() {
  return localStorage.getItem(KEY);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  try {
    const [, payload] = token.split('.');
    const { exp } = JSON.parse(atob(payload));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}
