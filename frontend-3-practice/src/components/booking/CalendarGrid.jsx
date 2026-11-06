import { buildCalendarGrid, compareDates, dateToKey, isDateSelectable } from '../../utils/date.js';

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function CalendarGrid({ year, month, today, selectedDate, onSelect }) {
  const cells = buildCalendarGrid(year, month);

  return (
    <>
      <div className="calendar__week">
        {WEEKDAYS.map(function (name) {
          return <span className="calendar__dow" key={name}>{name}</span>;
        })}
      </div>

      <div className="calendar__grid">
        {cells.map(function (date, index) {
          if (date === null) {
            return <span className="calendar__empty" key={'empty-' + index}></span>;
          }

          const selectable = isDateSelectable(date, today);
          const isToday = compareDates(date, today) === 0;
          const isSelected = compareDates(date, selectedDate) === 0;

          let className = 'calendar__day';
          if (!selectable) className += ' calendar__day--disabled';
          if (isToday) className += ' calendar__day--today';
          if (isSelected) className += ' calendar__day--selected';

          return (
            <button
              className={className}
              type="button"
              key={dateToKey(date)}
              disabled={!selectable}
              onClick={() => onSelect(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default CalendarGrid;
