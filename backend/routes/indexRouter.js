// routes/indexRouter.js
const { Router } = require("express");
const { postLogin, validateUser, postSignup } = require('../controllers/indexController');

const indexRouter = Router();

// Routes
indexRouter.post("/login", postLogin);
indexRouter.post("/signup", [validateUser, postSignup]);



module.exports = indexRouter;