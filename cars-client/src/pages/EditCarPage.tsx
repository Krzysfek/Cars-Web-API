import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';
import axios from 'axios';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewCar>({
    brand: '',
    model: '',
    doorsNumber: 5,
    luggageCapacity: 0,
    engineCapacity: 0,
    fuelType: 1,
    productionDate: '',
    averageFuelConsumption: 0,
    bodyType: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function loadCar() {
      try {
        setLoading(true);
        const car = await getCarById(id!, controller.signal);
        setFormData({
          brand: car.brand,
          model: car.model,
          doorsNumber: car.doorsNumber,
          luggageCapacity: car.luggageCapacity,
          engineCapacity: car.engineCapacity,
          fuelType: car.fuelType,
          productionDate: car.productionDate,
          averageFuelConsumption: car.averageFuelConsumption,
          bodyType: car.bodyType,
        });
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;

    try {
      await updateCar(id, formData);
      navigate(`/cars/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Nie udało się zapisać zmian.'
      );
    }
  }

  if (loading) return <p>Ładowanie danych do edycji...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;

  return (
    <div>
      <h1>Edytuj samochód (ID: {id})</h1>

      <form onSubmit={handleSubmit} className="car-form">
        <label>
          Marka:
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
          />
        </label>

        <label>
          Model:
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />
        </label>

        <label>
          Liczba drzwi:
          <input
            type="number"
            required
            value={formData.doorsNumber}
            onChange={(e) =>
              setFormData({ ...formData, doorsNumber: Number(e.target.value) })
            }
          />
        </label>

        <label>
          Pojemność bagażnika (l):
          <input
            type="number"
            required
            value={formData.luggageCapacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                luggageCapacity: Number(e.target.value),
              })
            }
          />
        </label>

        <label>
          Pojemność silnika (cm³):
          <input
            type="number"
            required
            value={formData.engineCapacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                engineCapacity: Number(e.target.value),
              })
            }
          />
        </label>

        <label>
          Rodzaj paliwa:
          <input
            type="number"
            required
            value={formData.fuelType}
            onChange={(e) =>
              setFormData({ ...formData, fuelType: Number(e.target.value) })
            }
          />
        </label>

        <label>
          Data produkcji:
          <input
            type="date"
            required
            value={formData.productionDate}
            onChange={(e) =>
              setFormData({ ...formData, productionDate: e.target.value })
            }
          />
        </label>

        <label>
          Średnie spalanie (l/100km):
          <input
            type="number"
            step="0.1"
            required
            value={formData.averageFuelConsumption}
            onChange={(e) =>
              setFormData({
                ...formData,
                averageFuelConsumption: Number(e.target.value),
              })
            }
          />
        </label>

        <label>
          Typ nadwozia:
          <input
            type="number"
            required
            value={formData.bodyType}
            onChange={(e) =>
              setFormData({ ...formData, bodyType: Number(e.target.value) })
            }
          />
        </label>

        <button type="submit" className="btn">
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}