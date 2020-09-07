import mongoose from 'mongoose';
import User, { IUserDocument } from './User';
import { IFrom, ITo } from '../chat/chat-IO';

export interface IMessageDocument extends mongoose.Document {
  content: string;
  timestamp: string;
  user: {
    senderEmail: string;
    senderName: string;
  };
}

export interface IChannelDocument extends mongoose.Document {
  messages: Array<IMessageDocument>;
  users: Array<IUserDocument>;
  creator: string;
}

export interface IMessageModel extends mongoose.Model<IMessageDocument> {}
export interface IChannelModel extends mongoose.Model<IChannelDocument> {
  saveMessage: (message: IMessageDocument, channelID: string) => void;
  saveNewRoom: (from: Object, to: Object, message: string) => Promise<string>;
}

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Object,
    required: true,
  },
});

const ChannelSchema = new mongoose.Schema({
  messages: {
    type: [MessageSchema],
  },
  users: [{ type: Object }],
  creator: {
    type: String,
    required: true,
  },
});

ChannelSchema.statics.saveNewRoom = async (
  from: IFrom,
  to: ITo,
  message: string
) => {
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
  });

  try {
    //start
    let channelID: string | null = null;

    await channel.save((err, doc) => {
      if (err) throw Error(err);
      channelID = doc._id;
    });

    let session: mongoose.ClientSession | null = null;
    return await mongoose
      .startSession()
      .then(async (_session) => {
        const { _id } = channel;
        session = _session;
        session.startTransaction();
        await User.findOneAndUpdate(
          { email: from.senderEmail },
          { $addToSet: { channels: _id } },
          { session },
          (err: Error) => {
            if (err && session) return session.abortTransaction();
            console.log('1 SAVED');
          }
        );

        await User.findOneAndUpdate(
          { email: to.recieverEmail },
          { $addToSet: { channels: _id } },
          { session },
          async (err, doc) => {
            if (err && session) return await session.abortTransaction();
            console.log('2 SAVED');
          }
        );
      })
      .then(async () => {
        if (session) await session.commitTransaction();
      })
      .then(() => {
        if (session) session.endSession();
        return channelID;
      });

    //end
  } catch (e) {
    console.log(e);
  }
};

ChannelSchema.statics.saveMessage = async (
  message: IMessageDocument,
  channelID: string
) => {
  console.log(message, channelID);
  const messageDB = new Message(message);
  await Channel.findOneAndUpdate(
    {
      _id: channelID,
    },
    {
      $addToSet: { messages: messageDB },
    },
    (err, doc) => {
      if (err) throw err;
      console.log(doc);
    }
  );
};

export const Channel: IChannelModel = mongoose.model<
  IChannelDocument,
  IChannelModel
>('channels', ChannelSchema, 'channels');
export const Message: IMessageModel = mongoose.model(
  'messages',
  MessageSchema,
  'message'
);

export default Channel;
