import * as express from 'express';

import { IAutheticated } from '../../interfaces/IAuthenticated';

import User from '../../models/User';
import auth from '../../middlewares/auth';

/**
 * @route  GET api/profile
 * @des Gives user's channels
 * @access  Private
 *  */

export default class ProfileController {
  public path = '/channels';
  public router = express.Router();

  constructor() {
    this.router.get(this.path, auth, this.getChannels);
  }

  private getChannels = async (req: IAutheticated, res: any) => {
    const userID = req.user.id;
    try {
      const userChannels = await User.findUserChannels(userID);
      res.status(200).json(userChannels);
    } catch (e) {
      res.status(500).send({ message: 'server is down' });
    }
  };
}
