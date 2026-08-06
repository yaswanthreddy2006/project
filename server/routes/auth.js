const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, registrationNumber, password, confirmPassword } = req.body;

    // 1. Missing fields check
    if (!username || !registrationNumber || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields (Username, Registration Number, and Password).' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanRegNo = registrationNumber.trim();

    // 2. Registration Number format check
    const regNoRegex = /^99\d{6,14}$/;
    if (!regNoRegex.test(cleanRegNo)) {
      return res.status(400).json({
        message: 'Invalid Registration Number. It must start with "99" and contain between 8 to 16 digits total (e.g., 9921004123).'
      });
    }

    // 3. Password checks
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // 4. Auto-generate email
    const generatedEmail = `${cleanRegNo}@klu.ac.in`;

    // 5. Check for duplicate account
    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { registrationNumber: cleanRegNo },
        { email: generatedEmail }
      ]
    });

    if (existingUser) {
      if (existingUser.registrationNumber === cleanRegNo) {
        return res.status(400).json({ message: `An account with Registration Number "${cleanRegNo}" already exists.` });
      }
      if (existingUser.username === cleanUsername) {
        return res.status(400).json({ message: `Username "${cleanUsername}" is already taken.` });
      }
      return res.status(400).json({ message: `Email "${generatedEmail}" is already registered.` });
    }

    // 6. Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Save user to MongoDB
    const newUser = new User({
      username: cleanUsername,
      registrationNumber: cleanRegNo,
      email: generatedEmail,
      password: hashedPassword,
      quizScore: 0,
      quizHistory: [],
      bookingHistory: [],
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanRegNo}`
    });

    await newUser.save();

    // 8. Issue JWT
    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: 'Student registration successful!',
      token,
      user: newUser.toSafeObject()
    });
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    return res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login via Username OR Registration Number
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please enter your Username or Registration Number and Password.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Search user by username OR registrationNumber
    const user = await User.findOne({
      $or: [
        { username: cleanIdentifier },
        { registrationNumber: cleanIdentifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Username/Registration Number or Password.' });
    }

    // Validate password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Username/Registration Number or Password.' });
    }

    const token = generateToken(user._id);

    return res.json({
      message: 'Login successful!',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (Session Check)
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    return res.json({
      user: req.user.toSafeObject()
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user session profile.' });
  }
});

// @route   POST /api/auth/quiz
// @desc    Add a quiz attempt to user history and update score
// @access  Private
router.post('/quiz', authMiddleware, async (req, res) => {
  try {
    const { quizTitle, score, totalQuestions } = req.body;
    if (!quizTitle || score === undefined || !totalQuestions) {
      return res.status(400).json({ message: 'Missing quiz details.' });
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    const quizAttempt = {
      quizTitle,
      score,
      totalQuestions,
      percentage,
      completedAt: new Date()
    };

    const user = await User.findById(req.user._id);
    user.quizHistory.unshift(quizAttempt);
    user.quizScore += score * 10; // 10 points per correct answer
    await user.save();

    return res.json({
      message: 'Quiz attempt saved to MongoDB!',
      quizScore: user.quizScore,
      quizHistory: user.quizHistory
    });
  } catch (error) {
    console.error('Quiz Save Error:', error);
    return res.status(500).json({ message: 'Failed to save quiz result.' });
  }
});

// @route   POST /api/auth/booking
// @desc    Add a facility booking to user history
// @access  Private
router.post('/booking', authMiddleware, async (req, res) => {
  try {
    const { facilityName, bookingDate, timeSlot } = req.body;
    if (!facilityName || !bookingDate || !timeSlot) {
      return res.status(400).json({ message: 'Please provide facility name, booking date, and time slot.' });
    }

    const bookingEntry = {
      facilityName,
      bookingDate,
      timeSlot,
      status: 'Confirmed',
      createdAt: new Date()
    };

    const user = await User.findById(req.user._id);
    user.bookingHistory.unshift(bookingEntry);
    await user.save();

    return res.json({
      message: 'Campus facility booked successfully!',
      bookingHistory: user.bookingHistory
    });
  } catch (error) {
    console.error('Booking Save Error:', error);
    return res.status(500).json({ message: 'Failed to create facility booking.' });
  }
});

module.exports = router;
