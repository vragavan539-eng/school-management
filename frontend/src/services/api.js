import axios from 'axios';

const API = axios.create({
  // இதை மாத்து
baseURL: 'https://school-management-fka9.onrender.com/api'
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────
export const login    = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe    = ()     => API.get('/auth/me');

// ── Students ─────────────────────────────
export const getStudents     = (params) => API.get('/students', { params });
export const getStudent      = (id)     => API.get(`/students/${id}`);
export const createStudent   = (data)   => API.post('/students', data);
export const updateStudent   = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent   = (id)     => API.delete(`/students/${id}`);
export const getStudentStats = ()       => API.get('/students/stats/summary');

// ── Teachers ─────────────────────────────
export const getTeachers   = (params) => API.get('/teachers', { params });
export const getTeacher    = (id)     => API.get(`/teachers/${id}`);
export const createTeacher = (data)   => API.post('/teachers', data);
export const updateTeacher = (id, data) => API.put(`/teachers/${id}`, data);
export const deleteTeacher = (id)     => API.delete(`/teachers/${id}`);

// ── Attendance ───────────────────────────
export const getAttendance    = (params) => API.get('/attendance', { params });
export const markBulkAttendance = (data) => API.post('/attendance/bulk', data);
export const getAttSummary    = (id, params) => API.get(`/attendance/summary/${id}`, { params });

// ── Results ──────────────────────────────
export const getResults        = (params) => API.get('/results', { params });
export const getStudentResults = (id)     => API.get(`/results/student/${id}`);
export const createResult      = (data)   => API.post('/results', data);
export const updateResult      = (id, data) => API.put(`/results/${id}`, data);
export const computeRanks      = (data)   => API.post('/results/compute-ranks', data);

// ── Fees ─────────────────────────────────
export const getFees      = (params) => API.get('/fees', { params });
export const getFeeSummary = ()       => API.get('/fees/summary');
export const createFee    = (data)   => API.post('/fees', data);
export const recordPayment = (id, data) => API.post(`/fees/${id}/payment`, data);

// ── Notices ──────────────────────────────
export const getNotices    = (params) => API.get('/notices', { params });
export const createNotice  = (data)   => API.post('/notices', data);
export const updateNotice  = (id, data) => API.put(`/notices/${id}`, data);
export const deleteNotice  = (id)     => API.delete(`/notices/${id}`);

export default API;
