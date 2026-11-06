// ===== Данные =====
const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'];
const TIMES = ['10:00', '10:45', '11:30', '12:15', '13:00', '13:45',
  '14:30', '15:15', '16:00', '16:45', '17:30', '18:15'];

// ===== Состояние =====
const state = {
  today: null,
  currentMonth: 0,
  currentYear: 0,
  selectedDate: null,
  selectedTime: null
};

// ===== Элементы =====
const monthTitle = document.getElementById('month-title');
const calendarGrid = document.getElementById('calendar-grid');
const slotsBox = document.getElementById('slots');
const prevButton = document.getElementById('prev-month');
const nextButton = document.getElementById('next-month');
const bottomText = document.getElementById('bottom-bar-text');
const confirmButton = document.getElementById('confirm-button');

// ===== Вспомогательные функции =====
// Сравнивает две даты без учёта времени: <0, 0 или >0
function compareDates(date1, date2) {
  const a = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const b = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return a - b;
}

// Прошедшие дни выбирать нельзя
function isDateSelectable(date) {
  return compareDates(date, state.today) >= 0;
}

// Массив ячеек месяца: null — пустая ячейка, иначе объект Date
function buildCalendarGrid(year, month) {
  const cells = [];
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // пн = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

// Строка вида 2026-11-07 для data-атрибута
function dateToKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + m + '-' + d;
}

// Условно «занятые» слоты: зависят от даты, чтобы везде не было одинаково
function isSlotBusy(date, index) {
  return (date.getDate() + index) % 4 === 0;
}

// ===== Отрисовка =====
function renderCalendar() {
  monthTitle.textContent = MONTHS_NOMINATIVE[state.currentMonth] + ' ' + state.currentYear;

  const cells = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  cells.forEach(function (date) {
    if (date === null) {
      html += '<span class="calendar__empty"></span>';
      return;
    }
    let classes = 'calendar__day';
    if (!isDateSelectable(date)) classes += ' calendar__day--disabled';
    if (compareDates(date, state.today) === 0) classes += ' calendar__day--today';
    if (state.selectedDate && compareDates(date, state.selectedDate) === 0) {
      classes += ' calendar__day--selected';
    }
    const disabled = isDateSelectable(date) ? '' : ' disabled';
    html += '<button class="' + classes + '" type="button" data-date="' +
      dateToKey(date) + '"' + disabled + '>' + date.getDate() + '</button>';
  });

  calendarGrid.innerHTML = html;

  // нельзя листать в прошлое дальше текущего месяца
  const isCurrentMonth = state.currentYear === state.today.getFullYear() &&
    state.currentMonth === state.today.getMonth();
  prevButton.disabled = isCurrentMonth;
}

function renderTimeSlots() {
  let html = '';
  TIMES.forEach(function (time, index) {
    const busy = isSlotBusy(state.selectedDate, index);
    let classes = 'slot';
    if (busy) classes += ' slot--busy';
    if (time === state.selectedTime) classes += ' slot--selected';
    html += '<button class="' + classes + '" type="button" data-time="' + time + '"' +
      (busy ? ' disabled' : '') + '>' + time + '</button>';
  });
  slotsBox.innerHTML = html;
}

function updateBottomBar() {
  const d = state.selectedDate;
  const dateText = DAYS_OF_WEEK[d.getDay()] + ', ' + d.getDate() + ' ' +
    MONTHS_GENITIVE[d.getMonth()] + ' ' + d.getFullYear();

  if (state.selectedTime) {
    bottomText.textContent = dateText + ' • ' + state.selectedTime;
    confirmButton.disabled = false;
  } else {
    bottomText.textContent = dateText + ' • время не выбрано';
    confirmButton.disabled = true;
  }
}

// ===== Обработчики =====
function onDayClick(event) {
  const button = event.target.closest('.calendar__day');
  if (!button || button.disabled) return;

  const parts = button.dataset.date.split('-');
  // месяц в Date считается с 0, поэтому минус 1
  state.selectedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  state.selectedTime = null; // при смене дня время сбрасываем

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onSlotClick(event) {
  const button = event.target.closest('.slot');
  if (!button || button.disabled) return;

  state.selectedTime = button.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function changeMonth(step) {
  state.currentMonth += step;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  renderCalendar();
}

function setupEventListeners() {
  // один обработчик на контейнер — работает и после перерисовки
  calendarGrid.addEventListener('click', onDayClick);
  slotsBox.addEventListener('click', onSlotClick);
  prevButton.addEventListener('click', function () { changeMonth(-1); });
  nextButton.addEventListener('click', function () { changeMonth(1); });
  confirmButton.addEventListener('click', function () {
    alert('Вы записаны: ' + bottomText.textContent);
  });
}

// ===== Запуск =====
function init() {
  state.today = new Date();
  state.currentMonth = state.today.getMonth();
  state.currentYear = state.today.getFullYear();
  state.selectedDate = state.today; // по умолчанию выбран сегодняшний день
  state.selectedTime = null;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);
