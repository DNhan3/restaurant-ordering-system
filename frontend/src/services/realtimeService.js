import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export const subscribeToOrderEvents = ({ session, userId, onOrderChanged }) => {
  if (!session?.accessToken || !onOrderChanged) {
    return () => {};
  }

  const socket = io(SOCKET_URL, {
    auth: { token: session.accessToken },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    socket.emit('orders:subscribe', { userId });
  });

  socket.on('order:changed', onOrderChanged);

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection failed:', error.message);
  });

  return () => {
    socket.off('order:changed', onOrderChanged);
    socket.disconnect();
  };
};
