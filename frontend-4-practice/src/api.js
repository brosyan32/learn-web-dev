async function request(url, signal) {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Ошибка сервера (${response.status}). Попробуйте ещё раз.`);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    if (error instanceof TypeError) throw new Error('Не удалось связаться с сервером. Проверьте подключение и повторите запрос.');
    throw error;
  }
}

export function fetchToday(signal) {
  return request('/api/booking/today', signal);
}

export function fetchSlots(date, signal) {
  const query = new URLSearchParams({ day: date.getDate(), month: date.getMonth(), year: date.getFullYear() });
  return request(`/api/slots?${query}`, signal);
}
