import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    // Track the active valid refresh token for sliding window rotation/revocation
    refreshToken: { 
      type: String, 
      default: null 
    }, 
  },
  { timestamps: true }
);

// Automatically hash password whenever it is created or modified

userSchema.pre('save', async function () {
  // 1. If the password hasn't changed, just exit the function early
  if (!this.isModified('password')) return;

  try {
    // 2. Hash the password safely
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // No next() needed here! Resolving the async function tells Mongoose to continue.
  } catch (err) {
    // 3. Throwing the error replaces next(err)
    throw err; 
  }
});

// Instance method to safe-compare passwords during authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;