// routes/adminPostsRouter.js
const { Router } = require("express");
const { getPostsAdmin, getPostAdmin, validatePost, createPost, updatePost, deletePost } = require('../controllers/postsController');
const {verifyToken, isAdmin} = require('../middlewares/auth');

const adminPostsRouter = Router();

// Routes - /admin/posts
adminPostsRouter.get("/", verifyToken, isAdmin, getPostsAdmin);
adminPostsRouter.post("/", verifyToken, isAdmin, validatePost, createPost);
adminPostsRouter.get("/:postId", verifyToken, isAdmin, getPostAdmin);
adminPostsRouter.put("/:postId", verifyToken, isAdmin, validatePost, updatePost);
adminPostsRouter.delete("/:postId", verifyToken, isAdmin, deletePost);


module.exports = adminPostsRouter;