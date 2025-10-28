// API Service for connecting to backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Generic fetch helper
const fetchAPI = async (url, options = {}) => {
  try {
    const headers = getAuthHeaders();
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`API Error (${response.status}):`, errorData.error || errorData);
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    throw error;
  }
};

// Memory API
export const memoryAPI = {
  // Get all memories
  getAll: async () => {
    return fetchAPI('/memories');
  },

  // Create memory
  create: async (memoryData) => {
    return fetchAPI('/memories', {
      method: 'POST',
      body: JSON.stringify(memoryData)
    });
  },

  // Update memory
  update: async (id, memoryData) => {
    return fetchAPI(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memoryData)
    });
  },

  // Delete memory
  delete: async (id) => {
    return fetchAPI(`/memories/${id}`, {
      method: 'DELETE'
    });
  },

  // Search memories
  search: async (query) => {
    return fetchAPI(`/memories?search=${encodeURIComponent(query)}`);
  }
};

// Weather Absence API
export const weatherAbsenceAPI = {
  // Get all absence requests (admin)
  getAll: async () => {
    return fetchAPI('/weather/absence');
  },

  // Get user's own absence requests
  getMine: async () => {
    return fetchAPI('/weather/absence/me');
  },

  // Create absence request
  create: async (absenceData) => {
    return fetchAPI('/weather/absence', {
      method: 'POST',
      body: JSON.stringify(absenceData)
    });
  },

  // Update absence request (admin)
  update: async (id, updateData) => {
    return fetchAPI(`/weather/absence/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Delete absence request
  delete: async (id) => {
    return fetchAPI(`/weather/absence/${id}`, {
      method: 'DELETE'
    });
  },

  // Search absence requests
  search: async (query) => {
    return fetchAPI(`/weather/absence/me?search=${encodeURIComponent(query)}`);
  }
};

// Work Report API
export const workReportAPI = {
  // Get all work reports
  getAll: async () => {
    return fetchAPI('/weather/reports');
  },

  // Create work report
  create: async (reportData) => {
    return fetchAPI('/weather/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  // Update work report
  update: async (id, reportData) => {
    return fetchAPI(`/weather/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData)
    });
  },

  // Delete work report
  delete: async (id) => {
    return fetchAPI(`/weather/reports/${id}`, {
      method: 'DELETE'
    });
  },

  // Search work reports
  search: async (query) => {
    return fetchAPI(`/weather/reports?search=${encodeURIComponent(query)}`);
  }
};

// User API
export const userAPI = {
  // Get current user
  getCurrent: async () => {
    return fetchAPI('/auth/me');
  }
};
