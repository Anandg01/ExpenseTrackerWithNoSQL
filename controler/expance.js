const Expance = require('../models/expance')
const User = require('../models/user')
const FileUrlTable = require('../models/downloadFileurl')
//const sequelize = require('../util/database')
const s3Service = require('../services/s3services')


exports.getData = async (req, res) => {
  const id = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  try {
    const data = await Expance.find({ userId: id } )
    const paginatedExpenses = data.slice(startIndex, endIndex)
    res.json({
      hasPrev: page > 1,
      hasNextpage: perPage * page < data.length,
      prevPage: page - 1,
      currentPage: page,
      nextPage: page + 1,
      perPage,
      total: data.length,
      data: paginatedExpenses
    });
  }
  catch (err) {
    res.status(303).json({ message: false })
  }
}


function validString(string) {
  if (string == undefined || string.length === 0) {
    return true;
  }
  return false;
}

exports.addExpance = async (req, res) => {

  let { expAmount, description, catagory, userId } = req.body;
  console.log("req.user ", req.user._id)
  userId = req.user._id;
  if (expAmount == undefined || validString(description) || validString(catagory)) {
    return res.status(401).json({ message: 'Something went wrong', success: false })
  }

  try {
    const expense=new Expance({expAmount:expAmount,description:description,catagory:catagory,userId:userId})
   const data= await expense.save()
    const totalexpance = Number(req.user.totalexpance) + Number(expAmount)
     console.log("totalexpance",totalexpance)
   await User.updateOne({_id:userId},{totalexpance:totalexpance})
   req.user.totalexpance=totalexpance;
   req.user.save()
    res.send(data)
  }
  catch (err) {
    await t.rollback();
    res.status(403).json(err)
    console.log('error find')
  }
}

exports.removeExpance = async (req, res) => {
//   const t = await sequelize.transaction();
  const expid = req.params.id
  if (expid == undefined || expid.length === 0) {
    return res.status(400).json({ success: false, message: 'invalid id' })
  }
  const userid = req.user.id;
  console.log(userid)
  try {
    const exp=await Expance.findByIdAndDelete({_id:expid})

    console.log(exp,exp.expAmount)
        const totalexpance = Number(req.user.totalexpance) - Number(exp.expAmount)
        req.user.totalexpance=totalexpance;
       await req.user.save()
    res.status(200).send(exp)
  }
  catch (err) {
   // await t.rollback()
    console.log(err)
    return res.status(404).json({ success: false, message: 'somthing went wrong' })
  }
}

exports.download = async (req, res) => {
  const user = req.user;

  try {
    //const expance = await user.getExpances()
    const expance=await Expance.find({userId:user})
    console.log(expance)
    const stringExpance = JSON.stringify(expance)
    console.log(user.id)
    const userid = user._id;

    const fileName = `Expense${userid}/${new Date()}.txt`;
    const fileURL = await s3Service.uploadToS3(stringExpance, fileName);
    //await FileUrlTable.create({ fileURL: fileURL, userId: userid })
     const f1=new FileUrlTable({fileURL: fileURL, userId: userid})
     f1.save()
    res.status(201).json({ fileURL, success: true })
  }
  catch (err) {
    res.status(401).json({ err, success: false })
  }

}


exports.allFileurl = async (req, res) => {
  const userId = req.user.id;
  const allfile = await FileUrlTable.find({ userId: userId })
  res.send(allfile)
}