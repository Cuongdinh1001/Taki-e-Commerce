const dotenv = require('dotenv').config();

if (process.env.ENVIRONMENT === 'DEVELOPMENT') process.env.L_HOST = `http://localhost:${process.env.PORT}`;

require('./src/server');