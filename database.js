const mongoose=require("mongoose");
const mongouri="mongodb+srv://bvrit-portal:AQPZMWO4tQAvMe9L@cluster0.dmnsn.mongodb.net/bvrit?retryWrites=true&w=majority"
//O13AdqObVEYuYHOU

const connectToMongo=()=>{
    mongoose.connect(mongouri,()=>{
        console.log("connected to mongo")
    })
}
module.exports=connectToMongo;