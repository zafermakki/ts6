import { useEffect, useState } from 'react';
import { usersService } from '../services/usersService';
import { isCanceledRequest } from '../../../utils/isCanceledRequest';

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    usersService.getUsers(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setUsers(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted && !isCanceledRequest(err)) {
          setError(err.message || 'Could not load members.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { users, loading, error };
}
