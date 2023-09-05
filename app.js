const express = require('express');
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express()

app.use(
    fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 1024 * 1024
        },
        abortOnLimit: true
    })
) 

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.post('/upload',(req,res)=>{
    console.log(req.files)
    if(!req.files){
        return res.status(400).send("Upload something!!!!")
    }
    const file = req.files.myFile
    const maxSize = 1024 * 1024
    if(file.size > maxSize){
        return res.status(500).send('file is too big')
    }
    const extensionName = '.' + file.mimetype.split('/')[1]
    const allowedExtension = ['.png','.jpg','.jpeg','.pdf','.txt'];
    if(!allowedExtension.includes(extensionName)){
        return res.status(500).send('File type not allowed')
    }
    const path = __dirname + "/files/" + file.name
    file.mv(path, (err)=>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send({status: "Success", path : path})
    })
})

app.listen(4000, ()=>{
    console.log('Ready to serve..')
})