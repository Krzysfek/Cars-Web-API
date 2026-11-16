import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { register } from '../services/authService';

export default function RegisterPage() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            setMessage(null);
            
            // Wywołanie rejestracji z naszego authService
            const result = await register({ userName, email, password });
            setMessage(result);
            
            // Czyszczenie formularza po sukcesie
            setUserName('');
            setEmail('');
            setPassword('');
        } catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            } else {
                setError('Nie udało się zarejestrować konta.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Rejestracja</h1>
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
            {error && <p className="error-message">{error}</p>}
            
            <form className="car-form" onSubmit={handleSubmit}>
                <label>
                    Nazwa użytkownika
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Hasło
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Przetwarzanie...' : 'Zarejestruj się'}
                </button>
            </form>
            <p>
                Masz już konto? <Link to="/login">Zaloguj się</Link>
            </p>
        </section>
    );
}