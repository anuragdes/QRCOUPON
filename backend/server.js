const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createCanvas } = require('canvas');
const QRCode = require('qrcode');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Coupon = mongoose.model('Coupon', {
  couponCode: String,
  link: String,
  used: Boolean,
  qrCodeImage: String,
});

app.get('/api/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const { couponCode, link } = req.body;

    // Create a QR code as an image using qrcode
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext('2d');

    await QRCode.toCanvas(canvas, link, { errorCorrectionLevel: 'H' });

    // Convert the canvas to a buffer
    const qrCodeBuffer = canvas.toBuffer('image/png');

    // Convert the buffer to a Base64-encoded string
    const qrCodeBase64 = qrCodeBuffer.toString('base64');

    const newCoupon = new Coupon({ couponCode, link, used: false, qrCodeImage: qrCodeBase64 });
    await newCoupon.save();
    res.json(newCoupon);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/markCouponUsed', async (req, res) => {
  try {
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    if (coupon.used) {
      return res.status(400).json({ message: 'Coupon already used' });
    }

    // Mark the coupon as used
    coupon.used = true;
    await coupon.save();

    res.json({ status: 'success', message: 'Coupon marked as used' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/api/coupons/:couponCode', async (req, res) => {
  try {
    const { couponCode } = req.params;
    const { used } = req.body;

    const coupon = await Coupon.findOneAndUpdate({ couponCode }, { used }, { new: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Return the updated coupon
    res.json(coupon);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/validate-coupon/:couponCode', async (req, res) => {
  try {
    const { couponCode } = req.params;

    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Return the coupon status
    res.json({ status: coupon.used ? 'used' : 'unused' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
