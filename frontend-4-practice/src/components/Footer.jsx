export default function Footer() {
  return (<footer className="footer" id="contacts">
    <div className="container">
      <div className="footer__columns">
        <div className="footer__brand"><a className="logo" href="#">БОР</a><p className="footer__muted">Стрижки и бритьё с характером.</p></div>
        <section className="footer__section"><h2 className="footer__title">Контакты</h2><address className="footer__address"><p className="footer__muted">♧ &nbsp;ул. Садовая, 15, Москва</p><a className="footer__phone" href="tel:+74951234567">☎ &nbsp;+7 (495) 123-45-67</a></address></section>
        <section className="footer__section"><h2 className="footer__title">Режим работы</h2><p className="footer__hours">Пн–Пт: 9:00 – 21:00<br />Сб–Вс: 10:00 – 19:00</p></section>
      </div>
      <div className="footer__bottom"><p className="footer__copyright">© 2026. Все права защищены.</p><a className="footer__policy" href="#privacy">Политика конфиденциальности</a></div>
    </div>
  </footer>);
}
