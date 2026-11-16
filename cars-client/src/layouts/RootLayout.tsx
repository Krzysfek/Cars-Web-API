import { NavLink, Outlet, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const favoriteCount = useCarUiStore((state) =>
    user ? (state.favoriteCarIdsByUser[user.id] ?? []).length : 0
  );

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <nav>
          <NavLink to="/" end className="nav-link">
            Strona główna
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/cars" end className="nav-link">
                Samochody
              </NavLink>
              <NavLink to="/cars/new" className="nav-link">
                Dodaj samochód
              </NavLink>
            </>
          )}

          <NavLink to="/about" className="nav-link">
            O aplikacji
          </NavLink>

          {user ? (
            <>
              <span className="favorite-counter" style={{ marginLeft: '15px' }}>
                Ulubione: {favoriteCount}
              </span>
              <span className="user-info" style={{ marginLeft: '15px' }}>
                {user.userName} ({user.roles.join(', ')})
              </span>
              <button type="button" onClick={handleLogout} style={{ marginLeft: '15px' }}>
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" style={{ marginLeft: '15px' }}>
                Logowanie
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Rejestracja
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}