import { Schema } from 'mongoose';

// schema for the database using Mongoose
export const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verificationToken: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});
