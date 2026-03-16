import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  forceTLS: true,
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then((res) => res.json())
        .then((data) => callback(false, data))
        .catch((err) => callback(true, err));
    },
  }),
});

export default echo;