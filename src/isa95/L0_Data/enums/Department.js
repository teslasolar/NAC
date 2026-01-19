/**
 * @fileoverview County department enumeration
 * @module L0/enums/Department
 */
export const Department = {
  CONTROLLER: '101',
  EXECUTIVE: '102',
  COUNCIL: '103',
  FISCAL: '110',
  HUMAN_SERVICES: '200',
  CORRECTIONS: '300',
  COURTS: '400',
  SHERIFF: '410',
  DA: '420',
  PUBLIC_DEFENDER: '430',
  RECORDER: '500',
  REGISTER: '510',
  PROTHONOTARY: '520',
  CLERK_COURTS: '530'
};

export const DepartmentNames = Object.fromEntries(
  Object.entries(Department).map(([k, v]) => [v, k.replace(/_/g, ' ')])
);
