import express from "express";
import { signup, login, getProfile, refreshToken, logout, updateProfile } from '../controllers/user.controller.js';
import { authenticateJWT } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";
import { createProject, getProjectById, getAllProjects } from "../controllers/Project.controller.js";
import { createPost, getPosts, likePost, sharePost, addComment, deletePost } from "../controllers/Post.controller.js";
import { generateAiContent } from "../controllers/GenAI.controller.js";
import { generateAiProjectContent } from "../controllers/GenProjectAI.controller.js";
import { createTransaction, getTransactions } from "../controllers/transaction.controller.js";
import { updateBlockchainHash } from "../controllers/Project.controller.js";

const router = express.Router();

// Signup and Login Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticateJWT, getProfile);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.put('/profile', authenticateJWT, updateProfile);

// Project Routes
router.post('/project/create', upload.single('image'), createProject);
router.get('/project/getAllProjects', getAllProjects);
router.get('/project/:projectId', getProjectById);
router.post('/project/:projectId/update-hash', updateBlockchainHash);

// Post Routes
router.post('/post/new-post', upload.single('image'), createPost);
router.get('/posts', getPosts); // Get all posts
router.post('/posts/:postId/like', likePost); // Like a post
router.post('/posts/:postId/share', sharePost); // Share a post
router.post('/posts/:postId/comments', addComment); // Add a comment to a post
router.delete('/posts/:postId', deletePost); // Delete a post

//  POST route for generating content
router.post('/generate-content', generateAiContent);
router.post('/generate-project-content', generateAiProjectContent);
//Transaction routes
router.post('/transactions', createTransaction);
router.get('/transactions', getTransactions);

// router.put('/transactions/status', updateTransactionStatus);

// router.get('/transactions/project/:projectId', getTransactionsByProject);

export default router;
