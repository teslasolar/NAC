/**
 * @fileoverview Salary Board operations and procedures
 * @module L3/controller/SalaryBoard
 * @authority 16 Pa.C.S. §1502
 */

export const SalaryBoard = {
  authority: '16 Pa.C.S. §1502',
  composition: {
    members: ['Controller', 'Commissioner 1', 'Commissioner 2', 'Commissioner 3'],
    chair: 'Controller',
    quorum: 3,
    votingMethod: 'majority'
  },
  jurisdiction: [
    'Set salaries for all county employees',
    'Approve position classifications',
    'Establish pay ranges',
    'Approve salary adjustments'
  ],
  meetingRequirements: {
    frequency: 'as needed',
    notice: '48 hours',
    publicMeeting: true,
    minutesRequired: true
  },
  approvalProcess: {
    newPositions: 'Salary Board vote',
    reclassifications: 'Salary Board vote',
    costOfLiving: 'Salary Board vote',
    meritIncreases: 'Within approved ranges'
  },
  controllerRole: {
    chair: true,
    votingMember: true,
    certifiesBudgetImpact: true,
    maintainsRecords: true
  }
};
