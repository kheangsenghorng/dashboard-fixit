import { useEffect, useState } from 'react';
import echo from '@/lib/echo';

export function useOwnerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const channel = echo.private('admin.notifications');

    channel.listen('.owner.created', (payload) => {
      console.log('New owner:', payload);
      setLatest(payload);
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      echo.leave('admin.notifications');
    };
  }, []);

  return { notifications, latest };
}