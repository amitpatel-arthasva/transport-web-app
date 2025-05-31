const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
require('./models/db');

const PORT = process.env.PORT || 5000;

// Import PDF service for cleanup
const { closeBrowserInstance } = require('./services/pdfService');

app.use(bodyParser.json());

// Configure CORS to expose Content-Disposition header for PDF downloads
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type']
}));

// Serve static files from assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const lorryReceiptRoutes = require('./routes/lorryReceiptRoutes');
const loadingSlipRoutes = require('./routes/loadingSlipRoutes');
const deliverySlipRoutes = require('./routes/deliverySlipRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quotation', quotationRoutes);
app.use('/api/lorry-receipt', lorryReceiptRoutes);
app.use('/api/loading-slip', loadingSlipRoutes);
app.use('/api/delivery-slip', deliverySlipRoutes);
app.use('/api/invoice', invoiceRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Graceful shutdown handling for browser cleanup
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Graceful shutdown initiated...`);
  try {
    await closeBrowserInstance();
    console.log('Browser instance closed successfully');
  } catch (error) {
    console.error('Error during browser cleanup:', error);
  }
  process.exit(0);
};

// Handle various shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});