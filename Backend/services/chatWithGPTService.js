require('dotenv').config(); // Đọc file .env

const { OpenAI } = require("openai");


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


class ChatGPT{
//     async generateTitleAndMoodBefore(messageContent) {
//         try {
//           const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 {role: "system", content: `Bạn là một trợ lý tạo tiêu đề. 
// Tạo một tiêu đề ngắn gọn (dưới 200 ký tự) dựa trên nội dung tin nhắn và đánh giá từ 1 đến 10 miêu tả tâm trạng của người dùng.
// Format trả về chính xác ở dạng JSON như sau:
// { "title": "Câu trả lời của bạn", "mood_before": (Số từ 1 đến 10) }`},
//               { role: "user", content: `Nội dung tin nhắn: "${messageContent}". Tạo tiêu đề cho cuộc trò chuyện.` }
//             ]
//           });
//             const rawContent = response.choices[0].message.content.trim();
//             console.log("title");
//             console.log(rawContent);
//             // Cố gắng parse JSON từ chuỗi phản hồi
//             const parsed = JSON.parse(rawContent);

//             // Trường hợp kiểm soát title quá dài
//             if (parsed.title.length > 200) {
//                 parsed.title = parsed.title.substring(0, 200);
//             }

//             return {
//                 title: parsed.title,
//                 mood_before: parsed.mood_before
//             };

//         } catch (error) {
//             console.error("Lỗi khi tạo tiêu đề:", error.message);
//             return {
//                 title: "Cuộc trò chuyện không có tiêu đề",
//                 mood_before: null
//             };
//         }
//     }

//     async chatWithGPT(messageContent) {
//         try {
//           const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // hoặc "gpt-3.5-turbo"
//             messages: [
//                 { 
//                     role: "system", 
//                     content: `Bạn là một trợ lý tâm lý hữu ích. 
                    
//                     Nhiệm vụ của bạn:
//                     1. Trả lời tin nhắn của người dùng một cách thấu hiểu và hữu ích
//                     2. Đánh giá tâm trạng theo tin nhắn của người dùng theo 4 emotion : happy,sad,angry,neutral
                    
//                     Format trả về là dạng JSON CHÍNH XÁC như sau:
//                     content: [câu trả lời của bạn cho người dùng]
//                     emotion: [lựa chọn của bạn]`
//                 },
//                 { role: "user", content: messageContent }
//             ]
//           });
      
//             console.log("Phản hồi từ ChatGPT:", response.choices[0].message.content);
//             return {
//                 success: true,
//                 message: response.choices[0].message.content
//             };
//         } catch (error) {
//             console.error("Lỗi gọi API:", error.message);
//             return {
//               success: false,
//               message: "Lỗi khi gọi API OpenAI: " + error.message
//             };
//         }
//       }
          // Hàm mô phỏng tạo tiêu đề và mood
    async generateTitleAndMoodBefore(messageContent) {
        // Giả lập xử lý nội dung
        const fakeTitle = messageContent.length > 50
            ? "Tâm sự dài dòng về cuộc sống"
            : "Tâm trạng hiện tại";
        const fakeMood = Math.floor(Math.random() * 10) + 1; // số từ 1 đến 10

        return {
            title: fakeTitle,
            mood_before: fakeMood
        };
    }

    // Hàm mô phỏng trả lời người dùng và phân tích cảm xúc
    async chatWithGPT(messageContent) {
        // Giả lập nội dung trả lời
        let emotion = "neutral";
        let reply = "Mình rất hiểu cảm xúc của bạn. Hãy cố gắng lên nhé!";

        if (messageContent.includes("buồn") || messageContent.includes("chán")) {
            emotion = "sad";
            reply = "Nghe bạn có vẻ đang không vui. Có điều gì làm bạn buồn vậy?";
        } else if (messageContent.includes("vui") || messageContent.includes("thích")) {
            emotion = "happy";
            reply = "Tuyệt vời! Mình rất vui khi nghe bạn chia sẻ điều tích cực!";
        } else if (messageContent.includes("tức") || messageContent.includes("giận")) {
            emotion = "angry";
            reply = "Mình hiểu là bạn đang tức giận. Bạn có muốn chia sẻ lý do không?";
        }

        return {
            success: true,
            message: JSON.stringify({
                content: reply,
                emotion: emotion
            })
        };
    }
}

module.exports = new ChatGPT()