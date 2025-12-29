// controllers/indexController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");



const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) throw new Error("Username already exists");
      return true;
    }),

  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) throw new Error("Email already exists");
      return true;
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirm_password")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Password confirmation doesn't match");
      }
      return true;
    }),
];


const postSignup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      errors: errors.array(),
      values: req.body,
    });
  }

  // Only use matchedData when validation PASSES
  const { username, email, password } = matchedData(req);
  const passwordHashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      passwordHashed: passwordHashed
    }
  })
  res.json({ success: true, message: "Signup successful" });
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    // Sign the JWT
    const token = jwt.sign(
      { userId: user.id},
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    // Send the token to the client
    return res.json({ token });
  })(req, res, next);
};

const getUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
        where: {id: req.userId},
        });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const getWelcome = async (req, res, next) => {
      res.json({message: "Welcome to the website. Backend initialized."});
};

module.exports = { 
                    postLogin,
                    postSignup,
                    validateUser,
                    getUser,
                    getWelcome,
 };
