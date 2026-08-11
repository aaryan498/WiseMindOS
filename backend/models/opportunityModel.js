import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  progress: { type: Number, default: 0, min: 0, max: 100 }
}, { _id: true });

const opportunitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Interview', 'Hackathon', 'Exam', 'Coding Competition', 'Other'], 
    default: 'Interview' 
  },
  targetDate: { type: Date, required: true },
  notes: { type: String, default: '' },
  skills: [skillSchema],
  createdAt: { type: Date, default: Date.now }
}, { minimize: false });

opportunitySchema.index({ userId: 1 });

const opportunityModel = mongoose.models.opportunity || mongoose.model('opportunity', opportunitySchema);

export default opportunityModel;
