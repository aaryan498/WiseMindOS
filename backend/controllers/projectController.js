import mongoose from 'mongoose';
import projectModel from '../models/projectModel.js';
import taskModel from '../models/taskModel.js';

// Create Project
const createProject = async (req, res) => {
    try {
        const { title, goalId, deadline, description } = req.body;
        const userId = req.body.userId;

        if (!title) {
            return res.json({ success: false, message: 'Title is required' });
        }

        const newProject = new projectModel({
            userId,
            title,
            goalId: goalId || null,
            deadline: deadline || null,
            description: description || ''
        });

        await newProject.save();
        res.json({ success: true, project: newProject, message: 'Project Created Successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Projects
const getProjects = async (req, res) => {
    try {
        const userId = req.body.userId;
        const projects = await projectModel.find({ userId });

        // Single aggregation to get task counts for all projects
        const projectProgress = await taskModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), projectId: { $ne: null } } },
            { $group: { _id: "$projectId", total: { $sum: 1 }, completed: { $sum: { $cond: ["$completed", 1, 0] } } } }
        ]);

        const progressMap = {};
        projectProgress.forEach(item => {
            progressMap[item._id.toString()] = {
                total: item.total,
                completed: item.completed,
                progress: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0
            };
        });

        const projectsWithProgress = projects.map(project => {
            const data = progressMap[project._id.toString()] || { total: 0, completed: 0, progress: 0 };
            return {
                ...project.toObject(),
                progress: data.progress,
                tasksCompleted: data.completed,
                totalTasks: data.total
            };
        });

        res.json({ success: true, projects: projectsWithProgress });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Project
const updateProject = async (req, res) => {
    try {
        const { projectId, title, goalId, deadline, description } = req.body;
        const userId = req.body.userId;

        if (!projectId) {
            return res.json({ success: false, message: 'Project ID is required' });
        }

        const project = await projectModel.findOne({ _id: projectId, userId });
        if (!project) {
            return res.json({ success: false, message: 'Project not found' });
        }

        if (title) project.title = title;
        if (goalId !== undefined) project.goalId = goalId;
        if (deadline !== undefined) project.deadline = deadline;
        if (description !== undefined) project.description = description;

        await project.save();
        res.json({ success: true, project, message: 'Project Updated Successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Project
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.body;
        const userId = req.body.userId;

        if (!projectId) {
            return res.json({ success: false, message: 'Project ID is required' });
        }

        const project = await projectModel.findOneAndDelete({ _id: projectId, userId });
        if (!project) {
            return res.json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, message: 'Project deleted successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createProject, getProjects, updateProject, deleteProject };