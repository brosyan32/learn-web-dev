import { today, getSlots } from './database.js';

// Задержка ответа: имитирует сеть. Поставьте 0 для мгновенных ответов.
const DELAY_MS = 600;

// День месяца, на который сервер отвечает ошибкой 500 (чтобы проверить сценарий ошибки).
// Поставьте null, чтобы отключить.
const ERROR_DAY = 13;

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function handle(url, res) {
  if (url.pathname === '/api/booking/today') {
    sendJson(res, 200, today);
    return;
  }

  if (url.pathname === '/api/slots') {
    const day = Number(url.searchParams.get('day'));
    const month = Number(url.searchParams.get('month'));
    const year = Number(url.searchParams.get('year'));

    if (!day || Number.isNaN(month) || !year) {
      sendJson(res, 400, { error: 'Нужны параметры day, month и year' });
      return;
    }
    if (day === ERROR_DAY) {
      sendJson(res, 500, { error: 'Внутренняя ошибка сервера' });
      return;
    }

    sendJson(res, 200, {
      date: { day: day, month: month, year: year },
      slots: getSlots(day, month, year),
    });
    return;
  }

  sendJson(res, 404, { error: 'Не найдено' });
}

// Плагин Vite: перехватывает запросы /api/...
export default function mockServer() {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use(function (req, res, next) {
        if (!req.url.startsWith('/api/')) {
          next();
          return;
        }
        const url = new URL(req.url, 'http://localhost');
        setTimeout(function () {
          handle(url, res);
        }, DELAY_MS);
      });
    },
  };
}
