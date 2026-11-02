import { today, slotSets } from './database.js';

export const DELAY_MS = 700;

export default function bookingServer() {
  function middleware(req, res, next) {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return next();
    function send(status, body) {
      if (res.destroyed) return;
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(body));
    }
    setTimeout(() => {
      try {
        if (req.method !== 'GET') return send(405, { error: 'Метод не поддерживается' });
        // Для проверки обработки ошибок: добавьте ?fail=1 к запросу.
        if (url.searchParams.get('fail') === '1') return send(500, { error: 'Сервер временно недоступен' });
        if (url.pathname === '/api/booking/today') return send(200, today);
        if (url.pathname === '/api/slots') {
          const fields = ['day', 'month', 'year'];
          if (fields.some(field => !/^\d+$/.test(url.searchParams.get(field) || ''))) {
            return send(400, { error: 'Укажите день, месяц и год' });
          }
          const [day, month, year] = fields.map(field => Number(url.searchParams.get(field)));
          const date = new Date(year, month, day);
          if (year < 1900 || year > 9999 || date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return send(400, { error: 'Некорректная дата' });
          }
          return send(200, { date: { day, month, year }, slots: slotSets[day % slotSets.length] });
        }
        return send(404, { error: 'Адрес API не найден' });
      } catch {
        return send(500, { error: 'Ошибка сервера' });
      }
    }, DELAY_MS);
  }
  return {
    name: 'booking-api',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}
