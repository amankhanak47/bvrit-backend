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
    body("year", "please enter year").isLength({ min: 1 }),
    body("mobile_no", "Enter a valid mobile-no").isLength({ min: 5 }),
    body("password").isLength({ min: 3 }),
    // body("student_img")
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
        year:req.body.year
        // student_img: req.body.student_img[0].base64,
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
      res.status(500).send("credentials already regidterd");
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
      // console.log(req.params.id)
      
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
          .json({ sucess: sucess, errors: "enter correct login password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      console.log(user.id)

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error);
      res.status(500).send({error:'internal servr error'});
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

//student change password

router.put('/student/changepassword', fetchstudent, async (req, res) => {
    const { password } = req.body;
    try {
        // Create a newNote object
      const updatedstudent = {};
       const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
        if (password) { updatedstudent.password = secpass };

      let changedstudent = await student.findById(req.user.id);
      console.log(req.user.id)
        if (!changedstudent) { return res.status(404).send("Not Found") }
        changedstudent = await student.findByIdAndUpdate(req.user.id, { $set: updatedstudent }, { new: true })
        res.json({ sucess:"true" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// student forgot password

router.put('/student/forgotpassword', async (req, res) => {
    const {college_email, password } = req.body;
    try {
        // Create a newNote object
      const fogottedpassword = {};
       const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      if (password) { fogottedpassword.password = secpass };
      if(college_email){fogottedpassword.college_email = college_email}

      let forgottedstudent = await student.findOne({ college_email });
      // let studentid=await student.findOne({ _id});
      // console.log((forgottedstudent.password))
      
        if (!forgottedstudent) { return res.status(404).send("Not Found") }
        forgottedstudent = await student.findByIdAndUpdate(forgottedstudent.id, { $set: fogottedpassword }, { new: true })
        res.json({ sucess:"true" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



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
    //  body("faculty_img")
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
        // faculty_img: req.body.faculty_img[0].base64,
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
      res.status(500).send("credentials already regidterd");
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


//student change password

router.put('/faculty/changepassword', fetchfaculty, async (req, res) => {
    const { password } = req.body;
    try {
        // Create a newNote object
      const updatedfaculty = {};
       const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
        if (password) { updatedfaculty.password = secpass };

      let changedfaculty = await faculty.findById(req.user.id);
      console.log(req.user.id)
        if (!changedfaculty) { return res.status(404).send("Not Found") }
        changedfaculty = await faculty.findByIdAndUpdate(req.user.id, { $set: updatedfaculty }, { new: true })
        res.json({ sucess:"true" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})



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
    // body("hod_img")
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
        // hod_img: req.body.hod_img[0].base64,
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
      res.status(500).send("cresentials already registered");
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
