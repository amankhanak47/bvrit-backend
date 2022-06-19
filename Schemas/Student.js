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
    unique: true,
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
  section: {
    type: String,
    required: true,
  },
  student_img:
    {
        type:String,
        // contentType: String
    },
  personal_email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
        type: String,
        required:true
  }
});

module.exports = mongoose.model("student", StudentSchema);
