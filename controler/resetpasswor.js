const Sib = require('sib-api-v3-sdk')
const uuid = require('uuid')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/resetpassword')

Sib.ApiClient.instance.authentications['api-key'].apiKey = process.env.SIB_SEND_Mail_key;
const tranEmailApi = new Sib.TransactionalEmailsApi()

exports.forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email:email})
        if (user) {
            const id = uuid.v4()
            console.log(id,user._id)
           // await user.createForgotpassword({ id, active: true })
           const fpData=new Forgotpassword({active:true,userId:user})
           fpData.save()
           .then(console.log)
                .catch(err => {
                    throw new Error(err)
                })

            const sender = {
                email: 'admin.and@gmail.com'
            }

            const receiver = [
                {
                    email: email
                }
            ]
            const sendemail = await tranEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'Reset the password',
                htmlContent: `<a href="http://localhost:2000/password/resetpassword/${user._id}">Reset password</a>`,

            }).catch(err => {
                throw new Error(err)
            })
            res.status(200).send({ message: 'check your mail' })
        }
        else {
            res.send({ message: 'Email is not resistered' })
        }
    }
    catch (err) {
        console.log(err)
        return res.json({ message: err, sucess: false })
    }
}


//iuhih
exports.resetpassword = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    Forgotpassword.findOne({userId:id})
        .then(forgotpasswordrequest => {
            console.log(forgotpasswordrequest)
           
            if (forgotpasswordrequest) {
                if (forgotpasswordrequest.active == false) {
                    return res.send({ message: 'Link expire' })
                }
                forgotpasswordrequest.active=false;
                //forgotpasswordrequest.updateOne({ active: false })
            //    forgotpasswordrequest.save()
            //     .then(r=>{
            //         console.log(r)
            //     }).catch(er=>console.log(er))
                res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${forgotpasswordrequest._id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                )
                res.end()

            }
            else{
                res.send({message:"something went wrong"})
            }
         })
}//klj

exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({_id: resetpasswordid}).then(resetpasswordrequest => {
            console.log(resetpasswordrequest)
            User.findOne({ _id: resetpasswordrequest.userId }).then(user => {
                // console.log('userDetails', user)
                if (user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                           // user.update({ password: hash })
                            user.password=hash;
                            user.save()
                            .then(() => {
                                res.status(201).json({ message: 'Successfuly update the new password' })
                            })
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user Exists', success: false })
                }
            })
        })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}


