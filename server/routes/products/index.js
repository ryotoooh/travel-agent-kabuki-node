import express from 'express';
import multipart from 'connect-multiparty';
import fs from 'fs';

const multipartyMiddleware = multipart();
const router = express.Router();

const routes = (param) => {

  const { productService, middleware } = param;

  router.get('/', async (req, res, next) => {
    try {
      const products = await productService.getProducts();
      return res.render('products/display', {
        title: 'Destinations',
        products,
        user: req.user,
      });
    } catch(err) {
      return err;
    }
  });

  router.post('/', middleware.isLoggedIn, multipartyMiddleware, async (req, res, next) => {
    try {
      // console.log(req.body);
      // console.log(req.files);

      let result = true;
      let result_msg = '';

      // check form input
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
        // emit error message
        result = false;
        result_msg = 'Please fill in all form fields with valid format.';

        if (req.files.image.name == '') {
          result_msg += '\r\nPlease select an image to upload.'
        }

        res.render('products/result', {
          result,
          result_msg,
          user: req.user,
        });
      } else if (req.files.image.size > 200000) {
        result = false;
        result_msg = 'The maximum size of image upload exceeded. An image must be less than 200KB.';
        res.render('products/result', {
          result,
          result_msg,
          user: req.user,
        });
      } else {
        // console.log(req.body);
        // copy file to public/images
        fs.copyFile(req.files.image.path, './public/images/' + req.files.image.name, (err) => {
          if (err)
          console.log(err);
        })

        fs.unlink(req.files.image.path, (err) => {
          if (err)
          console.log(err);
        });
        
        // add image file value for database
        req.body.image = '/images/' + req.files.image.name;
        await productService.addNewProduct(req.body);
        
        result = true;
        result_msg = 'New destination successfully added.';
        res.render('products/result', {
          title : 'Add Result of ' + req.body.city,
          result,
          result_msg,
          user: req.user,
        });
      }

    } catch(err) {
      console.log(err);
      return err;
    }
  });

  router.get('/new', middleware.isLoggedIn, async (req, res, next) => {
    try {
      return res.render('products/new', {
        title: 'Add Destination',
        user: req.user,
      });
    } catch(err) {
      return err;
    }
  });

  router.get('/all', middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    try {
      const products = await productService.getProducts();
      return res.render('products', {
        title: 'Update Destinations',
        products,
        user: req.user,
      });
    } catch(err) {
      return err;
    }
  })

  // Redirect dropdown form list
  router.get('/edit', middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    try {
      // console.log(req.query);
      res.redirect(`/products/${req.query.id}/edit`);
    } catch(err) {
      console.log(err);
      return err;
    }
  })

  // Redirect dropdown form list
  router.get('/delete', middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    try {
      // console.log(req.query);
      res.redirect(`/products/${req.query.id}/delete`);
    } catch(err) {
      console.log(err);
      return err;
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const product = await productService.getProduct(req.params.id);
      return res.render('products/show', {
        title: product.city,
        product,
        user: req.user,
      });
    } catch(err) {
      res.status(404);
      res.end()
      console.log(err);
      return;
    }   
  });

  router.get('/:id/edit', middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    try {
      const product = await productService.getProduct(req.params.id);
      const products = await productService.getProducts();
      return res.render('products/edit', {
        title: 'Update Destination of ' + product.city,
        product,
        products,
        user: req.user,
      });
    } catch(err) {
      res.status(404);
      res.end()
      console.log(err);
      return;
    }
  });

  router.get('/:id/delete', middleware.isLoggedIn, middleware.isAdmin, async (req, res, next) => {
    try {
      const product = await productService.getProduct(req.params.id);
      const products = await productService.getProducts();
      return res.render('products/delete', {
        title: 'Delete Destination of ' + product.city,
        product,
        products,
        user: req.user,
      });
    } catch(err) {
      res.status(404);
      res.end()
      console.log(err);
      return;
    }
  });

  router.put('/:id', middleware.isLoggedIn, middleware.isAdmin, multipartyMiddleware, async (req, res, next) => {
    try {
      // console.log(req.body);
      // console.log(req.files);

      let result = true;
      let result_msg = '';

      // check form input
      if (
        req.body.region == '' || 
        req.body.city == '' ||
        req.body.description == '' ||
        req.body.cite == '' ||
        req.body.price == '' ||
        req.body.caption == '' ||
        isNaN(req.body.price) 
      ) {
        fs.unlink(req.files.image.path, (err) => {
          if (err)
          console.log(err);
        });
        // emit error message
        result = false;
        result_msg = 'Please fill in all form fields with valid format.';

        res.render('products/result', {
          result,
          result_msg,
          user: req.user,
        });
      } else if (req.files.image.size > 200000) {
        result = false;
        result_msg = 'The maximum size of image upload exceeded. An image must be less than 200KB.';
        res.render('products/result', {
          result,
          result_msg,
          user: req.user,
        });
      } else {
        // console.log(req.body);
        // copy file to public/images
        if (req.files.image.name != '') {
          fs.copyFile(req.files.image.path, './public/images/' + req.files.image.name, (err) => {
            if (err)
            console.log(err);
          })

          // add image file value for database
          req.body.image = '/images/' + req.files.image.name;
        }

        fs.unlink(req.files.image.path, (err) => {
          if (err)
          console.log(err);
        });       
        
        await productService.updateProduct(req);
        
        result = true;
        result_msg = 'Destination successfully updated.';
        res.render('products/result', {
          title : 'Update Result of ' + req.body.city,
          result,
          result_msg,
          user: req.user,
        });
      }
  
    } catch(err) {
      let result = false;
      let result_msg = 'Destination not updated.';
      res.render('products/result', {
        title : 'Update Result of ' + req.body.city,
        result,
        result_msg,
        user: req.user,
      });
      return err;
    }
  });

  router.delete('/:id', middleware.isLoggedIn, middleware.isAdmin, multipartyMiddleware, async (req, res, next) => {
    try {
      let result = true;
      let result_msg = '';

      // remove file to public/images
      fs.unlink('./public' + req.body.image, (err) => {
        if (err) 
          console.log(err);
      });
      result_msg = 'Image successfully deleted.\r\n';
          
      await productService.deleteProduct(req);
      
      result_msg += 'Destination successfully deleted.';
      res.render('products/result', {
        title : 'Delete Result of ' + req.body.city,
        result,
        result_msg,
        user: req.user,
      });
      
    } catch(err) {
      let result = false;
      let result_msg = 'Destination not deleted.';
      res.render('products/result', {
        title : 'Delete Result of ' + req.body.city,
        result,
        result_msg,
        user: req.user,
      });
      return err;
    }
  });

  return router;
}

export default routes;