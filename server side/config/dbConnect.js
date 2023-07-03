const mongoose=require("mongoose")
const url="mongodb://127.0.0.1:27017/user";
const dbConnect=()=>{
    return new Promise((resolve,reject)=>{
        try {
           const conn= mongoose.connect(url)
            resolve(conn)
        } catch (error) {
           reject(error) 
        }
    })
}
module.exports={dbConnect}