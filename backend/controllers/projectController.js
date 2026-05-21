import projectModel from '../models/projectModel.js';
import taskModel from '../models/taskModel.js';
import { emptyProgressSummary, summarizeTaskProgress } from '../utils/progressSummary.js';

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
        const projects = await projectModel.find({ userId }).lean();
        const projectIds = projects.map(project => project._id);

        const projectTasks = projectIds.length > 0
            ? await taskModel.find(
                { userId, projectId: { $in: projectIds } },
                { projectId: 1, completed: 1 }
            ).lean()
            : [];

        const progressByProjectId = summarizeTaskProgress(projectTasks, 'projectId');

        const projectsWithProgress = projects.map((project) => {
            const summary = progressByProjectId.get(project._id.toString()) || emptyProgressSummary;
            return {
                ...project,
                progress: summary.progress,
                tasksCompleted: summary.tasksCompleted,
                totalTasks: summary.totalTasks
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
