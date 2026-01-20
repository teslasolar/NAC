/**
 * UnitConnections - Inter-unit workflow dependencies
 *
 * Defines the connections between row officer production units
 * representing the flow of work, fees, and cases between offices.
 *
 * @module digitaltwin/helpers/UnitConnections
 */

/**
 * Connection types
 */
export const ConnectionType = {
  FEE_DEPOSIT: 'fee-deposit',
  CASE_REFERRAL: 'case-referral',
  CASE_FILING: 'case-filing',
  SERVICE_REQUEST: 'service-request',
  REFERRAL: 'referral',
  DEED_RECORDING: 'deed-recording',
  JUDGMENT: 'judgment'
};

/**
 * Get all inter-unit connections (workflow dependencies)
 * @returns {Array<{from: string, to: string, type: string, label: string}>}
 */
export function getUnitConnections() {
  return [
    // Financial flow: fees/funds -> Treasurer
    { from: 'sheriff', to: 'treasurer', type: ConnectionType.FEE_DEPOSIT, label: 'Fee Collection' },
    { from: 'coroner', to: 'treasurer', type: ConnectionType.FEE_DEPOSIT, label: 'Permit Fees' },
    { from: 'clerk-of-courts', to: 'treasurer', type: ConnectionType.FEE_DEPOSIT, label: 'Court Fees' },
    { from: 'prothonotary', to: 'treasurer', type: ConnectionType.FEE_DEPOSIT, label: 'Filing Fees' },
    { from: 'recorder-of-deeds', to: 'treasurer', type: ConnectionType.FEE_DEPOSIT, label: 'Recording Fees' },
    { from: 'register-of-wills', to: 'treasurer', type: ConnectionType.FEE_DEPOSIT, label: 'Probate Fees' },

    // Criminal justice flow
    { from: 'sheriff', to: 'district-attorney', type: ConnectionType.CASE_REFERRAL, label: 'Arrests' },
    { from: 'district-attorney', to: 'clerk-of-courts', type: ConnectionType.CASE_FILING, label: 'Criminal Cases' },
    { from: 'district-attorney', to: 'prothonotary', type: ConnectionType.CASE_FILING, label: 'Civil Matters' },

    // Court documents
    { from: 'prothonotary', to: 'sheriff', type: ConnectionType.SERVICE_REQUEST, label: 'Writs' },
    { from: 'clerk-of-courts', to: 'sheriff', type: ConnectionType.SERVICE_REQUEST, label: 'Subpoenas' },

    // Death investigations
    { from: 'coroner', to: 'district-attorney', type: ConnectionType.REFERRAL, label: 'Suspicious Deaths' },

    // Property records
    { from: 'sheriff', to: 'recorder-of-deeds', type: ConnectionType.DEED_RECORDING, label: 'Sheriff Deeds' },

    // Estate matters
    { from: 'register-of-wills', to: 'prothonotary', type: ConnectionType.JUDGMENT, label: 'Estate Judgments' }
  ];
}

/**
 * Get connections for a specific unit
 * @param {string} unitId - Unit identifier
 * @returns {Object} Incoming and outgoing connections
 */
export function getConnectionsForUnit(unitId) {
  const all = getUnitConnections();
  return {
    incoming: all.filter(c => c.to === unitId),
    outgoing: all.filter(c => c.from === unitId)
  };
}

/**
 * Calculate unit layout positions for 3D visualization
 * @param {Array} units - Array of units
 * @param {Object} options - Layout options
 * @returns {Map<string, Object>} Unit positions
 */
export function calculateUnitLayout(units, options = {}) {
  const cols = options.cols || 4;
  const spacing = options.spacing || { x: 80, z: 60 };
  const positions = new Map();

  units.forEach((unit, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    positions.set(unit.id, {
      x: col * spacing.x,
      y: 0,
      z: row * spacing.z
    });
  });

  return positions;
}

export default {
  ConnectionType,
  getUnitConnections,
  getConnectionsForUnit,
  calculateUnitLayout
};
