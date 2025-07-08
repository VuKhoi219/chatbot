// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-brain text-white text-2xl mr-2"></i>
              <span className="font-semibold text-xl">MindCare AI</span>
            </div>
            <p className="text-gray-400">
              Trợ lý AI chăm sóc sức khỏe tâm lý hàng đầu Việt Nam.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Về chúng tôi</a
                >
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Dịch vụ</a
                >
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Câu hỏi thường gặp</a
                >
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Liên hệ</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Trung tâm trợ giúp</a
                >
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Điều khoản sử dụng</a
                >
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition"
                  >Chính sách bảo mật</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
                ><i className="fab fa-facebook"></i
              ></a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
                ><i className="fab fa-twitter"></i
              ></a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
                ><i className="fab fa-instagram"></i
              ></a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
                ><i className="fab fa-linkedin"></i
              ></a>
            </div>
          </div>
        </div>

        <div
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>© 2025 MindCare AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;