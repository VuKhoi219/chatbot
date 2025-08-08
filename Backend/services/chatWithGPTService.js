require("dotenv").config(); // Đọc file .env
const { OpenAI } = require("openai");
const cosineSimilarityUtil = require("../utils/cosineSimilarityUtil");
const documentRepository = require("../repository/documentRepository");
const messageRepository = require("../repository/messageRepository");

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

  async chatWithGPT(messageContent, conversationId) {
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

      var messageLateBot =
        await messageRepository.findMessageLateBotByConversationId(
          conversationId
        );

      // Nếu không có document nào hợp lệ, trả về câu trả lời generic

      if (validDocs.length === 0) {
        console.warn("Không có document nào có embedding hợp lệ");
        // Trả về câu trả lời generic nếu không có document
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `Bạn là một trợ lý AI chuyên về tâm lý (psychological support assistant).
            Nhiệm vụ chính:
            1. Lắng nghe và trả lời người dùng một cách thấu hiểu, hữu ích, tôn trọng và không phán xét.
            2. Dự đoán tâm trạng của người dùng theo 1 trong 4 loại: "happy", "sad", "angry", "neutral".
            3. Nếu phát hiện dấu hiệu tự làm hại hoặc tình huống nguy cấp, phản hồi an toàn và khuyến khích tìm trợ giúp chuyên môn.

            Quy tắc trả lời:
            - Luôn dùng giọng văn ấm áp, rõ ràng, ngắn gọn.
            - Không chẩn đoán y tế hoặc kê đơn thuốc.
            - Có thể hỏi thêm 1 câu để khuyến khích người dùng chia sẻ nhiều hơn.
            - Luôn trả lời bằng tiếng Việt nếu người dùng đang dùng tiếng Việt.
            - Tuyệt đối trả về đúng định dạng JSON, không kèm thêm văn bản ngoài JSON.

            Định dạng bắt buộc:
            {
              "content": "câu trả lời đồng cảm và hữu ích (tối đa ~800 ký tự)",
              "emotion": "happy|sad|angry|neutral"
            }

            Ghi chú về emotion:
            - happy: thể hiện niềm vui, hào hứng, biết ơn.
            - sad: buồn, thất vọng, cô đơn, mệt mỏi.
            - angry: tức giận, khó chịu, bực tức.
            - neutral: không rõ cảm xúc hoặc trung tính.
            Nếu không chắc, chọn "neutral".

            Ví dụ:
            User nhắn: "Mấy hôm nay tôi thấy mệt mỏi."
            Assistant trả về: {
              "content": "Nghe bạn nói mình cảm thấy lo lắng cho sức khỏe của bạn. Bạn có muốn kể thêm điều gì khiến bạn mệt mỏi không?",
              "emotion": "sad"
            }`,
            },
            ...(messageLateBot
              ? [
                  {
                    role: "assistant",
                    content: messageLateBot.content, // hoặc messageLateBot.message tuỳ DB
                  },
                ]
              : []),
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
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Bạn là một trợ lý AI chuyên về tâm lý (psychological support assistant).
              Mục tiêu chính: lắng nghe, đồng cảm, hỗ trợ cảm xúc tức thì và an toàn — KHÔNG thay thế chuyên gia y tế/tiền lâm sàng.

              Tài liệu tham khảo:
              ${topDocs}

              Quy tắc chung:
              - Luôn ưu tiên giọng điệu ấm áp, tôn trọng, không phán xét, ngắn gọn và dễ hiểu.
              - Trả lời bằng tiếng Việt nếu người dùng dùng tiếng Việt; nếu người dùng yêu cầu tiếng khác thì chuyển ngôn ngữ tương ứng.
              - Không chẩn đoán y tế, không kê đơn thuốc, không hướng dẫn hành động tự gây hại.
              - Nếu phát hiện dấu hiệu tự làm hại / ý tưởng tự tử hoặc tình huống nguy kịch: phản ứng nhanh, an toàn, khuyến khích liên hệ hỗ trợ chuyên môn/đường dây nóng địa phương, hỏi "Bạn có an toàn ngay bây giờ không?", và đề nghị ở lại cùng họ trong cuộc trò chuyện.

              Nhiệm vụ (chi tiết):
              1. Lắng nghe: hiểu cảm xúc và hoàn cảnh người dùng dựa trên lời họ nói và (nếu cần) thông tin trong ${topDocs}.
              2. Hỗ trợ: đưa ra phản hồi đồng cảm, ngắn gọn, có thể kèm 1-2 bước tiếp theo thiết thực (ví dụ: thở 4-4-4, tìm ai đó để nói chuyện, hoặc khuyến khích tìm trợ giúp chuyên nghiệp).
              3. Dự đoán tâm trạng: gán **một** trong 4 nhãn: "happy", "sad", "angry", "neutral".
              4. Đề xuất bước tiếp theo: nếu phù hợp, trong cùng trường "content" hãy khéo léo đưa 1 câu hỏi tiếp để khuyến khích user kể thêm (ví dụ: "Bạn có muốn nói rõ hơn điều gì đang khiến bạn buồn?").

              Định dạng trả lời (BẮT BUỘC — chỉ trả về 1 đối tượng JSON, KHÔNG có văn bản hay chú thích thêm):
              {
                "content": "một câu trả lời đồng cảm, rõ ràng, hữu ích (tối đa ~800 ký tự)",
                "emotion": "happy|sad|angry|neutral"
              }

              Ghi chú về emotion:
              - happy: ngôn ngữ thể hiện niềm vui, biết ơn, hài lòng hoặc phấn khích.
              - sad: buồn, cô đơn, tuyệt vọng, mệt mỏi, mất động lực.
              - angry: giận dữ, bực tức, cảm thấy bất công, muốn phản kháng.
              - neutral: câu hỏi thông tin, mô tả trung lập, hoặc không đủ dấu hiệu cảm xúc rõ ràng.
              - Nếu không chắc, chọn "neutral" và trong "content" mời họ mô tả thêm.

              Hướng dẫn khi dùng ${topDocs}:
              - Nếu trả lời dựa trên nội dung trong ${topDocs}, có thể tóm tắt ngắn (1–2 câu) và ghi rõ "Dựa trên tài liệu..." trong nội dung trả lời — nhưng **vẫn phải** chỉ trả về JSON.
              - Không sao chép nguyên văn quá 25 từ từ bất kỳ nguồn nào.

              Kịch bản nguy cấp (bắt buộc tuân thủ khi phát hiện dấu hiệu tự hại / tự tử):
              - "content" phải: (1) thừa nhận cảm xúc, (2) hỏi về an toàn hiện tại, (3) khuyến khích liên hệ hỗ trợ chuyên nghiệp/đường dây nóng, (4) đề nghị ở lại và lắng nghe.
              - Gán "emotion": "sad".

              Ví dụ (user → assistant JSON):
              1) User: "Hôm nay mình được tăng lương, vui lắm!"
              Assistant trả về:
              {
                "content": "Tuyệt vời quá — nghe bạn hồ hởi thật! Chúc mừng bạn vì sự cố gắng được ghi nhận. Bạn có muốn chia sẻ phần thú vị nhất của ngày hôm nay không?",
                "emotion": "happy"
              }

              2) User: "Mấy tuần nay mình thấy chán, không muốn làm gì."
              Assistant trả về:
              {
                "content": "Mình rất tiếc khi nghe bạn đang cảm thấy như vậy — chuyện kéo dài mệt mỏi thật khó khăn. Bạn có thể kể thêm một chút về những lúc bạn cảm thấy chán nhất trong ngày không? Nếu cảm thấy áp lực quá, tìm gặp ai đó bạn tin hoặc chuyên gia có thể giúp đỡ.",
                "emotion": "sad"
              }

              3) User: "Tôi tức anh ta lắm vì nói dối."
              Assistant trả về:
              {
                "content": "Cảm giác bị phản bội và tức giận là hoàn toàn dễ hiểu. Bạn có muốn nói rõ hơn về chuyện đó — điều gì làm bạn cảm thấy tổn thương nhất? Nếu cần, mình có vài cách để giúp bạn xử lý cơn giận an toàn.",
                "emotion": "angry"
              }

              Lưu ý kỹ thuật/kiểm tra hợp lệ:
              - Luôn trả về **duy nhất** một JSON object hợp lệ (no extra text, no markdown).
              - Các giá trị phải là chuỗi (string) theo schema trên.
              - Tránh trả lời quá dài — ưu tiên rõ ràng, hành động cụ thể hoặc câu hỏi tiếp theo.

              — HẾT —`,
          },
          ...(messageLateBot
            ? [
                {
                  role: "assistant",
                  content: messageLateBot.content, // hoặc messageLateBot.message tuỳ DB
                },
              ]
            : []),
          { role: "user", content: messageContent },
        ],
      });

      // Trả về kết quả
      if (!response.choices || response.choices.length === 0) {
        throw new Error("Không có lựa chọn nào trong phản hồi từ OpenAI");
      }
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
