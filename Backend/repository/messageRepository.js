const Message = require('../model/message'); // Adjust path as needed

class MessageRepository {
  // Tạo tin nhắn mới
  async createMessage(messageData) {
    try {
        const message = new Message(messageData);
        await message.save();
        return {
            success: true,
            message: "Thêm dữ liệu message thành công"
        }
    } catch (error) {
        return {
            success: false,
            message:"Lỗi khi thêm dữ liệu vào message"
        }
    }
  }

  // Lấy tất cả tin nhắn theo conversation_id
  async findByConversationId(conversationId) {
    try {
      const messages = await Message.find({ conversation_id: conversationId })
        return {
        success: true,
            messages,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy tin nhắn theo cuộc hội thoại: ${error.message}`);
    }
  }
  async findMessageLateBotByConversationId(conversationId) {
    try {
      const message = await Message.findOne({
        conversation_id: conversationId,
        sender: "bot",
      }).sort({ timestamp: -1 });
      return message;
    }catch (error) {
      throw new Error(`Lỗi khi lấy tin nhắn muộn của bot theo cuộc hội thoại: ${error.message}`);
    }
  }
}

module.exports = new MessageRepository();