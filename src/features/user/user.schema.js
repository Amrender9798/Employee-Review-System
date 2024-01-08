import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "The name should be at least 3 characters long"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
  },
  password: { type: String, required: [true, "Password is required"] },
  reviewsFromOthers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  reviewsToOthers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false, // Default value is false
  },
});

const User = mongoose.model('User', userSchema);
export default User;
