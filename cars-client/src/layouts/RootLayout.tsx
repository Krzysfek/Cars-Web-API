import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
  const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);
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
          <span className="favorite-counter">
            Ulubione: {favoriteCount}
          </span>
        </nav>
    
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}