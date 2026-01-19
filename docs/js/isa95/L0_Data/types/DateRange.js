/**
 * @fileoverview Date range type for fiscal periods
 * @module L0/types/DateRange
 */
export const DateRange = {
  type: 'DateRange',
  fields: {
    start: { type: 'Date', required: true },
    end: { type: 'Date', required: true }
  },
  validate: (v) => v.start <= v.end,
  contains: (range, date) => date >= range.start && date <= range.end
};
