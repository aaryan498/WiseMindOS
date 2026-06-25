import projectModel from '../models/projectModel.js';
import taskModel from '../models/taskModel.js';

// Create Project
const createProject = async (req, res, next) => {
    try {
        const { title, goalId, deadline, description } = req.body;
        const userId = req.user.id;

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
        next(error);
    }
};

// Get All Projects
const getProjects = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const projects = await projectModel.find({ userId });

        // Calculate progress dynamically for each project
        const projectsWithProgress = await Promise.all(projects.map(async (project) => {
            const projectTasks = await taskModel.find({ userId, projectId: project._id });
            const completedTasks = projectTasks.filter(task => task.completed).length;
            const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

            return {
                ...project.toObject(),
                progress,
                tasksCompleted: completedTasks,
                totalTasks: projectTasks.length
            };
        }));

        res.json({ success: true, projects: projectsWithProgress });

    } catch (error) {
        next(error);
    }
};

// Update Project
const updateProject = async (req, res, next) => {
    try {
        const { projectId, title, goalId, deadline, description } = req.body;
        const userId = req.user.id;

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
        next(error);
    }
};

// Delete Project
const deleteProject = async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const userId = req.user.id;

        if (!projectId) {
            return res.json({ success: false, message: 'Project ID is required' });
        }

        const project = await projectModel.findOneAndDelete({ _id: projectId, userId });
        if (!project) {
            return res.json({ success: false, message: 'Project not found' });
        }

        await taskModel.updateMany({ userId, projectId }, { $set: { projectId: null } });

        res.json({ success: true, message: 'Project deleted successfully' });

    } catch (error) {
        next(error);
    }
};

export { createProject, getProjects, updateProject, deleteProject };