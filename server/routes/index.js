import express from 'express';
import productsRoute from './products';
import searchRoute from './search';

const router = express.Router();

const routes = (param) => {

  const { productService } = param;

  router.get('/', async (req, res, next) => {
    try {
      const products = await productService.getProducts(3);
      return res.render('index', {
        title: 'Top',
        products,
      });
    } catch(err) {
      return err;
    }
  });

  router.use('/products', productsRoute(param));
  router.use('/search', searchRoute(param));

  return router;
}

export default routes;