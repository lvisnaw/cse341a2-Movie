const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'; // Uses environment variable or default

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testUser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               accountType:
 *                 type: string
 *                 example: "read"
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, accountType } = req.body;

    if (!username || !password || !accountType) {
      return res.status(400).json({ message: 'Username, password, and account type are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, accountType });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testUser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token.
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ userId: user._id, accountType: user.accountType }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const router = express.Router();
// const JWT_SECRET = 'your_jwt_secret_key_here'; // Change this in production

// /**
//  * @openapi
//  * /api/users/register:
//  *   post:
//  *     summary: Register a new user
//  *     description: Creates a new user account with a hashed password.
//  *     tags:
//  *       - Users
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *                 example: "testUser"
//  *               password:
//  *                 type: string
//  *                 example: "strongpassword123"
//  *     responses:
//  *       201:
//  *         description: User registered successfully.
//  */
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// /**
//  * @openapi
//  * /api/users/login:
//  *   post:
//  *     summary: Login a user
//  *     description: Authenticates a user and returns a JWT token.
//  *     tags:
//  *       - Users
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *                 example: "testUser"
//  *               password:
//  *                 type: string
//  *                 example: "strongpassword123"
//  *     responses:
//  *       200:
//  *         description: Login successful, returns JWT token.
//  */
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find user by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate JWT
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// module.exports = router;
