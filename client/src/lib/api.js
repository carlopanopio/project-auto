const BASE = '/api';

function getToken() {
  return localStorage.getItem('ah_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

// Public
export const getServices = () => request('/services');
export const getProjects = () => request('/projects');
export const getTestimonials = () => request('/testimonials');
export const getExperience = () => request('/experience');
export const getCertifications = () => request('/certifications');
export const submitContact = (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) });

// Auth
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

// Admin — services
export const adminGetServices = () => request('/services/all');
export const adminCreateService = (body) => request('/services', { method: 'POST', body: JSON.stringify(body) });
export const adminUpdateService = (id, body) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const adminDeleteService = (id) => request(`/services/${id}`, { method: 'DELETE' });

// Admin — projects
export const adminGetProjects = () => request('/projects/all');
export const adminCreateProject = (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) });
export const adminUpdateProject = (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const adminDeleteProject = (id) => request(`/projects/${id}`, { method: 'DELETE' });

// Admin — experience
export const adminGetExperience = () => request('/experience/all');
export const adminCreateExperience = (body) => request('/experience', { method: 'POST', body: JSON.stringify(body) });
export const adminUpdateExperience = (id, body) => request(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const adminDeleteExperience = (id) => request(`/experience/${id}`, { method: 'DELETE' });

// Admin — testimonials
export const adminGetTestimonials = () => request('/testimonials/all');
export const adminCreateTestimonial = (body) => request('/testimonials', { method: 'POST', body: JSON.stringify(body) });
export const adminUpdateTestimonial = (id, body) => request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const adminDeleteTestimonial = (id) => request(`/testimonials/${id}`, { method: 'DELETE' });

// Admin — certifications
export const adminGetCertifications = () => request('/certifications/all');
export const adminCreateCertification = (body) => request('/certifications', { method: 'POST', body: JSON.stringify(body) });
export const adminUpdateCertification = (id, body) => request(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const adminDeleteCertification = (id) => request(`/certifications/${id}`, { method: 'DELETE' });
