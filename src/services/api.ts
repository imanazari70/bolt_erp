import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { 
  LoginRequest, 
  Staff, 
  Project, 
  Task, 
  TimeSheet, 
  Mail, 
  Message 
} from '../types/api';

const API_BASE_URL = 'http://0.0.0.0:8081';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    toast.error(error.response?.data?.message || 'An error occurred');
    return Promise.reject(error);
  }
);

// Authentication
export const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout/');
    return response.data;
  },
  verify: async () => {
    const response = await api.get('/api/auth/verify/');
    return response.data;
  },
};

// Staff management
export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const response = await api.get('/api/staffs/');
    return response.data;
  },
  getById: async (id: number): Promise<Staff> => {
    const response = await api.get(`/api/staffs/${id}/`);
    return response.data;
  },
  create: async (staff: Omit<Staff, 'id'>): Promise<Staff> => {
    const response = await api.post('/api/staffs/', staff);
    return response.data;
  },
  update: async (id: number, staff: Partial<Staff>): Promise<Staff> => {
    const response = await api.patch(`/api/staffs/${id}/`, staff);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/staffs/${id}/`);
  },
};

// Project management
export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/api/projects/');
    return response.data;
  },
  getById: async (id: number): Promise<Project> => {
    const response = await api.get(`/api/projects/${id}/`);
    return response.data;
  },
  create: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const response = await api.post('/api/projects/', project);
    return response.data;
  },
  update: async (id: number, project: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/api/projects/${id}/`, project);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/projects/${id}/`);
  },
};

// Task management
export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks/');
    return response.data;
  },
  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/api/tasks/${id}/`);
    return response.data;
  },
  create: async (task: Omit<Task, 'id' | 'start_date'>): Promise<Task> => {
    const response = await api.post('/api/tasks/', task);
    return response.data;
  },
  update: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${id}/`, task);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/tasks/${id}/`);
  },
};

// Timesheet management
export const timesheetApi = {
  getAll: async (): Promise<TimeSheet[]> => {
    const response = await api.get('/api/timesheets/');
    return response.data;
  },
  getById: async (id: number): Promise<TimeSheet> => {
    const response = await api.get(`/api/timesheets/${id}/`);
    return response.data;
  },
  create: async (timesheet: Omit<TimeSheet, 'id' | 'date'>): Promise<TimeSheet> => {
    const response = await api.post('/api/timesheets/', timesheet);
    return response.data;
  },
  update: async (id: number, timesheet: Partial<TimeSheet>): Promise<TimeSheet> => {
    const response = await api.patch(`/api/timesheets/${id}/`, timesheet);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/timesheets/${id}/`);
  },
};

// Mail management
export const mailApi = {
  getAll: async (): Promise<Mail[]> => {
    const response = await api.get('/api/mails/');
    return response.data;
  },
  getById: async (id: number): Promise<Mail> => {
    const response = await api.get(`/api/mails/${id}/`);
    return response.data;
  },
  create: async (mail: Omit<Mail, 'id'>): Promise<Mail> => {
    const response = await api.post('/api/mails/', mail);
    return response.data;
  },
  update: async (id: number, mail: Partial<Mail>): Promise<Mail> => {
    const response = await api.patch(`/api/mails/${id}/`, mail);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/mails/${id}/`);
  },
};

// Message management
export const messageApi = {
  getAll: async (): Promise<Message[]> => {
    const response = await api.get('/api/messages/');
    return response.data;
  },
  getById: async (id: number): Promise<Message> => {
    const response = await api.get(`/api/messages/${id}/`);
    return response.data;
  },
  create: async (message: Omit<Message, 'id' | 'date'>): Promise<Message> => {
    const response = await api.post('/api/messages/', message);
    return response.data;
  },
  update: async (id: number, message: Partial<Message>): Promise<Message> => {
    const response = await api.patch(`/api/messages/${id}/`, message);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/messages/${id}/`);
  },
};

// Admin API functions
export const adminApi = {
  // Users management
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users/');
    return response.data;
  },
  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/api/admin/users/${id}/`);
    return response.data;
  },
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/api/admin/users/', user);
    return response.data;
  },
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await api.patch(`/api/admin/users/${id}/`, user);
    return response.data;
  },
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}/`);
  },

  // Groups management
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get('/api/admin/groups/');
    return response.data;
  },
  getGroup: async (id: number): Promise<Group> => {
    const response = await api.get(`/api/admin/groups/${id}/`);
    return response.data;
  },
  createGroup: async (group: Omit<Group, 'id'>): Promise<Group> => {
    const response = await api.post('/api/admin/groups/', group);
    return response.data;
  },
  updateGroup: async (id: number, group: Partial<Group>): Promise<Group> => {
    const response = await api.patch(`/api/admin/groups/${id}/`, group);
    return response.data;
  },
  deleteGroup: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/groups/${id}/`);
  },

  // Permissions management
  getPermissions: async (): Promise<Permission[]> => {
    const response = await api.get('/api/admin/permissions/');
    return response.data;
  },
  getPermission: async (id: number): Promise<Permission> => {
    const response = await api.get(`/api/admin/permissions/${id}/`);
    return response.data;
  },
  createPermission: async (permission: Omit<Permission, 'id'>): Promise<Permission> => {
    const response = await api.post('/api/admin/permissions/', permission);
    return response.data;
  },
  updatePermission: async (id: number, permission: Partial<Permission>): Promise<Permission> => {
    const response = await api.patch(`/api/admin/permissions/${id}/`, permission);
    return response.data;
  },
  deletePermission: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/permissions/${id}/`);
  },
};