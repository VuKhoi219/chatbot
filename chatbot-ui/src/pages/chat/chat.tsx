// import { ChatInput } from "@/components/custom/chatinput";
// import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
// import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
// import { useState } from "react";
// import { message } from "../../interfaces/interfaces"
// import { Overview } from "@/components/custom/overview";
// import { Header } from "@/components/custom/header";
// import { LeftSidebar } from "@/components/custom/leftsidebar"
// import { RightSidebar } from "@/components/custom/rightsidebar"
// import { v4 as uuidv4 } from 'uuid';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useConversationContext } from '@/context/ConversationContext';

// export function Chat() {
//   const { addConversation } = useConversationContext();
  

//   const [chatTitle, setChatTitle] = useState<string>(""); // ✅ đã thêm
//   const [conversationId, setConversationId] = useState<string>(""); // ✅ đã thêm

//   const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
//   const [messages, setMessages] = useState<message[]>([]);
//   const [question, setQuestion] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
//   const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
//   const [currentMood, setCurrentMood] = useState<number>(0);

//   const toggleLeftSidebar = () => {
//     setLeftSidebarOpen(!leftSidebarOpen);
//   };

//   const toggleRightSidebar = () => {
//     setRightSidebarOpen(!rightSidebarOpen);
//   };

//   const closeLeftSidebar = () => {
//     setLeftSidebarOpen(false);
//   };

//   const closeRightSidebar = () => {
//     setRightSidebarOpen(false);
//   };

//   const handleSubmit = (text?: string) => {
//     const messageText = text || question;
//     if (!messageText.trim()) return;

//     const userMessage: message = {
//       content: messageText,
//       role: "user",
//       id: uuidv4()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setQuestion("");
//     setIsLoading(true);
//   };

//   const handleMessageReceived = (botResponse: any) => {
//     console.log("Received botResponse:", botResponse);
//     setIsLoading(false);

//     let content = '';
//     if (botResponse.success && botResponse.message) {
//       try {
//         const parsedMessage = JSON.parse(botResponse.message);
//         content = parsedMessage.content || '';
//         if (!content) {
//           console.warn("Parsed message has no content:", parsedMessage);
//           content = JSON.stringify(parsedMessage);
//         }
//       } catch (error) {
//         console.error("Lỗi khi phân tích message:", error);
//         content = JSON.stringify(botResponse);
//       }
//     } else {
//       console.warn("No message in botResponse:", botResponse);
//       content = botResponse.response || JSON.stringify(botResponse);
//     }

//     const botMessage: message = {
//       content,
//       role: "assistant",
//       id: uuidv4()
//     };

//     console.log("Bot message:", botMessage);
//     setMessages(prev => [...prev, botMessage]);
//   };

//   const handleError = (error: string) => {
//     setIsLoading(false);
//     console.error("Chat error:", error);

//     const errorMessage: message = {
//       content: `Error: ${error}`,
//       role: "assistant",
//       id: uuidv4()
//     };

//     setMessages(prev => [...prev, errorMessage]);
//   };

//   const handleTitleCreated = (title: string, mood: number) => {
//     setChatTitle(title);
//     const id = crypto.randomUUID();
//     setConversationId(id);
//     addConversation({ _id: id, title });
//     setCurrentMood(mood);
//   };

//   const isFirstMessage = messages.length === 0;

//   return (
//     <div className="flex flex-col h-dvh bg-background">
//       {/* Header */}
//       <Header
//         toggleLeftSidebar={toggleLeftSidebar}
//         toggleRightSidebar={toggleRightSidebar}
//         title={chatTitle}
//       />

//       <div className="flex flex-1 min-h-0 relative">
//         {/* Left Sidebar */}
//         <LeftSidebar isOpen={leftSidebarOpen} onClose={closeLeftSidebar} />

//         {/* Main Content */}
//         <div className="flex flex-col flex-1 min-w-0 relative">
//           <div className="relative flex-1 min-w-0">
//             {!leftSidebarOpen && (
//               <button
//                 onClick={toggleLeftSidebar}
//                 className="fixed left-4 top-20 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 aria-label="Mở sidebar trái"
//               >
//                 <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//               </button>
//             )}

//             {!rightSidebarOpen && (
//               <button
//                 onClick={toggleRightSidebar}
//                 className="fixed right-4 top-20 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 aria-label="Mở sidebar phải"
//               >
//                 <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//               </button>
//             )}

//             <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
//               {messages.length === 0 && <Overview />}
//               {messages.map((message) => (
//                 <PreviewMessage key={message.id} message={message} />
//               ))}
//               {isLoading && <ThinkingMessage />}
//               <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
//             </div>
//           </div>

//           {/* Chat Input */}
//           <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
//             <ChatInput
//               question={question}
//               setQuestion={setQuestion}
//               onSubmit={handleSubmit}
//               isLoading={isLoading}
//               isFirstMessage={isFirstMessage}
//               onMessageReceived={handleMessageReceived}
//               onTitleCreated={handleTitleCreated}
//               onError={handleError}
//             />
//           </div>
//         </div>

//         {/* Right Sidebar */}
//         <RightSidebar isOpen={rightSidebarOpen} onClose={closeRightSidebar} />
//       </div>

//       {(leftSidebarOpen || rightSidebarOpen) && (
//         <div
//           className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40 md:hidden"
//           onClick={() => {
//             setLeftSidebarOpen(false);
//             setRightSidebarOpen(false);
//           }}
//         ></div>
//       )}
//     </div>
//   );
// }
import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message"; // Giả định đây là component hiển thị tin nhắn
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useEffect, useCallback, useMemo } from "react"; // Import hooks cần thiết
// import { message } from "../../interfaces/interfaces" // Sử dụng kiểu ApiMessage từ API thay vì kiểu nội bộ
import { ApiMessage } from '@/services/type'; // <<< Import kiểu dữ liệu tin nhắn từ API
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { LeftSidebar } from "@/components/custom/leftsidebar"
import { RightSidebar } from "@/components/custom/rightsidebar"
import { v4 as uuidv4 } from 'uuid'; // Dùng cho ID tạm thời
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConversationContext } from '@/context/ConversationContext'; // Import context
import useMessages from '@/hooks/useMessage'; // Import hook useMessages

// interface message { // Loại bỏ hoặc cập nhật interface này nếu cần
//   content: string;
//   role: "user" | "assistant"; // Hoặc sender: "user" | "bot"
//   id: string; // ID tạm thời
//   // Có thể thêm các trường khác như emotion, timestamp nếu cần hiển thị
// }

export function Chat() {
  const {
    selectedConversationId,
    selectedConversation,
    setSelectedConversationId,
    addConversation
  } = useConversationContext();

  const {
    messages: fetchedMessages,
    isLoading: isLoadingMessages,
    error: messagesError,
    // fetchMessages // Không cần gọi thủ công ở đây nữa
  } = useMessages(selectedConversationId || undefined);

  const [displayedMessages, setDisplayedMessages] = useState<ApiMessage[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [currentMood, setCurrentMood] = useState<number>(0);
  // >>> Thêm state loading riêng cho việc bot đang suy nghĩ <<<
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);


  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    console.log("useEffect: selectedConversationId changed or messages fetched", selectedConversationId, fetchedMessages);
    if (fetchedMessages && fetchedMessages.length > 0) {
      setDisplayedMessages(fetchedMessages);
    } else {
       // Khi chuyển conversation hoặc fetch không có tin nhắn, giữ lại tin nhắn tạm user nếu có
       // hoặc xóa hết nếu logic yêu cầu
       setDisplayedMessages(prev => prev.filter(msg => msg._id?.startsWith('temp-user-')));
      // setDisplayedMessages([]); // <-- Nếu muốn xóa hoàn toàn khi chuyển chat
    }
  }, [fetchedMessages, selectedConversationId]); // Thêm selectedConversationId để reset state hiển thị khi chuyển conversation

   useEffect(() => {
       if (selectedConversation && selectedConversation.mood_before !== undefined) {
           setCurrentMood(selectedConversation.mood_before);
       } else {
           setCurrentMood(0);
       }
   }, [selectedConversation]);


  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  const closeLeftSidebar = () => {
    setLeftSidebarOpen(false);
  };

  const closeRightSidebar = () => {
    setRightSidebarOpen(false);
  };

  // Hàm được gọi khi người dùng submit tin nhắn
  // -> Thêm tin nhắn user vào UI, set bot thinking state
  const handleChatSubmit = useCallback((text?: string) => {
    const messageText = text || question;
    if (!messageText.trim()) return;

    const userMessage: ApiMessage = {
      content: messageText,
      sender: "user",
      _id: `temp-user-${uuidv4()}`,
      conversation_id: selectedConversationId || 'temp',
      emotion: 'neutral',
      timestamp: new Date().toISOString(),
      __v: 0
    };

    setDisplayedMessages(prev => [...prev, userMessage]);
    setQuestion("");
    // >>> Set bot thinking state to true ngay sau khi gửi tin nhắn user <<<
    setIsBotThinking(true); // Bot bắt đầu xử lý

  }, [question, selectedConversationId, setQuestion]);


  // Hàm được gọi khi nhận phản hồi bot
  // -> Thêm tin nhắn bot vào UI, set bot thinking state về false
  const handleMessageReceived = useCallback((botResponse: any) => {
    console.log("Chat.tsx: Received botResponse:", botResponse);
    // >>> Set bot thinking state về false <<<
    setIsBotThinking(false); // Bot đã trả lời xong

    let content = '';
    if (botResponse && botResponse.message) {
      try {
        const parsedMessage = JSON.parse(botResponse.message);
        content = parsedMessage.content || '';
        if (!content) {
          console.warn("Chat.tsx: Parsed message has no content:", parsedMessage);
          content = JSON.stringify(parsedMessage);
        }
      } catch (error) {
        console.error("Chat.tsx: Lỗi khi phân tích message:", error);
        content = JSON.stringify(botResponse);
      }
    } else {
      console.warn("Chat.tsx: No 'message' field in botResponse:", botResponse);
      content = botResponse.response || JSON.stringify(botResponse);
    }

    const botMessage: ApiMessage = {
      content,
      sender: "bot",
      _id: `temp-bot-${uuidv4()}`,
      conversation_id: selectedConversationId || 'temp',
      emotion: 'neutral',
      timestamp: new Date().toISOString(),
      __v: 0
    };

    console.log("Chat.tsx: Adding bot message to UI:", botMessage);
    setDisplayedMessages(prev => [...prev, botMessage]);
  }, [selectedConversationId]);


  // Hàm được gọi khi tạo title mới
  const handleTitleCreated = useCallback((title: string, mood: number) => {
    console.log("Chat.tsx: Title created:", title, "Mood:", mood);
    // isBotThinking đã được set false trong handleMessageReceived
    // setCurrentMood(mood); // Uncomment nếu muốn hiển thị mood riêng biệt
  }, []);

  // Hàm xử lý lỗi từ ChatInput
  // -> Thêm tin nhắn lỗi, set bot thinking state về false
  const handleError = useCallback((error: string) => {
    // >>> Set bot thinking state về false <<<
    setIsBotThinking(false); // Có lỗi xảy ra, bot không còn xử lý

    console.error("Chat.tsx: Chat error:", error);

    const errorMessage: ApiMessage = {
      content: `Error: ${error}`,
      sender: "bot",
      _id: `temp-error-${uuidv4()}`,
      conversation_id: selectedConversationId || 'temp',
      emotion: 'neutral',
      timestamp: new Date().toISOString(),
      __v: 0
    };

    setDisplayedMessages(prev => [...prev, errorMessage]);
  }, [selectedConversationId]);

  const isFirstMessage = !selectedConversationId;

  const handleNewChat = useCallback(() => {
    setSelectedConversationId(null);
    setDisplayedMessages([]);
    setQuestion('');
    setCurrentMood(0);
    setIsBotThinking(false); // Reset thinking state
  }, [setSelectedConversationId]);


  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Header */}
      <Header
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
        title={selectedConversation?.title || 'Cuộc trò chuyện mới'}
      />

      <div className="flex flex-1 min-h-0 relative">
        {/* Left Sidebar */}
        <LeftSidebar isOpen={leftSidebarOpen} onClose={closeLeftSidebar}  onNewChat={handleNewChat}  />

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0 relative">
          <div className="relative flex-1 min-w-0">
            {/* Buttons to toggle sidebars when closed */}
            {!leftSidebarOpen && (
              <button
                onClick={toggleLeftSidebar}
                className="fixed left-4 top-20 z-30 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Mở sidebar trái"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}

            {!rightSidebarOpen && (
              <button
                onClick={toggleRightSidebar}
                className="fixed right-4 top-20 z-30 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Mở sidebar phải"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}

            {/* Message Display Area */}
            <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
              {/* Hiển thị Overview khi chưa có selectedConversation và chưa có tin nhắn nào được gõ */}
              {!selectedConversationId && displayedMessages.length === 0 && <Overview onNewChat={handleNewChat} />}

              {/* Hiển thị loading khi đang fetch tin nhắn lịch sử */}
               {isLoadingMessages && displayedMessages.length === 0 && (
                   <div className="text-center text-gray-500 mt-8">Đang tải tin nhắn...</div>
               )}

               {/* Hiển thị lỗi khi fetch tin nhắn lịch sử */}
               {messagesError && (
                    <div className="text-center text-red-500 mt-8">
                        Lỗi tải tin nhắn: {messagesError.message}
                         {/* Nút thử lại fetch lịch sử - cần hàm fetchMessages từ hook */}
                         {/* <button onClick={() => fetchMessages(selectedConversationId!)}>Thử lại</button> */}
                    </div>
               )}

              {/* Render tin nhắn */}
              {displayedMessages.map((message, index) => (
                <PreviewMessage key={message._id || `temp-${index}`} message={message} />
              ))}

              {/* >>> Uncomment và sử dụng state isBotThinking để hiển thị ThinkingMessage <<< */}
              {isBotThinking && <ThinkingMessage />}

              {/* Placeholder để cuộn xuống cuối */}
              <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            <ChatInput
              question={question}
              setQuestion={setQuestion}
              onSubmit={handleChatSubmit} // Hàm để xử lý submit (thêm tin nhắn user vào UI tạm thời & set isBotThinking)
              // isLoading={isLoadingMessages || isBotThinking} // Có thể truyền tổng loading nếu ChatInput cần disabled input dựa trên cả 2
              isLoading={false} // ChatInput tự quản lý loading API nội bộ
              isFirstMessage={isFirstMessage}
              onMessageReceived={handleMessageReceived} // Callback khi nhận tin nhắn bot (set isBotThinking false)
              onTitleCreated={handleTitleCreated} // Callback khi tạo title mới
              onError={handleError} // Callback khi có lỗi (set isBotThinking false)
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar isOpen={rightSidebarOpen} onClose={closeRightSidebar} currentMood={currentMood} />
      </div>

      {/* Overlay khi sidebars mở trên mobile */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-20 md:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        ></div>
      )}


    </div>
  );
}