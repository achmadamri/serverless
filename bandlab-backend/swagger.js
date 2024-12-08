const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BandLab API', 
    version: '1.0.0', 
    description: 'API documentation for BandLab backend', 
  },
  servers: [
    {
      url: 'https://{your-api-gateway-url}', 
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./handler.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
