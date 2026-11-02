export default function TimeSlots({ slots, selectedTime, onTimeClick, loading, error, onRetry }) {
 if (loading) return <section className="times" aria-busy="true"><h2 className="times__title">Доступное время</h2><p role="status">Загрузка слотов…</p></section>;
 if (error) return <section className="times"><h2 className="times__title">Доступное время</h2><p role="alert">{error}</p><button className="retry" type="button" onClick={onRetry}>Повторить</button></section>;
 return <fieldset className="times"><legend className="visually-hidden">Выберите свободное время</legend><h2 className="times__title">Доступное время</h2><div className="times__grid">
  {slots.map(slot => <button key={slot.time} className={['slot', !slot.available && 'slot--busy', slot.time === selectedTime && 'slot--selected'].filter(Boolean).join(' ')} type="button" disabled={!slot.available} aria-label={!slot.available ? slot.time + ', занято' : slot.time} aria-pressed={!!slot.available && slot.time === selectedTime} onClick={() => onTimeClick(slot.time)}>
   {!slot.available ? <><span>{slot.time}</span><small className="slot__status">Занято</small></> : <span className="slot__time">{slot.time}</span>}
  </button>)}
 </div></fieldset>;
}
