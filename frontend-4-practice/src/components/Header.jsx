export default function Header() {
  return (<header className="header">
    <div className="container header__inner">
      <a className="logo" href="#" aria-label="БОР — главная">БОР</a>
      <nav className="nav" aria-label="Основная навигация">
        <a className="nav__link" href="#services">Услуги</a>
        <a className="nav__link" href="#gallery">Галерея</a>
        <a className="nav__link" href="#team">Команда</a>
        <a className="nav__link" href="#reviews">Отзывы</a>
        <a className="nav__link" href="#contacts">Контакты</a>
      </nav>
    </div>
  </header>);
}
