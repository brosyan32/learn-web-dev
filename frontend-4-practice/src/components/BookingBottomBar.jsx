import { formatDate } from '../data/date.js';
export default function BookingBottomBar({ selectedDay, selectedTime, confirmed }) {
 const summary = formatDate(selectedDay) + ' • ' + (selectedTime || 'Выберите время');
 return <><div className="selection" aria-live="polite"><p className="selection__summary">{summary}</p><p className="selection__message" role="status">{confirmed ? 'Вы выбрали: ' + summary + '. Это демонстрация: запись не отправляется.' : ''}</p></div><button className="confirm" type="submit" disabled={!selectedTime}>Подтвердить</button></>;
}
