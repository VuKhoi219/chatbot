require('dotenv').config(); // Đọc file .env

const { OpenAI } = require("openai");


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


class ChatGPT{
    async chatWithGPT(data) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // hoặc "gpt-3.5-turbo"
            messages: [
              { role: "system", content: "Bạn là một trợ lý tâm lý hữu ích." },
              { role: "user", content: "Xin chào, bạn khỏe không?" }
            ]
          });
      
            console.log("Phản hồi từ ChatGPT:", response.choices[0].message.content);
            return response.choices[0].message.content;
        } catch (error) {
          console.error("Lỗi gọi API:", error.message);
        }
      }
      
}

module.exports = ChatGPT()