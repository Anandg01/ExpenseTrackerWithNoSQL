const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const filurlSchema=new Schema({
    fileURL:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
})

module.exports=mongoose.model("fileurltable",filurlSchema)

// const Sequelize=require('sequelize')
// const sequelize=require('../util/database')

// const downloadedUrl= sequelize.define('fileurltable',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         alowNull:false,
//         primaryKey:true
//     },
//     fileURL:Sequelize.STRING
// })

// module.exports=downloadedUrl