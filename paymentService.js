const stripe = require('stripe')(process.env.STRIPE_KEY);
const redis = require('../config/redis');

class PaymentService {
  async createPaymentIntent(amount, metadata) {
    // Circuit breaker check
    const failures = await redis.get(`payment_failures:${metadata.userId}`);
    if (failures > 3) throw new Error('Payment suspended - too many failures');

    try {
      const intent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata
      });
      return { clientSecret: intent.client_secret };
    } catch (err) {
      await redis.incr(`payment_failures:${metadata.userId}`);
      throw err;
    }
  }
}

module.exports = new PaymentService();