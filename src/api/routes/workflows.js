/**
 * Workflow Routes
 *
 * Handles workflow management endpoints including
 * workflow definitions and instance management.
 *
 * @module api/routes/workflows
 */

import { Router } from 'express';

const router = Router();

/**
 * Create workflows router with injected dependencies
 * @param {Object} deps - Dependencies
 * @param {Object} deps.configLoader - Configuration loader
 * @param {Object} deps.workflowEngine - Workflow engine
 */
export function createWorkflowsRouter({ configLoader, workflowEngine }) {

  /**
   * @api {get} /api/workflows Get Available Workflows
   */
  router.get('/', (req, res) => {
    try {
      const workflowConfig = configLoader.getConfig('L2', 'workflowRules');
      const workflows = Object.entries(workflowConfig.workflows).map(([id, wf]) => ({
        id,
        name: wf.name,
        steps: wf.steps?.length || 0,
        defaultSLA: wf.defaultSLA
      }));

      res.json({ workflows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/workflows/:id Get Workflow Details
   */
  router.get('/:id', (req, res) => {
    try {
      const workflow = configLoader.getWorkflow(req.params.id);
      if (!workflow) {
        return res.status(404).json({ error: `Workflow not found: ${req.params.id}` });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {post} /api/workflows/:id/instances Start Workflow Instance
   */
  router.post('/:id/instances', (req, res) => {
    try {
      const { workItemId, initiator, data } = req.body;

      const instance = workflowEngine.createInstance(req.params.id, {
        workItemId,
        initiator,
        data,
        startedAt: new Date().toISOString()
      });

      res.status(201).json({
        instanceId: instance.id,
        workflowId: req.params.id,
        status: instance.status,
        currentStep: instance.currentStep
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}

export default createWorkflowsRouter;
