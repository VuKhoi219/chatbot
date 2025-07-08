import { useState } from 'react';
import { register } from '../services/yourApiFunctions';
import { User } from '../services/type';

interface UseRegisterResult {
    loading: boolean;
    error: string | null;
    registerUser: (name: string, email: string, password: string, age: number, gender: string) => Promise<User | null>;
    clearError: () => void;
}

const useRegister = (): UseRegisterResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registerUser = async (
        name: string, 
        email: string, 
        password: string, 
        age: number, 
        gender: string
    ): Promise<User | null> => {
        setLoading(true);
        setError(null);

        try {
            const userData = { name, email, password, age, gender };
            const user: User = await register(userData);
            setLoading(false);
            return user;
        } catch (error: any) {
            setLoading(false);
            setError(error.message || 'Registration failed');
            return null;
        }
    };

    const clearError = () => {
        setError(null);
    };

    return { loading, error, registerUser, clearError };
};

export default useRegister;