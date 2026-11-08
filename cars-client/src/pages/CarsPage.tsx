import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import CarCard from '../components/CarCard';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCars(controller.signal);
        setCars(data);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) return;
        
        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError('Wystąpił nieznany błąd.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCars();
    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) return;

    try {
      await deleteCar(id);
      removeFavorite(id); 
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Błąd usuwania.');
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite =
      !showFavoritesOnly || favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
  });

  if (loading) return <p>Ładowanie listy samochodów...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;

  return (
    <div>
      <h1>Lista samochodów</h1>

      {/* Pasek narzędzi (Zustand) */}
      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Tylko ulubione
        </label>
      </div>

      {/* Wyświetlanie przefiltrowanej listy kart */}
      {visibleCars.length === 0 ? (
        <p>Brak wyników wyszukiwania.</p>
      ) : (
        <ul className="car-list">
          {visibleCars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car} 
              onDelete={handleDelete} 
            />
          ))}
        </ul>
      )}
    </div>
  );
}