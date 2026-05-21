const summarizeTaskProgress = (tasks, groupKey) => {
    return tasks.reduce((summary, task) => {
        const rawId = task[groupKey];
        if (!rawId) return summary;

        const id = rawId.toString();
        const current = summary.get(id) || { totalTasks: 0, tasksCompleted: 0, progress: 0 };

        current.totalTasks += 1;
        if (task.completed) {
            current.tasksCompleted += 1;
        }
        current.progress = Math.round((current.tasksCompleted / current.totalTasks) * 100);

        summary.set(id, current);
        return summary;
    }, new Map());
};

const emptyProgressSummary = {
    totalTasks: 0,
    tasksCompleted: 0,
    progress: 0
};

export { summarizeTaskProgress, emptyProgressSummary };
