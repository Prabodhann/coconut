import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Log the incoming order data
    console.log('Received order data:', { userId, items, amount, address });

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.json({ success: false, message: 'Invalid amount' });
    }

    // Log items to ensure they have valid values
    items.forEach((item) => {
      if (!item.itemId || isNaN(item.quantity) || item.quantity <= 0) {
        console.log('Invalid item:', item);
        return res.json({ success: false, message: 'Invalid item data' });
      }
    });

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Charge',
        },
        unit_amount: 5 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `https://coconut-frontend.vercel.app/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `https://coconut-frontend.vercel.app//verify?success=false&orderId=${newOrder._id}`,
      line_items: line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error('Error placing order:', error);
    res.json({ success: false, message: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    res.json({ success: false, message: 'Error' });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: 'Paid' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Not Paid' });
    }
  } catch (error) {
    console.error('Error verifying order:', error);
    res.json({ success: false, message: 'Not  Verified' });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder };
