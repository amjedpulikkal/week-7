const express = require("express");
const router = express.Router()
const methodOverride = require('method-override')
const session = require("express-session")
const db = require("../tools/db")

router.use(methodOverride('_method'));


router.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => {

  if (req.session.admin) {

    db.find().then(data => {

      let user = []
      let nouser = []
      for (let n in data) {
        if (data[n].status) {
          user.push(data[n])
        } else {
          nouser.push(data[n])
        }

      }
      res.render("admin", { user ,nouser,page:"admin"})
    }).catch(err => {

      console.log(err);
      res.redirect("./")

    })
  } else {
    
    res.render("adLogin",{page:"admin"})
  }
})


router.get("/block/:id", (req, res) => {
  try{
    const id = req.params.id
    db.block(id).then(value=>{
      res.redirect("/admin")
    })
  }catch(e){

    console.log(e);
  }
})
router.get("/unblock/:id", (req, res) => {
  try{
    const id = req.params.id
    db.Unblock(id).then(value=>{
      res.redirect("/admin")
    })
  }catch(e){
    console.log(e);
  }

})


router.patch("/update/:id", (req, res) => {


  const id = req.params.id
  const userdata = req.body
  db.update(id, userdata).then(data => {

    if (data) {
      console.log(data)
      res.redirect("/admin")
    } else {

      res.render("/")

    }


  }).catch(data => {
    console.log("err__" + data);
  })


})

router.post("/add", (req, res) => {
 console.log("goot it")
  const data = req.body
  console.log(data)
  db.insert(data).then(data => {
      // res.redirect("./admin")
      res.status(200).json({ message: "Success" });
  }).catch(err => {

    res.status(400).json({ error: err });

  })
})


router.post("/", (req, res) => {

  const bodyData = req.body
  console.log(bodyData);

  if (bodyData.password != "" && bodyData.email != "") {

    db.admin(bodyData).then(data => {
      if (data) {
        console.log(data == null);
        console.log(data);
        req.session.admin = data
        res.redirect("/admin")
      } else {
        const err = "Email or password not match"
        res.render("adLogin", { err ,page:"admin"})
      }
    }).catch(data => {
      console.log(data);
    })
  } else {
    const err = " password or email is null"
    res.render("adLogin", { err,page:"admin" })
  }
})


router.get("/logout", (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.redirect("/")
    } else {
      res.redirect("/admin")
    }
  })
})


router.delete("/delete/:id", (req, res) => {
  const id = req.params.id
  console.log(id);
  db.Duser(id).then(data => {
    console.log(data);
    if (data) {
      res.redirect("/admin")
    }
  })
})

module.exports = router