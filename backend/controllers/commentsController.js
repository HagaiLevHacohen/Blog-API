// controllers/commentsController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const getComments = async (req, res, next) => {
    try {
        const comments = await prisma.comment.findMany({
        where: { postId: Number(req.params.postId)},
        orderBy: {createdAt: "desc"},
        include: {user: true}
        });

        res.json(comments);
    } catch (err) {
        next(err);
    }
};


const validateComment = [
  body("content")
    .trim()
    .notEmpty()
    .isLength({ max: 255 })
    .withMessage("Title is required and must be under 255 characters"),
];

const createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        errors: errors.array(),
        values: req.body,
      });
    }

    const { content } = matchedData(req);

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: Number(req.params.postId),
        userId: req.userId
      },
      include: { user: true }
    });

    res.json({ success: true, comment: newComment });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await prisma.comment.delete({
      where: {id: Number(req.params.commentId)}
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};


module.exports = { 
                    getComments,
                    validateComment,
                    createComment,
                    deleteComment

 };