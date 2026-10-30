import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <div className="app-container">
      <header className="navbar">
        <nav>
          <NavLink to="/" end className="nav-link">
            Strona główna
          </NavLink>
          <NavLink to="/cars" end className="nav-link">
            Samochody
          </NavLink>
          <NavLink to="/cars/new" className="nav-link">
            Dodaj samochód
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}