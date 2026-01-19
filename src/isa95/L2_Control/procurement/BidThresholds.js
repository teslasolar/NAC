/**
 * @fileoverview Procurement bid thresholds
 * @module L2/procurement/BidThresholds
 */
export const BidThresholds = {
  process: 'BidThresholds',
  thresholds: {
    noQuote: { max: 1000, method: 'Direct purchase' },
    phoneQuote: { min: 1000, max: 5000, quotes: 3 },
    writtenQuote: { min: 5000, max: 21900, quotes: 3 },
    formalBid: { min: 21900, method: 'Sealed bid' },
    rfp: { min: 21900, method: 'RFP for services' }
  },
  exemptions: [
    'Sole source',
    'Emergency',
    'Cooperative purchasing',
    'Professional services'
  ],
  check: (amount, type) => {
    const t = BidThresholds.thresholds;
    if (amount < t.noQuote.max) return 'noQuote';
    if (amount < t.phoneQuote.max) return 'phoneQuote';
    if (amount < t.writtenQuote.max) return 'writtenQuote';
    return type === 'services' ? 'rfp' : 'formalBid';
  }
};
