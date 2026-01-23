/**
 * Query County Data Tool
 * General-purpose query tool for county public data sources
 *
 * @module mcp/tools/query-county-data
 */

export const queryCountyDataTool = {
  name: 'query_county_data',
  description: 'Query Northampton County public data sources including property records, court records, and GIS data.',
  inputSchema: {
    type: 'object',
    properties: {
      source: {
        type: 'string',
        enum: ['property', 'court', 'gis', 'assessment', 'elections'],
        description: 'Data source to query',
      },
      query: {
        type: 'string',
        description: 'Search query (parcel ID, case number, address, etc.)',
      },
    },
    required: ['source', 'query'],
  },

  async execute(args) {
    const { source, query } = args;

    // Public data endpoints for Northampton County
    const endpoints = {
      property: {
        name: 'Property Records',
        url: 'https://www.ncpao.org/',
        description: 'Northampton County Assessment Office - property search',
        searchUrl: 'https://www.ncpao.org/search?q=' + encodeURIComponent(query),
      },
      court: {
        name: 'Court Records',
        url: 'https://ujsportal.pacourts.us/',
        description: 'PA Unified Judicial System - case search',
        searchUrl: 'https://ujsportal.pacourts.us/CaseSearch',
        note: 'Search by docket number, participant name, or case ID',
      },
      gis: {
        name: 'GIS/Mapping',
        url: 'https://gis.northamptoncounty.org/',
        description: 'Northampton County GIS Portal - property mapping',
        searchUrl: 'https://gis.northamptoncounty.org/',
      },
      assessment: {
        name: 'Assessment Data',
        url: 'https://www.ncpao.org/',
        description: 'Property assessment and tax information',
        searchUrl: 'https://www.ncpao.org/',
      },
      elections: {
        name: 'Elections',
        url: 'https://www.northamptoncounty.org/CTYADMN/ELECTNS/',
        description: 'Voter registration and election results',
        searchUrl: 'https://www.northamptoncounty.org/CTYADMN/ELECTNS/',
      },
    };

    const sourceInfo = endpoints[source];
    if (!sourceInfo) {
      return { error: 'Unknown source: ' + source };
    }

    return {
      source: sourceInfo.name,
      query,
      description: sourceInfo.description,
      url: sourceInfo.url,
      searchUrl: sourceInfo.searchUrl,
      note: sourceInfo.note || 'Visit the URL to perform the search',
      disclaimer: 'This tool provides links to official county data sources. Data retrieval requires visiting the source directly.',
    };
  },
};
