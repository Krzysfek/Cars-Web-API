import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCars(controller.signal);
        setCars(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCars();

    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Czy na pewno chcesz usunąć ten samochód?'
    );
    if (!confirmed) return;

    try {
      await deleteCar(id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Wystąpił błąd podczas usuwania.'
      );
    }
  }

  if (loading) return <p>Ładowanie listy samochodów...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;

  return (
    <div>
      <h1>Lista samochodów</h1>

      {cars.length === 0 ? (
        <p>Brak samochodów w bazie.</p>
      ) : (
        <ul className="car-list">
          {cars.map((car) => (
            <li key={car.id} className="car-item">
              <div>
                <strong>
                  {car.brand} {car.model}
                </strong>{' '}
                (Rok/Data: {car.productionDate})
              </div>
              <div className="car-actions">
                <Link to={`/cars/${car.id}`} className="btn">
                  Szczegóły
                </Link>
                <Link to={`/cars/${car.id}/edit`} className="btn">
                  Edytuj
                </Link>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="btn btn-danger"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}