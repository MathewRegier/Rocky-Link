// Updated contactRoutes.js
import express from 'express';
import { getContacts, getContactIdByPhoneNumber, getUsersByLocation, getCustomFields, getContactsByTag } from '../api/GHL.js';
import { LoyaltyUser } from '../config/db.js';

const router = express.Router();

router.get('/sync-contacts', async (req, res) => {
    const contacts = await getContacts(process.env.GOHIGHLEVEL_API_KEY);
    res.status(200).json(contacts);
});

router.get('/usersByLocation/:locationId', async (req, res) => {
    const { locationId } = req.params;
    const users = await getUsersByLocation(locationId, process.env.GOHIGHLEVEL_API_KEY);
    if (users && users.length > 0) {
      res.json({ success: true, users: users });
    } else {
      res.status(404).json({ success: false, message: 'No users found' });
    }
});

router.get('/fetch-custom-fields', async (req, res) => {
    const fields = await getCustomFields(process.env.GOHIGHLEVEL_API_KEY);
    res.status(200).json(fields);
});

router.post('/sync-contacts-by-tag', async (req, res) => {
  console.log(req.body);  // Log the incoming request body to debug
  if (!req.body.apiKey || !req.body.tag) {
      return res.status(400).json({ error: 'API key and tag are required.' });
  }
  try {
      const contacts = await getContactsByTag(req.body.tag, req.body.apiKey);
      if (contacts) {
          res.status(200).json(contacts);
      } else {
          res.status(404).json({ error: 'No contacts found' });
      }
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, phone, email } = req.body;

    try {
        const existingUser = await LoyaltyUser.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new LoyaltyUser({
            firstName,
            lastName,
            phone,
            email,
            points: 0,
            totalPointsGained: 0
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Customer login
router.post('/login', async (req, res) => {
    const { phone } = req.body;

    try {
        const user = await LoyaltyUser.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Award points
router.post('/award-points', async (req, res) => {
    const { phone, points } = req.body;

    try {
        const user = await LoyaltyUser.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.points += points;
        user.totalPointsGained += points;
        await user.save();

        res.status(200).json({ message: 'Points awarded successfully', points: user.points });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Redeem points for coupon
router.post('/redeem-points', async (req, res) => {
    const { phone, points } = req.body;

    try {
        const user = await LoyaltyUser.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.points < points) {
            return res.status(400).json({ error: 'Insufficient points' });
        }

        user.points -= points;
        await user.save();

        res.status(200).json({ message: 'Points redeemed successfully', points: user.points });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;
