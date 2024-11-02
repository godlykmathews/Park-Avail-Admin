var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertId)
            })
        })

    },
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("Login Success");
                        response.user=user
                        response.status=true  
                        resolve(response)                      
                    }else{
                        console.log("Login Failed - password Error");
                    }
                })
            }else{
                console.log("Login Failed - User not found");
            }
        })
    }
}