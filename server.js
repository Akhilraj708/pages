const express = require('express');
const mongoose = require('mongoose');
const paymentRoutes = require('./controllers/payments');
const productRoutes = require('./controllers/products');
const inventoryService = require('./services/inventoryService');

// Database connection
mongoose.connect('mongodb://db:27017/ecommerce', {useNewUrlParser: true});

// Real-time inventory updates
inventoryService.startWebSocketServer();

const app = express();
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// Health checks
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', db: mongoose.connection.readyState });
});

app.listen(3000, () => console.log('Server running on port 3000'));