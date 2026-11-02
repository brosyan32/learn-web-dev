import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BookingSteps from './components/BookingSteps.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import CalendarGrid from './components/CalendarGrid.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import { getSlotsForDate, isDateSelectable } from './data/date.js';

export default function App() {
 const [today] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); });
 const [currentMonth, setCurrentMonth] = useState(today.getMonth());
 const [currentYear, setCurrentYear] = useState(today.getFullYear());
 const [selectedDay, setSelectedDay] = useState(today);
 const [selectedTime, setSelectedTime] = useState(null);
 const [slots, setSlots] = useState(() => getSlotsForDate(today));
 const [confirmed, setConfirmed] = useState(false);

 function handleDayClick(date) {
  if (!isDateSelectable(date.getDate(), date.getMonth(), date.getFullYear(), today)) return;
  setSelectedDay(date);
  setSelectedTime(null);
  setSlots(getSlotsForDate(date));
  setConfirmed(false);
 }
 function handleTimeClick(time) {
  if (!slots.some(slot => slot.time === time && !slot.busy)) return;
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
  if (selectedTime) setConfirmed(true);
 }
 return <><Header /><main className="main container"><BookingSteps /><h1 className="title">Календарь</h1>
  <form className="booking" onSubmit={handleConfirm}>
   <fieldset className="calendar"><legend className="visually-hidden">Выберите дату</legend>
    <CalendarHeader month={currentMonth} year={currentYear} onChangeMonth={handleChangeMonth} />
    <CalendarGrid month={currentMonth} year={currentYear} today={today} selectedDay={selectedDay} onDayClick={handleDayClick} />
   </fieldset>
   <div className="booking__right"><TimeSlots slots={slots} selectedTime={selectedTime} onTimeClick={handleTimeClick} /><BookingBottomBar selectedDay={selectedDay} selectedTime={selectedTime} confirmed={confirmed} /></div>
  </form>
 </main><Footer /></>;
}
