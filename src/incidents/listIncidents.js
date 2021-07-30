/* eslint consistent-return: 0 */

'use strict';

const getCollectionItems = require('../utils/getCollectionItems');

const listIncidents = async (req, res, next) => {
  try {
    console.log('Listing incidents');

    const incidents = await getCollectionItems('incidents');

    return res.send({ incidents });
  } catch (e) {
    next(e);
  }
};

module.exports = listIncidents;
