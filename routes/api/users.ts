import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { IRegisterData } from '../../interfaces/IRegisterData';
import { IAutheticated } from '../../interfaces/IAuthenticated';

import auth from '../../middlewares/auth';
import User from '../../models/User';
import { IJwtUser } from '../../interfaces/IJwtUser';
import { ApiErrors } from '../../errors/api-errors';

const { check, validationResult } = require('express-validator');

/**
 * @route  GET api/users
 * @des Gives list of users except sender, 25 limit
 * @access  Private
 *  */

/**
 * @route  GET api/users
 * @des Creates an user, and gives user data
 * @access  Public
 *  */

export default class UserController {
  public route = '/';
  public router = express.Router();

  constructor() {
    this.router.get(this.route, auth, this.getUsers);
    this.router.post(
      this.route,
      [
        check('email', 'Enter correct email').isEmail(),
        check('password', 'Enter password with 6 or more characters').isLength({
          min: 6,
        }),
      ],
      this.regiserUser
    );
  }

  private getUsers = async (req: any, res: any) => {
    try {
      const search = decodeURI(req.query.search) || '';
      const sender = req.user.id;
      const users = await User.findUsersByQuery(search, sender);
      res.status(200).json({ users });
    } catch (e) {
      res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
  };

  private regiserUser = (req: Request, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const data = req.body as IRegisterData;
    User.registerUser(data, (_error, data) => {
      let e = _error;
      console.log(data);
      if (!e) return res.status(201).json(data);
      switch (e.message) {
        case ApiErrors.INCORRECT_DATA:
          return res
            .status(422)
            .json({ errors: [{ message: ApiErrors.INCORRECT_DATA }] });
        case ApiErrors.USER_ALREADY_EXISTS:
          return res
            .status(422)
            .json({ errors: [{ message: ApiErrors.USER_ALREADY_EXISTS }] });
        default:
          return res
            .status(500)
            .json({ errors: [{ message: 'Server error' }] });
      }
    });
  };
}
