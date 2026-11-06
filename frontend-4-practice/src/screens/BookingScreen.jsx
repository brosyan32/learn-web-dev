import { useEffect, useState } from 'react';
import CalendarHeader from '../components/booking/CalendarHeader.jsx';
import CalendarGrid from '../components/booking/CalendarGrid.jsx';
import TimeSlots from '../components/booking/TimeSlots.jsx';
import BookingBottomBar from '../components/booking/BookingBottomBar.jsx';
import { compareDates } from '../utils/date.js';
import { fetchToday, fetchSlots } from '../api.js';

function BookingScreen() {
  // «сегодня» приходит с сервера: loading | error | success
  const [today, setToday] = useState(null);
  const [todayStatus, setTodayStatus] = useState('loading');
  const [todayAttempt, setTodayAttempt] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // слоты выбранного дня: loading | error | success
  const [slots, setSlots] = useState([]);
  const [slotsStatus, setSlotsStatus] = useState('loading');
  const [slotsAttempt, setSlotsAttempt] = useState(0);

  // Шаг 1. Загружаем «сегодня» при открытии страницы
  useEffect(function () {
    let ignore = false;
    setTodayStatus('loading');

    fetchToday()
      .then(function (data) {
        if (ignore) return;
        const date = new Date(data.year, data.month, data.day);
        setToday(date);
        setSelectedDate(date);
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
        setTodayStatus('success');
      })
      .catch(function () {
        if (!ignore) setTodayStatus('error');
      });

    return function () {
      ignore = true;
    };
  }, [todayAttempt]);

  // Шаг 2. Загружаем слоты при смене дня.
  // ignore защищает от гонки: ответ на старый клик не перезапишет новый.
  useEffect(function () {
    if (selectedDate === null) return;

    let ignore = false;
    setSlotsStatus('loading');
    setSlots([]);

    fetchSlots(selectedDate)
      .then(function (data) {
        if (ignore) return;
        setSlots(data);
        setSlotsStatus('success');
      })
      .catch(function () {
        if (!ignore) setSlotsStatus('error');
      });

    return function () {
      ignore = true;
    };
  }, [selectedDate, slotsAttempt]);

  function handleDayClick(date) {
    if (compareDates(date, selectedDate) === 0) return;
    setSelectedDate(date);
    setSelectedTime(null); // при смене дня время сбрасываем
  }

  function handleSlotClick(time) {
    setSelectedTime(time);
  }

  function changeMonth(step) {
    const next = new Date(currentYear, currentMonth + step, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
  }

  function handleConfirm(text) {
    alert('Вы записаны: ' + text);
  }

  let content;

  if (todayStatus === 'loading') {
    content = <p className="status">Загрузка…</p>;
  } else if (todayStatus === 'error') {
    content = (
      <div className="status status--error">
        <p>Не удалось загрузить данные. Проверьте соединение и попробуйте ещё раз.</p>
        <button
          className="status__retry"
          type="button"
          onClick={() => setTodayAttempt(todayAttempt + 1)}
        >
          Повторить
        </button>
      </div>
    );
  } else {
    const isCurrentMonth =
      currentYear === today.getFullYear() && currentMonth === today.getMonth();

    content = (
      <div className="booking">
        <div className="booking__choice">
          <section className="block calendar">
            <CalendarHeader
              year={currentYear}
              month={currentMonth}
              canGoBack={!isCurrentMonth}
              onPrev={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
            />
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              today={today}
              selectedDate={selectedDate}
              onSelect={handleDayClick}
            />
          </section>

          <section className="block times">
            <h2 className="block__title">Время</h2>
            <ul className="legend">
              <li className="legend__item legend__item--free">Свободно</li>
              <li className="legend__item legend__item--busy">Занято</li>
            </ul>
            <TimeSlots
              status={slotsStatus}
              slots={slots}
              selectedTime={selectedTime}
              onSelect={handleSlotClick}
              onRetry={() => setSlotsAttempt(slotsAttempt + 1)}
            />
          </section>
        </div>

        <BookingBottomBar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onConfirm={handleConfirm}
        />
      </div>
    );
  }

  return (
    <main className="main">
      <section className="intro">
        <p className="steps">Шаг 3 из 4</p>
        <h1 className="title">Выберите дату и время</h1>
        <p className="intro__text">Мастер: Артём · Мужская стрижка, 45 минут</p>
      </section>

      {content}
    </main>
  );
}

export default BookingScreen;
