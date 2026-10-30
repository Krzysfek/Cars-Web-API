import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div>
      <h1>Cars Web Application</h1>
      <p>
        Aplikacja kliencka zbudowana w React + TypeScript + Vite.
        Krzysztof Moros.
      </p>
      <Link to="/cars" className="btn">
        Przejdź do listy samochodów
      </Link>
    </div>
  );
}