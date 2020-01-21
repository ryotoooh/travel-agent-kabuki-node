require('dotenv').config();

import express from 'express';
import path from 'path';
import routes from './server/routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import ProductService from './server/services/ProductService';

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASEURL = process.env.DATABASEURL;

const productService = new ProductService();

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

app.use('/', routes({
  productService
}));
app.use(express.static('public'));

app.listen(PORT, process.env.IP, () =>
  console.log(`travel-agent-kabuki is running on port ${PORT}`)
);