'use strict';

const { customAlphabet } = require('nanoid');

const random = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 6);

module.exports = random;
