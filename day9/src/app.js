const express = require('express');
const app = express();
const noteModel = require('./models/notes.model')
const cors = require('cors')
const path = require('path')


app.use(express.json());
app.use(express.static("./public"))
app.use(cors())

app.post("/notes",async (req,res)=>{
    const {title,description} = req.body;
    const note = await noteModel.create({
        title,description
    });

    res.status(201).json({
        message: "Note created succesfully",
        note
    })
})

app.delete("/notes/:id",async (req,res)=>{
    const id = req.params.id;
    console.log(id);
    
    await noteModel.findByIdAndDelete(id)

    res.status(200).json({
        message: "Note deleted succesfully"
    })
})

app.patch("/notes/:id",async (req,res)=>{
    const id = req.params.id;
    const {description} = req.body;
    await noteModel.findByIdAndUpdate(id,{
        description
    })

    res.status(201).json({
        message: "Note updated succesfully",
    })
})



app.get("/notes",async (req,res)=>{
    const note = await noteModel.find();

    res.status(200).json({
        message: "Notes fetched succesfully",
        note
    })
})


app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"));
})

module.exports = app;