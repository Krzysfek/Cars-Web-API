import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  

    // Pobranie użytkownika
  const user = useAuthStore((state) => state.user);

  // Pobranie ulubionych zależnych od ID
  const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : [];
  const isFavorite = favoriteCarIds.includes(car.id);

  return (
    <li className="car-item">
      <div>
        <strong>
          {car.brand} {car.model}
        </strong>{' '}
        (Rok/Data: {car.productionDate})
      </div>
      <div className="car-actions">
        {/* Przycisk z logiką Zustand */}
        <button
          type="button"
          className={
            isFavorite
              ? 'btn favorite-button active-favorite'
              : 'btn favorite-button'
          }
          onClick={() => {
            if (user) {
              toggleFavorite(user.id, car.id);
            }
          }}
        >
          {isFavorite ? 'Ulubiony' : 'Ulubione'}
        </button>

        {/* Stare przyciski z poprzedniego laboratorium */}
        <Link to={`/cars/${car.id}`} className="btn">
          Szczegóły
        </Link>
        <Link to={`/cars/${car.id}/edit`} className="btn">
          Edytuj
        </Link>
        <button
          onClick={() => onDelete(car.id)}
          className="btn btn-danger"
        >
          Usuń
        </button>
      </div>
    </li>
  );
}