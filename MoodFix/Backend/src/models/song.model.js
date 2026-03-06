const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please enter the song title']
    },
    songUrl:{
        type:String,
        required:[true,'Please enter the song url']
    },
    posterUrl:{
        type:String,
        required:[true,'Please enter the song poster url']
    },
    mood:{
        type:String,
        enum:{
            values:["happy","sad","surprised"]
        }
    }
})

const songModel = mongoose.model("song",songSchema);


module.exports = songModel;