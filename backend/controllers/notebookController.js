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

// ➤ Create Notebook (max 40)
export const createNotebook = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name required" });
    }

    const count = await notebookModel.countDocuments({ userId });
    if (count >= 40) {
      return res.status(400).json({ success: false, message: "Max 40 notebooks allowed" });
    }

    const notebook = new notebookModel({
      userId,
      name,
      order: count + 1
    });

    await notebook.save();

    res.json({ success: true, notebook });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Get all notebooks of user
export const getNotebooks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notebooks = await notebookModel
      .find({ userId })
      .sort({ order: 1 });

    res.json({ success: true, notebooks });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ Update Notebook Name
export const updateNotebook = async (req, res, next) => {
  try {
    const { notebookId, name } = req.body;
    const userId = req.user.id;

    if (!notebookId || !name) {
      return res.status(400).json({ success: false, message: "NotebookId and name required" });
    }

    const notebook = await notebookModel.findOneAndUpdate(
      { _id: notebookId, userId },
      { name },
      { new: true }
    );

    if (!notebook) {
      return res.status(404).json({ success: false, message: "Notebook not found" });
    }

    res.json({ success: true, notebook });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ➤ Delete Notebook (with user check + cascade delete)
export const deleteNotebook = async (req, res, next) => {
  try {
    const { notebookId } = req.body;
    const userId = req.user.id;

    const notebook = await notebookModel.findOneAndDelete({
      _id: notebookId,
      userId
    });

    if (!notebook) {
      return res.status(404).json({ success: false, message: "Notebook not found" });
    }

    // delete all pages of this notebook (scoped to authenticated user)
    await pageModel.deleteMany({ notebookId, userId });

    await reorderNotebooks(userId);

    const notebooks = await notebookModel
      .find({ userId })
      .sort({ order: 1 });

    res.json({ success: true, notebooks });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};