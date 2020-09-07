import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { IChannelDocument } from './Channel';
import { IRegisterData } from '../interfaces/IRegisterData';
import { IJwtUser } from '../interfaces/IJwtUser';

import { ApiErrors } from '../errors/api-errors';

import { Message, Channel } from './Channel';
import { Redis } from '../config/database';
const { ObjectId } = mongoose.Types;
const Schema = mongoose.Schema;

export interface IUserDocument extends mongoose.Document {
  displayName: string;
  email: string;
  password: string;
  date: Date;
  channels: Array<IChannelDocument>;
}

type callback = (err: Error | null, data: IJwtUser | null) => void;

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findUserChannels: (userID: string) => Promise<Object>;
  authUser: (data: IRegisterData, cb: callback) => void;
  findUsersByQuery: (search: string, sender: string) => any;
  registerUser: (data: IRegisterData, cb: callback) => void;
  //TODO
  createNewChannel: (data: any) => void;
}

const UserSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  channels: {
    type: [ObjectId],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.statics.findUserChannels = async (userID: string) => {
  return await User.aggregate([
    {
      $match: {
        _id: ObjectId(userID),
      },
    },
    {
      $lookup: {
        from: 'channels',
        localField: 'channels',
        foreignField: '_id',
        as: 'result',
      },
    },
    {
      $project: {
        result: true,
        _id: false,
      },
    },
  ]);
};

UserSchema.statics.findUsersByQuery = async (
  search: string,
  sender: string
) => {
  let users = await User.find(
    { displayName: { $regex: search }, _id: { $nin: [ObjectId(sender)] } },
    { email: '1', displayName: '1' }
  ).limit(25);

  //user gives docs with doc properties
  const userPromises = users.map(async (user: any) => {
    const userSocket = await new Promise((res) => {
      if (!Redis.database) return;
      Redis.database.hget(user._doc.email, 'socketID', (err, reply) => {
        if (err) throw Error('problem with redis');
        res(reply);
      });
    });

    return { ...user._doc, status: !!userSocket };
  });
  users = await Promise.all(userPromises);
  return users;
};

UserSchema.statics.registerUser = async (data: IRegisterData, cb: callback) => {
  const { email, displayName, password } = data;
  if (!email || !displayName || !password)
    return cb(new Error(ApiErrors.INCORRECT_DATA), null);
  let user = await User.findOne({ email });
  if (user) return cb(new Error(ApiErrors.USER_ALREADY_EXISTS), null);

  user = new User({
    displayName,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save((err, user) => {
    if (err) throw err;
    console.log(`${user.displayName} is saved`);
  });

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(payload, 'secret', { expiresIn: 360000 }, (error, token) => {
    if (error) throw error;
    if (!token) return cb(new Error(ApiErrors.INCORRECT_TOKEN), null);
    cb(null, {
      token,
      displayName,
      email,
    });
  });
};

UserSchema.statics.createNewChannel = (data: any) => {
  const {
    data: { from, to, message },
  } = data;

  const messageMod = new Message({
    content: message,
    user: from,
  });

  const channel = new Channel({
    creator: from.senderEmail,
    users: [
      { email: from.senderEmail, name: from.senderName },
      { email: to.recieverEmail, name: to.recieverName },
    ],
    messages: [messageMod],
    lastMessage: messageMod,
  });

  //start
  channel.save((err, doc) => {
    if (err) throw err;
    console.log(doc);
  });

  let session: any = null;
  mongoose
    .startSession()
    .then(async (_session) => {
      const { _id } = channel;
      session = _session;
      session.startTransaction();
      await User.findOneAndUpdate(
        { email: from.senderEmail },
        { $addToSet: { channels: _id } },
        { session },
        (err, doc) => {
          if (err) return session.abortTransaction();
          console.log('1 SAVED');
        }
      );

      await User.findOneAndUpdate(
        { email: to.recieverEmail },
        { $addToSet: { channels: _id } },
        { session },
        (err, doc) => {
          if (err) return session.abortTransaction();
          console.log('2 SAVED');
        }
      );
    })
    .then(() => session.commitTransaction())
    .then(() => session.endSession());
};

UserSchema.statics.authUser = async (data: IRegisterData, cb: callback) => {
  const { email, password } = data;
  console.log(1, email, password);
  if (!email || !password) return cb(new Error(ApiErrors.INCORRECT_DATA), null);
  const user = (await User.findOne({ email })) as IUserDocument;
  if (!user) return cb(new Error(ApiErrors.NOT_EXISTED_USER), null);
  const isPassowrdValid = await bcrypt.compare(password, user.password);
  if (!isPassowrdValid) return ApiErrors.INVALID_PASSWORD;

  const payload = {
    user: {
      id: user.id,
    },
  };

  const u_display_name = user.displayName;

  return jwt.sign(payload, 'secret', { expiresIn: 180000 }, (err, token) => {
    if (err) throw err;
    if (!token) return cb(new Error(ApiErrors.INCORRECT_TOKEN), null);
    console.log(4);
    cb(null, {
      token,
      displayName: u_display_name,
      email,
    });
  });
};

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>(
  'user',
  UserSchema,
  'users'
);
export default User;
