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
    unique: true,
  },

  personal_email: {
    type: String,
    required: true,
    unique: true,
    },
   password: {
        type: String,
        required:true
  },
  faculty_img:
    {
        type:String,
    },
});

module.exports = mongoose.model("faculty", FacultySchema);
