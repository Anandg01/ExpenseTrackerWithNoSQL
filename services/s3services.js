const aws=require('aws-sdk')
require('dotenv').config();

exports.uploadToS3= function(data, fileName){
    const BUCKET_NAME='expanceapp';
    const IAM_USER_KEY=process.env.AWS_IAM_USER_KEY
    const IAM_USER_SECRET=process.env.AWS_IAM_USER_SECRET;
  //const IAM_USER_KEY=''
   //const IAM_USER_SECRET='';
  
    let s3busket=new aws.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey:IAM_USER_SECRET,
      //Bucket:BUCKET_NAME
    })
  
  
      var params={
        Bucket:BUCKET_NAME,
        Key:fileName,
        Body:data,
        ACL:"public-read"
         }
  
  return new Promise((resolve, reject)=>{
    s3busket.upload(params,(err, s3Responce)=>{
      if(err){
        console.log('Somthing went wrong',err)
        reject(err)
      }
      else{
        console.log( 'succes',s3Responce)
        resolve(s3Responce.Location)
      }
     })
  })
  
  }