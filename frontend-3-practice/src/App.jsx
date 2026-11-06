import BookingScreen from './screens/BookingScreen.jsx';

function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <a className="logo" href="#">Бритва</a>
          <nav className="nav">
            <a className="nav__link" href="#">Главная</a>
            <a className="nav__link" href="#">Услуги</a>
            <a className="nav__link nav__link--active" href="#">Запись</a>
            <a className="nav__link" href="#">Контакты</a>
          </nav>
        </div>
      </header>

      <BookingScreen />

      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__text">Барбершоп «Бритва», Ярославль, ул. Свободы, 46</p>
          <p className="footer__text">Ежедневно с 10:00 до 20:00 · +7 (4852) 00-00-00</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
