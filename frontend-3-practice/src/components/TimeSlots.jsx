export default function TimeSlots({ slots, selectedTime, onTimeClick }) {
 return <fieldset className="times"><legend className="visually-hidden">Выберите свободное время</legend><h2 className="times__title">Доступное время</h2><div className="times__grid">
  {slots.map(slot => <button key={slot.time} className={['slot', slot.busy && 'slot--busy', slot.time === selectedTime && 'slot--selected'].filter(Boolean).join(' ')} type="button" disabled={slot.busy} aria-label={slot.busy ? slot.time + ', занято' : slot.time} aria-pressed={!slot.busy && slot.time === selectedTime} onClick={() => onTimeClick(slot.time)}>
   {slot.busy ? <><span>{slot.time}</span><small className="slot__status">Занято</small></> : <span className="slot__time">{slot.time}</span>}
  </button>)}
 </div></fieldset>;
}
