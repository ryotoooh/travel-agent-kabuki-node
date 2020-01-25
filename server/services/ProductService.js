import mongoose from 'mongoose';
import fs from 'fs';
import sanitize from 'mongo-sanitize';

import { ProductSchema } from '../models/product';

const Product = mongoose.model('Product', ProductSchema);

class ProductService {

  async getProducts() {
    const products = await Product.find({});
    return products;
  }

  async getProducts(num) {
    const products = await Product.find({}).limit(num);
    return products;
  }

  async getProduct(id) {
    const product = await Product.findById({ _id: id });
    return product;
  }

  async cleanQuery(query) {
    return query = sanitize(query);
  }

  async searchProducts(keyword) {
    this.cleanQuery(keyword);
    const products = await Product.find({ $text: { $search: keyword } });
    return products;
  }

  async addNewProduct(newProduct) {
    const result = await Product.create(newProduct);
    return result;
  }

  async updateProduct(req) {
    Product.findById({ _id: req.params.id}, async (err, updatedProduct) => {
      if (err) {
        return err;
      } else {
        if (req.files.image.name != '') {
          updatedProduct.image = req.body.image;
        }

        updatedProduct.region = req.body.region;
        updatedProduct.city = req.body.city;
        updatedProduct.description = req.body.description;
        updatedProduct.cite = req.body.cite;
        updatedProduct.price = req.body.price;
        updatedProduct.caption = req.body.caption;

        updatedProduct.save();
        return true;
      }
    });
  }

  async deleteProduct(req) {
    Product.findById({ _id: req.params.id}, async (err, deletedProduct) => {
      if (err) {
        return err;
      } else {
        deletedProduct.remove();
        return true;
      }
    });
  }

  // this method is not-in-use
  // still working on it
  async uploadImage(req) {
    let result = true;
    let result_msg = '';

    if (req.files.image.name == '') {
      result = false;
      result_msg += ' Please select an image to upload.';
    } else if(req.files.image.size > 200000) {
      result = false;
      result_msg += ' The maximum size of image upload exceeded. An image must be less than 200KB.';
    } else {
      req.body.image = 'images/' + req.files.image.name; 
    }

    return {
      result,
      result_msg,
    }

  }

  // this method is not-in-use
  // still working on it
  validateFormInput(req, res, next) {
      let result = true;
      let result_msg = '';

      if (
        req.body.region == '' || 
        req.body.city == '' ||
        req.body.description == '' ||
        req.body.cite == '' ||
        req.body.price == '' ||
        req.body.caption == '' ||
        isNaN(req.body.price) ||
        req.files.image.name == ''
      ) {
        fs.unlink(req.files.image.path, (err) => {
          if (err)
          console.log(err);
        });
        result = false;
        result_msg = 'Please fill in all form fields with valid format.';

        if (req.files.image.name == '') {
          result_msg += ' Please select an image to upload.'
        }
        
        res.render('products/result', {
          result,
          result_msg,
        });
      } else if (req.files.image.size > 200000) {
        result = false;
        result_msg = 'The maximum size of image upload exceeded. An image must be less than 200KB.';
        res.render('products/result', {
          result,
          result_msg,
        });
      } else {
        next();
      }
  }
 
}

export default ProductService;