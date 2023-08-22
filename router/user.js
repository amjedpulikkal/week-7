const express = require("express");
const router = express.Router()
const inUser = require("../tools/mid").inUser
const nouser = require("../tools/mid").noUser
const session = require("express-session")
const db = require("../tools/db")



router.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );


router.get("/signup", nouser, (req, res) => {

    res.render("sign",{page:"user login"})
})
router.post("/signup", (req, res) => {

    const data = req.body
    db.insert(data).then(data => {
        req.session.user = data
        res.redirect("./")
    }).catch(err => {

        res.render("sign", { err ,page:"signup"})

    })
})

router.get("/login", nouser, (req, res) => {

    res.render("index",{page:"login"})


})
router.post("/login", nouser, (req, res) => {

    const bData = req.body
    db.findUser(bData).then(data => {
        req.session.user = data
        res.redirect("/")

    }).catch(err => {
        res.render("index", { err })
    })
})



router.get("/", inUser, (req, res) => {
    data = req.session.user
    res.render("home", { data ,page:"Home"})

})


router.get("/logout",(req,res)=>{
  
    req.session.destroy((err)=>{
      if(err){
        console.log(err);
        res.redirect("/")
      }else{
        res.redirect("/login")
      }
    })
  })

module.exports = router