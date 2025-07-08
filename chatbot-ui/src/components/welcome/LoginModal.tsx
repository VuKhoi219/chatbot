import React, { useState } from 'react';
import useLogin from '../../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

// import { User, AuthResponse } from '../../services/type';  // Import User và AuthResponse

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, error, loginUser, clearError } = useLogin();
    const navigate = useNavigate();

    
    if (!isOpen) return null;
    console.log('LoginModal rendered, isOpen:', isOpen);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const authResponse = await loginUser(email, password);    
        if (authResponse) {
            // Xử lý đăng nhập thành công
            console.log('Login successful!', authResponse);
            localStorage.setItem('token', authResponse.token);
            localStorage.setItem('user', JSON.stringify(authResponse.user));
            // Reset form
            setEmail('');
            setPassword('');
            onClose();
            // Thêm một chút delay để đảm bảo modal đã đóng
            setTimeout(() => {
                window.location.href = "/";
            }, 100);
        } else {
            // Error is handled by the useLogin hook
            console.error("Login Failed")
        }
    };
    return (
        <div id="loginModal" className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl leading-6 font-bold text-gray-900">Đăng nhập</h3>
                                    <button 
                                        onClick={onClose} 
                                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                                        aria-label="Đóng modal"
                                    >
                                        <svg 
                                            className="w-6 h-6" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M6 18L18 6M6 6l12 12" 
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <form onSubmit={handleSubmit}>
                                        {error && <div className="text-red-500 mb-2">{error}</div>}
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Nhập email của bạn"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Nhập mật khẩu"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember-me"
                                                    name="remember-me"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Ghi nhớ đăng nhập</label>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                disabled={loading}
                                            >
                                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <p className="text-sm text-gray-500 text-center">
                            Chưa có tài khoản?
                            <button onClick={onSwitchToRegister} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                                Đăng ký ngay
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;