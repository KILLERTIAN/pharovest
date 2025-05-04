import mongoose from "mongoose";

// Comment Schema
const commentSchema = new mongoose.Schema({
    id: { type: String, required: true },  // Changed to String for consistency with other models
    avatar: String,
    name: { type: String },  // Changed from ObjectId reference to String
    text: String,
    createdAt: { type: Date, default: Date.now },
    mentions: [String],  // Added for enabling mentions
});

// Post Schema
const postSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },  // Changed to String for consistency with other models
    avatar: String,
    name: { type: String },  // Changed from ObjectId reference to String
    date: { type: Date, default: Date.now },
    image: { type: String, required: true },  // Changed from images array to single image
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: [commentSchema],  // Nested comment schema
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
