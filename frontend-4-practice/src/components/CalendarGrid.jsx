import { buildCalendarGrid, compareDates, formatDate, isDateSelectable, WEEKDAYS_SHORT } from '../data/date.js';
export default function CalendarGrid({ month, year, today, selectedDay, onDayClick }) {
 return <div className="calendar__grid">
  {WEEKDAYS_SHORT.map(day => <span className="weekday" key={day} aria-hidden="true">{day}</span>)}
  {buildCalendarGrid(year, month).flat().map((date, index) => {
   if (date.getMonth() !== month) return <span className="calendar__empty" key={index} aria-hidden="true" />;
   const selectable = isDateSelectable(date.getDate(), month, year, today);
   const selected = compareDates(date, selectedDay) === 0;
   const classes = ['day', selected && 'day--selected', !selectable && 'day--disabled'].filter(Boolean).join(' ');
   return <button key={index} className={classes} type="button" disabled={!selectable} aria-label={formatDate(date)} aria-pressed={selected} onClick={() => onDayClick(date)}><span className="day__number">{date.getDate()}</span></button>;
  })}
 </div>;
}
