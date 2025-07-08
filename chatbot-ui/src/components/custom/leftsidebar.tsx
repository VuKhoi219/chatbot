// import React, { useState, useEffect, useMemo } from 'react';
// import { Button } from '../ui/button';
// import { Search, X } from 'lucide-react';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import { useConversations } from '../../hooks/useListConversations';
// import { useConversationContext } from '@/context/ConversationContext'; // dùng context

// interface LeftSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onClose }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userId, setUserId] = useState<string>('');
//   const { conversations: newConversations } = useConversationContext();
//   const { chatTitle } = useConversationContext();

//   console.log("🟡 LeftSidebar nhận chatTitle:", chatTitle);

//   // Lấy userId từ localStorage
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         setUserId(user.id);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//       }
//     }
//   }, []);

//   // Lấy danh sách cũ từ API
//   const { conversations: oldConversations, loading, error } = useConversations(userId);

//   // Hợp nhất danh sách mới và cũ
//   const allConversations = useMemo(() => {
//     const ids = new Set();
//     const merged = [...newConversations, ...oldConversations].filter(conv => {
//       if (ids.has(conv._id)) return false;
//       ids.add(conv._id);
//       return true;
//     });
//     return merged;
//   }, [newConversations, oldConversations]);

//   const filteredHistory = allConversations.filter(item =>
//     item.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const clearSearch = () => {
//     setSearchQuery('');
//   };

//   return (
//     <div
//       className={`
//         bg-gray-200 w-64 p-4 transition-transform duration-300 transform
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//         ${isOpen ? 'shadow-lg' : ''}
//         fixed top-16 left-0 h-full z-40 flex flex-col
//       `}
//     >
//       {/* Close Button */}
//       <Button
//         onClick={onClose}
//         className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
//       >
//         <KeyboardArrowLeftIcon />
//       </Button>

//       {/* Header */}
//       <h2 className="text-lg font-semibold mb-4 mt-12">Lịch sử chat</h2>

//       {/* Hiển thị tiêu đề mới nhất */}
//       {chatTitle && (
//         <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md shadow-sm">
//           <div className="text-xs text-gray-600 uppercase font-semibold mb-1">Tiêu đề mới nhất</div>
//           <div className="text-sm font-medium text-gray-800">{chatTitle}</div>
//         </div>
//       )}

//       {/* Search Bar */}
//       <div className="relative mb-4">
//         <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
//           <Search className="h-4 w-4 text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Tìm kiếm cuộc trò chuyện..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-1 outline-none text-sm"
//           />
//           {searchQuery && (
//             <button
//               onClick={clearSearch}
//               className="ml-2 text-gray-400 hover:text-gray-600"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           )}
//         </div>
//       </div>

//       {searchQuery && (
//         <div className="text-sm text-gray-600 mb-2">
//           {filteredHistory.length} kết quả cho "{searchQuery}"
//         </div>
//       )}

//       {loading && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-sm text-gray-500">Đang tải...</div>
//         </div>
//       )}

//       {error && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-sm text-red-500 text-center">
//             <p>Lỗi: {error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-2 text-xs underline"
//             >
//               Thử lại
//             </button>
//           </div>
//         </div>
//       )}

//       {!loading && !error && (
//         <div className="flex-1 overflow-hidden">
//           <div className="h-full overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
//             {filteredHistory.length > 0 ? (
//               filteredHistory.map((item) => (
//                 <div
//                   key={item._id}
//                   className="block p-3 hover:bg-gray-300 rounded-lg cursor-pointer transition-colors"
//                 >
//                   <div className="font-medium text-sm text-gray-800 mb-1">
//                     {item.title}
//                   </div>
//                   <div className="text-xs text-gray-600 truncate">
//                     Cuộc trò chuyện
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-sm text-gray-500 text-center py-4">
//                 {searchQuery ? 'Không tìm thấy kết quả nào' : 'Chưa có lịch sử chat'}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Search, X, PlusCircle  } from 'lucide-react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { cx } from 'classix'; // <<< Thêm import này

// Loại bỏ import useConversations ở đây, vì context đã fetch và quản lý
import { useConversationContext } from '@/context/ConversationContext'; // dùng context

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void; // <<< Thêm prop này

  // Có thể thêm prop để xử lý "New Chat" button nếu có
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onClose,onNewChat  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Lấy conversations và setSelectedConversationId từ context
  const { conversations, selectedConversationId, setSelectedConversationId, selectedConversation } = useConversationContext();

  // Loại bỏ logic fetch userId và useConversations ở đây vì đã chuyển vào context

  const filteredHistory = conversations.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Hàm xử lý khi click vào một item lịch sử
  const handleConversationClick = (convId: string) => {
      setSelectedConversationId(convId);
      // Tùy chọn: đóng sidebar khi click trên mobile
      // onClose();
  };

  // Hiển thị tiêu đề của cuộc trò chuyện đang được chọn
  // (Thay vì hiển thị "Tiêu đề mới nhất" không liên quan trực tiếp đến lịch sử)
  const currentSelectedTitle = selectedConversation ? selectedConversation.title : 'Chọn cuộc trò chuyện';


  return (
    <div
      className={`
        bg-gray-200 w-64 p-4 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isOpen ? 'shadow-lg' : ''}
        fixed top-16 left-0 h-full z-40 flex flex-col
      `}
    >
      {/* Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      >
        <KeyboardArrowLeftIcon />
      </Button>
      <div className="pt-10"> {/* Thêm padding để tránh nút bị che */}
        <Button
          variant="outline"
          className="w-full justify-start mb-4 mt-2 text-gray-800"
          onClick={onNewChat}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cuộc trò chuyện mới
        </Button>
      </div>
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4 mt-12">Lịch sử chat</h2>

      {/* Hiển thị tiêu đề của cuộc trò chuyện đang được chọn */}
      <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md shadow-sm">
          <div className="text-xs text-gray-600 uppercase font-semibold mb-1">Đang xem</div>
          <div className="text-sm font-medium text-gray-800 truncate">{currentSelectedTitle}</div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {searchQuery && (
        <div className="text-sm text-gray-600 mb-2">
          {filteredHistory.length} kết quả cho "{searchQuery}"
        </div>
      )}

      {/* Loading/Error handling from Context or parent if needed */}
      {/* Hiện tại context không expose loading/error của useConversations, bạn có thể thêm vào nếu cần */}
      {/* Ví dụ: {contextLoading && <p>Loading...</p>} */}

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item._id}
                className={cx(
                    "block p-3 rounded-lg cursor-pointer transition-colors",
                    selectedConversationId === item._id ? 'bg-blue-300 hover:bg-blue-400' : 'hover:bg-gray-300'
                )}
                onClick={() => handleConversationClick(item._id)}
              >
                <div className="font-medium text-sm text-gray-800 mb-1">
                  {item.title}
                </div>
                {/* Có thể hiển thị thời gian hoặc tin nhắn cuối cùng nếu API trả về */}
                <div className="text-xs text-gray-600 truncate">
                  Cuộc trò chuyện
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              {searchQuery ? 'Không tìm thấy kết quả nào' : 'Chưa có lịch sử chat'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};