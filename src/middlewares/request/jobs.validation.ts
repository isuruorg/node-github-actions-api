import { query } from 'express-validator';

const validate = (method: string) => {
  switch (method) {
    case 'getAllJobs':
      return query('softDelete')
        .exists()
        .withMessage('softDelete query param is required')
        .isBoolean()
        .withMessage('softDelete value should be boolean');
  }
};

export default validate;
