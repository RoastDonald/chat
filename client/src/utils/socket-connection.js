import io from 'socket.io-client';

class SocketManager {
  static socket = null;
  static email = null;

  static getConnection = (email) => {
    if (SocketManager.socket) return SocketManager.socket;
    console.log(email);
    SocketManager.socket = io.connect('/');
    SocketManager.email = email;
    SocketManager.socket.emit('client:auth', {
      data: {
        email,
      },
    });
    return SocketManager.socket;
  };

  static disconnectFromServer = () => {
    SocketManager.setOffline();
    SocketManager.email = null;
    SocketManager.socket = null;
  };

  static setOffline = async () => {
    const { socket, email } = this;
    if (socket && email) {
      console.log(socket, email);
      await socket.emit('client:logout', {
        data: {
          email,
        },
      });
    }
    await socket.disconnect();
  };
}

export default SocketManager;
