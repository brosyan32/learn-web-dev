export default function BookingSteps() {
  return (<ol className="steps" aria-label="Этапы записи">
      <li className="steps__item steps__item--complete"><span className="steps__number">1</span><span className="visually-hidden">Выбор услуги, завершено</span></li>
      <li className="steps__item steps__item--complete"><span className="steps__number">2</span><span className="visually-hidden">Выбор мастера, завершено</span></li>
      <li className="steps__item steps__item--current" aria-current="step"><span className="steps__number">3</span><span className="visually-hidden">Выбор даты и времени</span></li>
      <li className="steps__item"><span className="steps__number">4</span><span className="visually-hidden">Контактные данные</span></li>
      <li className="steps__item"><span className="steps__number">5</span><span className="visually-hidden">Подтверждение</span></li>
    </ol>);
}
