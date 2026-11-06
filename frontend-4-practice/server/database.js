// «База данных» имитационного сервера.
// Месяц считается с нуля: январь = 0, октябрь = 9.

const now = new Date();

// «Сегодня» отдаёт сервер, а не код страницы
export const today = {
  day: now.getDate(),
  month: now.getMonth(),
  year: now.getFullYear(),
};

const TIMES = ['10:00', '10:45', '11:30', '12:15', '13:00', '13:45',
  '14:30', '15:15', '16:00', '16:45', '17:30', '18:15'];

// Слоты на день: { time, available }. Занятость условная и зависит от даты.
export function getSlots(day, month, year) {
  return TIMES.map(function (time, index) {
    return { time: time, available: (day + month + index) % 4 !== 0 };
  });
}
