import BaseError from './base-error';

class InternalServerError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}

export default InternalServerError;
