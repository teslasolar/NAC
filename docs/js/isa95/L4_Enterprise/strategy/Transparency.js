/**
 * @fileoverview Public transparency strategy
 * @module L4/strategy/Transparency
 */
export const Transparency = {
  level: 'enterprise',
  commitments: [
    'Publish all audit reports',
    'Online checkbook',
    'Budget documents public',
    'RTKL compliance'
  ],
  channels: {
    website: 'controller reports section',
    meetings: 'public attendance welcome',
    requests: 'RTKL within 5 days',
    data: 'open data portal'
  },
  metrics: {
    rtklResponseTime: '5 business days',
    reportPublicationTime: '30 days from completion'
  }
};
