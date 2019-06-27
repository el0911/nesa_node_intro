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
const user = require('./models/users')


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


app.post('/login',(req,res)=>{
    const userDetails = req.body
    user.findOne(userDetails,(err,doc)=>{
        if(err){
           return res.send('i got an error')
        }
        else{
            if(doc){
                
                return res.json({
                    status:true,
                    userDetail:doc
                })
            }
            else{
                return res.json({
                    status:false,
                    message:'no user matching details'
                })
            }
        }
    })
    
})

app.get('/getdata',(req,res)=>{
    blog.find({'title':'somto'},(err,doc)=>{
        return res.json(doc)
    })
})


app.post('/register',(req,res)=>{

    const userDetails = req.body

    const newUser = new user(userDetails)

    newUser.save((err,doc)=>{
            if (err) {
                console.log(err);
                return res.send('i got an error')
            }
            else{
                return res.json(doc)
            }
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