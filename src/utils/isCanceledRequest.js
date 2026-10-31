/**
 * Detect requests canceled by Axios, AbortController, or browser navigation.
 * Some adapters expose only the message `canceled`, without the usual code/name.
 */
export function isCanceledRequest(error) {
  const message = String(error?.message || error || '').trim().toLowerCase();
  return Boolean(
    error?.code === 'ERR_CANCELED' ||
    error?.name === 'CanceledError' ||
    error?.name === 'AbortError' ||
    message === 'canceled' ||
    message === 'cancelled' ||
    message === 'request canceled' ||
    message === 'request cancelled'
  );
}
