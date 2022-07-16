const mongoose = require("mongoose");
const { Schema } = mongoose;

const FacultySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
 
  college_email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile_no: {
    type: Number,
    required: true,
    
  },

  personal_email: {
    type: String,
    required: true,
  
    },
   password: {
        type: String,
        required:true
  },

});

module.exports = mongoose.model("faculty", FacultySchema);
