// routes/adminCommentsRouter.js
const { Router } = require("express");
const { deleteComment } = require('../controllers/commentsController');
const {verifyToken, isAdmin} = require('../middlewares/auth');

const adminCommentsRouter = Router({ mergeParams: true });

// Routes - /admin/posts/:postId/comments
adminCommentsRouter.get("/:commentId", verifyToken, isAdmin, deleteComment);


module.exports = adminCommentsRouter;