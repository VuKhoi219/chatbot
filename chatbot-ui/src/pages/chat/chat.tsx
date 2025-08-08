
import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useEffect, useCallback } from "react";
import { ApiMessage } from '@/services/type';
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { LeftSidebar } from "@/components/custom/leftsidebar"
import { RightSidebar } from "@/components/custom/rightsidebar"
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConversationContext } from '@/context/ConversationContext';
import useMessages from '@/hooks/useMessage';

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
  } = useMessages(selectedConversationId || undefined);

  const [displayedMessages, setDisplayedMessages] = useState<ApiMessage[]>([]);
  const [question, setQuestion] = useState<string>("");
  // 👉 Ban đầu set false nếu là màn hình nhỏ
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [currentMood, setCurrentMood] = useState<number>(0);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  // Fixed useEffect to properly handle conversation switching
  useEffect(() => {
    console.log("useEffect: selectedConversationId changed", selectedConversationId, fetchedMessages);
    
    if (selectedConversationId === null) {
      // When creating new chat, immediately clear messages
      setDisplayedMessages([]);
    } else if (fetchedMessages && fetchedMessages.length > 0) {
      // When switching to existing conversation, show fetched messages
      setDisplayedMessages(fetchedMessages);
    } else if (selectedConversationId && fetchedMessages && fetchedMessages.length === 0) {
      // When switching to conversation with no messages (empty conversation)
      setDisplayedMessages([]);
    }
  }, [fetchedMessages, selectedConversationId]);
  useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setLeftSidebarOpen(false);
          setRightSidebarOpen(false);
        } else {
          setLeftSidebarOpen(true);
          setRightSidebarOpen(true);
        }
      };
      handleResize(); // chạy lần đầu
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
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
    setIsBotThinking(true);
  }, [question, selectedConversationId]);

  const handleMessageReceived = useCallback((botResponse: any) => {
    console.log("Chat.tsx: Received botResponse:", botResponse);
    setIsBotThinking(false);

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

  const handleTitleCreated = useCallback((title: string, mood: number) => {
    console.log("Chat.tsx: Title created:", title, "Mood:", mood);
  }, []);

  const handleError = useCallback((error: string) => {
    setIsBotThinking(false);
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

  // Fixed handleNewChat to immediately clear all states
  const handleNewChat = useCallback(() => {
    // Clear all states immediately and synchronously
    setSelectedConversationId(null);
    setDisplayedMessages([]); // Clear messages immediately
    setQuestion('');
    setCurrentMood(0);
    setIsBotThinking(false);
  }, [setSelectedConversationId]);

  return (
    <div className="flex flex-col h-dvh bg-background">
      <Header
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
        title={selectedConversation?.title || 'Cuộc trò chuyện mới'}
      />

      <div className="flex flex-1 min-h-0 relative">
        <LeftSidebar isOpen={leftSidebarOpen} onClose={closeLeftSidebar} onNewChat={handleNewChat} />

        <div className="flex flex-col flex-1 min-w-0 relative">
          <div className="relative flex-1 min-w-0">
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

            <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
              {/* Show Overview only when no conversation selected and no messages */}
              {!selectedConversationId && displayedMessages.length === 0 && <Overview onNewChat={handleNewChat} />}

              {/* Show loading when fetching messages for existing conversation */}
              {selectedConversationId && isLoadingMessages && displayedMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">Đang tải tin nhắn...</div>
              )}

              {/* Show error when fetching messages */}
              {messagesError && (
                <div className="text-center text-red-500 mt-8">
                  Lỗi tải tin nhắn: {messagesError.message}
                </div>
              )}

              {/* Render messages */}
              {displayedMessages.map((message, index) => (
                <PreviewMessage key={message._id || `temp-${index}`} message={message} />
              ))}

              {/* Show thinking message when bot is processing */}
              {isBotThinking && <ThinkingMessage />}

              <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
            </div>
          </div>

          <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            <ChatInput
              question={question}
              setQuestion={setQuestion}
              onSubmit={handleChatSubmit}
              isLoading={false}
              isFirstMessage={isFirstMessage}
              onMessageReceived={handleMessageReceived}
              onTitleCreated={handleTitleCreated}
              onError={handleError}
            />
          </div>
        </div>

        <RightSidebar isOpen={rightSidebarOpen} onClose={closeRightSidebar} currentMood={currentMood} />
      </div>

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