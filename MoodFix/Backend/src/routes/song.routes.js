const express = require('express');
const songController = require('../controllers/song.controller');
const upload = require('../middlewares/upload.middleware');

const Router = express.Router();

Router.post('/',upload.single("song"),songController.uploadSong)

Router.get('/',songController.getSong)

module.exports = Router;