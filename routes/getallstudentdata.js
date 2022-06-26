
const express = require("express");
const student = require("../Schemas/Student");
const faculty = require("../Schemas/Faculty");
const hod = require("../Schemas/Hod");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchstudent = require("../middleware/fetchstuden");
const fetchfaculty = require("../middleware/fetchfaculty");
const fetchhod = require("../middleware/fetchhod");
const JWT_SECRET = "qwertyuiop";



router.post("/student/getallstudents",[ body("name", "Enter a valid name").isLength({ min: 2 }),
  
 
    body("section", "please enter section").isLength({ min: 1 }),
    body("year", "please enter year").isLength({ min: 1 }),
    
    body("password").isLength({ min: 3 }),], async (req, res) => {
  try {
    
      const user = await student.find({ section: req.body.section, year: req.body.year}).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});



module.exports = router;