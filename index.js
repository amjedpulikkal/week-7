const express = require('express')
const app = express()
const adminRouter = require("./router/admin")
const userRouter = require("./router/user")
const nocache = require("nocache")


app.use(express.urlencoded({ extended: true }));
app.set('views', ('views'));
app.set('view engine', 'hbs');
app.use(express.static("public"))
app.use(nocache());


//----------------Route------------------------------
app.use("/admin", adminRouter)
app.use("/", userRouter)




const PORT = 3000
app.listen(PORT, () => {
  console.log(PORT);
})





