import * as express from 'express';

import { IAutheticated } from '../../interfaces/IAuthenticated';
import { IRegisterData } from '../../interfaces/IRegisterData';

import User from '../../models/User';
import auth from '../../middlewares/auth';
import { ApiErrors } from '../../errors/api-errors';
const { check, validationResult } = require('express-validator');

/**
 * @route   GET api/auth
 * @des Gives user document
 * @access  Private
 *  */

/**
 * @route  POST api/auth
 * @des User auth, gives user data with token
 * @access  Public
 *  */

export default class AuthController {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.router.get(this.path, auth, this.GET_UserDocument);
    this.router.post(
      this.path,
      [
        check('email', 'Enter correct email').isEmail(),
        check('password', 'Password is too short').isLength({
          min: 6,
        }),
      ],
      this.POST_UserToken
    );
  }

  private GET_UserDocument = async (req: IAutheticated, res: any) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user);
    } catch (e) {
      res.status(500).send({ message: 'server is down' });
    }
  };

  private POST_UserToken = async (req: Request, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = req.body as IRegisterData;

    User.authUser(user, (_error, userFromToken) => {
      let e = _error;
      if (!e) return res.status(200).json(userFromToken);
      switch (e.message) {
        case ApiErrors.INCORRECT_DATA:
          return res
            .status(422)
            .json({ errors: [{ message: ApiErrors.INCORRECT_DATA }] });
        case ApiErrors.INCORRECT_TOKEN:
          return res
            .status(422)
            .json({ errors: [{ message: ApiErrors.INCORRECT_TOKEN }] });
        case ApiErrors.NOT_EXISTED_USER:
          return res
            .status(422)
            .json({ errors: [{ message: ApiErrors.NOT_EXISTED_USER }] });
        case ApiErrors.INVALID_PASSWORD:
          return res
            .status(422)
            .json({ errors: [{ message: ApiErrors.INVALID_PASSWORD }] });
        default:
          return res
            .status(500)
            .json({ errors: [{ message: 'Server is down' }] });
      }
    });
  };
}
