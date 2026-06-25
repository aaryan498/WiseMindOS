import notebookModel from "../models/notebookModel.js";
import pageModel from "../models/pageModel.js";

// ➤ Create Notebook (max 40)
export const createNotebook = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { name } = req.body;

    if (!name) {
      return res.json({ success: false, message: "Name required" });
    }

    const count = await notebookModel.countDocuments({ userId });
    if (count >= 40) {
      return res.json({ success: false, message: "Max 40 notebooks allowed" });
    }

    const notebook = new notebookModel({
      userId,
      name,
      order: count + 1
    });

    await notebook.save();

    res.json({ success: true, notebook });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ➤ Get all notebooks of user
export const getNotebooks = async (req, res) => {
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

// ➤ Update Notebook Name
export const updateNotebook = async (req, res) => {
  try {
    const { notebookId, name } = req.body;
    const userId = req.body.userId;

    if (!notebookId || !name) {
      return res.json({ success: false, message: "NotebookId and name required" });
    }

    const notebook = await notebookModel.findOneAndUpdate(
      { _id: notebookId, userId },
      { name },
      { new: true }
    );

    if (!notebook) {
      return res.json({ success: false, message: "Notebook not found" });
    }

    res.json({ success: true, notebook });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ➤ Delete Notebook (with user check + cascade delete)
export const deleteNotebook = async (req, res) => {
  try {
    const { notebookId } = req.body;
    const userId = req.body.userId;

    const notebook = await notebookModel.findOneAndDelete({
      _id: notebookId,
      userId
    });

    if (!notebook) {
      return res.json({ success: false, message: "Notebook not found" });
    }

    // delete all pages of this notebook
    await pageModel.deleteMany({ notebookId });

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};