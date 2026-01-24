/**
 * Parcel Search Tool
 * Search and query parcel/GIS data for Northampton County
 *
 * @module mcp/tools/search-parcels
 */

export const searchParcelsTool = {
  name: 'search_parcels',
  description: 'Search Northampton County parcels by address, owner, or parcel ID. Returns assessment, zoning, and property details.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query: address, owner name, or parcel ID',
      },
      municipality: {
        type: 'string',
        description: 'Filter by municipality (e.g., "Bethlehem", "Easton")',
      },
      zoning: {
        type: 'string',
        description: 'Filter by zoning type (e.g., "R1", "C2", "I1")',
      },
      minAcres: {
        type: 'number',
        description: 'Minimum parcel size in acres',
      },
      maxAcres: {
        type: 'number',
        description: 'Maximum parcel size in acres',
      },
      vacant: {
        type: 'boolean',
        description: 'Filter for vacant parcels only',
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 10)',
      },
    },
  },

  async execute(args) {
    const {
      query,
      municipality,
      zoning,
      minAcres = 0,
      maxAcres = Infinity,
      vacant = false,
      limit = 10
    } = args || {};

    // Sample parcel data (in production, this would query County GIS)
    const parcels = [
      {
        parcelId: 'K9-15-4A-0021',
        address: '123 Main Street',
        municipality: 'Bethlehem',
        owner: 'Smith Family Trust',
        acres: 0.25,
        zoning: 'R2',
        zoningDesc: 'Residential Medium Density',
        landValue: 45000,
        buildingValue: 185000,
        totalAssessment: 230000,
        yearBuilt: 1952,
        vacant: false,
        lastSaleDate: '2019-06-15',
        lastSalePrice: 275000,
      },
      {
        parcelId: 'L8-22-3B-0105',
        address: '456 Industrial Blvd',
        municipality: 'Bethlehem',
        owner: 'Lehigh Valley Commerce LLC',
        acres: 12.5,
        zoning: 'I2',
        zoningDesc: 'Heavy Industrial',
        landValue: 850000,
        buildingValue: 2500000,
        totalAssessment: 3350000,
        yearBuilt: 1988,
        vacant: false,
        lastSaleDate: '2021-03-10',
        lastSalePrice: 4200000,
      },
      {
        parcelId: 'M7-10-1C-0033',
        address: '789 Commerce Way',
        municipality: 'Easton',
        owner: 'Delaware River Partners',
        acres: 5.2,
        zoning: 'C2',
        zoningDesc: 'Commercial General',
        landValue: 420000,
        buildingValue: 0,
        totalAssessment: 420000,
        yearBuilt: null,
        vacant: true,
        lastSaleDate: '2023-09-22',
        lastSalePrice: 550000,
        developmentPotential: 'Retail, office, mixed-use',
      },
      {
        parcelId: 'N4-05-2A-0078',
        address: '2200 Farmland Road',
        municipality: 'Lower Saucon Township',
        owner: 'Saucon Valley Farms Inc',
        acres: 145.0,
        zoning: 'AG',
        zoningDesc: 'Agricultural',
        landValue: 580000,
        buildingValue: 125000,
        totalAssessment: 705000,
        yearBuilt: 1875,
        vacant: false,
        preservation: 'Clean and Green enrolled',
        preferredUse: 'Agricultural',
      },
      {
        parcelId: 'K9-18-4D-0001',
        address: '500 Hospital Drive',
        municipality: 'Bethlehem',
        owner: 'St. Luke\'s Health Network',
        acres: 28.3,
        zoning: 'I1',
        zoningDesc: 'Institutional',
        landValue: 1200000,
        buildingValue: 45000000,
        totalAssessment: 46200000,
        yearBuilt: 1995,
        vacant: false,
        taxExempt: true,
        exemptionType: 'Healthcare/Charitable',
      },
      {
        parcelId: 'P2-11-5B-0042',
        address: 'Mountain View Lane (Lot 12)',
        municipality: 'Palmer Township',
        owner: 'Mountain View Developers',
        acres: 3.8,
        zoning: 'R1',
        zoningDesc: 'Residential Low Density',
        landValue: 195000,
        buildingValue: 0,
        totalAssessment: 195000,
        yearBuilt: null,
        vacant: true,
        approvedFor: 'Single family residential, 4 lots approved',
      },
      {
        parcelId: 'L5-33-2C-0088',
        address: '900 Center Street',
        municipality: 'Nazareth',
        owner: 'Borough of Nazareth',
        acres: 1.2,
        zoning: 'P',
        zoningDesc: 'Public/Park',
        landValue: 150000,
        buildingValue: 500000,
        totalAssessment: 650000,
        yearBuilt: 1920,
        vacant: false,
        taxExempt: true,
        exemptionType: 'Government',
        use: 'Municipal building',
      },
    ];

    // Apply filters
    let results = parcels;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.parcelId.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q)
      );
    }

    if (municipality) {
      const m = municipality.toLowerCase();
      results = results.filter(p => p.municipality.toLowerCase().includes(m));
    }

    if (zoning) {
      const z = zoning.toUpperCase();
      results = results.filter(p => p.zoning.toUpperCase().includes(z));
    }

    if (minAcres > 0) {
      results = results.filter(p => p.acres >= minAcres);
    }

    if (maxAcres < Infinity) {
      results = results.filter(p => p.acres <= maxAcres);
    }

    if (vacant) {
      results = results.filter(p => p.vacant === true);
    }

    // Apply limit
    results = results.slice(0, limit);

    return {
      count: results.length,
      parcels: results,
      note: 'Sample data - production version queries County GIS API',
      gisPortal: 'https://gis.northamptoncounty.org',
      assessmentOffice: 'https://www.norcopa.gov/departments/assessment',
      source: 'NAC Digital Twin - Parcel Data',
    };
  },
};

export const getZoningInfoTool = {
  name: 'get_zoning_info',
  description: 'Get zoning district information and permitted uses.',
  inputSchema: {
    type: 'object',
    properties: {
      district: {
        type: 'string',
        description: 'Zoning district code (e.g., "R1", "C2", "I1")',
      },
      municipality: {
        type: 'string',
        description: 'Municipality (zoning varies by municipality)',
      },
    },
    required: ['district'],
  },

  async execute(args) {
    const { district, municipality } = args;

    const zoningDistricts = {
      'R1': {
        code: 'R1',
        name: 'Residential Low Density',
        minLotSize: '1 acre',
        maxDensity: '1 dwelling unit per acre',
        maxHeight: '35 feet',
        setbacks: { front: 50, side: 25, rear: 40 },
        permittedUses: ['Single-family detached', 'Agriculture', 'Home occupation'],
        conditionalUses: ['Churches', 'Schools', 'Public utilities'],
        prohibited: ['Multi-family', 'Commercial', 'Industrial'],
      },
      'R2': {
        code: 'R2',
        name: 'Residential Medium Density',
        minLotSize: '10,000 sq ft',
        maxDensity: '4 dwelling units per acre',
        maxHeight: '35 feet',
        setbacks: { front: 30, side: 10, rear: 25 },
        permittedUses: ['Single-family', 'Two-family', 'Townhouses', 'Home occupation'],
        conditionalUses: ['Multi-family', 'Churches', 'Day care'],
        prohibited: ['Commercial', 'Industrial'],
      },
      'R3': {
        code: 'R3',
        name: 'Residential High Density',
        minLotSize: '5,000 sq ft',
        maxDensity: '12 dwelling units per acre',
        maxHeight: '45 feet',
        setbacks: { front: 25, side: 8, rear: 20 },
        permittedUses: ['Single-family', 'Multi-family', 'Apartments'],
        conditionalUses: ['Mixed-use', 'Senior housing'],
        prohibited: ['Heavy commercial', 'Industrial'],
      },
      'C1': {
        code: 'C1',
        name: 'Commercial Neighborhood',
        minLotSize: '10,000 sq ft',
        maxHeight: '35 feet',
        setbacks: { front: 25, side: 10, rear: 20 },
        permittedUses: ['Retail', 'Office', 'Personal services', 'Restaurant'],
        conditionalUses: ['Gas station', 'Drive-through'],
        prohibited: ['Industrial', 'Warehousing'],
      },
      'C2': {
        code: 'C2',
        name: 'Commercial General',
        minLotSize: '20,000 sq ft',
        maxHeight: '50 feet',
        setbacks: { front: 40, side: 15, rear: 25 },
        permittedUses: ['Retail', 'Office', 'Hotel', 'Entertainment', 'Vehicle sales'],
        conditionalUses: ['Light manufacturing', 'Self-storage'],
        prohibited: ['Heavy industrial'],
      },
      'I1': {
        code: 'I1',
        name: 'Institutional',
        minLotSize: '1 acre',
        maxHeight: '60 feet',
        permittedUses: ['Hospital', 'School', 'Government', 'Religious', 'Cemetery'],
        conditionalUses: ['Accessory commercial'],
        prohibited: ['Residential (except accessory)', 'Industrial'],
      },
      'I2': {
        code: 'I2',
        name: 'Heavy Industrial',
        minLotSize: '2 acres',
        maxHeight: '75 feet',
        setbacks: { front: 75, side: 50, rear: 50 },
        permittedUses: ['Manufacturing', 'Warehousing', 'Distribution', 'Utilities'],
        conditionalUses: ['Hazardous materials', 'Recycling'],
        prohibited: ['Residential', 'Retail'],
        requirements: ['Stormwater management', 'Buffer zones from residential'],
      },
      'AG': {
        code: 'AG',
        name: 'Agricultural',
        minLotSize: '25 acres',
        maxDensity: '1 dwelling per 25 acres',
        permittedUses: ['Farming', 'Forestry', 'Single-family', 'Farm stand'],
        conditionalUses: ['Agritourism', 'Equestrian', 'Wind/solar'],
        prohibited: ['Commercial', 'Industrial', 'Subdivision'],
        note: 'Subject to PA Act 319 (Clean and Green) tax benefits',
      },
      'P': {
        code: 'P',
        name: 'Public/Park',
        permittedUses: ['Parks', 'Recreation', 'Government facilities', 'Open space'],
        conditionalUses: ['Community events', 'Utilities'],
        prohibited: ['Residential', 'Commercial', 'Industrial'],
      },
    };

    const code = district.toUpperCase();
    const info = zoningDistricts[code];

    if (!info) {
      return {
        error: `Zoning district "${district}" not found`,
        availableDistricts: Object.keys(zoningDistricts),
        note: 'Zoning codes may vary by municipality',
      };
    }

    return {
      ...info,
      municipality: municipality || 'General - verify with municipal zoning office',
      zoningOfficer: 'Contact municipal planning department',
      appealsBoard: 'Municipal Zoning Hearing Board',
      source: 'NAC Digital Twin - Zoning Data',
    };
  },
};
