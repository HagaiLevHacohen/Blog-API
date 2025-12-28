// app.js
require("dotenv").config();

const { prisma } = require("./lib/prisma");
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const configurePassport = require("./config/passport");

// Import Routers
const indexRouter = require("./routes/indexRouter");
const postsRouter = require("./routes/postsRouter");
const adminPostsRouter = require("./routes/adminPostsRouter");
const adminCommentsRouter = require("./routes/adminCommentsRouter");
const commentsRouter = require("./routes/commentsRouter");


// app setup
const app = express();

// If deployed behind a proxy (Render, Heroku, Railway)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


// ----- Passport configuration -----
configurePassport(passport, prisma);


// ----- Express middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());


// ------- Routers -------
app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/admin/posts", adminPostsRouter);
app.use("/posts/:postId/comments", commentsRouter);
app.use("/admin/posts/:postId/comments", adminCommentsRouter);



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})