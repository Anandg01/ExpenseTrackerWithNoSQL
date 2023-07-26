const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    ispremiumuser:{
        type:Boolean,
    },
    totalexpance:{
        type:Number,
        min:0,
        default:0
    }

})

module.exports=mongoose.model("Users",userSchema)
// const Sequelize=require('sequelize')
// const sequelize=require('../util/database')

// const user=sequelize.define('user',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         alowNull:false,
//         primaryKey:true
//     },
//     name:{
//     type:Sequelize.STRING,
//     alowNull:false
//     },

//     email:{
//     type:Sequelize.STRING,
//     alowNull:false,
//     unique:true
//     },
//     password:{
//         type:Sequelize.STRING,
//         alowNull:false,
//     },
//     ispremiumuser:Sequelize.BOOLEAN,
//     totalexpance:{
//         type:Sequelize.INTEGER,
//         defaultValue:0
//     }
// })

// module.exports=user;