const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Russell',
      version: '1.0.0',
      description: 'Documentation de l’API du port Russell',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

module.exports = swaggerJSDoc(options);
