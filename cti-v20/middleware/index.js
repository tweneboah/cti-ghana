// All middlewares goes here

const middlewareObj = {}

//LOGIN 
middlewareObj.isLogin = function(req, res, next){
 if(req.isAuthenticated()){
    return next()
 }else {
 req.flash('error', 'Please login first')
 res.redirect('/login')
 }
}
module.exports  = middlewareObj;