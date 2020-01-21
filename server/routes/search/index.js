import express from 'express';

const router = express.Router();

const routes = (param) => {

  const { productService } = param;

  router.get('/', async (req, res, next) => {
    try {
      const searchValue = req.query.q;
      const products = await productService.searchProducts(`/${searchValue}/`);
      return res.render('search', {
        title: `Search Result of ${searchValue}`,
        searchValue,
        products,
      });
    } catch(err) {
      return err;
    }

  });

  return router;
}

export default routes;