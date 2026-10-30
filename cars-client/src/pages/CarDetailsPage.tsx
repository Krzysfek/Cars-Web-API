import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
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
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
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