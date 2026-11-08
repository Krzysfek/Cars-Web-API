import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';
import axios from 'axios';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function loadCar() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCarById(id!, controller.signal);
        setCar(data);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }
        
        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError('Wystąpił nieznany błąd.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCar();

    return () => controller.abort();
  }, [id]);

  if (loading) return <p>Ładowanie szczegółów samochodu...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;
  if (!car) return <p>Nie znaleziono samochodu.</p>;
  const isFavorite = car ? favoriteCarIds.includes(car.id) : false;

  return (
    <div className="car-details">
      <h1>
        {car.brand} {car.model}
      </h1>
      <ul>
        <li><strong>ID:</strong> {car.id}</li>
        <li><strong>Marka:</strong> {car.brand}</li>
        <li><strong>Model:</strong> {car.model}</li>
        <li><strong>Liczba drzwi:</strong> {car.doorsNumber}</li>
        <li><strong>Pojemność bagażnika:</strong> {car.luggageCapacity} l</li>
        <li><strong>Pojemność silnika:</strong> {car.engineCapacity} cm³</li>
        <li><strong>Rodzaj paliwa (kod):</strong> {car.fuelType}</li>
        <li><strong>Data produkcji:</strong> {car.productionDate}</li>
        <li><strong>Średnie spalanie:</strong> {car.averageFuelConsumption} l/100km</li>
        <li><strong>Typ nadwozia (kod):</strong> {car.bodyType}</li>
      </ul>

      <button
        type="button"
        className={isFavorite ? 'btn favorite-button active-favorite' : 'btn favorite-button'}
        onClick={() => toggleFavorite(car!.id)}
        >
        {isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      </button>

      <div className="car-actions">
        <Link to={`/cars/${car.id}/edit`} className="btn">
          Edytuj
        </Link>
        <Link to="/cars" className="btn">
          Powrót do listy
        </Link>
      </div>
    </div>
  );
}