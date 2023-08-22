function inUser(req, res, next) {

    if (req.session.user) {
        next()
    } else {
        res.redirect("login")
    }
}
function noUser(req, res, next) {
  
    if (req.session.user) {
        res.redirect("/")
    } else {
       next()
    }

}
        

module.exports = { inUser, noUser }