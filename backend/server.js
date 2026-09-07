const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MTN Configuration
const MTN_CONFIG = {
  consumerKey: process.env.MTN_CONSUMER_KEY || '74DFhEq4CAw0Ah3yzj0cRESv6R0ZdaO1',
  consumerSecret: process.env.MTN_CONSUMER_SECRET || 'zS0eD3zxz6CUGpXO',
  merchantId: process.env.MTN_MERCHANT_ID || 'BESTIES_GH_001',
  merchantPhone: process.env.MTN_MERCHANT_PHONE || '+233541479680',
  apiUrl: process.env.MTN_API_URL || 'https://api.mtn.com/mtn_payment_sandbox',
  callbackUrl: process.env.CALLBACK_URL || 'https://yourdomain.com/api/mtn-callback'
};

// Store transactions (use database in production)
const transactions = {};

// Generate OAuth token from MTN
async function generateToken() {
  try {
    const auth = Buffer.from(`${MTN_CONFIG.consumerKey}:${MTN_CONFIG.consumerSecret}`).toString('base64');

    const response = await axios.post(
      `${MTN_CONFIG.apiUrl}/oauth/access_token`,
      { grant_type: 'client_credentials' },
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Token generation error:', error.message);
    throw new Error('Failed to generate MTN token');
  }
}

// Initiate payment
app.post('/api/initiate-payment', async (req, res) => {
  try {
    const {
      fullName,
      email,
      ageGroup,
      story,
      phone,
      network
    } = req.body;

    // Validate input
    if (!phone || !email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate unique reference
    const reference = `BESTIES_${uuidv4().split('-')[0].toUpperCase()}`;
    const amount = 20000; // GHS 200 in pesewas (1 GHS = 100 pesewas)

    // Store transaction
    transactions[reference] = {
      reference,
      fullName,
      email,
      ageGroup,
      story,
      phone,
      network,
      amount,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };

    // Generate token
    const token = await generateToken();

    // Prepare payment request
    const paymentData = {
      reference: reference,
      subscriber_number: phone,
      amount: amount,
      currency: 'GHS',
      description: 'Besties Annual Membership Registration',
      payer_message: 'Besties Membership - GHS 200',
      payee_note: 'Thank you for joining Besties!',
      callback_url: `${MTN_CONFIG.callbackUrl}?reference=${reference}`
    };

    // Send to MTN API
    const mtnResponse = await axios.post(
      `${MTN_CONFIG.apiUrl}/collection/initiate`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Reference-Id': reference,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Payment initiated: ${reference} for ${fullName}`);

    res.json({
      success: true,
      message: 'Payment prompt sent to your phone',
      reference: reference,
      amount: 'GHS 200',
      phone: phone,
      network: network
    });

  } catch (error) {
    console.error('Payment initiation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
});

// Webhook callback from MTN
app.post('/api/mtn-callback', (req, res) => {
  try {
    const { reference, status, transaction_id } = req.body;

    console.log(`Webhook received: ${reference} - Status: ${status}`);

    if (transactions[reference]) {
      transactions[reference].status = status;
      transactions[reference].transactionId = transaction_id;
      transactions[reference].completedAt = new Date();

      // If successful, save registration to database
      if (status === 'successful') {
        console.log(`Registration completed for: ${transactions[reference].fullName}`);
        // TODO: Save to database here
        // TODO: Send confirmation email
      }
    }

    res.json({
      success: true,
      message: 'Callback received',
      reference: reference
    });

  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// Check payment status
app.get('/api/payment-status/:reference', (req, res) => {
  try {
    const { reference } = req.params;

    const transaction = transactions[reference];

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      reference: reference,
      status: transaction.status,
      amount: 'GHS 200',
      customer: transaction.fullName,
      createdAt: transaction.createdAt,
      completedAt: transaction.completedAt
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking payment status'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Besties Payment Backend is running',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Besties Payment Backend running on port ${PORT}`);
  console.log(`📱 MTN Mobile Money Integration Active`);
  console.log(`💰 Merchant: ${MTN_CONFIG.merchantPhone}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
