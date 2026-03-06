const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');
const path = require('path');



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/**
 * Routes
 */
const authroutes = require("./routes/auth.routes");
const songroutes = require("./routes/song.routes");




app.use("/api/auth",authroutes);
app.use("/api/songs",songroutes);
app.use("/",express.static(path.join(__dirname,"../public")));
console.log(path.join(__dirname,"public"));







module.exports = app;