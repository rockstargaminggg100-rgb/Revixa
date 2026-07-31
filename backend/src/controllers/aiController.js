/**
 * REVIXA BACKEND — AI CONTROLLER
 * backend/src/controllers/aiController.js
 * 
 * HTTP request/response handlers for AI Executive Copilot & Decision Engine.
 * NO Prisma imports. Calls DecisionEngine, ExecutiveCopilot, and AIMemoryService exclusively.
 */

import { DecisionEngine } from '../services/ai/DecisionEngine.js';
import { ExecutiveCopilot } from '../services/ai/ExecutiveCopilot.js';
import { AIMemoryService } from '../services/ai/AIMemoryService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAISummary = async (req, res, next) => {
  try {
    const orgId = req.user ? req.user.organizationId : 'org_default';
    const { query } = req.body || {};
    const decisionResult = await DecisionEngine.executeDecisionPipeline(orgId, query);
    return sendSuccess(res, decisionResult.executiveSummary, 200, 'AI Executive summary generated');
  } catch (err) {
    next(err);
  }
};

export const getAIRecommendations = async (req, res, next) => {
  try {
    const orgId = req.user ? req.user.organizationId : 'org_default';
    const { query } = req.body || {};
    const decisionResult = await DecisionEngine.executeDecisionPipeline(orgId, query);
    return sendSuccess(res, decisionResult.recommendations, 200, 'AI recommendations generated');
  } catch (err) {
    next(err);
  }
};

export const getAICopilot = async (req, res, next) => {
  try {
    const orgId = req.user ? req.user.organizationId : 'org_default';
    const { mode = 'morning' } = req.body || {};
    const copilotData = await ExecutiveCopilot.generateCopilotBriefing(orgId, mode);
    return sendSuccess(res, copilotData, 200, 'Executive Copilot briefing generated');
  } catch (err) {
    next(err);
  }
};

export const getAIHistory = async (req, res, next) => {
  try {
    const history = AIMemoryService.getHistory();
    return sendSuccess(res, history, 200, 'AI decision history retrieved');
  } catch (err) {
    next(err);
  }
};
