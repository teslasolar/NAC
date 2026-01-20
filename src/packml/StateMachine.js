/**
 * PackML State Machine
 * OMAC PackML standard state model for county operations
 *
 * PackML States:
 * - Production States: Idle, Starting, Execute, Completing, Complete
 * - Pause States: Holding, Held, Unholding, Suspending, Suspended, Unsuspending
 * - Stop States: Stopping, Stopped, Aborting, Aborted, Clearing, Resetting
 *
 * Applied to county government:
 * - Claim Processing
 * - Audit Execution
 * - Budget Cycles
 * - Board Meetings
 */

// PackML Standard States
const PackMLState = {
  // Base States
  UNDEFINED: 'undefined',
  CLEARING: 'clearing',
  STOPPED: 'stopped',
  STARTING: 'starting',
  IDLE: 'idle',
  SUSPENDED: 'suspended',
  EXECUTE: 'execute',
  STOPPING: 'stopping',
  ABORTING: 'aborting',
  ABORTED: 'aborted',
  HOLDING: 'holding',
  HELD: 'held',
  UNHOLDING: 'unholding',
  SUSPENDING: 'suspending',
  UNSUSPENDING: 'unsuspending',
  RESETTING: 'resetting',
  COMPLETING: 'completing',
  COMPLETE: 'complete',
};

// PackML Commands
const PackMLCommand = {
  RESET: 'reset',
  START: 'start',
  STOP: 'stop',
  HOLD: 'hold',
  UNHOLD: 'unhold',
  SUSPEND: 'suspend',
  UNSUSPEND: 'unsuspend',
  ABORT: 'abort',
  CLEAR: 'clear',
  SC: 'state_complete', // Internal state complete signal
};

// PackML Mode
const PackMLMode = {
  PRODUCTION: 'production',
  MAINTENANCE: 'maintenance',
  MANUAL: 'manual',
  UNDEFINED: 'undefined',
};

// Valid state transitions per PackML spec
const StateTransitions = {
  [PackMLState.UNDEFINED]: {
    [PackMLCommand.CLEAR]: PackMLState.CLEARING,
  },
  [PackMLState.CLEARING]: {
    [PackMLCommand.SC]: PackMLState.STOPPED,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.STOPPED]: {
    [PackMLCommand.RESET]: PackMLState.RESETTING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.RESETTING]: {
    [PackMLCommand.SC]: PackMLState.IDLE,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.IDLE]: {
    [PackMLCommand.START]: PackMLState.STARTING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.STARTING]: {
    [PackMLCommand.SC]: PackMLState.EXECUTE,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.EXECUTE]: {
    [PackMLCommand.SC]: PackMLState.COMPLETING,
    [PackMLCommand.HOLD]: PackMLState.HOLDING,
    [PackMLCommand.SUSPEND]: PackMLState.SUSPENDING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.COMPLETING]: {
    [PackMLCommand.SC]: PackMLState.COMPLETE,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.COMPLETE]: {
    [PackMLCommand.RESET]: PackMLState.RESETTING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.HOLDING]: {
    [PackMLCommand.SC]: PackMLState.HELD,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.HELD]: {
    [PackMLCommand.UNHOLD]: PackMLState.UNHOLDING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.UNHOLDING]: {
    [PackMLCommand.SC]: PackMLState.EXECUTE,
    [PackMLCommand.HOLD]: PackMLState.HOLDING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.SUSPENDING]: {
    [PackMLCommand.SC]: PackMLState.SUSPENDED,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.SUSPENDED]: {
    [PackMLCommand.UNSUSPEND]: PackMLState.UNSUSPENDING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.UNSUSPENDING]: {
    [PackMLCommand.SC]: PackMLState.EXECUTE,
    [PackMLCommand.SUSPEND]: PackMLState.SUSPENDING,
    [PackMLCommand.STOP]: PackMLState.STOPPING,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.STOPPING]: {
    [PackMLCommand.SC]: PackMLState.STOPPED,
    [PackMLCommand.ABORT]: PackMLState.ABORTING,
  },
  [PackMLState.ABORTING]: {
    [PackMLCommand.SC]: PackMLState.ABORTED,
  },
  [PackMLState.ABORTED]: {
    [PackMLCommand.CLEAR]: PackMLState.CLEARING,
  },
};

class PackMLStateMachine {
  constructor(unitId) {
    this.unitId = unitId;
    this.state = PackMLState.UNDEFINED;
    this.mode = PackMLMode.PRODUCTION;
    this.history = [];
    this.stateStartTime = null;
    this.stateData = {};
    this.listeners = new Map();

    // PackML Admin tags
    this.admin = {
      stateChangeInProcess: false,
      machSpeed: 0,
      curMachSpeed: 0,
      machSpeedSetpoint: 100,
      equipmentInterlock: false,
      prodConsumedCount: [],
      prodProcessedCount: [],
      prodDefectiveCount: 0,
    };
  }

  getState() {
    return this.state;
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    if (this.state === PackMLState.STOPPED || this.state === PackMLState.IDLE) {
      this.mode = mode;
      this.log('MODE_CHANGE', { mode });
      return true;
    }
    return false;
  }

  command(cmd) {
    const transitions = StateTransitions[this.state];
    if (!transitions) {
      this.log('INVALID_STATE', { state: this.state, command: cmd });
      return false;
    }

    const nextState = transitions[cmd];
    if (!nextState) {
      this.log('INVALID_COMMAND', { state: this.state, command: cmd });
      return false;
    }

    return this.transitionTo(nextState, cmd);
  }

  transitionTo(newState, trigger = 'internal') {
    const prevState = this.state;
    const prevDuration = this.stateStartTime
      ? Date.now() - this.stateStartTime
      : 0;

    this.admin.stateChangeInProcess = true;

    // Execute exit action
    this.executeStateAction(prevState, 'exit');

    this.state = newState;
    this.stateStartTime = Date.now();

    // Execute entry action
    this.executeStateAction(newState, 'enter');

    this.admin.stateChangeInProcess = false;

    this.log('STATE_TRANSITION', {
      from: prevState,
      to: newState,
      trigger,
      prevDuration,
    });

    // Notify listeners
    this.emit('stateChange', { from: prevState, to: newState, trigger });

    // Auto-complete transient states
    this.handleTransientState(newState);

    return true;
  }

  executeStateAction(state, phase) {
    const action = this.stateData[`${state}_${phase}`];
    if (typeof action === 'function') {
      try {
        action(this);
      } catch (err) {
        this.log('ACTION_ERROR', { state, phase, error: err.message });
      }
    }
  }

  handleTransientState(state) {
    // Auto-complete acting states after their action completes
    const transientStates = [
      PackMLState.CLEARING,
      PackMLState.STARTING,
      PackMLState.COMPLETING,
      PackMLState.RESETTING,
      PackMLState.HOLDING,
      PackMLState.UNHOLDING,
      PackMLState.SUSPENDING,
      PackMLState.UNSUSPENDING,
      PackMLState.STOPPING,
      PackMLState.ABORTING,
    ];

    if (transientStates.includes(state)) {
      // In real implementation, this would be triggered by action completion
      // For simulation, auto-complete after brief delay
      setTimeout(() => {
        if (this.state === state) {
          this.command(PackMLCommand.SC);
        }
      }, 100);
    }
  }

  setStateAction(state, phase, action) {
    this.stateData[`${state}_${phase}`] = action;
    return this;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return this;
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  log(event, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      unitId: this.unitId,
      event,
      state: this.state,
      mode: this.mode,
      ...data,
    };
    this.history.push(entry);
    return entry;
  }

  getHistory() {
    return [...this.history];
  }

  getStatus() {
    return {
      unitId: this.unitId,
      state: this.state,
      mode: this.mode,
      stateTime: this.stateStartTime
        ? Date.now() - this.stateStartTime
        : 0,
      admin: { ...this.admin },
    };
  }
}

module.exports = {
  PackMLState,
  PackMLCommand,
  PackMLMode,
  StateTransitions,
  PackMLStateMachine,
};
