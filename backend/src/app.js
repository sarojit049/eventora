const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.env === 'production' 
    ? config.cors.origin 
    : [config.cors.origin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Root endpoint for Render health checks
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Eventora API'
  });
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Swagger API docs
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eventora API',
      version: '1.0.0',
      description: 'Eventora - Event Booking Platform API Documentation',
      contact: {
        name: 'Eventora Support',
      },
    },
    servers: [
      {
        url: config.env === 'production'
          ? 'https://your-backend.onrender.com'
          : `http://localhost:${config.port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Eventora API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
