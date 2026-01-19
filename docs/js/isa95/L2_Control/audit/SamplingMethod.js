/**
 * @fileoverview Audit sampling methodology
 * @module L2/audit/SamplingMethod
 */
export const SamplingMethod = {
  process: 'SamplingMethod',
  methods: {
    random: {
      name: 'Random',
      use: 'General population testing',
      formula: (pop, conf, tol) => Math.ceil((pop * 1.96 * 1.96 * 0.25) / (tol * tol * (pop - 1) + 1.96 * 1.96 * 0.25))
    },
    monetary: {
      name: 'Monetary Unit',
      use: 'Dollar-weighted sampling',
      interval: (total, sampleSize) => total / sampleSize
    },
    judgmental: {
      name: 'Judgmental',
      use: 'High-risk items, specific criteria'
    }
  },
  recommend: (population, dollarTotal, riskLevel) =>
    riskLevel === 'high' ? 'monetary' : population > 1000 ? 'random' : 'judgmental'
};
