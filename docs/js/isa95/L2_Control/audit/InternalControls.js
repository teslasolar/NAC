/**
 * @fileoverview Internal control framework
 * @module L2/audit/InternalControls
 * @authority 16 Pa.C.S. §1707
 */

export const InternalControls = {
  process: 'InternalControls',
  authority: '16 Pa.C.S. §1707',
  framework: 'COSO',
  components: {
    controlEnvironment: [
      'Tone at the top',
      'Ethics and integrity',
      'Organizational structure',
      'Competence and accountability'
    ],
    riskAssessment: [
      'Fraud risk identification',
      'Change management',
      'Risk tolerance levels'
    ],
    controlActivities: [
      'Segregation of duties',
      'Authorization controls',
      'Physical controls',
      'IT controls'
    ],
    informationCommunication: [
      'Financial reporting',
      'Policy dissemination',
      'Whistleblower channels'
    ],
    monitoring: [
      'Ongoing evaluations',
      'Separate evaluations',
      'Corrective actions'
    ]
  },
  keyControls: {
    cashReceipts: ['Dual custody', 'Daily deposits', 'Reconciliation'],
    disbursements: ['Approval hierarchy', 'Check signing', 'Warrant review'],
    payroll: ['Timekeeping', 'Rate verification', 'Distribution'],
    procurement: ['Bid requirements', 'Contract review', 'Receiving']
  }
};
