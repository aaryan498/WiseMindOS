import retrospectiveModel from '../models/retrospectiveModel.js';
import notebookModel from '../models/notebookModel.js';
import pageModel from '../models/pageModel.js';

const RETRO_NOTEBOOK_NAME = 'Retrospectives';

// ─── Helper: find or create the "Retrospectives" notebook ───────────────────
const findOrCreateRetroNotebook = async (userId) => {
    let notebook = await notebookModel.findOne({ userId, name: RETRO_NOTEBOOK_NAME });

    if (!notebook) {
        const count = await notebookModel.countDocuments({ userId });
        notebook = await notebookModel.create({
            userId,
            name: RETRO_NOTEBOOK_NAME,
            order: count + 1,
            pageCount: 0
        });
    }

    return notebook;
};

// ─── Helper: build markdown content from a retrospective doc ─────────────────
const buildMarkdownContent = (retro) => {
    const { weekStartDate, weekEndDate, metricsSummary, responses, overallRating } = retro;
    const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const habitRate = metricsSummary.totalHabits > 0
        ? Math.round((metricsSummary.habitsCompleted / metricsSummary.totalHabits) * 100)
        : 0;
    const taskRate = metricsSummary.totalTasks > 0
        ? Math.round((metricsSummary.tasksCompleted / metricsSummary.totalTasks) * 100)
        : 0;

    const promptLines = responses
        .map((r, i) => `### Q${i + 1}: ${r.question}\n${r.answer || '_No answer provided._'}`)
        .join('\n\n');

    return `# Weekly Retrospective
**Period:** ${fmt(weekStartDate)} → ${fmt(weekEndDate)}
**Overall Focus Rating:** ${overallRating}/10

---

## 📊 Weekly Metrics

| Metric | Value |
|---|---|
| Habits Completed | ${metricsSummary.habitsCompleted}/${metricsSummary.totalHabits} (${habitRate}%) |
| Tasks Completed | ${metricsSummary.tasksCompleted}/${metricsSummary.totalTasks} (${taskRate}%) |
| Avg Productivity | ${metricsSummary.avgProductivity}% |
| Avg Discipline | ${metricsSummary.avgDiscipline}% |
| Active Goals | ${metricsSummary.goalsCount} |

---

## 💬 Reflection Prompts

${promptLines}

---
*Archived by WiseMindOS on ${fmt(new Date())}*`;
};


// ─── POST /api/retrospectives/create ────────────────────────────────────────
export const createRetrospective = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { weekStartDate, weekEndDate, metricsSummary, responses, overallRating } = req.body;

        if (!weekStartDate || !weekEndDate) {
            return res.json({ success: false, message: 'weekStartDate and weekEndDate are required' });
        }

        // Prevent duplicate for same week
        const existing = await retrospectiveModel.findOne({
            userId,
            weekStartDate: new Date(weekStartDate)
        });

        if (existing) {
            return res.json({ success: false, message: 'A retrospective for this week already exists' });
        }

        // ── Create retrospective doc ────────────────────────────────────────
        const retro = await retrospectiveModel.create({
            userId,
            weekStartDate: new Date(weekStartDate),
            weekEndDate:   new Date(weekEndDate),
            metricsSummary: metricsSummary || {},
            responses: responses || [],
            overallRating: overallRating || 5
        });

        // ── Archive to Library ──────────────────────────────────────────────
        try {
            const notebook = await findOrCreateRetroNotebook(userId);

            const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const pageTitle = `Retro: ${fmt(weekStartDate)} – ${fmt(weekEndDate)}`;
            const content   = buildMarkdownContent(retro);

            const page = await pageModel.create({
                userId,
                notebookId: notebook._id,
                title:   pageTitle,
                content: content,
                order:   notebook.pageCount + 1
            });

            notebook.pageCount += 1;
            await notebook.save();

            // Store back-references
            retro.libraryNotebookId = notebook._id;
            retro.libraryPageId     = page._id;
            await retro.save();
        } catch (archiveErr) {
            console.error('Library archive failed (non-fatal):', archiveErr.message);
        }

        return res.json({ success: true, retrospective: retro });

    } catch (error) {
        next(error);
    }
};


// ─── POST /api/retrospectives/list ──────────────────────────────────────────
export const getRetrospectives = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const retros = await retrospectiveModel
            .find({ userId })
            .sort({ weekStartDate: -1 });

        return res.json({ success: true, retrospectives: retros });

    } catch (error) {
        next(error);
    }
};


// ─── POST /api/retrospectives/delete ────────────────────────────────────────
export const deleteRetrospective = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { retroId } = req.body;

        if (!retroId) {
            return res.json({ success: false, message: 'retroId is required' });
        }

        const retro = await retrospectiveModel.findOneAndDelete({ _id: retroId, userId });

        if (!retro) {
            return res.json({ success: false, message: 'Retrospective not found' });
        }

        // Also delete the linked library page if it exists
        if (retro.libraryPageId) {
            try {
                const page = await pageModel.findOneAndDelete({ _id: retro.libraryPageId, userId });

                if (page && retro.libraryNotebookId) {
                    const notebook = await notebookModel.findOne({ _id: retro.libraryNotebookId, userId });
                    if (notebook && notebook.pageCount > 0) {
                        notebook.pageCount -= 1;
                        await notebook.save();
                    }
                }
            } catch (deleteErr) {
                console.error('Library page cleanup failed (non-fatal):', deleteErr.message);
            }
        }

        const remaining = await retrospectiveModel
            .find({ userId })
            .sort({ weekStartDate: -1 });

        return res.json({ success: true, retrospectives: remaining });

    } catch (error) {
        next(error);
    }
};
