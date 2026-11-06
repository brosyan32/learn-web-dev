import { useState } from 'react';
import CalendarHeader from '../components/booking/CalendarHeader.jsx';
import CalendarGrid from '../components/booking/CalendarGrid.jsx';
import TimeSlots from '../components/booking/TimeSlots.jsx';
import BookingBottomBar from '../components/booking/BookingBottomBar.jsx';
import { compareDates, generateSlots } from '../utils/date.js';

function BookingScreen() {
  // сегодняшняя дата создаётся один раз
  const [today] = useState(() => new Date());

  // пять значений состояния
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => generateSlots(today));

  // показан ли текущий месяц (назад листать нельзя)
  const isCurrentMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  function handleDayClick(date) {
    setSelectedDate(date);
    setSelectedTime(null); // при смене дня время сбрасываем
    setSlots(generateSlots(date));
  }

  function handleSlotClick(time) {
    setSelectedTime(time);
  }

  function changeMonth(step) {
    // Date сам переносит год: месяц 12 -> январь следующего года
    const next = new Date(currentYear, currentMonth + step, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
  }

  function handleConfirm(text) {
    alert('Вы записаны: ' + text);
  }

  return (
    <main className="main">
      <section className="intro">
        <p className="steps">Шаг 3 из 4</p>
        <h1 className="title">Выберите дату и время</h1>
        <p className="intro__text">Мастер: Артём · Мужская стрижка, 45 минут</p>
      </section>

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
              slots={slots}
              selectedTime={selectedTime}
              onSelect={handleSlotClick}
            />
          </section>
        </div>

        <BookingBottomBar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onConfirm={handleConfirm}
        />
      </div>
    </main>
  );
}

export default BookingScreen;
