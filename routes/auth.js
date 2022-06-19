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


//create a user
//ROute 1
router.post(
  "/student/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("roll_no").isLength({ min: 6 }),
    body("college_email", "Enter a valid college-email").isEmail(),
    body("personal_email", "Enter a valid personal-email").isEmail(),
    body("section", "please enter section").isLength({ min: 1 }),
    body("mobile_no", "Enter a valid mobile-no").isLength({ min: 5 }),
    body("password").isLength({ min: 3 }),
    body("student_img")
  ],
  
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      //create ney user
      user = await student.create({
        name: req.body.name,
        password: secpass,
        college_email: req.body.college_email,
        personal_email: req.body.personal_email,
        section: req.body.section,
        mobile_no: req.body.mobile_no,
        roll_no: req.body.roll_no,
        password: secpass,
        student_img: req.body.student_img[0].base64,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("user with this credentials already exists");
    }
  }
);

//uthenticate a user "./api/auth/login"
//ROUte 2
router.post(
  "/student/login",
  [
    
    body("password", "password cannot be blank").exists(),

    body("college_email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { college_email, password } = req.body;
    try {
      let user = await student.findOne({ college_email });
      
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

// get logedin user details
// ROuTe 3

router.post("/student/getinfo", fetchstudent, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await student.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});

//faculty
//faculty signup
router.post(
  "/faculty/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("college_email", "Enter a valid college-email").isEmail(),
    body("personal_email", "Enter a valid personal-email").isEmail(),
    body("mobile_no", "Enter a valid mobile-no").isLength({ min: 9 }),
    body("password").isLength({ min: 3 }),
     body("faculty_img")
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }
    
    try {
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      //create ney user
      user = await faculty.create({
        name: req.body.name,
        password: secpass,
        college_email: req.body.college_email,
        personal_email: req.body.personal_email,
        mobile_no: req.body.mobile_no,
        password: secpass,
        faculty_img: req.body.faculty_img[0].base64,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error);
      res.status(500).send("some error occured");
    }
  }
);

//faculty login
//uthenticate a user "./api/auth/faculty/login"
//ROUte 2
router.post(
  "/faculty/login",
  [
    body("password", "password cannot be blank").exists(),
    body("college_email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { college_email, password } = req.body;
    try {
      let user = await faculty.findOne({ college_email });
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);


// get logedin faculty details
// ROuTe 3

router.post("/faculty/getinfo", fetchfaculty, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await faculty.findById(userId);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});


//hod
//hod signup
router.post(
  "/hod/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("college_email", "Enter a valid college-email").isEmail(),
    body("personal_email", "Enter a valid personal-email").isEmail(),
    body("mobile_no", "Enter a valid mobile-no").isLength({ min: 9 }),
    body("password").isLength({ min: 3 }),
    body("hod_img")
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      
      //create ney user
      user = await hod.create({
        name: req.body.name,
        password: secpass,
        college_email: req.body.college_email,
        personal_email: req.body.personal_email,
        mobile_no: req.body.mobile_no,
        password: secpass,
        hod_img: req.body.hod_img[0].base64,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//hod login
//uthenticate a user "./api/auth/hod/login"
//ROUte 2
router.post(
  "/hod/login",
  [
    
    body("password", "password cannot be blank").exists(),
    body("college_email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { college_email, password } = req.body;
    try {
      let user = await hod.findOne({ college_email });
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "enter correct login credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

// get logedin hod details
// ROuTe 3

router.post("/hod/getinfo", fetchhod, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await hod.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});



module.exports = router;