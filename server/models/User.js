const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

const bookingHistorySchema = new mongoose.Schema({
  facilityName: { type: String, required: true },
  bookingDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long']
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Must start with 99 and have total 8 to 16 digits
          return /^99\d{6,14}$/.test(v);
        },
        message: props => `${props.value} is not a valid Registration Number! Must start with 99 and be between 8 to 16 digits total.`
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    quizScore: {
      type: Number,
      default: 0
    },
    quizHistory: {
      type: [quizHistorySchema],
      default: []
    },
    bookingHistory: {
      type: [bookingHistorySchema],
      default: []
    },
    profileImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

// Method to remove sensitive password before sending user object
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema, 'users');
