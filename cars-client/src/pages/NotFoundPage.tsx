import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 – Nie znaleziono strony</h1>
      <p>Podany adres URL nie istnieje</p>
      <Link to="/" className="btn">
        Wróć na stronę główną
      </Link>
    </div>
  );
}