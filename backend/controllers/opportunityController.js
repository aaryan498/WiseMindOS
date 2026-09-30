import opportunityModel from '../models/opportunityModel.js';
import { sanitizeField } from '../utils/sanitize.js';

export const computeOpportunityStats = (opportunity) => {
  const oppObj = opportunity.toObject ? opportunity.toObject() : { ...opportunity };
  const skills = oppObj.skills || [];
  
  // Calculate average readiness percentage
  const totalSkills = skills.length;
  const readinessScore = totalSkills > 0
    ? Math.round(skills.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalSkills)
    : 0;

  // Calculate days remaining until targetDate
  let daysRemaining = null;
  if (oppObj.targetDate) {
    const target = new Date(oppObj.targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    ...oppObj,
    readinessScore,
    daysRemaining
  };
};

// Create Opportunity
export const createOpportunity = async (req, res, next) => {
  try {
    const { title, category, targetDate, notes, skills } = req.body;
    const userId = req.user.id;

    const { value: cleanTitle, error: titleError } = sanitizeField(title, 'title', { required: true });
    if (titleError) return res.json({ success: false, message: titleError });

    if (!targetDate) {
      return res.json({ success: false, message: 'Target date is required' });
    }

    const formattedSkills = Array.isArray(skills)
      ? skills.map((s) => ({
          name: typeof s === 'string' ? s.trim() : (s.name || '').trim(),
          progress: typeof s === 'object' && s.progress !== undefined ? Number(s.progress) : 0
        })).filter((s) => s.name.length > 0)
      : [];

    const newOpportunity = new opportunityModel({
      userId,
      title: cleanTitle,
      category: category || 'Interview',
      targetDate,
      notes: notes || '',
      skills: formattedSkills
    });

    await newOpportunity.save();
    const opportunityWithStats = computeOpportunityStats(newOpportunity);

    res.json({
      success: true,
      opportunity: opportunityWithStats,
      message: 'Opportunity created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get All Opportunities for User
export const getOpportunities = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const opportunities = await opportunityModel.find({ userId }).sort({ targetDate: 1 });

    const opportunitiesWithStats = opportunities.map(computeOpportunityStats);

    res.json({
      success: true,
      opportunities: opportunitiesWithStats
    });
  } catch (error) {
    next(error);
  }
};

// Update Opportunity
export const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, category, targetDate, notes, skills } = req.body;

    const opportunity = await opportunityModel.findOne({ _id: id, userId });
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (title !== undefined) {
      const { value: cleanTitle, error: titleError } = sanitizeField(title, 'title', { required: true });
      if (titleError) return res.json({ success: false, message: titleError });
      opportunity.title = cleanTitle;
    }

    if (category !== undefined) opportunity.category = category;
    if (targetDate !== undefined) opportunity.targetDate = targetDate;
    if (notes !== undefined) opportunity.notes = notes;

    if (Array.isArray(skills)) {
      opportunity.skills = skills.map((s) => ({
        name: typeof s === 'string' ? s.trim() : (s.name || '').trim(),
        progress: typeof s === 'object' && s.progress !== undefined ? Number(s.progress) : 0
      })).filter((s) => s.name.length > 0);
    }

    await opportunity.save();
    const updatedWithStats = computeOpportunityStats(opportunity);

    res.json({
      success: true,
      opportunity: updatedWithStats,
      message: 'Opportunity updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update Individual Skill Progress
export const updateSkillProgress = async (req, res, next) => {
  try {
    const { id, skillId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.json({ success: false, message: 'Progress must be a number between 0 and 100' });
    }

    const opportunity = await opportunityModel.findOne({ _id: id, userId });
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const skill = opportunity.skills.id(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    skill.progress = Number(progress);
    await opportunity.save();

    const updatedWithStats = computeOpportunityStats(opportunity);

    res.json({
      success: true,
      opportunity: updatedWithStats,
      message: 'Skill progress updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete Opportunity
export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const opportunity = await opportunityModel.findOneAndDelete({ _id: id, userId });
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
