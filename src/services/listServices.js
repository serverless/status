/* eslint consistent-return: 0 */

'use strict';

const getCollectionItems = require('../utils/getCollectionItems');

const listServices = async (req, res, next) => {
  try {
    console.log('Listing services');

    const services = await getCollectionItems('services');

    return res.send({ services });
  } catch (e) {
    next(e);
  }
};

module.exports = listServices;
