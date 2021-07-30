'use strict';

const { api, params } = require('@serverless/cloud'); // eslint-disable-line

test('Service CRUD', async () => {
  const service = {
    serviceStatus: 'Operational',
    serviceName: 'Serverless Framework Dashboard',
    serviceDescription: 'This is the Serverless Framework Dashboard',
  };
  const { body: createdService } = await api
    .put(`/services?adminPassword=${params.ADMIN_PASSWORD}`)
    .invoke(service);

  console.log(createdService);

  expect(createdService.serviceStatus).toEqual(service.serviceStatus);
  expect(createdService.serviceName).toEqual(service.serviceName);
  expect(createdService.serviceDescription).toEqual(service.serviceDescription);
  expect(createdService.serviceId).toBeDefined();
  expect(createdService.serviceCreatedAts).toBeDefined();
  expect(createdService.serviceUpdatedAt).toBeDefined();

  // expect(body).toEqual({
  //   items: [
  //     {
  //       id: '123456',
  //       name: 'Something to do',
  //     },
  //   ],
  // });
});
