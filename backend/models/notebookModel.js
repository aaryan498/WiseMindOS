import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true,
        index: true
    },

    name: { type: String, required: true },

    // To maintain order like your frontend
    order: { type: Number, default: 0 },

    pageCount: { type: Number, default: 0 }
}, { minimize: false, timestamps: true });

notebookSchema.index({ createdAt: -1 });
notebookSchema.index({ updatedAt: -1 });

const notebookModel = mongoose.models.notebook || mongoose.model('notebook', notebookSchema);

export default notebookModel;