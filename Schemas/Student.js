const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  roll_no: {
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
 year: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },

  personal_email: {
    type: String,
    required: true,
    
    },
    password: {
        type: String,
        required:true
  }
});

module.exports = mongoose.model("student", StudentSchema);
