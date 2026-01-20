/**
 * NAC API Module
 *
 * Provides data access and integration with Northampton County systems
 */

const { NACClient, COUNTY_ENDPOINTS } = require('./NACClient');
const { DataService } = require('./DataService');
const { APIRouter } = require('./Router');

module.exports = {
  NACClient,
  DataService,
  APIRouter,
  COUNTY_ENDPOINTS,
};
