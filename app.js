const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config();

// const sequelize=require('./util/database')
 
const bodyParser=require('body-parser')
const fs=require('fs')
const path=require('path')
const cors=require('cors')
const helmet=require('helmet')
const morgan=require('morgan')
const app=express();

 const User=require('./models/user')
// const Expance=require('./models/expance')
// const order=require('./models/orders')
// const Forgotpassword=require('./models/resetpassword')
// const fileUrl=require('./models/downloadFileurl')
app.use(cors())
//app.use(helmet())

const accessLogStream=fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags:'a'}
);

app.use(morgan('combined',{stream:accessLogStream}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
/*
app.use('/',(req, res)=>{
    console.log(req)
    res.send('hi')
})*/

const userRout=require('./router/user')
const expanceRout=require('./router/expance')
const resetpasword=require('./router/resetpassword')

 app.use('/user',userRout)
app.use('/password',resetpasword)

app.use(expanceRout)

app.use((req, res)=>{
    console.log('usr', req.url)
res.sendFile(path.join(__dirname,'public',req.url))
})

mongoose.connect(process.env.URI)
.then(result=>{
    console.log("mongoose is connect")
    app.listen(2000,console.log("server running..."))
})
.catch(err=>console.log('error occured in mongoose conection',err))