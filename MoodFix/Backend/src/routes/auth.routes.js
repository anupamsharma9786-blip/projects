const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleWare = require("../middlewares/auth.middleware")

const Router = express.Router();

Router.post("/register",authController.registerUser);

Router.post("/login",authController.loginUser)

Router.get("/get-me",authMiddleWare.authUser,authController.getMe)

Router.get("/logout",authMiddleWare.authUser,authController.logoutUser)

module.exports = Router;