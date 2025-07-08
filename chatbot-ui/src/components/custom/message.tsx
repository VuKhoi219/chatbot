// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { cx } from 'classix';
// import { SparklesIcon } from './icons';
// import { Markdown } from './markdown';
// import { message } from "../../interfaces/interfaces"
// import { MessageActions } from '@/components/custom/actions';

// export const PreviewMessage = ({ message }: { message: message; }) => {
//   console.log("Rendering PreviewMessage:", message);

//   return (
//     <motion.div
//       className="w-full mx-auto max-w-3xl px-4 group/message"
//       initial={{ y: 5, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       data-role={message.role}
//     >
//       <div
//         className={cx(
//           'group-data-[role=user]/message:bg-zinc-700 dark:group-data-[role=user]/message:bg-muted group-data-[role=user]/message:text-white flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl'
//         )}
//       >
//         {message.role === 'assistant' && (
//           <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
//             <SparklesIcon size={14} />
//           </div>
//         )}

//         <div className="flex flex-col w-full">
//           {message.content ? (
//             <div className="flex flex-col gap-4 text-left">
//               <Markdown>{message.content}</Markdown>
//             </div>
//           ) : (
//             <div className="text-red-500">No content to display</div>
//           )}

//           {message.role === 'assistant' && (
//             <MessageActions message={message} />
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export const ThinkingMessage = ({ content }: { content?: string }) => {
//   console.log("Rendering ThinkingMessage with content:", content);
//   const role = 'assistant';

//   return (
//       <motion.div
//           className="w-full mx-auto max-w-3xl px-4 group/message"
//           initial={{ y: 5, opacity: 0 }}
//           animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
//           data-role={role}
//       >
//           <div
//               className={cx(
//                   'flex gap-4 px-3 w-full max-w-2xl py-2 rounded-xl bg-gray-100 dark:bg-gray-700'
//               )}
//           >
//               <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
//                   <SparklesIcon size={14} />
//               </div>
//               <div className="flex flex-col w-full">
//                   {content ? (
//                       <div className="flex flex-col gap-4 text-left">
//                           <Markdown>{content}</Markdown>
//                       </div>
//                   ) : (
//                       <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                       </div>
//                   )}
//               </div>
//           </div>
//       </motion.div>
//   );
// };

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cx } from 'classix';
import { SparklesIcon } from './icons';
// import { message } from "../../interfaces/interfaces" // Nên sử dụng ApiMessage thay thế
import { ApiMessage } from '@/services/type'; // Import kiểu dữ liệu từ API
import { Markdown } from './markdown';
import { MessageActions } from '@/components/custom/actions'; // Giả định đường dẫn đúng

// Sử dụng ApiMessage interface
export const PreviewMessage = ({ message }: { message: ApiMessage; }) => {
  console.log("Rendering PreviewMessage:", message);

  const isUser = message.sender === 'user';
  const isAssistant = message.sender === 'bot'; // Sử dụng 'bot' theo cấu trúc API bạn cung cấp

  // Chỉ render nếu sender là user hoặc bot
  if (!isUser && !isAssistant) {
      // console.warn("Unsupported sender type:", message.sender);
      return null;
  }

  return (
    // >>> Container ngoài cùng: Áp dụng căn chỉnh trái/phải <<<
    <motion.div
      className={cx(
        'flex', // Bật flexbox
        'w-full', // Chiếm toàn bộ chiều rộng để flexbox có không gian căn chỉnh
        'mx-auto', // Giữ căn giữa trong phạm vi lớn hơn nếu cần (max-w-3xl)
        'max-w-3xl', // Giới hạn chiều rộng tối đa cho cả container message
        'px-4', // Padding ngang
        isUser ? 'justify-end' : 'justify-start', // <<< Logic căn phải cho user, trái cho assistant
        'group/message' // Giữ group class
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      // Không cần data-role ở đây nữa nếu bạn không dùng nó cho styling nội bộ
      // Hoặc bạn vẫn có thể giữ lại nếu các component con MessageActions cần nó
      // data-role={message.sender} // Sử dụng sender thay vì role nếu API dùng sender
    >
      {/* Avatar/Icon (hiển thị bên trái nội dung bot) */}
      {isAssistant && ( // Chỉ hiển thị cho assistant
         <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border mr-2"> {/* Added mr-2 for spacing */}
            <SparklesIcon size={14} />
          </div>
      )}


      {/* >>> Container nội dung: Áp dụng background, bo góc, giới hạn chiều rộng NỘI DUNG <<< */}
      <div
        className={cx(
          'flex flex-col gap-4 p-3 rounded-xl', // Flex column, padding, bo góc
          // 'w-full', // Loại bỏ w-full ở đây để nội dung chỉ rộng bằng content + max-w-xs
          'max-w-xs sm:max-w-md lg:max-w-lg', // Giới hạn chiều rộng của bubble tin nhắn
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800', // Màu sắc dựa trên người gửi
           'break-words' // Đảm bảo xuống dòng
        )}
      >
        {message.content ? (
          <div className="flex flex-col gap-4 text-left">
            {/* Markdown component có thể xử lý text-left nếu cần */}
            <Markdown>{message.content}</Markdown>
          </div>
        ) : (
          <div className="text-red-500">No content to display</div>
        )}

        {/* Message Actions (hiển thị bên dưới nội dung bot) */}
        {isAssistant && ( // Chỉ hiển thị cho assistant
          <MessageActions message={message} />
        )}
      </div>

      {/* Avatar/Icon (có thể thêm avatar user bên phải nếu cần) */}
      {/* {isUser && (
         <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border ml-2">
              {/* User Avatar Here }
         </div>
      )} */}

    </motion.div>
  );
};


// Cập nhật ThinkingMessage tương tự để nó cũng căn trái
export const ThinkingMessage = ({ content }: { content?: string }) => {
  console.log("Rendering ThinkingMessage with content:", content);
  // Thinking message thường được coi như của assistant/bot

  return (
      // >>> Container ngoài cùng: Áp dụng căn chỉnh trái <<<
      <motion.div
          className={cx(
            'flex', // Bật flexbox
            'w-full', // Chiếm toàn bộ chiều rộng
            'mx-auto',
            'max-w-3xl', // Giới hạn chiều rộng tối đa
            'px-4', // Padding ngang
            'justify-start', // <<< Luôn căn trái cho ThinkingMessage
            'group/message'
          )}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          // data-role="assistant" // Có thể giữ lại
      >
           {/* Avatar/Icon của bot/assistant */}
           <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border mr-2"> {/* Added mr-2 */}
               <SparklesIcon size={14} />
           </div>

          {/* Container nội dung Thinking */}
          <div
              className={cx(
                  'flex flex-col p-3 rounded-xl', // Padding, bo góc
                  'max-w-xs sm:max-w-md lg:max-w-lg', // Giới hạn chiều rộng của bubble
                  'bg-gray-100 dark:bg-gray-700' // Màu nền
              )}
          >
              <div className="flex flex-col w-full">
                  {content ? (
                      // Nếu ThinkingMessage có nội dung cụ thể
                      <div className="flex flex-col gap-4 text-left">
                          <Markdown>{content}</Markdown>
                      </div>
                  ) : (
                      // Hiển thị indicator loading (ba chấm)
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                  )}
              </div>
          </div>
      </motion.div>
  );
};

// Export các component
// export { PreviewMessage, ThinkingMessage };