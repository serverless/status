/* eslint consistent-return: 0 */

'use strict';

const { api, data, params } = require('@serverless/cloud'); // eslint-disable-line
const { customAlphabet } = require('nanoid');

const random = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 6);

const serviceStatuses = ['Major Outage', 'Partial Outage', 'Degraded Performance', 'Operational'];
const incidentStatuses = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

/*
 * Set Service
 */
api.put('/services', async (req, res, next) => {
  try {
    console.log('Setting service');
    authorize(req);
    const { serviceName, serviceDescription, serviceStatus } = req.body;
    const serviceId = req.body.serviceId || random();

    if (!serviceName) {
      throw new Error('Missing serviceName');
    }

    if (!serviceStatus) {
      throw new Error('Missing serviceStatus');
    }

    if (!serviceStatuses.includes(serviceStatus)) {
      throw new Error(`Invalid serviceStatus: ${serviceStatus}`);
    }

    const serviceUpdatedAt = Date.now();

    const serviceToSet = { serviceId, serviceName, serviceStatus, serviceUpdatedAt };

    if (serviceDescription) {
      serviceToSet.serviceDescription = serviceDescription;
    }

    const existingService = await data.get(`services:${serviceId}`);

    if (!existingService) {
      serviceToSet.serviceCreatedAt = Date.now();
    }

    const setService = await data.set(`services:${serviceId}`, serviceToSet);

    return res.send(setService);
  } catch (e) {
    next(e);
  }
});

/*
 * Get Service
 */
api.get('/services/:serviceId', async (req, res, next) => {
  try {
    console.log('Getting service');
    const { serviceId } = req.params;

    const service = await data.get(`services:${serviceId}`);

    return res.send(service);
  } catch (e) {
    next(e);
  }
});

/*
 * Delete Service
 */
api.delete('/services/:serviceId', async (req, res, next) => {
  try {
    console.log('Deleting service');
    authorize(req);
    const { serviceId } = req.params;

    await data.remove(`services:${serviceId}`);

    const services = await getCollectionItems('services');

    return res.send({ services });
  } catch (e) {
    next(e);
  }
});

/*
 * Get Services
 */
api.get('/services', async (req, res, next) => {
  try {
    console.log('Listing services');

    const services = await getCollectionItems('services');

    return res.send({ services });
  } catch (e) {
    next(e);
  }
});

/*
 * Set Incident
 */
api.put('/incidents', async (req, res, next) => {
  try {
    console.log('Setting incident');
    authorize(req);
    const { incidentName, incidentDescription, affectedServicesIds, incidentStatus } = req.body;
    const incidentId = req.body.incidentId || random();

    if (!incidentName) {
      throw new Error('Missing incidentName');
    }

    if (!incidentStatus) {
      throw new Error('Missing incidentStatus');
    }

    if (!incidentStatuses.includes(incidentStatus)) {
      throw new Error(`Invalid incidentStatus: ${incidentStatus}`);
    }

    if (!affectedServicesIds || affectedServicesIds.length === 0) {
      throw new Error('Missing affectedServicesIds');
    }

    for (const serviceId of affectedServicesIds) {
      const service = await data.get(`services:${serviceId}`);

      if (!service) {
        throw new Error(`serviceId ${serviceId} does not exist`);
      }
    }

    const incidentUpdatedAt = Date.now();

    const incidentToSet = {
      incidentId,
      incidentName,
      incidentStatus,
      affectedServicesIds,
      incidentUpdatedAt,
    };

    if (incidentDescription) {
      incidentToSet.incidentDescription = incidentDescription;
    }

    const existingIncident = await data.get(`incidents:${incidentId}`);

    if (!existingIncident) {
      incidentToSet.incidentCreatedAt = Date.now();
    }

    const setIncident = await data.set(`incidents:${incidentId}`, incidentToSet);

    return res.send(setIncident);
  } catch (e) {
    next(e);
  }
});

/*
 * Get Incident
 */
api.get('/incidents/:incidentId', async (req, res, next) => {
  try {
    console.log('Getting incident');
    const { incidentId } = req.params;

    const incident = await data.get(`incidents:${incidentId}`);

    return res.send(incident);
  } catch (e) {
    next(e);
  }
});

/*
 * Delete Incident
 */
api.delete('/incidents/:incidentId', async (req, res, next) => {
  try {
    console.log('Deleting incident');
    authorize(req);
    const { incidentId } = req.params;

    await data.remove(`incidents:${incidentId}`);

    const incidents = await getCollectionItems('incidents');

    return res.send({ incidents });
  } catch (e) {
    next(e);
  }
});

/*
 * Get Incidents
 */
api.get('/incidents', async (req, res, next) => {
  try {
    console.log('Listing incidents');

    const incidents = await getCollectionItems('incidents');

    return res.send({ incidents });
  } catch (e) {
    next(e);
  }
});

/*
 * Set Update
 */
api.put('/incidents/:incidentId/updates', async (req, res, next) => {
  try {
    console.log('Setting update');
    authorize(req);
    const { incidentId } = req.params;
    const { updateDescription, incidentStatus, affectedServicesStatus } = req.body;
    const updateId = req.body.updateId || random();

    if (!updateDescription) {
      throw new Error('Missing updateDescription');
    }

    if (!incidentStatus) {
      throw new Error('Missing incidentStatus');
    }

    if (!incidentStatuses.includes(incidentStatus)) {
      throw new Error(`Invalid incidentStatus: ${incidentStatus}`);
    }

    if (!affectedServicesStatus) {
      throw new Error('Missing affectedServicesStatus');
    }

    if (!serviceStatuses.includes(affectedServicesStatus)) {
      throw new Error(`Invalid affectedServicesStatus: ${affectedServicesStatus}`);
    }

    const incident = await data.get(`incidents:${incidentId}`);

    if (!incident) {
      throw new Error(`IncidencId "${incidentId}" does not exist`);
    }

    incident.incidentStatus = incidentStatus;
    incident.incidentUpdatedAt = Date.now();

    await data.set(`incidents:${incidentId}`, incident);

    for (const serviceId of incident.affectedServicesIds) {
      const service = await data.get(`services:${serviceId}`);

      service.serviceStatus = affectedServicesStatus;
      service.serviceUpdatedAt = Date.now();

      await data.set(`services:${serviceId}`, service);
    }

    const updateUpdatedAt = Date.now();

    const updateToSet = {
      updateId,
      incidentId,
      updateDescription,
      incidentStatus,
      affectedServicesStatus,
      updateUpdatedAt,
    };

    const existingUpdate = await data.get(`updates:${updateId}`);

    if (!existingUpdate) {
      updateToSet.updateCreatedAt = Date.now();
    }

    const setUpdate = await data.set(`updates:${updateId}`, updateToSet);

    return res.send(setUpdate);
  } catch (e) {
    next(e);
  }
});

/*
 * Get Update
 */
api.get('/incidents/:incidentId/updates/:updateId', async (req, res, next) => {
  try {
    console.log('Getting incident');
    const { updateId } = req.params;

    const update = await data.get(`updates:${updateId}`);

    return res.send(update);
  } catch (e) {
    next(e);
  }
});

/*
 * Delete Update
 */
api.delete('/incidents/:incidentId/updates/:updateId', async (req, res, next) => {
  try {
    console.log('Deleting update');
    authorize(req);
    const { updateId } = req.params;

    await data.remove(`updates:${updateId}`);

    const updates = await getCollectionItems('updates');

    return res.send({ updates });
  } catch (e) {
    next(e);
  }
});

/*
 * Get Updates
 */
api.get('/incidents/:incidentId/updates', async (req, res, next) => {
  try {
    console.log('Listing updates');

    const updates = await getCollectionItems('updates');

    return res.send({ updates });
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line
api.use((err, req, res, next) => {
  // Errors are also streamed live to your terminal in dev mode.
  console.error(err.stack);

  if (!err.statusCode) {
    err.statusCode = 500;
  }

  const error = {
    name: err.name,
    statusCode: err.statusCode,
    message: err.message,
  };

  return res.status(err.statusCode).json(error);
});

const authorize = (req) => {
  const authHeader = req.get('Authorization') || '';
  const adminPassword = authHeader.replace('Bearer ', '');

  if (adminPassword === '' || adminPassword !== params.ADMIN_PASSWORD) {
    throw new Error('Unauthorized');
  }
};

const getCollectionItems = async (collectionName) => {
  const { items } = await data.get(`${collectionName}:*`);
  return items.map((item) => item.value);
};

module.exports = api;
