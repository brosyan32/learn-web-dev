// Все запросы к серверу собраны здесь.

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Ошибка сервера: ' + response.status);
  }
  return response.json();
}

// GET /api/booking/today -> { day, month, year }  (месяц с нуля)
export async function fetchToday() {
  const data = await request('/api/booking/today');
  return { day: data.day, month: data.month, year: data.year };
}

// GET /api/slots?day=&month=&year= -> { date, slots }
export async function fetchSlots(date) {
  const query = '?day=' + date.getDate() +
    '&month=' + date.getMonth() +
    '&year=' + date.getFullYear();
  const data = await request('/api/slots' + query);

  return data.slots.map(function (slot) {
    return { time: slot.time, available: slot.available };
  });
}
