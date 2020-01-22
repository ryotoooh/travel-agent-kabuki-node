import express from 'express';
import productsRoute from './products';
import searchRoute from './search';

import mongoose from 'mongoose';
import passport from 'passport';
import { UserSchema } from '../models/user';
const User = mongoose.model('User', UserSchema);

const router = express.Router();

const routes = (param) => {

  const { productService, middleware } = param;

  router.get('/', async (req, res, next) => {
    try {
      const products = await productService.getProducts(3);
      return res.render('index', {
        title: 'Top',
        products,
        user: req.user,
      });
    } catch(err) {
      return err;
    }
  });

  router.get('/register', async (req, res, next) => {
    try {
      return res.render('register', {
        title: `Sign Up`,
      });
    } catch(err) {
      return err;
    }
  });

  router.post('/register', async (req, res, next) => {
    try {
      User.register(new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        access_level: req.body.access_level,
      }), req.body.password, (err, user) => {
        if (err) {
          console.log(err)
          return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
          return res.redirect('products/all');
        });
      });

    } catch(err) {
      return err;
    }
  });

  router.get('/login', async (req, res, next) => {
    try {
      return res.render('login', {
        title: `Login`,
      });
    } catch(err) {
      return err;
    }
  });

  // passport middleware
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/products/all',
    failureRedirect: '/login'
  }), async (req, res, next) => {
  });

  router.get('/logout', async (req, res, next) => {
    try {
      req.logout();
      return res.redirect('/login');
    } catch(err) {
      return err;
    }
  });

  router.use('/products', productsRoute(param));
  router.use('/search', searchRoute(param));

  return router;
}

export default routes;