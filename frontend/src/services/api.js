const API_URL = 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login_check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }), // LexikJWT utilise 'username' par défaut pour l'email
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return await response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // Profile
  getMe: async () => {
    const response = await fetch(`${API_URL}/me`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  },

  // Operations (Expenses/Incomes)
  getOperations: async () => {
    const response = await fetch(`${API_URL}/operations`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch operations');
    return await response.json();
  },

  createOperation: async (operation) => {
    const response = await fetch(`${API_URL}/operations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(operation),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create operation');
    }
    return await response.json();
  },

  updateOperation: async (id, operation) => {
    const response = await fetch(`${API_URL}/operations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(operation),
    });
    if (!response.ok) throw new Error('Failed to update operation');
    return await response.json();
  },

  deleteOperation: async (id) => {
    const response = await fetch(`${API_URL}/operations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete operation');
    return true;
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  },

  createCategory: async (title) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
  }
};
