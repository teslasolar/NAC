/**
 * NAC API Module
 *
 * Provides data access and integration with Northampton County systems.
 * Includes REST API server for Digital Twin integration.
 *
 * @module api
 */

const { NACClient, COUNTY_ENDPOINTS } = require('./NACClient');
const { DataService } = require('./DataService');
const { APIRouter } = require('./Router');

/**
 * Module information
 */
const moduleInfo = {
  name: 'NAC API Module',
  version: '2.0.0',
  description: 'API layer for Northampton County Digital Twin',
  components: ['NACClient', 'DataService', 'APIRouter', 'REST Server'],
  serverModule: './server.js'
};

module.exports = {
  NACClient,
  DataService,
  APIRouter,
  COUNTY_ENDPOINTS,
  moduleInfo
};
