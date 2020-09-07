export const findAndPasteMessage = (channels, msg) => {
  const { channelID, message } = msg;
  return channels.map((channel) => {
    if (channel._id === channelID) {
      channel.messages.push(message);
      return channel;
    } else return channel;
  });
};
