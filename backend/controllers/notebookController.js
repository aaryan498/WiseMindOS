import notebookModel from "../models/notebookModel.js";
import pageModel from "../models/pageModel.js";

const buildNotebookReorderUpdate = (_notebook, index) => ({
  order: index + 1,
});

export const reorderNotebooks = async (userId) => {
  const remainingNotebooks = await notebookModel
    .find({ userId })
    .sort({ order: 1 });

  const bulkOps = remainingNotebooks
    .map((notebook, index) => {
      const desiredOrder = index + 1;
      if (notebook.order === desiredOrder) return null;

      return {
        updateOne: {
          filter: { _id: notebook._id },
          update: { $set: buildNotebookReorderUpdate(notebook, index) },
        },
      };
    })
    .filter(Boolean);

  if (bulkOps.length > 0) {
    await notebookModel.bulkWrite(bulkOps);
  }

  return remainingNotebooks.length;
};

// âž¤ Create Notebook (max 40)
export const createNotebook = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Name required" });
    }

    const trimmedName = name.trim();
    const existing = await notebookModel.findOne({
      userId,
      name: new RegExp('^' + trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
    });

    if (existing) {
      return res.json({ success: false, message: "A notebook with this name already exists" });
    }

    const count = await notebookModel.countDocuments({ userId });
    if (count >= 40) {
      return res.json({ success: false, message: "Max 40 notebooks allowed" });
    }

    const notebook = new notebookModel({
      userId,
      name: trimmedName,
      order: count + 1
    });

    await notebook.save();

    res.json({ success: true, notebook });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// âž¤ Get all notebooks of user
export const getNotebooks = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const page = Number(req.body?.page || req.query?.page) || 1;
    let limit = Number(req.body?.limit || req.query?.limit) || 20;

    // Enforce maximum page size limits
    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (limit < 1) limit = 20;

    const skip = (page - 1) * limit;

    // Sorting support (default sorting by order asc)
    const sortBy = req.body?.sortBy || req.query?.sortBy || 'order';
    const sortOrder = req.body?.sortOrder || req.query?.sortOrder || 'asc';
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const total = await notebookModel.countDocuments({ userId });
    const notebooks = await notebookModel
      .find({ userId })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: notebooks,
      notebooks, // Backward compatibility
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// âž¤ Update Notebook Name
export const updateNotebook = async (req, res, next) => {
  try {
    const { notebookId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!notebookId || !name || !name.trim()) {
      return res.json({
        success: false,
        message: "NotebookId and name required"
      });
    }

    const trimmedName = name.trim();

    const existing = await notebookModel.findOne({
      userId,
      _id: { $ne: notebookId },
      name: new RegExp(
        '^' +
          trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
          '$',
        'i'
      )
    });

    if (existing) {
      return res.json({
        success: false,
        message: "A notebook with this name already exists"
      });
    }

    const notebook = await notebookModel.findOneAndUpdate(
      { _id: notebookId, userId },
      { name: trimmedName },
      { new: true }
    );

    if (!notebook) {
      return res.json({
        success: false,
        message: "Notebook not found"
      });
    }

    res.json({ success: true, notebook });
  } catch (error) {
    next(error);
  }
};


// âž¤ Delete Notebook (with user check + cascade delete)
export const deleteNotebook = async (req, res, next) => {
  try {
    const { notebookId } = req.params;
    const userId = req.user.id;

    const notebook = await notebookModel.findOneAndDelete({
      _id: notebookId,
      userId
    });

    if (!notebook) {
      return res.json({
        success: false,
        message: "Notebook not found"
      });
    }

    await pageModel.deleteMany({ notebookId, userId });

    await reorderNotebooks(userId);

    const notebooks = await notebookModel
      .find({ userId })
      .sort({ order: 1 });

    res.json({ success: true, notebooks });
  } catch (error) {
    next(error);
  }
};
