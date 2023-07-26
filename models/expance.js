const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const expenseSchema=new Schema({
    expAmount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    catagory:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Users"
    }

})

module.exports=mongoose.model("expense",expenseSchema)
// const Sequelize=require('sequelize');
// const sequelize=require('../util/database');

// const expance=sequelize.define('expance',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         alowNull:false,
//         primaryKey:true
//     },
//     expAmount:{
//         type:Sequelize.INTEGER,
//         alowNull:false
//     },
//     description:{
//         type:Sequelize.STRING,
//         alowNull:false
//     },
//     catagory:{
//         type:Sequelize.STRING,
//         alowNull:false
//     }
// })

// module.exports=expance;