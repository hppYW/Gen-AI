import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Scenario APIs
export const scenarioAPI = {
  getAllScenarios: async () => {
    const response = await api.get('/scenarios');
    return response.data;
  },

  getScenarioById: async (id) => {
    const response = await api.get(`/scenarios/${id}`);
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/scenarios/category/${category}`);
    return response.data;
  },

  getByDifficulty: async (difficulty) => {
    const response = await api.get(`/scenarios/difficulty/${difficulty}`);
    return response.data;
  },
};

// Conversation APIs
export const conversationAPI = {
  startConversation: async (scenarioId) => {
    const response = await api.post('/conversation/start', { scenarioId });
    return response.data;
  },

  sendMessage: async (conversationId, message, conversationHistory, scenarioId) => {
    const response = await api.post('/conversation/message', {
      conversationId,
      message,
      conversationHistory,
      scenarioId,
    });
    return response.data;
  },

  getSuggestions: async (conversationHistory, scenarioId) => {
    const response = await api.post('/conversation/suggestions', {
      conversationHistory,
      scenarioId,
    });
    return response.data;
  },

  analyzeConversation: async (conversationHistory, scenarioId) => {
    const response = await api.post('/conversation/analyze', {
      conversationHistory,
      scenarioId,
    });
    return response.data;
  },
};

export default api;
