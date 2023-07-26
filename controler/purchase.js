const rozerpay = require('razorpay')
const Order = require('../models/orders');

exports.premiumParchase = async (req, res) => {
    console.log(req.user.id)
    try {
        const rzp = new rozerpay({
            key_id: process.env.RZP_Key_Id,
            key_secret: process.env.RZP_SECRET_Key
        })
        const amount = 5000;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            const o1=new Order({orderId: order.id, status: 'PENDING',userId:req.user })
            o1.save()
           .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch(err => {
                    console.log('error in ths 2')
                    throw new Error(err)
                })
        })
    }
    catch (err) {
        console.log(err)
        res.status(403).json({ message: 'Somthing went wrong', error: err })
    }
}

exports.updatrastionStatus = async (req, res) => {
    try {
        const { payment_id, order_id, paymentStatus } = req.body;
        let status = 'SUCCESSFUL';
        let premimum = true;
        if (paymentStatus === false) {
            status = 'FAIELD';
            premimum = false;
        }
        console.log("paymentStatus===", paymentStatus)
        const updateResult = await Order.updateOne({ orderId: order_id }, {
            $set: {
                paymentId: payment_id,
                status: status,
            }
        });
        console.log(updateResult)
        req.user.ispremiumuser=premimum;
        req.user.save()
     res.status(202).json({ sucess: true, message: 'Transastion completed' })
    }
    catch (err) {
        console.log(err)
        res.status(403).json({ sucess: false, message: 'transtion faield' })
    }
}