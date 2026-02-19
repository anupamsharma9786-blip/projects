const app = require('./src/app');
require('dotenv').config();

const connectToDb = require('./src/config/database');

connectToDb();

app.listen("3000",()=>{
    console.log("Server is listening of port 3000")
})



    
