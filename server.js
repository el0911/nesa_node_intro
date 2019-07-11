const express = require('express')
const mongo = require('mongoose')
const app = express()
const PORT = 8080
const cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken')
app.use(cors())

const schema = Joi.object().keys({
        username:Joi.string().required().min(3).max(20),
        password:Joi.string().required().min(6).max(13).alphanum(),
        email:Joi.string().email().required(),
        fullname:Joi.string().required().min(3).max(20)
    })

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


app.post('/signin',(req,res)=>{
    const userDetails = req.body
    const password = userDetails.password
    user.findOne({
        email:userDetails.email
    },(err,doc)=>{
        if(err){
           return res.send('i got an error')
        }
        else{
            if(doc){
               
                if(bcrypt.compareSync(password, doc.password)){

                    const token = jwt.sign(doc.toJSON(),'parish',{
                        expiresIn:'100h'
                    })
                    return res.json({
                        status:true,
                        userDetail:token
                    })
                }
                else{
                    return res.json({
                        status:false,
                        message:'Wrong password'
                    })
                }
               
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
    const result = Joi.validate(userDetails,schema)

    const error = result.error
    const value = result.value

    if(error){
        return res.json(error)
    }
    const password = userDetails.password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    userDetails.password = hash

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