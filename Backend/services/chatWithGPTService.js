require("dotenv").config(); // Đọc file .env
const { OpenAI } = require("openai");
const cosineSimilarityUtil = require("../utils/cosineSimilarityUtil");
const documentRepository = require("../repository/documentRepository");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatGPT {
  async generateTitleAndMoodBefore(messageContent) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Bạn là một trợ lý tạo tiêu đề về tâm lý.
  Tạo một tiêu đề ngắn gọn (dưới 200 ký tự) dựa trên nội dung tin nhắn và đánh giá từ 1 đến 10 miêu tả tâm trạng của người dùng.
  Format trả về chính xác ở dạng JSON như sau:
  { "title": "Câu trả lời của bạn", "mood_before": (Số từ 1 đến 10) }`,
          },
          {
            role: "user",
            content: `Nội dung tin nhắn: "${messageContent}". Tạo tiêu đề cho cuộc trò chuyện.`,
          },
        ],
      });
      const rawContent = response.choices[0].message.content.trim();

      // Cố gắng parse JSON từ chuỗi phản hồi
      const parsed = JSON.parse(rawContent);

      // Trường hợp kiểm soát title quá dài
      if (parsed.title.length > 200) {
        parsed.title = parsed.title.substring(0, 200);
      }

      return {
        title: parsed.title,
        mood_before: parsed.mood_before,
      };
    } catch (error) {
      console.error("Lỗi khi tạo tiêu đề:", error.message);
      return {
        title: "Cuộc trò chuyện không có tiêu đề",
        mood_before: null,
      };
    }
  }

  async chatWithGPT(messageContent) {
    try {
      // 1. Tạo embedding cho câu hỏi
      const embedRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: messageContent,
      });
      const queryVec = embedRes.data[0].embedding;
      const documentsResult = await documentRepository.getAllDocuments();

      if (!documentsResult.success || !Array.isArray(documentsResult.data)) {
        throw new Error("Không lấy được dữ liệu từ document repository");
      }

      const docs = documentsResult.data;

      // Lọc và kiểm tra docs có embedding hợp lệ
      const validDocs = docs.filter((doc) => {
        if (!doc.embedding) {
          return false;
        }
        if (!Array.isArray(doc.embedding)) {
          return false;
        }
        if (doc.embedding.length === 0) {
          return false;
        }
        return true;
      });

      if (validDocs.length === 0) {
        console.warn("Không có document nào có embedding hợp lệ");
        // Trả về câu trả lời generic nếu không có document
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Bạn là một trợ lý AI chuyên về tâm lý. 
              Nhiệm vụ:
              1. Trả lời người dùng một cách thấu hiểu và hữu ích.
              2. Dự đoán tâm trạng của người dùng theo 4 loại: happy, sad, angry, neutral.
  
              Trả lời đúng định dạng JSON:
              {
                "content": "câu trả lời của bạn",
                "emotion": "tâm trạng dự đoán"
              }`,
            },
            { role: "user", content: messageContent },
          ],
        });

        return {
          success: true,
          message: response.choices[0].message.content,
        };
      }

      const scored = validDocs.map((doc) => {
        try {
          const score = cosineSimilarityUtil.cosineSimilarity(
            queryVec,
            doc.embedding
          );
          return {
            text: doc.text,
            score: isNaN(score) ? 0 : score,
          };
        } catch (error) {
          console.error("Error calculating similarity for doc:", error.message);
          return {
            text: doc.text,
            score: 0,
          };
        }
      });

      const topDocs = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((d, i) => `#${i + 1}: ${d.text}`)
        .join("\n");

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Bạn là một trợ lý AI chuyên về tâm lý. Dưới đây là một số đoạn tài liệu bạn có thể dùng để hỗ trợ người dùng:
            Tài liệu tham khảo:
            ${topDocs}
            Nhiệm vụ:
            1. Trả lời người dùng một cách thấu hiểu và hữu ích, dựa theo nội dung tài liệu.
            2. Dự đoán tâm trạng của người dùng theo 4 loại: happy, sad, angry, neutral.
  
            Trả lời đúng định dạng JSON:
            {
              "content": "câu trả lời của bạn",
              "emotion": "tâm trạng dự đoán"
            }`,
          },
          { role: "user", content: messageContent },
        ],
      });

      return {
        success: true,
        message: response.choices[0].message.content,
      };
    } catch (error) {
      console.error("Lỗi gọi API:", error.message);
      return {
        success: false,
        message: "Lỗi khi gọi API OpenAI: " + error.message,
      };
    }
  }

  // async generateTitleAndMoodBefore(messageContent) {
  //   // Giả lập xử lý nội dung
  //   const fakeTitle =
  //     messageContent.length > 50
  //       ? "Tâm sự dài dòng về cuộc sống"
  //       : "Tâm trạng hiện tại";
  //   const fakeMood = Math.floor(Math.random() * 10) + 1; // số từ 1 đến 10

  //   return {
  //     title: fakeTitle,
  //     mood_before: fakeMood,
  //   };
  // }

  // // Hàm mô phỏng trả lời người dùng và phân tích cảm xúc
  // async chatWithGPT(messageContent) {
  //   // Giả lập nội dung trả lời
  //   let emotion = "neutral";
  //   let reply = "Mình rất hiểu cảm xúc của bạn. Hãy cố gắng lên nhé!";

  //   if (messageContent.includes("buồn") || messageContent.includes("chán")) {
  //     emotion = "sad";
  //     reply = "Nghe bạn có vẻ đang không vui. Có điều gì làm bạn buồn vậy?";
  //   } else if (
  //     messageContent.includes("vui") ||
  //     messageContent.includes("thích")
  //   ) {
  //     emotion = "happy";
  //     reply = "Tuyệt vời! Mình rất vui khi nghe bạn chia sẻ điều tích cực!";
  //   } else if (
  //     messageContent.includes("tức") ||
  //     messageContent.includes("giận")
  //   ) {
  //     emotion = "angry";
  //     reply =
  //       "Mình hiểu là bạn đang tức giận. Bạn có muốn chia sẻ lý do không?";
  //   }

  //   return {
  //     success: true,
  //     message: JSON.stringify({
  //       content: reply,
  //       emotion: emotion,
  //     }),
  //   };
  // }
}

module.exports = new ChatGPT();
