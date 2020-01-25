class Middleware {
  async isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }

  async isAdmin(req, res, next) {
    if (req.user.access_level === 'Administrator') {
      return next();
    } else {
      res.redirect('/');
    }
  }
  
}

export default Middleware;