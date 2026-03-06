const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'User is required'],
        unique:[true,'User already exists']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'Email already exists']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false
    }
})

const userModel = mongoose.model('User',userSchema);


module.exports = userModel;