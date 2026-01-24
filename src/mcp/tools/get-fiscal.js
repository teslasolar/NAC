/**
 * Fiscal Information Tools
 * Returns debt, tax rate, and fiscal data for Northampton County
 *
 * @module mcp/tools/get-fiscal
 */

export const getDebtInfoTool = {
  name: 'get_debt_info',
  description: 'Get Northampton County debt and bond information. Returns outstanding bonds, debt service, and credit rating.',
  inputSchema: {
    type: 'object',
    properties: {
      detail: {
        type: 'string',
        description: 'Level of detail: "summary", "bonds", or "full" (default: "summary")',
      },
    },
  },

  async execute(args) {
    const { detail = 'summary' } = args || {};

    // County debt data (from public records)
    const debtData = {
      totalOutstanding: 285000000,
      generalObligation: 195000000,
      reveneBonds: 90000000,
      debtService2026: 32000000,
      creditRating: {
        agency: "Moody's",
        rating: 'Aa2',
        outlook: 'Stable',
        lastReview: '2025-08-15',
      },
      debtPerCapita: 889, // ~320,000 population
      debtToAssessedValue: 0.85, // As percentage
      legalDebtLimit: 503000000, // Tied to budget
      remainingCapacity: 218000000,
    };

    const bonds = [
      {
        series: '2025 GO Bonds',
        purpose: 'Courthouse parking deck repairs, P-25 radio system',
        issued: '2025-09-15',
        principal: 45000000,
        maturity: '2045-09-15',
        rate: 4.25,
        outstanding: 45000000,
      },
      {
        series: '2023 GO Bonds',
        purpose: 'Bridge infrastructure, public works equipment',
        issued: '2023-06-01',
        principal: 55000000,
        maturity: '2043-06-01',
        rate: 3.85,
        outstanding: 48000000,
      },
      {
        series: '2020 GO Refunding',
        purpose: 'Refunding of 2010 and 2012 series for savings',
        issued: '2020-03-15',
        principal: 75000000,
        maturity: '2035-03-15',
        rate: 2.50,
        outstanding: 52000000,
      },
      {
        series: '2018 GO Bonds',
        purpose: '911 center, courthouse renovations',
        issued: '2018-11-01',
        principal: 60000000,
        maturity: '2038-11-01',
        rate: 4.00,
        outstanding: 35000000,
      },
      {
        series: 'Gracedale Revenue Bonds',
        purpose: 'Nursing home facility improvements',
        issued: '2019-05-01',
        principal: 50000000,
        maturity: '2039-05-01',
        rate: 3.75,
        outstanding: 38000000,
        type: 'Revenue',
        note: 'Secured by Gracedale revenues, not GO',
      },
    ];

    if (detail === 'summary') {
      return {
        totalDebt: debtData.totalOutstanding,
        debtService2026: debtData.debtService2026,
        creditRating: debtData.creditRating.rating,
        ratingOutlook: debtData.creditRating.outlook,
        debtPerCapita: debtData.debtPerCapita,
        remainingBorrowingCapacity: debtData.remainingCapacity,
        source: 'NAC Digital Twin - Fiscal Data',
      };
    }

    if (detail === 'bonds') {
      return {
        bonds,
        totalOutstanding: bonds.reduce((sum, b) => sum + b.outstanding, 0),
        source: 'NAC Digital Twin - Bond Data',
      };
    }

    // Full detail
    return {
      ...debtData,
      bonds,
      debtHistory: [
        { year: 2024, outstanding: 295000000 },
        { year: 2023, outstanding: 280000000 },
        { year: 2022, outstanding: 265000000 },
        { year: 2021, outstanding: 258000000 },
        { year: 2020, outstanding: 275000000 },
      ],
      source: 'NAC Digital Twin - Full Fiscal Data',
    };
  },
};

export const getTaxRateTool = {
  name: 'get_tax_rate',
  description: 'Get Northampton County tax rates and assessment information.',
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'Tax type: "property", "hotel", "all" (default: "all")',
      },
      municipality: {
        type: 'string',
        description: 'Specific municipality for combined rate calculation',
      },
    },
  },

  async execute(args) {
    const { type = 'all', municipality } = args || {};

    const taxData = {
      property: {
        countyMillage: 10.8,
        assessmentRatio: 100,
        lastReassessment: 2024,
        nextReassessment: 'TBD',
        noIncreaseYears: 8, // 8 consecutive years without increase
        lastIncreaseYear: 2018,
        averageHomeValue: 275000,
        averageCountyTax: 2970, // 10.8 mills on $275k
        note: 'No real estate tax increase for 8th consecutive year (FY2026)',
      },
      hotel: {
        rate: 5.0, // 5% hotel occupancy tax
        collectionAgent: 'County Treasurer',
        revenue2025: 3500000,
        use: 'Tourism promotion, convention center support',
      },
      deed: {
        transferTaxRate: 1.0, // 1% county portion
        stateRate: 1.0, // 1% state portion
        totalRate: 2.0,
        exemptions: ['Transfers between family members', 'Government transfers'],
      },
      perCapita: {
        countyTax: 5.00,
        note: 'Per capita tax varies by municipality',
      },
    };

    // Municipality data for combined rates
    const municipalities = {
      bethlehem: { name: 'Bethlehem', schoolMillage: 22.5, municipalMillage: 6.8, totalMillage: 40.1 },
      easton: { name: 'Easton', schoolMillage: 24.2, municipalMillage: 7.2, totalMillage: 42.2 },
      nazareth: { name: 'Nazareth', schoolMillage: 18.9, municipalMillage: 4.5, totalMillage: 34.2 },
      'palmer township': { name: 'Palmer Township', schoolMillage: 21.3, municipalMillage: 2.8, totalMillage: 34.9 },
      'lower saucon': { name: 'Lower Saucon Township', schoolMillage: 20.1, municipalMillage: 3.2, totalMillage: 34.1 },
    };

    let result = {};

    if (type === 'property' || type === 'all') {
      result.propertyTax = taxData.property;
    }

    if (type === 'hotel' || type === 'all') {
      result.hotelTax = taxData.hotel;
    }

    if (type === 'all') {
      result.deedTransferTax = taxData.deed;
      result.perCapitaTax = taxData.perCapita;
    }

    if (municipality) {
      const key = municipality.toLowerCase();
      const muni = municipalities[key] || Object.values(municipalities).find(m =>
        m.name.toLowerCase().includes(key)
      );

      if (muni) {
        result.municipalityBreakdown = {
          ...muni,
          countyMillage: taxData.property.countyMillage,
          estimatedTaxOn275k: {
            county: 2970,
            school: Math.round(275000 * muni.schoolMillage / 1000),
            municipal: Math.round(275000 * muni.municipalMillage / 1000),
            total: Math.round(275000 * muni.totalMillage / 1000),
          },
        };
      }
    }

    return {
      ...result,
      assessmentAppealsDeadline: 'August 1 annually',
      assessmentOffice: 'Northampton County Assessment Office',
      source: 'NAC Digital Twin - Tax Rate Data',
    };
  },
};

export const getFiscalYearInfoTool = {
  name: 'get_fiscal_year_info',
  description: 'Get fiscal year calendar and budget cycle information.',
  inputSchema: {
    type: 'object',
    properties: {
      year: {
        type: 'number',
        description: 'Fiscal year (default: current)',
      },
    },
  },

  async execute(args) {
    const { year = 2026 } = args || {};

    return {
      fiscalYear: year,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      budgetCycle: {
        executiveProposal: `${year - 1}-10-01`,
        councilHearings: `${year - 1}-10-15 to ${year - 1}-11-30`,
        adoption: `${year - 1}-12-04`,
        implementation: `${year}-01-01`,
      },
      keyDates: [
        { date: `${year}-01-01`, event: 'Fiscal year begins' },
        { date: `${year}-04-15`, event: 'Q1 financial reports due' },
        { date: `${year}-06-30`, event: 'Mid-year budget review' },
        { date: `${year}-08-01`, event: 'Assessment appeal deadline' },
        { date: `${year}-10-01`, event: `FY${year + 1} budget proposal due` },
        { date: `${year}-12-31`, event: 'Fiscal year ends' },
      ],
      quarterlyReports: [
        { quarter: 'Q1', due: `${year}-04-15`, period: 'Jan-Mar' },
        { quarter: 'Q2', due: `${year}-07-15`, period: 'Apr-Jun' },
        { quarter: 'Q3', due: `${year}-10-15`, period: 'Jul-Sep' },
        { quarter: 'Q4', due: `${year + 1}-01-15`, period: 'Oct-Dec' },
      ],
      source: 'NAC Digital Twin - Fiscal Calendar',
    };
  },
};
