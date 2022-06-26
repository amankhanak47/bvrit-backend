const mongoose=require("mongoose");
const mongouri="mongodb://localhost:27017"
//O13AdqObVEYuYHOU

const connectToMongo=()=>{
    mongoose.connect(mongouri,()=>{
        console.log("connected to mongo")
    })
}
module.exports=connectToMongo;