/**
 * Production Units (Row Officers) Routes
 *
 * Handles all endpoints related to ISA-95 production units
 * representing county row officers.
 *
 * @module api/routes/units
 */

import { Router } from 'express';

const router = Router();

/**
 * Create units router with injected dependencies
 * @param {Object} deps - Dependencies
 * @param {Object} deps.configLoader - Configuration loader
 */
export function createUnitsRouter({ configLoader }) {

  /**
   * @api {get} /api/units Get All Production Units
   */
  router.get('/', (req, res) => {
    try {
      const unitsConfig = configLoader.getConfig('L3', 'productionUnits');
      const units = Object.entries(unitsConfig.units).map(([id, unit]) => ({
        id,
        name: unit.name,
        type: unit.type,
        authority: unit.authority,
        assemblyLines: unit.assemblyLines.length,
        staffing: unit.staffing
      }));

      res.json({
        enterprise: unitsConfig.enterprise,
        count: units.length,
        units
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/units/:id Get Production Unit by ID
   */
  router.get('/:id', (req, res) => {
    try {
      const unit = configLoader.createProductionUnit(req.params.id);
      res.json({
        id: unit.id,
        name: unit.name,
        type: unit.type,
        state: unit.stateMachine.currentState,
        mode: unit.stateMachine.currentMode,
        lines: unit.lines.map(l => ({
          id: l.id,
          name: l.name,
          stations: l.stations.length
        })),
        metrics: unit.getMetrics()
      });
    } catch (error) {
      res.status(404).json({ error: `Unit not found: ${req.params.id}` });
    }
  });

  /**
   * @api {get} /api/units/:id/state Get Unit State Machine Status
   */
  router.get('/:id/state', (req, res) => {
    try {
      const unit = configLoader.createProductionUnit(req.params.id);
      const sm = unit.stateMachine;

      res.json({
        unitId: req.params.id,
        currentState: sm.currentState,
        currentMode: sm.currentMode,
        availableTransitions: sm.getAvailableTransitions(),
        stateHistory: sm.stateHistory.slice(-10)
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  /**
   * @api {post} /api/units/:id/command Send Command to Unit
   */
  router.post('/:id/command', (req, res) => {
    try {
      const { command } = req.body;
      const unit = configLoader.createProductionUnit(req.params.id);

      const validCommands = ['start', 'stop', 'hold', 'reset', 'abort', 'clear'];
      if (!validCommands.includes(command)) {
        return res.status(400).json({
          error: `Invalid command. Valid commands: ${validCommands.join(', ')}`
        });
      }

      const previousState = unit.stateMachine.currentState;
      const success = unit.stateMachine[command]?.();

      res.json({
        unitId: req.params.id,
        command,
        success: success !== false,
        previousState,
        currentState: unit.stateMachine.currentState
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

export default createUnitsRouter;
