import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BookingSteps from './components/BookingSteps.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import CalendarGrid from './components/CalendarGrid.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { compareDates, isDateSelectable } from './data/date.js';

import { fetchToday, fetchSlots } from './api.js';

export default function App() {
 const [today, setToday] = useState(null);
 const [currentMonth, setCurrentMonth] = useState(null);
 const [currentYear, setCurrentYear] = useState(null);
 const [selectedDay, setSelectedDay] = useState(null);
 const [selectedTime, setSelectedTime] = useState(null);
 const [slots, setSlots] = useState([]);
 const [confirmed, setConfirmed] = useState(false);
 const [todayLoading, setTodayLoading] = useState(true);
 const [todayError, setTodayError] = useState('');
 const [slotsLoading, setSlotsLoading] = useState(false);
 const [slotsError, setSlotsError] = useState('');
 const [todayAttempt, setTodayAttempt] = useState(0);
 const [slotsAttempt, setSlotsAttempt] = useState(0);

 useEffect(() => {
  const controller = new AbortController();
  let active = true;
  setTodayLoading(true);
  setTodayError('');
  fetchToday(controller.signal).then(data => {
   if (!active) return;
   const date = new Date(data.year, data.month, data.day);
   if (!Number.isInteger(data.year) || !Number.isInteger(data.month) || !Number.isInteger(data.day) || date.getFullYear() !== data.year || date.getMonth() !== data.month || date.getDate() !== data.day) throw new Error('Сервер вернул некорректную дату.');
   setToday(date);
   setCurrentMonth(data.month);
   setCurrentYear(data.year);
   setSlotsLoading(true);
   setSelectedDay(date);
  }).catch(error => {
   if (active && error.name !== 'AbortError') setTodayError(error.message);
  }).finally(() => { if (active) setTodayLoading(false); });
  return () => { active = false; controller.abort(); };
 }, [todayAttempt]);

 useEffect(() => {
  if (!selectedDay) return;
  const controller = new AbortController();
  let active = true;
  setSlotsLoading(true);
  setSlotsError('');
  setSlots([]);
  setSelectedTime(null);
  fetchSlots(selectedDay, controller.signal).then(data => {
   if (!active) return;
   if (!data.date || data.date.day !== selectedDay.getDate() || data.date.month !== selectedDay.getMonth() || data.date.year !== selectedDay.getFullYear()) throw new Error('Сервер вернул слоты для другой даты. Повторите запрос.');
   if (!Array.isArray(data.slots) || data.slots.some(slot => typeof slot.time !== 'string' || typeof slot.available !== 'boolean')) throw new Error('Некорректный ответ сервера.');
   setSlots(data.slots);
  }).catch(error => {
   if (active && error.name !== 'AbortError') setSlotsError(error.message);
  }).finally(() => { if (active) setSlotsLoading(false); });
  return () => { active = false; controller.abort(); };
 }, [selectedDay, slotsAttempt]);

 function handleDayClick(date) {
  if (!isDateSelectable(date.getDate(), date.getMonth(), date.getFullYear(), today)) return;
  setSelectedDay(date);
  setSelectedTime(null);
  setSlots([]);
  setSlotsLoading(true);
  setSlotsError('');
  setConfirmed(false);
 }
 function handleTimeClick(time) {
  if (slotsLoading || slotsError || !slots.some(slot => slot.time === time && slot.available)) return;
  setSelectedTime(time);
  setConfirmed(false);
 }
 function handleChangeMonth(direction) {
  const next = new Date(currentYear, currentMonth + direction, 1);
  setCurrentMonth(next.getMonth());
  setCurrentYear(next.getFullYear());
 }
 function handleConfirm(event) {
  event.preventDefault();
  if (selectedTime && !slotsLoading && !slotsError) setConfirmed(true);
 }
 return <><Header /><main className="main container"><BookingSteps /><h1 className="title">Календарь</h1>
  {todayLoading ? <section className="request-status" role="status">Загрузка…</section> : todayError ? <section className="request-status"><p role="alert">{todayError}</p><button className="retry" type="button" onClick={() => setTodayAttempt(value => value + 1)}>Повторить</button></section> : <form className="booking" onSubmit={handleConfirm}>
   <fieldset className="calendar"><legend className="visually-hidden">Выберите дату</legend>
    <CalendarHeader month={currentMonth} year={currentYear} onChangeMonth={handleChangeMonth} />
    <CalendarGrid month={currentMonth} year={currentYear} today={today} selectedDay={selectedDay} onDayClick={handleDayClick} />
   </fieldset>
   <div className="booking__right"><TimeSlots loading={slotsLoading} error={slotsError} onRetry={() => { setSlotsLoading(true); setSlotsAttempt(value => value + 1); }} slots={slots} selectedTime={selectedTime} onTimeClick={handleTimeClick} /><BookingBottomBar selectedDay={selectedDay} selectedTime={selectedTime} confirmed={confirmed} /></div>
  </form>}
 </main><Footer /></>;
}
