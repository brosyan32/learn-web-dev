'use strict';

// Данные: демонстрационное расписание без сервера.
const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Состояние: даты хранятся в местном времени, без UTC-преобразований.
const state = {
  today: null,
  currentMonth: null,
  currentYear: null,
  selectedDay: null,
  selectedTime: null,
  slots: [],
};
let elements;

// Чистые функции.
function compareDates(date1, date2) {
  const first = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
  const second = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();
  return Math.sign(first - second);
}

function isDateSelectable(day, month, year, today) {
  return compareDates(new Date(year, month, day), today) >= 0;
}

function buildCalendarGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((offset + count) / 7) * 7;
  const weeks = [];
  for (let index = 0; index < cellCount; index += 7) {
    const week = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      week.push(new Date(year, month, index + weekday - offset + 1));
    }
    weeks.push(week);
  }
  return weeks;
}

function getSlotsForDate(date) {
  const seed = date.getFullYear() + date.getMonth() + date.getDate();
  return TIMES.map((time, index) => ({
    time,
    busy: index === seed % TIMES.length || index === (seed + 3) % TIMES.length,
  }));
}

function formatDate(date) {
  return `${DAYS_OF_WEEK[date.getDay()]}, ${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

// Рендер: после innerHTML обработчики добавляются к новым кнопкам.
function renderCalendar() {
  elements.month.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
  const headings = WEEKDAYS_SHORT.map(day => `<span class="weekday" aria-hidden="true">${day}</span>`).join('');
  const days = buildCalendarGrid(state.currentYear, state.currentMonth).flat().map(date => {
    if (date.getMonth() !== state.currentMonth) {
      return '<span class="calendar__empty" aria-hidden="true"></span>';
    }
    const selectable = isDateSelectable(date.getDate(), state.currentMonth, state.currentYear, state.today);
    const selected = compareDates(date, state.selectedDay) === 0;
    return `<button class="day${selected ? ' day--selected' : ''}${selectable ? '' : ' day--disabled'}" type="button" data-day="${date.getDate()}" aria-label="${formatDate(date)}" aria-pressed="${selected}"${selectable ? '' : ' disabled'}><span class="day__number">${date.getDate()}</span></button>`;
  }).join('');
  elements.calendar.innerHTML = headings + days;
  elements.calendar.querySelectorAll('button[data-day]').forEach(button => {
    button.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  elements.slots.innerHTML = state.slots.map(slot => {
    const selected = slot.time === state.selectedTime;
    if (slot.busy) {
      return `<button class="slot slot--busy" type="button" disabled aria-label="${slot.time}, занято"><span>${slot.time}</span><small class="slot__status">Занято</small></button>`;
    }
    return `<button class="slot${selected ? ' slot--selected' : ''}" type="button" data-time="${slot.time}" aria-pressed="${selected}"><span class="slot__time">${slot.time}</span></button>`;
  }).join('');
  elements.slots.querySelectorAll('button[data-time]').forEach(button => {
    button.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  elements.summary.textContent = `${formatDate(state.selectedDay)} • ${state.selectedTime || 'Выберите время'}`;
  elements.confirm.disabled = !state.selectedTime;
}

// Обработчики.
function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  if (!isDateSelectable(day, state.currentMonth, state.currentYear, state.today)) return;
  state.selectedDay = new Date(state.currentYear, state.currentMonth, day);
  state.selectedTime = null;
  state.slots = getSlotsForDate(state.selectedDay);
  elements.message.textContent = '';
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  elements.calendar.querySelector(`[data-day="${day}"]`).focus();
}

function onTimeSlotClick(event) {
  const time = event.currentTarget.dataset.time;
  if (!state.slots.some(slot => slot.time === time && !slot.busy)) return;
  state.selectedTime = time;
  elements.message.textContent = '';
  renderTimeSlots();
  updateBottomBar();
  elements.slots.querySelector(`[data-time="${time}"]`).focus();
}

function changeMonth(direction) {
  const next = new Date(state.currentYear, state.currentMonth + direction, 1);
  state.currentMonth = next.getMonth();
  state.currentYear = next.getFullYear();
  renderCalendar();
}

function setupMonthNavigation() {
  elements.previous.addEventListener('click', () => changeMonth(-1));
  elements.next.addEventListener('click', () => changeMonth(1));
}

function onConfirm(event) {
  event.preventDefault();
  if (!state.selectedTime) return;
  elements.message.textContent = `Вы выбрали: ${formatDate(state.selectedDay)} • ${state.selectedTime}. Это демонстрация: запись не отправляется.`;
}

// Инициализация.
function init() {
  const now = new Date();
  state.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  state.currentMonth = state.today.getMonth();
  state.currentYear = state.today.getFullYear();
  state.selectedDay = new Date(state.today);
  state.selectedTime = null;
  state.slots = getSlotsForDate(state.selectedDay);
  elements = {
    month: document.querySelector('.calendar__month'),
    calendar: document.querySelector('.calendar__grid'),
    slots: document.querySelector('.times__grid'),
    previous: document.querySelectorAll('.calendar__arrow')[0],
    next: document.querySelectorAll('.calendar__arrow')[1],
    summary: document.querySelector('.selection__summary'),
    message: document.querySelector('.selection__message'),
    confirm: document.querySelector('.confirm'),
    form: document.querySelector('.booking'),
  };
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
  elements.form.addEventListener('submit', onConfirm);
}

document.addEventListener('DOMContentLoaded', init);
