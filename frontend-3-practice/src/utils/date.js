export const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'];

export const TIMES = ['10:00', '10:45', '11:30', '12:15', '13:00', '13:45',
  '14:30', '15:15', '16:00', '16:45', '17:30', '18:15'];

// Сравнение дат без учёта времени: <0, 0 или >0
export function compareDates(date1, date2) {
  const a = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const b = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return a - b;
}

// Прошедшие дни выбирать нельзя
export function isDateSelectable(date, today) {
  return compareDates(date, today) >= 0;
}

// Ячейки месяца: null — пустая ячейка, иначе Date. Неделя начинается с понедельника.
export function buildCalendarGrid(year, month) {
  const cells = [];
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

// Ключ для React: 2026-11-07
export function dateToKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + m + '-' + d;
}

// Слоты на выбранный день; «занятость» условная и зависит от даты
export function generateSlots(date) {
  return TIMES.map(function (time, index) {
    return { time: time, busy: (date.getDate() + index) % 4 === 0 };
  });
}

// «Пятница, 17 октября 2026»
export function formatDate(date) {
  return DAYS_OF_WEEK[date.getDay()] + ', ' + date.getDate() + ' ' +
    MONTHS_GENITIVE[date.getMonth()] + ' ' + date.getFullYear();
}
