const express = require('express')
const mongo = require('mongoose')
const app = express()
const PORT = 8888


app.use(express.json())
mongo.connect('mongodb://127.0.0.1:27017/nesa',(err )=>{
    if(err){
        console.log(err);
        
    }
    else{
        console.log('connected');
        
    }
})

const blog = require('./models/blog')


app.get('/savedata',(req,res)=>{
    const data = req.query
    const blogPost = new blog(
        {
        title: data.title,
        author: data.author,
        body: data.body,
        comments: 0,
        date: new Date()
       }
       )
    
    blogPost.save((err,doc)=>{
        return res.json(doc)

    })
})

app.get('/getdata',(req,res)=>{
    blog.find({'title':'somto'},(err,doc)=>{
        return res.json(doc)
    })
})

app.listen(PORT,(err)=>{
    if(!err){
        console.log('fun happens in nesa (they all suffer)');
    }
    else{
        console.log(err)
    }
})