import { MONTHS_NOMINATIVE } from '../data/date.js';
export default function CalendarHeader({ month, year, onChangeMonth }) {
 return <div className="calendar__header"><h2 className="calendar__month">{MONTHS_NOMINATIVE[month]} {year}</h2><div className="calendar__arrows"><button className="calendar__arrow" type="button" aria-label="Предыдущий месяц" onClick={() => onChangeMonth(-1)}>‹</button><button className="calendar__arrow" type="button" aria-label="Следующий месяц" onClick={() => onChangeMonth(1)}>›</button></div></div>;
}
