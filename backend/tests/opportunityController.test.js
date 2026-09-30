import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { computeOpportunityStats } from '../controllers/opportunityController.js';

describe('Opportunity Controller - Skill Readiness & Days Countdown Calculations', () => {
  test('should correctly compute readiness score as 0 when no skills exist', () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const opp = {
      title: 'Meta Frontend Interview',
      targetDate,
      skills: []
    };
    const stats = computeOpportunityStats(opp);
    assert.equal(stats.readinessScore, 0);
    assert.ok(stats.daysRemaining >= 7 && stats.daysRemaining <= 8);
  });

  test('should correctly compute average readiness score from skill progress percentages', () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);

    const opp = {
      title: 'Smart India Hackathon',
      targetDate,
      skills: [
        { name: 'React Hooks', progress: 80 },
        { name: 'System Design', progress: 50 },
        { name: 'Node.js', progress: 90 }
      ]
    };
    const stats = computeOpportunityStats(opp);
    // (80 + 50 + 90) / 3 = 220 / 3 = 73.33 -> rounded to 73
    assert.equal(stats.readinessScore, 73);
    assert.ok(stats.daysRemaining >= 3 && stats.daysRemaining <= 4);
  });

  test('should handle past target dates gracefully with negative daysRemaining', () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 2);

    const opp = {
      title: 'Data Structures Exam',
      targetDate,
      skills: [{ name: 'Dynamic Programming', progress: 100 }]
    };
    const stats = computeOpportunityStats(opp);
    assert.equal(stats.readinessScore, 100);
    assert.ok(stats.daysRemaining < 0);
  });
});
