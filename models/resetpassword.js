const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const resetPwdSchema=new Schema({
    active:Boolean,
    expiresby:Date,
    userId:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    }
})

module.exports=mongoose.model("forgotpassword",resetPwdSchema)
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// //id, name , password, phone number, role

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = Forgotpassword;