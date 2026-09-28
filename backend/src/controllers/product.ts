import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import Product from '../models/product';
import { BadRequestError, ConflictError } from '../errors';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find({});
    res.send({ items, total: items.length });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).send(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(error);
  }
};
