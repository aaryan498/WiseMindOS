import apiClient from './apiClient';

// ============ AUTH APIs ============
export const authAPI = {
    register: async (data) => {
        const response = await apiClient.post('/api/user/register', data);
        return response.data;
    },
    login: async (data) => {
        const response = await apiClient.post('/api/user/login', data);
        return response.data;
    },
    googleLogin: async (credential) => {
        const response = await apiClient.post('/api/user/google', { credential });
        return response.data;
    },
    update: async (data) => {
        const response = await apiClient.patch('/api/user/profile', data);
        return response.data;
    },
    updateProfilePic: async (data) => {
        const response = await apiClient.patch('/api/user/profile-picture', data);
        return response.data;
    }
};

// ============ GOAL APIs ============
export const goalAPI = {
    create: async (data) => {
        const response = await apiClient.post('/api/goals', data);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/api/goals');
        return response.data;
    },
    update: async (data) => {
        const { goalId, ...updates } = data;
        const response = await apiClient.patch(`/api/goals/${goalId}`, updates);
        return response.data;
    },
    delete: async (goalId) => {
        const response = await apiClient.delete(`/api/goals/${goalId}`);
        return response.data;
    }
};

// ============ PROJECT APIs ============
export const projectAPI = {
    create: async (data) => {
        const response = await apiClient.post('/api/projects', data);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/api/projects');
        return response.data;
    },
    update: async (data) => {
        const { projectId, ...updates } = data;
        const response = await apiClient.patch(`/api/projects/${projectId}`, updates);
        return response.data;
    },
    delete: async (projectId) => {
        const response = await apiClient.delete(`/api/projects/${projectId}`);
        return response.data;
    }
};

// ============ TASK APIs ============
export const taskAPI = {
    create: async (data) => {
        const response = await apiClient.post('/api/tasks', data);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/api/tasks');
        return response.data;
    },
    update: async (data) => {
        const { taskId, ...updates } = data;
        const response = await apiClient.patch(`/api/tasks/${taskId}`, updates);
        return response.data;
    },
    toggle: async (taskId) => {
        const response = await apiClient.patch(`/api/tasks/${taskId}/toggle`);
        return response.data;
    },
    delete: async (taskId) => {
        const response = await apiClient.delete(`/api/tasks/${taskId}`);
        return response.data;
    }
};

// ============ HABIT APIs ============
export const habitAPI = {
    create: async (data) => {
        const response = await apiClient.post('/api/habits', data);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/api/habits');
        return response.data;
    },
    update: async (data) => {
        const { habitId, ...updates } = data;
        const response = await apiClient.patch(`/api/habits/${habitId}`, updates);
        return response.data;
    },
    complete: async (habitId) => {
        const response = await apiClient.patch(`/api/habits/${habitId}/complete`);
        return response.data;
    },
    delete: async (habitId) => {
        const response = await apiClient.delete(`/api/habits/${habitId}`);
        return response.data;
    }
};

// ============ DAILY PLAN APIs ============
export const dailyPlanAPI = {
    getToday: async () => {
        const response = await apiClient.get('/api/daily-plan/today');
        return response.data;
    },
    add: async (data) => {
        const response = await apiClient.post('/api/daily-plan/tasks', data);
        return response.data;
    },
    remove: async (plannedTaskId) => {
        const response = await apiClient.delete(`/api/daily-plan/tasks/${plannedTaskId}`);
        return response.data;
    },
    toggle: async (plannedTaskId) => {
        const response = await apiClient.patch(
            `/api/daily-plan/tasks/${plannedTaskId}/toggle`
        );
        return response.data;
    },
    clear: async () => {
        const response = await apiClient.delete('/api/daily-plan');
        return response.data;
    }
};

// ============ NOTEBOOK APIs ============
export const notebookAPI = {
    create: async (data) => {
        const response = await apiClient.post('/api/notebooks', data);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/api/notebooks');
        return response.data;
    },
    update: async (notebookId, name) => {
        const response = await apiClient.patch(`/api/notebooks/${notebookId}`, {
            name
        });
        return response.data;
    },
    delete: async (notebookId) => {
        const response = await apiClient.delete(`/api/notebooks/${notebookId}`);
        return response.data;
    }
};

// ============ PAGE APIs ============
export const pageAPI = {
    create: async (data) => {
        const response = await apiClient.post('/api/pages', data);
        return response.data;
    },
    getPagesByNotebook: async (notebookId) => {
        const response = await apiClient.get('/api/pages', {
            params: { notebookId }
        });
        return response.data;
    },
    update: async (data) => {
        const { pageId, ...updates } = data;
        const response = await apiClient.patch(`/api/pages/${pageId}`, updates);
        return response.data;
    },
    delete: async (pageId) => {
        const response = await apiClient.delete(`/api/pages/${pageId}`);
        return response.data;
    }
};

// ============ STATS APIs ============
export const statsAPI = {
    save: async (data) => {
        const response = await apiClient.post('/api/stats', data);
        return response.data;
    },

    getWeekly: async () => {
        const response = await apiClient.get('/api/stats/weekly');
        return response.data;
    }
};