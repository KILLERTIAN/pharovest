import Post from '../models/Post.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Import the Cloudinary utility
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

export const createPost = async (req, res) => {
    try {
        // Check for image in the request
        if (!req.file) {
            return res.status(400).json({ msg: 'Image file is required' });
        }

        // Upload image to Cloudinary
        const imageFilePath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(imageFilePath);
        const imageUrl = cloudinaryResponse ? cloudinaryResponse.secure_url : '';

        // Fetch name and avatar from the request body, falling back to user info if available
        const name = req.body.name || req.user?.name || 'Guest';
        const avatar = req.body.avatar || req.user?.profileImage || 'https://res.cloudinary.com/djoebsejh/image/upload/v1727181418/u6fshzccb1vhxk2bzopn.png';

        // Find the last post to determine the next ID
        const lastPost = await Post.findOne().sort({ id: -1 }).limit(1); // Get the last inserted post by ID
        const nextId = lastPost ? lastPost.id + 1 : 1; // If no post exists, start at 1

        // Create a new post with the next ID in series
        const post = new Post({
            id: nextId, 
            avatar: avatar, 
            name: name,
            image: imageUrl,
            description: req.body.description,
            date: new Date().toISOString(),
            likes: 0, 
            shares: 0, 
            comments: [],
        });

        // Save the post to the database
        await post.save();

        return res.status(201).json({ msg: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Failed to create post' });
    }
};


// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Like a post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        post.likes += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

// Share a post
export const sharePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        post.shares += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error sharing post:', error);
        res.status(500).json({ error: 'Failed to share post' });
    }
};

// Add a comment to a post
export const addComment = async (req, res) => {
    try {
        const { avatar, name, text } = req.body;
        const post = await Post.findById(req.params.postId);
        post.comments.push({ avatar, name, text });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};
