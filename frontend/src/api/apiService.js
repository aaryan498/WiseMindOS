import axiosInstance from './axios';

// ============ AUTH APIs ============
export const authAPI = {
    register: async (data) => {
        const response = await axiosInstance.post('/api/user/register', data);
        return response.data;
    },
    login: async (data) => {
        const response = await axiosInstance.post('/api/user/login', data);
        return response.data;
    },
    googleLogin: async (credential) => {
        const response = await axiosInstance.post('/api/user/google', { credential });
        return response.data;
    },
    update: async (data) => {
        const response = await axiosInstance.post('/api/user/update', data);
        return response.data;
    },
    updateProfilePic: async (data) => {
        const response = await axiosInstance.post('/api/user/update-profile-pic', data);
        return response.data;
    }
};

// ============ GOAL APIs ============
export const goalAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/goals/create', data);
        return response.data;
    },
    getAll: async () => {
        const response = await axiosInstance.post('/api/goals/list', {});
        return response.data;
    },
    update: async (data) => {
        const response = await axiosInstance.post('/api/goals/update', data);
        return response.data;
    },
    delete: async (goalId) => {
        const response = await axiosInstance.post('/api/goals/delete', { goalId });
        return response.data;
    }
};

// ============ PROJECT APIs ============
export const projectAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/projects/create', data);
        return response.data;
    },
    getAll: async () => {
        const response = await axiosInstance.post('/api/projects/list', {});
        return response.data;
    },
    update: async (data) => {
        const response = await axiosInstance.post('/api/projects/update', data);
        return response.data;
    },
    delete: async (projectId) => {
        const response = await axiosInstance.post('/api/projects/delete', { projectId });
        return response.data;
    }
};

// ============ TASK APIs ============
export const taskAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/tasks/create', data);
        return response.data;
    },
    getAll: async () => {
        const response = await axiosInstance.post('/api/tasks/list', {});
        return response.data;
    },
    update: async (data) => {
        const response = await axiosInstance.post('/api/tasks/update', data);
        return response.data;
    },
    toggle: async (taskId) => {
        const response = await axiosInstance.post('/api/tasks/toggle', { taskId });
        return response.data;
    },
    delete: async (taskId) => {
        const response = await axiosInstance.post('/api/tasks/delete', { taskId });
        return response.data;
    }
};

// ============ HABIT APIs ============
export const habitAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/habits/create', data);
        return response.data;
    },
    getAll: async () => {
        const response = await axiosInstance.post('/api/habits/list', {});
        return response.data;
    },
    update: async (data) => {
        const response = await axiosInstance.post('/api/habits/update', data);
        return response.data;
    },
    complete: async (habitId) => {
        const response = await axiosInstance.post('/api/habits/complete', { habitId });
        return response.data;
    },
    delete: async (habitId) => {
        const response = await axiosInstance.post('/api/habits/delete', { habitId });
        return response.data;
    }
};

// ============ DAILY PLAN APIs ============
export const dailyPlanAPI = {
    getToday: async () => {
        const response = await axiosInstance.post('/api/daily-plan/today', {});
        return response.data;
    },
    add: async (data) => {
        const response = await axiosInstance.post('/api/daily-plan/add', data);
        return response.data;
    },
    remove: async (plannedTaskId) => {
        const response = await axiosInstance.post('/api/daily-plan/remove', { plannedTaskId });
        return response.data;
    },
    toggle: async (plannedTaskId) => {
        const response = await axiosInstance.post('/api/daily-plan/toggle', { plannedTaskId });
        return response.data;
    },
    clear: async () => {
        const response = await axiosInstance.post('/api/daily-plan/clear', {});
        return response.data;
    }
};

// ============ NOTEBOOK APIs ============
export const notebookAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/notebooks/create', data);
        return response.data;
    },
    getAll: async () => {
        const response = await axiosInstance.post('/api/notebooks/list', {});
        return response.data;
    },
    update: async (notebookId, name) => {
        const response = await axiosInstance.post('/api/notebooks/update', { notebookId, name });
        return response.data;
    },
    delete: async (notebookId) => {
        const response = await axiosInstance.post('/api/notebooks/delete', { notebookId });
        return response.data;
    }
};

// ============ PAGE APIs ============
export const pageAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/pages/create', data);
        return response.data;
    },
    getPagesByNotebook: async (notebookId) => {
        const response = await axiosInstance.post('/api/pages/list', { notebookId });
        return response.data;
    },
    update: async (data) => {
        const response = await axiosInstance.post('/api/pages/update', data);
        return response.data;
    },
    delete: async (pageId, notebookId) => {
        const response = await axiosInstance.post('/api/pages/delete', { pageId, notebookId });
        return response.data;
    }
};


// ============ STATS APIs ============
export const statsAPI = {
    save: async (data) => {
        const response = await axiosInstance.post('/api/stats/save', data);
        return response.data;
    },

    getWeekly: async () => {
        const response = await axiosInstance.post('/api/stats/weekly', {});
        return response.data;
    }
};