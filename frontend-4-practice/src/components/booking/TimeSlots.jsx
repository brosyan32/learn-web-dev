function TimeSlots({ status, slots, selectedTime, onSelect, onRetry }) {
  if (status === 'loading') {
    return <p className="status">Загрузка слотов…</p>;
  }

  if (status === 'error') {
    return (
      <div className="status status--error">
        <p>Не удалось загрузить время. Попробуйте ещё раз.</p>
        <button className="status__retry" type="button" onClick={onRetry}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="slots">
      {slots.map(function (slot) {
        let className = 'slot';
        if (!slot.available) className += ' slot--busy';
        if (slot.time === selectedTime) className += ' slot--selected';

        return (
          <button
            className={className}
            type="button"
            key={slot.time}
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlots;
