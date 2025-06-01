const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API',
      version: '1.0.0',
      description: 'API documentation for the Chat App',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs-swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
