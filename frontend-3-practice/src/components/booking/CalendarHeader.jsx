import { MONTHS_NOMINATIVE } from '../../utils/date.js';

function CalendarHeader({ year, month, canGoBack, onPrev, onNext }) {
  return (
    <div className="calendar__head">
      <button
        className="calendar__arrow"
        type="button"
        aria-label="Предыдущий месяц"
        disabled={!canGoBack}
        onClick={onPrev}
      >
        ‹
      </button>
      <h2 className="block__title">{MONTHS_NOMINATIVE[month]} {year}</h2>
      <button
        className="calendar__arrow"
        type="button"
        aria-label="Следующий месяц"
        onClick={onNext}
      >
        ›
      </button>
    </div>
  );
}

export default CalendarHeader;
