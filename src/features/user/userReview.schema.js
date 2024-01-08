// models/reviewModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feedback: {
    type: String,
  },
  // Add other properties as needed
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
