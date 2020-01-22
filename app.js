require('dotenv').config();

import express from 'express';
import path from 'path';
import routes from './server/routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import { UserSchema } from './server/models/user';
const User = mongoose.model('User', UserSchema);

import ProductService from './server/services/ProductService';
import Middleware from './server/middleware';

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASEURL = process.env.DATABASEURL;

const productService = new ProductService();
const middleware = new Middleware();

mongoose.Promise = global.Promise;
mongoose.connect(DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('ERROR', err.message);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './server/views'));
app.use(methodOverride('_method'));

// session configuration
app.use(require('express-session')({
  secret: 'She sells sea shells by the sea shore',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes({
  productService,
  middleware
}));
app.use(express.static('public'));

app.listen(PORT, process.env.IP, () =>
  console.log(`travel-agent-kabuki is running on port ${PORT}`)
);