const mongoose = require('mongoose');

async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch(err){
        console.error('Error connecting to MongoDB:', err);
    }

    console.log("Connected to Database");
    
}

module.exports = connectToDB;