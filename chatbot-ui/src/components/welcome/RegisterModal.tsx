// src/components/RegisterModal.tsx
import React, { useState } from 'react';
import useRegister from '../../hooks/useRegister';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    agreeToTerms: false
  });
  const { loading, error, registerUser, clearError } = useRegister();

  const [errors, setErrors] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    if (errors) setErrors('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Vui lòng nhập họ tên';
    }
    if (!formData.email.trim()) {
      return 'Vui lòng nhập email';
    }
    if (!formData.password) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (formData.password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    if (!formData.age || parseInt(formData.age) < 1) {
      return 'Vui lòng nhập tuổi hợp lệ';
    }
    if (!formData.gender) {
      return 'Vui lòng chọn giới tính';
    }
    if (!formData.agreeToTerms) {
      return 'Vui lòng đồng ý với điều khoản dịch vụ';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const validationError = validateForm();
    if (validationError) {
      setErrors(validationError);
      return;
    }

    try {
      // TODO: Implement registration logic here
      console.log('Form data:', formData);
      const registerReponse = await registerUser(formData.name,formData.email,formData.password,Number(formData.age),formData.gender)
      
      alert('Đăng ký thành công!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: '',
        agreeToTerms: false
      });
      
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setErrors('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleClose = () => {
    setErrors('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
      agreeToTerms: false
    });
    onClose();
  };

  return (
    <div id="registerModal" className="fixed inset-0 z-50 overflow-y-auto">
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
                  <h3 className="text-2xl leading-6 font-bold text-gray-900">Đăng ký tài khoản</h3>
                  <button 
                    onClick={handleClose} 
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
                
                {errors && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors}
                  </div>
                )}
                
                <div className="mt-2">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        id="reg-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nhập họ tên đầy đủ"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="reg-email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="reg-password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Tạo mật khẩu (tối thiểu 8 ký tự)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12m0 0l2.122 2.121M12 12l2.122-2.121m0 0l1.415-1.414M12 12l-2.122-2.121" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="reg-confirm-password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Nhập lại mật khẩu"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12m0 0l2.122 2.121M12 12l2.122-2.121m0 0l1.415-1.414M12 12l-2.122-2.121" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="reg-age" className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
                      <input
                        type="number"
                        id="reg-age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="1"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nhập tuổi của bạn"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="reg-gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                      <select
                        id="reg-gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>
                    <div className="flex items-center mb-4">
                      <input
                        id="terms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        Tôi đồng ý với
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 ml-1">Điều khoản dịch vụ</a>
                        và
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 ml-1">Chính sách bảo mật</a>
                      </label>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Đăng ký
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <p className="text-sm text-gray-500 text-center">
              Đã có tài khoản?
              <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;