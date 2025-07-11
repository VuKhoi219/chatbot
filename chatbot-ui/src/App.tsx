import './App.css'
import { Chat } from './pages/chat/chat'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Welcome } from './pages/welcome/welcome';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { ConversationProvider } from '@/context/ConversationContext';
import ChatBot404 from '@/pages/404'; // Import trang 404

function App(): JSX.Element {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Routes>
              {/* Route được bảo vệ - chỉ user đã đăng nhập mới vào được */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <ConversationProvider>
                      <Chat />
                    </ConversationProvider>
                  </ProtectedRoute>
                } 
              />
              
              {/* Route public - chỉ user chưa đăng nhập mới vào được */}
              <Route 
                path='/welcome' 
                element={
                  <PublicRoute>
                    <Welcome/>
                  </PublicRoute>
                }
              />
              <Route path="*" element={<ChatBot404 />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App;
