/**
 * PackML State Machine - ISA-88 / ISA-TR88.00.02
 *
 * Formal state machine for county government operations modeled as
 * manufacturing equipment states. Each row officer's processes follow
 * this standard state model.
 *
 * @module isa88/PackML
 */

/**
 * PackML States per ISA-TR88.00.02
 * These are the 17 states defined in the PackML standard
 */
export const PackMLState = {
  // Stopped States (waiting states)
  STOPPED: 'STOPPED',
  IDLE: 'IDLE',
  COMPLETE: 'COMPLETE',
  HELD: 'HELD',
  SUSPENDED: 'SUSPENDED',
  ABORTED: 'ABORTED',

  // Acting States (transient states)
  STARTING: 'STARTING',
  EXECUTE: 'EXECUTE',
  COMPLETING: 'COMPLETING',
  RESETTING: 'RESETTING',
  HOLDING: 'HOLDING',
  UNHOLDING: 'UNHOLDING',
  SUSPENDING: 'SUSPENDING',
  UNSUSPENDING: 'UNSUSPENDING',
  STOPPING: 'STOPPING',
  ABORTING: 'ABORTING',
  CLEARING: 'CLEARING'
};

/**
 * PackML Mode - Operating modes for production units
 */
export const PackMLMode = {
  PRODUCTION: 'PRODUCTION',     // Normal operation
  MAINTENANCE: 'MAINTENANCE',   // Maintenance mode
  MANUAL: 'MANUAL',             // Manual intervention
  AUDIT: 'AUDIT',               // Under audit/review
  TRAINING: 'TRAINING'          // Training mode
};

/**
 * Valid state transitions per PackML specification
 */
export const PackMLTransitions = {
  [PackMLState.STOPPED]: [PackMLState.RESETTING, PackMLState.ABORTING],
  [PackMLState.RESETTING]: [PackMLState.IDLE, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.IDLE]: [PackMLState.STARTING, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.STARTING]: [PackMLState.EXECUTE, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.EXECUTE]: [PackMLState.COMPLETING, PackMLState.HOLDING, PackMLState.SUSPENDING, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.COMPLETING]: [PackMLState.COMPLETE, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.COMPLETE]: [PackMLState.RESETTING, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.HOLDING]: [PackMLState.HELD, PackMLState.ABORTING],
  [PackMLState.HELD]: [PackMLState.UNHOLDING, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.UNHOLDING]: [PackMLState.EXECUTE, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.SUSPENDING]: [PackMLState.SUSPENDED, PackMLState.ABORTING],
  [PackMLState.SUSPENDED]: [PackMLState.UNSUSPENDING, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.UNSUSPENDING]: [PackMLState.EXECUTE, PackMLState.STOPPING, PackMLState.ABORTING],
  [PackMLState.STOPPING]: [PackMLState.STOPPED, PackMLState.ABORTING],
  [PackMLState.ABORTING]: [PackMLState.ABORTED],
  [PackMLState.ABORTED]: [PackMLState.CLEARING],
  [PackMLState.CLEARING]: [PackMLState.STOPPED, PackMLState.ABORTING]
};

/**
 * PackML State Machine
 * Manages state transitions for production units (row officers)
 */
export class PackMLStateMachine {
  constructor(unitId, initialState = PackMLState.STOPPED) {
    this.unitId = unitId;
    this.currentState = initialState;
    this.currentMode = PackMLMode.PRODUCTION;
    this.stateHistory = [{
      state: initialState,
      timestamp: new Date().toISOString(),
      reason: 'Initial state'
    }];
    this.listeners = [];
  }

  /**
   * Get current state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Get current mode
   */
  getMode() {
    return this.currentMode;
  }

  /**
   * Check if transition is valid
   */
  canTransition(targetState) {
    const validTransitions = PackMLTransitions[this.currentState] || [];
    return validTransitions.includes(targetState);
  }

  /**
   * Get valid transitions from current state
   */
  getValidTransitions() {
    return PackMLTransitions[this.currentState] || [];
  }

  /**
   * Transition to new state
   */
  transition(targetState, reason = '') {
    if (!this.canTransition(targetState)) {
      throw new Error(
        `Invalid transition: ${this.currentState} -> ${targetState}. ` +
        `Valid transitions: ${this.getValidTransitions().join(', ')}`
      );
    }

    const previousState = this.currentState;
    this.currentState = targetState;

    const historyEntry = {
      from: previousState,
      to: targetState,
      timestamp: new Date().toISOString(),
      reason
    };

    this.stateHistory.push(historyEntry);
    this._notifyListeners(historyEntry);

    return historyEntry;
  }

  /**
   * Set operating mode
   */
  setMode(mode) {
    if (!Object.values(PackMLMode).includes(mode)) {
      throw new Error(`Invalid mode: ${mode}`);
    }
    this.currentMode = mode;
  }

  /**
   * Add state change listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove state change listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify all listeners of state change
   */
  _notifyListeners(historyEntry) {
    this.listeners.forEach(callback => {
      try {
        callback(historyEntry, this);
      } catch (e) {
        console.error('Listener error:', e);
      }
    });
  }

  /**
   * Get state history
   */
  getHistory() {
    return [...this.stateHistory];
  }

  /**
   * Check if in a waiting state
   */
  isWaiting() {
    return [
      PackMLState.STOPPED,
      PackMLState.IDLE,
      PackMLState.COMPLETE,
      PackMLState.HELD,
      PackMLState.SUSPENDED,
      PackMLState.ABORTED
    ].includes(this.currentState);
  }

  /**
   * Check if in an acting state
   */
  isActing() {
    return !this.isWaiting();
  }

  /**
   * Command shortcuts for common operations
   */
  reset(reason = 'Reset command') {
    return this.transition(PackMLState.RESETTING, reason);
  }

  start(reason = 'Start command') {
    if (this.currentState === PackMLState.IDLE) {
      return this.transition(PackMLState.STARTING, reason);
    }
    throw new Error('Can only start from IDLE state');
  }

  stop(reason = 'Stop command') {
    return this.transition(PackMLState.STOPPING, reason);
  }

  hold(reason = 'Hold command') {
    if (this.currentState === PackMLState.EXECUTE) {
      return this.transition(PackMLState.HOLDING, reason);
    }
    throw new Error('Can only hold from EXECUTE state');
  }

  unhold(reason = 'Unhold command') {
    if (this.currentState === PackMLState.HELD) {
      return this.transition(PackMLState.UNHOLDING, reason);
    }
    throw new Error('Can only unhold from HELD state');
  }

  suspend(reason = 'Suspend command') {
    if (this.currentState === PackMLState.EXECUTE) {
      return this.transition(PackMLState.SUSPENDING, reason);
    }
    throw new Error('Can only suspend from EXECUTE state');
  }

  unsuspend(reason = 'Unsuspend command') {
    if (this.currentState === PackMLState.SUSPENDED) {
      return this.transition(PackMLState.UNSUSPENDING, reason);
    }
    throw new Error('Can only unsuspend from SUSPENDED state');
  }

  abort(reason = 'Abort command') {
    return this.transition(PackMLState.ABORTING, reason);
  }

  clear(reason = 'Clear command') {
    if (this.currentState === PackMLState.ABORTED) {
      return this.transition(PackMLState.CLEARING, reason);
    }
    throw new Error('Can only clear from ABORTED state');
  }

  /**
   * Auto-complete acting states (simulation helper)
   */
  completeActingState() {
    const autoTransitions = {
      [PackMLState.RESETTING]: PackMLState.IDLE,
      [PackMLState.STARTING]: PackMLState.EXECUTE,
      [PackMLState.COMPLETING]: PackMLState.COMPLETE,
      [PackMLState.HOLDING]: PackMLState.HELD,
      [PackMLState.UNHOLDING]: PackMLState.EXECUTE,
      [PackMLState.SUSPENDING]: PackMLState.SUSPENDED,
      [PackMLState.UNSUSPENDING]: PackMLState.EXECUTE,
      [PackMLState.STOPPING]: PackMLState.STOPPED,
      [PackMLState.ABORTING]: PackMLState.ABORTED,
      [PackMLState.CLEARING]: PackMLState.STOPPED
    };

    const nextState = autoTransitions[this.currentState];
    if (nextState) {
      return this.transition(nextState, 'Auto-complete');
    }
    return null;
  }

  /**
   * Serialize state machine
   */
  toJSON() {
    return {
      unitId: this.unitId,
      currentState: this.currentState,
      currentMode: this.currentMode,
      isWaiting: this.isWaiting(),
      validTransitions: this.getValidTransitions(),
      historyLength: this.stateHistory.length
    };
  }
}

/**
 * State colors for visualization
 */
export const PackMLStateColors = {
  [PackMLState.STOPPED]: '#6c757d',    // Gray
  [PackMLState.IDLE]: '#17a2b8',       // Cyan
  [PackMLState.STARTING]: '#ffc107',   // Yellow
  [PackMLState.EXECUTE]: '#28a745',    // Green
  [PackMLState.COMPLETING]: '#20c997', // Teal
  [PackMLState.COMPLETE]: '#007bff',   // Blue
  [PackMLState.HOLDING]: '#fd7e14',    // Orange
  [PackMLState.HELD]: '#e83e8c',       // Pink
  [PackMLState.UNHOLDING]: '#fd7e14',  // Orange
  [PackMLState.SUSPENDING]: '#6f42c1', // Purple
  [PackMLState.SUSPENDED]: '#6f42c1',  // Purple
  [PackMLState.UNSUSPENDING]: '#6f42c1', // Purple
  [PackMLState.STOPPING]: '#dc3545',   // Red
  [PackMLState.ABORTING]: '#dc3545',   // Red
  [PackMLState.ABORTED]: '#343a40',    // Dark
  [PackMLState.CLEARING]: '#6c757d',   // Gray
  [PackMLState.RESETTING]: '#ffc107'   // Yellow
};

export default PackMLStateMachine;
