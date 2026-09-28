import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { createProduct, getProducts } from '../controllers/product';

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required().min(2).max(30),
      image: Joi.object()
        .keys({
          fileName: Joi.string().required(),
          originalName: Joi.string().required(),
        })
        .required(),
      category: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().allow(null).optional(),
    }),
  }),
  createProduct,
);

export default productRouter;
