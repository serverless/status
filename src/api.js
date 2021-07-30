'use strict';

const { api } = require('@serverless/cloud'); // eslint-disable-line

const errorHandler = require('./errors/errorHandler');

const { putService, getService, deleteService, listServices } = require('./services');
const { putIncident, getIncident, deleteIncident, listIncidents } = require('./incidents');
const { putUpdate, getUpdate, deleteUpdate, listUpdates } = require('./updates');

// Services
api.put('/services', putService);
api.get('/services/:serviceId', getService);
api.delete('/services/:serviceId', deleteService);
api.get('/services', listServices);

// Incidents
api.put('/incidents', putIncident);
api.get('/incidents/:incidentId', getIncident);
api.delete('/incidents/:incidentId', deleteIncident);
api.get('/incidents', listIncidents);

// Updates
api.put('/incidents/:incidentId/updates', putUpdate);
api.get('/incidents/:incidentId/updates/:updateId', getUpdate);
api.delete('/incidents/:incidentId/updates/:updateId', deleteUpdate);
api.get('/incidents/:incidentId/updates', listUpdates);

api.use(errorHandler);

module.exports = api;
