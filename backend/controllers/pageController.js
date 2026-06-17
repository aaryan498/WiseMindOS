import pageModel from "../models/pageModel.js";
import notebookModel from "../models/notebookModel.js";

// ➤ Create Page (max 100 per notebook)
export const createPage = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const { notebookId } = req.body;

    if (!notebookId) {
      return res.json({ success: false, message: "NotebookId required" });
    }

    const notebook = await notebookModel.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.json({ success: false, message: "Notebook not found" });
    }

    if (notebook.pageCount >= 100) {
      return res.json({ success: false, message: "Max 100 pages allowed" });
    }

    const page = new pageModel({
      userId,
      notebookId,
      title: `Page ${notebook.pageCount + 1}`,
      order: notebook.pageCount + 1
    });

    await page.save();

    notebook.pageCount += 1;
    await notebook.save();

    res.json({ success: true, page });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ➤ Get pages of a notebook (with user check)
export const getPages = async (req, res, next) => {
  try {
    const { notebookId } = req.body;
    const userId = req.body.userId;

    const pages = await pageModel
      .find({ notebookId, userId })
      .sort({ order: 1 });

    res.json({ success: true, pages });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ➤ Update Page Content (max 10KB + user check)
export const updatePage = async (req, res, next) => {
  try {
    const { pageId, content } = req.body;
    const userId = req.body.userId;

    if (content === undefined || content === null) {
      return res.json({ success: false, message: "Content is required" });
    }

    if (typeof content !== "string") {
      return res.json({ success: false, message: "Content must be a string" });
    }

    if (content.length > 10000) {
      return res.json({ success: false, message: "Max 10KB content allowed" });
    }

    const page = await pageModel.findOneAndUpdate(
      { _id: pageId, userId },
      {
        content,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!page) {
      return res.json({ success: false, message: "Page not found" });
    }

    res.json({ success: true, page });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ➤ Delete Page (with user check)
export const deletePage = async (req, res, next) => {
  try {
    const { pageId, notebookId } = req.body;
    const userId = req.body.userId;

    const page = await pageModel.findOneAndDelete({
      _id: pageId,
      userId
    });

    if (!page) {
      return res.json({ success: false, message: "Page not found" });
    }

    const notebook = await notebookModel.findOne({
      _id: notebookId,
      userId
    });

    if (notebook && notebook.pageCount > 0) {
      notebook.pageCount -= 1;
      await notebook.save();
    }

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};