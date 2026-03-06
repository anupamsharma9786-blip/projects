const songModel = require('../models/song.model');
const id3 = require('node-id3');
const storageService = require('../services/storage.service');

async function uploadSong(req,res){
    const songBuffer = req.file.buffer;

    const mood = req.body.mood;

    

    const tags = id3.read(songBuffer);
    const [songFile,imageFile] = await Promise.all([
        storageService.uploadFile({
        buffer:songBuffer,
        filename:tags.title + "mp3",
        folder:"moodfix/songs"
    }),
    storageService.uploadFile({
        buffer:tags.image.imageBuffer,
        filename:tags.title + "jpg",
        folder:"moodfix/posters"
    })
    ])

    const song = await songModel.create({
        title:tags.title,
        songUrl:songFile.url,
        posterUrl:imageFile.url,
        mood
    })

    return res.status(201).json({
        message:"song created succesfully",
        song,

    })
}


async function getSong(req,res){
    const {mood} = req.query;
    console.log(mood);
    

    const song = await songModel.findOne({
        mood:mood
    })

    return res.status(200).json({
        message:"song fetched succesfully",
        song
    })
}

module.exports = {
    uploadSong,
    getSong
}