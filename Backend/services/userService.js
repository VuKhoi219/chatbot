
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository'); // Giả sử bạn có model User

class UserService {

    async register(userData) {
        try {
            const { email, password, name, age, gender } = userData;
            const hashedPassword = bcrypt.hashSync(password, 10);
            const result = await userRepository.register({ email, hashedPassword, name, age, gender });
            return result;
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Lỗi server",
                user: null
            }
        }
    }

    async login(loginData) {
        try {
            const { email, password } = loginData;

            const result = await userRepository.login(email)
            if (!result.success) {
                return result
            }
            console.log(result)
            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(password, result.user.hashedPassword);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Sai mật khẩu',
                    user: result
                };
            }
            // Tạo JWT token
            const token = jwt.sign(
                { 
                    userId: result.user._id, 
                    email: result.user.email,
                    age: result.user.age,
                    gender: result.user.gender
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            delete result.user.hashedPassword;
            return {
                success: true,
                message: 'Đăng nhập thành công',
                token,
                user: result
            };

        } catch (error) {
            throw new Error(error.message || 'Lỗi khi đăng nhập');
        }
    }
}

module.exports = new UserService();