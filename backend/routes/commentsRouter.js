// routes/commentsRouter.js
const { Router } = require("express");
const { getComments, createComment, validateComment } = require('../controllers/commentsController');
const {verifyToken, isAdmin} = require('../middlewares/auth');

const commentsRouter = Router({ mergeParams: true });

// Routes - /posts/:postId/comments
commentsRouter.get("/", getComments);
commentsRouter.post("/", verifyToken, validateComment, createComment);


module.exports = commentsRouter;