import { formatDate } from '../../utils/date.js';

function BookingBottomBar({ selectedDate, selectedTime, onConfirm }) {
  const dateText = formatDate(selectedDate);
  const text = selectedTime
    ? dateText + ' • ' + selectedTime
    : dateText + ' • время не выбрано';

  return (
    <aside className="bottom-bar">
      <div className="bottom-bar__info">
        <p className="bottom-bar__label">Ваша запись</p>
        <p className="bottom-bar__value">{text}</p>
        <p className="bottom-bar__service">Мужская стрижка · Артём · 1 500 ₽</p>
      </div>
      <button
        className="button"
        type="button"
        disabled={!selectedTime}
        onClick={() => onConfirm(text)}
      >
        Подтвердить запись
      </button>
    </aside>
  );
}

export default BookingBottomBar;
