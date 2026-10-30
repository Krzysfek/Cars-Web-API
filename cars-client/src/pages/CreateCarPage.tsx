import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewCar>({
    brand: '',
    model: '',
    doorsNumber: 5,
    luggageCapacity: 400,
    engineCapacity: 1600,
    fuelType: 1,
    productionDate: '2023-01-01',
    averageFuelConsumption: 6.5,
    bodyType: 1,
  });

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const created = await createCar(formData);
      navigate(`/cars/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Nie udało się dodać samochodu.'
      );
    }
  }

  return (
    <div>
      <h1>Dodaj nowy samochód</h1>
      {error && <p className="error">{error}</p>}

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
          Rodzaj paliwa (np. 1 - Benzyna, 2 - Diesel):
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
          Typ nadwozia (kod liczbowy):
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
          Dodaj samochód
        </button>
      </form>
    </div>
  );
}