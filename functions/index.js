const { logger } = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const { api } = require('./service');

exports.api = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true });
  api(request, response); // Forward the request to your Express app
});
