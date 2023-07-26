const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const OrdesrSchema=new Schema({
    paymentId:String,
    orderId:String,
    status:String,
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
})

module.exports=mongoose.model("order",OrdesrSchema)

// const Sequilizer=require('sequelize')
// const sequelize=require('../util/database')

// const Order=sequelize.define('order',{
//     id:{
//         type:Sequilizer.INTEGER,
//         autoIncrement:true,
//         alowNull:false,
//         primaryKey:true
//     },
//     paymentId:Sequilizer.STRING,
//     orderId:Sequilizer.STRING,
//     status:Sequilizer.STRING
// })


// module.exports=Order;