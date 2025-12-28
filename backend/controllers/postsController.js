// controllers/postsController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
        where: { published: true },
        include: { user: true }
        });

        res.json(posts);
    } catch (err) {
        next(err);
    }
};


const getPostsAdmin = async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
        include: { user: true }
        });

        res.json(posts);
    } catch (err) {
        next(err);
    }
};

const getPost = async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
        where: {id: Number(req.params.postId), published: true},
        include: { user: true, comments: true }
        });

        res.json(post);
    } catch (err) {
        next(err);
    }
};

const getPostAdmin = async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
        where: {id: Number(req.params.postId)},
        include: { user: true, comments: true }
        });

        res.json(post);
    } catch (err) {
        next(err);
    }
};

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .isLength({ max: 255 })
    .withMessage("Title is required and must be under 255 characters"),

  body("content")
    .optional()
    .trim(),
  body("published")
    .optional(),
];

const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        errors: errors.array(),
        values: req.body,
      });
    }

    const { title, content, published } = matchedData(req);

    await prisma.post.create({
      data: {
        title,
        content,
        published,
        userId: req.userId
      }
    });

    res.json({ success: true, message: "Post created" });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        errors: errors.array(),
        values: req.body,
      });
    }

    const { title, content, published } = matchedData(req);

    await prisma.post.update({
      where: {id: Number(req.params.postId)},
      data: {
        title,
        content,
        published,
      }
    });

    res.json({ success: true, message: "Post updated" });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await prisma.post.delete({
      where: {id: Number(req.params.postId)}
    });

    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};


module.exports = { 
                    getPosts, getPostsAdmin,
                    getPost, getPostAdmin,
                    validatePost,
                    createPost,
                    updatePost,
                    deletePost

 };