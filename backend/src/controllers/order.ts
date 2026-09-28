import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import Product from '../models/product';
import { BadRequestError } from '../errors';

interface IOrderBody {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      items,
      total,
    }: IOrderBody = req.body;

    if (!items.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      throw new BadRequestError('Передан невалидный id товара');
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingId = items.find((id) => !foundIds.includes(id));
      throw new BadRequestError(`Товар с id ${missingId} не найден`);
    }

    const notForSale = products.find((p) => p.price === null);
    if (notForSale) {
      throw new BadRequestError(`Товар с id ${notForSale._id} не продается`);
    }

    const calculatedTotal = products.reduce(
      (sum, p) => sum + (p.price as number),
      0,
    );

    if (calculatedTotal !== total) {
      throw new BadRequestError('Неверная сумма заказа');
    }

    const orderId = faker.string.uuid();

    res.send({ id: orderId, total });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
