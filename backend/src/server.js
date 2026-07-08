const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║       🎉 Eventora API Server Running         ║
║                                              ║
║  Environment: ${config.env.padEnd(30)}║
║  Port:        ${String(config.port).padEnd(30)}║
║  CORS Origin: ${config.cors.origin.padEnd(30)}║
║  API Docs:    http://localhost:${config.port}/api-docs   ║
║  Health:      http://localhost:${config.port}/health     ║
║                                              ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
