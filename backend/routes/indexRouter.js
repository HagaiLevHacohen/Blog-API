// routes/indexRouter.js
const { Router } = require("express");
const { postLogin, validateUser, postSignup, getUser } = require('../controllers/indexController');
const {verifyToken, isAdmin} = require('../middlewares/auth');

const indexRouter = Router();

// Routes
indexRouter.post("/login", postLogin);
indexRouter.post("/signup", [validateUser, postSignup]);
indexRouter.get("/user", verifyToken, getUser);



module.exports = indexRouter;