function TimeSlots({ slots, selectedTime, onSelect }) {
  return (
    <div className="slots">
      {slots.map(function (slot) {
        let className = 'slot';
        if (slot.busy) className += ' slot--busy';
        if (slot.time === selectedTime) className += ' slot--selected';

        return (
          <button
            className={className}
            type="button"
            key={slot.time}
            disabled={slot.busy}
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
