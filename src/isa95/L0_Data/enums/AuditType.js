/**
 * @fileoverview Audit type enumeration
 * @module L0/enums/AuditType
 */
export const AuditType = {
  FINANCIAL: 'financial',
  COMPLIANCE: 'compliance',
  OPERATIONAL: 'operational',
  FORENSIC: 'forensic',
  SPECIAL: 'special'
};

export const AuditTypeConfig = {
  [AuditType.FINANCIAL]: { frequency: 'annual', standard: 'GAGAS' },
  [AuditType.COMPLIANCE]: { frequency: 'as_needed', standard: 'SingleAudit' },
  [AuditType.OPERATIONAL]: { frequency: 'rotation', standard: 'GFOA' },
  [AuditType.FORENSIC]: { frequency: 'triggered', standard: 'ACFE' },
  [AuditType.SPECIAL]: { frequency: 'requested', standard: 'varies' }
};
