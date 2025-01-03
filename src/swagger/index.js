
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'docs.yaml'));

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger docs available at /api-docs');
};

module.exports = setupSwagger;
