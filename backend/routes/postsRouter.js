// routes/postsRouter.js
const { Router } = require("express");
const { getPosts, getPost } = require('../controllers/postsController');
const {verifyToken, isAdmin} = require('../middlewares/auth');

const postsRouter = Router();

// Routes - /posts
postsRouter.get("/", getPosts);
postsRouter.get("/:postId", getPost);


module.exports = postsRouter;