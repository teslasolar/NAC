/**
 * ISA-88 Batch Executor
 * Executes legal code recipes as batch processes
 * Maintains audit trail of all state transitions
 */

const { RecipeStatus } = require('./RecipeManager');

const BatchState = {
  IDLE: 'idle',
  RUNNING: 'running',
  COMPLETE: 'complete',
  PAUSED: 'paused',
  HELD: 'held',
  ABORTED: 'aborted',
  STOPPED: 'stopped',
};

const BatchCommand = {
  START: 'start',
  STOP: 'stop',
  HOLD: 'hold',
  RESTART: 'restart',
  ABORT: 'abort',
  PAUSE: 'pause',
  RESUME: 'resume',
  RESET: 'reset',
};

class BatchExecutor {
  constructor(batchId) {
    this.batchId = batchId;
    this.state = BatchState.IDLE;
    this.recipe = null;
    this.context = {};
    this.history = [];
    this.startTime = null;
    this.endTime = null;
    this.currentProcedure = null;
    this.currentUnitProcedure = null;
    this.currentOperation = null;
    this.currentPhase = null;
  }

  loadRecipe(recipe) {
    this.recipe = recipe;
    this.log('RECIPE_LOADED', { recipeId: recipe.id, statute: recipe.statute });
    return this;
  }

  setContext(ctx) {
    this.context = { ...this.context, ...ctx };
    return this;
  }

  command(cmd) {
    const validTransitions = {
      [BatchState.IDLE]: [BatchCommand.START],
      [BatchState.RUNNING]: [BatchCommand.HOLD, BatchCommand.STOP, BatchCommand.ABORT, BatchCommand.PAUSE],
      [BatchState.PAUSED]: [BatchCommand.RESUME, BatchCommand.STOP, BatchCommand.ABORT],
      [BatchState.HELD]: [BatchCommand.RESTART, BatchCommand.STOP, BatchCommand.ABORT],
      [BatchState.COMPLETE]: [BatchCommand.RESET],
      [BatchState.ABORTED]: [BatchCommand.RESET],
      [BatchState.STOPPED]: [BatchCommand.RESET],
    };

    if (!validTransitions[this.state]?.includes(cmd)) {
      this.log('INVALID_COMMAND', { cmd, currentState: this.state });
      return false;
    }

    const stateMap = {
      [BatchCommand.START]: BatchState.RUNNING,
      [BatchCommand.STOP]: BatchState.STOPPED,
      [BatchCommand.HOLD]: BatchState.HELD,
      [BatchCommand.RESTART]: BatchState.RUNNING,
      [BatchCommand.ABORT]: BatchState.ABORTED,
      [BatchCommand.PAUSE]: BatchState.PAUSED,
      [BatchCommand.RESUME]: BatchState.RUNNING,
      [BatchCommand.RESET]: BatchState.IDLE,
    };

    const prevState = this.state;
    this.state = stateMap[cmd];
    this.log('STATE_CHANGE', { from: prevState, to: this.state, command: cmd });

    if (cmd === BatchCommand.START) {
      this.startTime = new Date().toISOString();
      this.execute();
    }

    return true;
  }

  async execute() {
    if (!this.recipe) {
      this.log('ERROR', { message: 'No recipe loaded' });
      return;
    }

    for (const procedure of this.recipe.procedures) {
      if (this.state !== BatchState.RUNNING) break;

      this.currentProcedure = procedure;
      procedure.status = RecipeStatus.RUNNING;
      this.log('PROCEDURE_START', { id: procedure.id, name: procedure.name });

      for (const unitProcedure of procedure.unitProcedures) {
        if (this.state !== BatchState.RUNNING) break;

        this.currentUnitProcedure = unitProcedure;
        unitProcedure.status = RecipeStatus.RUNNING;
        this.log('UNIT_PROCEDURE_START', {
          id: unitProcedure.id,
          name: unitProcedure.name,
          unit: unitProcedure.targetUnit
        });

        for (const operation of unitProcedure.operations) {
          if (this.state !== BatchState.RUNNING) break;

          this.currentOperation = operation;
          operation.status = RecipeStatus.RUNNING;
          this.log('OPERATION_START', { id: operation.id, name: operation.name });

          for (const phase of operation.phases) {
            if (this.state !== BatchState.RUNNING) break;

            this.currentPhase = phase;
            phase.status = RecipeStatus.RUNNING;
            this.log('PHASE_START', { id: phase.id, name: phase.name });

            try {
              if (phase.action) {
                phase.result = await phase.action(this.context);
              }
              phase.status = RecipeStatus.COMPLETE;
              this.log('PHASE_COMPLETE', { id: phase.id, result: phase.result });
            } catch (err) {
              phase.status = RecipeStatus.ABORTED;
              this.log('PHASE_ERROR', { id: phase.id, error: err.message });
              this.command(BatchCommand.ABORT);
            }
          }

          if (this.state === BatchState.RUNNING) {
            operation.status = RecipeStatus.COMPLETE;
            this.log('OPERATION_COMPLETE', { id: operation.id });
          }
        }

        if (this.state === BatchState.RUNNING) {
          unitProcedure.status = RecipeStatus.COMPLETE;
          this.log('UNIT_PROCEDURE_COMPLETE', { id: unitProcedure.id });
        }
      }

      if (this.state === BatchState.RUNNING) {
        procedure.status = RecipeStatus.COMPLETE;
        this.log('PROCEDURE_COMPLETE', { id: procedure.id });
      }
    }

    if (this.state === BatchState.RUNNING) {
      this.state = BatchState.COMPLETE;
      this.endTime = new Date().toISOString();
      this.log('BATCH_COMPLETE', {
        duration: new Date(this.endTime) - new Date(this.startTime)
      });
    }
  }

  log(event, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      batchId: this.batchId,
      event,
      ...data,
    };
    this.history.push(entry);
    return entry;
  }

  getAuditTrail() {
    return {
      batchId: this.batchId,
      recipe: this.recipe?.id,
      statute: this.recipe?.statute,
      state: this.state,
      startTime: this.startTime,
      endTime: this.endTime,
      history: this.history,
    };
  }
}

module.exports = { BatchExecutor, BatchState, BatchCommand };
