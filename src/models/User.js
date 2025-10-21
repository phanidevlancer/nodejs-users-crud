const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, min: 0 }
  },
  { timestamps: true }
);

// Simple text index to enable q= search on name/email
userSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('User', userSchema);
