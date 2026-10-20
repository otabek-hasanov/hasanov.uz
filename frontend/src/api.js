const cache = new Map();

async function request(path, options = {}) {
  const res = await fetch('/api' + path, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    const error = new Error((data && data.message) || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function get(path, { fresh = false } = {}) {
  if (!fresh && cache.has(path)) return cache.get(path);
  const promise = request(path).then((d) => d.data ?? d);
  promise.catch(() => cache.delete(path));
  cache.set(path, promise);
  return promise;
}

export function invalidate(prefix) {
  [...cache.keys()].forEach((key) => {
    if (key.startsWith(prefix)) cache.delete(key);
  });
}

let csrfToken = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const data = await request('/csrf');
  csrfToken = data.token;
  return csrfToken;
}

export function setCsrfToken(token) {
  csrfToken = token;
}

export async function postJson(path, body) {
  const token = await getCsrfToken();
  return request(path, {
    method: 'POST',
    headers: { 'X-CSRF-Token': token },
    body: JSON.stringify(body),
  });
}

export async function postForm(path, formData) {
  const token = await getCsrfToken();
  return request(path, {
    method: 'POST',
    headers: { 'X-CSRF-Token': token },
    body: formData,
  });
}

export async function del(path) {
  const token = await getCsrfToken();
  return request(path, {
    method: 'DELETE',
    headers: { 'X-CSRF-Token': token },
  });
}

export { request };
