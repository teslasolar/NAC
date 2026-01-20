/**
 * Transaction Routes
 *
 * Handles fee schedules, work items, and transaction processing.
 *
 * @module api/routes/transactions
 */

import { Router } from 'express';

const router = Router();

/**
 * Create transactions router with injected dependencies
 * @param {Object} deps - Dependencies
 * @param {Object} deps.configLoader - Configuration loader
 * @param {Object} deps.blockchainSigner - Blockchain signer
 */
export function createTransactionsRouter({ configLoader, blockchainSigner }) {

  /**
   * @api {get} /api/transactions/fees Fee Schedules
   */
  router.get('/fees', (req, res) => {
    try {
      const fees = configLoader.getConfig('L1', 'feeSchedules');
      res.json(fees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/transactions/fees/:officerId Get Officer Fee Schedule
   */
  router.get('/fees/:officerId', (req, res) => {
    try {
      const schedule = configLoader.getFeeSchedule(req.params.officerId);
      if (!schedule) {
        return res.status(404).json({ error: `Fee schedule not found: ${req.params.officerId}` });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {post} /api/transactions/calculate Calculate Fee
   */
  router.post('/calculate', (req, res) => {
    try {
      const { officerId, feeType, params } = req.body;
      const fee = configLoader.calculateFee(officerId, feeType, params);
      res.json(fee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}

/**
 * Create work items router with injected dependencies
 * @param {Object} deps - Dependencies
 * @param {Object} deps.configLoader - Configuration loader
 * @param {Object} deps.blockchainSigner - Blockchain signer
 */
export function createWorkItemsRouter({ configLoader, blockchainSigner }) {
  const workItemsRouter = Router();

  /**
   * @api {get} /api/workitems/types Get Work Item Types
   */
  workItemsRouter.get('/types', (req, res) => {
    try {
      const types = configLoader.getConfig('L0', 'workItemTypes');
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {post} /api/workitems Create Work Item
   */
  workItemsRouter.post('/', (req, res) => {
    try {
      const { unitId, typeId, data } = req.body;

      if (!unitId || !typeId) {
        return res.status(400).json({ error: 'unitId and typeId are required' });
      }

      const workItem = configLoader.createWorkItem(unitId, typeId, data);

      // Sign with blockchain
      const signature = blockchainSigner.signTransaction({
        type: 'WORK_ITEM_CREATED',
        workItemId: workItem.id,
        unitId,
        typeId,
        timestamp: new Date().toISOString()
      });

      res.status(201).json({
        workItem: {
          id: workItem.id,
          type: workItem.type,
          status: workItem.status,
          priority: workItem.priority,
          createdAt: workItem.createdAt
        },
        signature
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return workItemsRouter;
}

export default createTransactionsRouter;
