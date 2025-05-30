const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
require('./models/db');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});