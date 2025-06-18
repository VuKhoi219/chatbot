const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

// Import các models
const User = require('./model/user');
const Conversation = require('./model/conversation');
const Message = require('./model/message');

// Kết nối database
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/chatbot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

// Hàm tạo users
const createUsers = async (count = 10) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      hashedPassword: hashedPassword,
      age: faker.number.int({ min: 18, max: 65 }),
      gender: faker.helpers.arrayElement(['male', 'female']),
      created_at: faker.date.past({ years: 1 })
    };
    
    users.push(user);
    console.log(`📝 Tạo user: ${user.name} - ${user.email} - Password: ${password}`);
  }
  
  return await User.insertMany(users);
};

// Hàm tạo conversations
const createConversations = async (users, conversationsPerUser = 3) => {
  const conversations = [];
  
  for (const user of users) {
    for (let i = 0; i < conversationsPerUser; i++) {
      const conversation = {
        user_id: user._id,
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        mood_before: faker.number.int({ min: 1, max: 10 }),
        mood_after: faker.number.int({ min: 1, max: 10 }),
        created_at: faker.date.past({ years: 1 })
      };
      
      conversations.push(conversation);
    }
  }
  
  console.log(`💬 Tạo ${conversations.length} cuộc trò chuyện`);
  return await Conversation.insertMany(conversations);
};

// Hàm tạo messages
const createMessages = async (conversations, messagesPerConversation = 8) => {
  const messages = [];
  
  // Danh sách tin nhắn mẫu cho user
  const userMessages = [
    "Hhể cảm thấy tốt hơn?",
    "Tôi đang lo lắng về tươôm nay tôi cảm thấy rất căng thẳng",
    "Tôi gặp khó khăn trong công việc",
    "Làm thế nào để tôi có tng lai",
    "Cảm ơn bạn đã lắng nghe tôi",
    "Tôi muốn chia sẻ về ngày hôm nay",
    "Tôi cần lời khuyên về mối quan hệ",
    "Làm sao để tôi có thể tự tin hơn?",
    "Tôi đang trải qua một thời gian khó khăn",
    "Bạn có thể giúp tôi không?"
  ];
  
  // Danh sách tin nhắn mẫu cho bot
  const botMessages = [
    "Tôi hiểu bạn đang cảm thấy căng thẳng. Hãy thử thở sâu và thư giãn nhé.",
    "Mọi khó khăn đều có thể vượt qua được. Bạn có muốn chia sẻ cụ thể không?",
    "Có nhiều cách để cải thiện tâm trạng. Bạn thích hoạt động nào nhất?",
    "Lo lắng là điều bình thường. Hãy tập trung vào những gì bạn có thể kiểm soát.",
    "Rất vui được giúp đỡ bạn. Tôi luôn ở đây khi bạn cần.",
    "Cảm ơn bạn đã chia sẻ. Điều gì khiến bạn cảm thấy ấn tượng nhất?",
    "Mối quan hệ cần sự hiểu biết và giao tiếp. Bạn đã thử nói chuyện chưa?",
    "Sự tự tin đến từ việc chấp nhận bản thân. Bạn có nhiều điểm mạnh lắm.",
    "Thời gian khó khăn sẽ qua đi. Bạn mạnh mẽ hơn bạn nghĩ đấy.",
    "Tất nhiên rồi! Tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn."
  ];
  
  for (const conversation of conversations) {
    let messageCount = 0;
    
    for (let i = 0; i < messagesPerConversation; i++) {
      // Xen kẽ tin nhắn giữa user và bot
      const isUserMessage = i % 2 === 0;
      const sender = isUserMessage ? 'user' : 'bot';
      const messageArray = isUserMessage ? userMessages : botMessages;
      
      const message = {
        conversation_id: conversation._id,
        content: faker.helpers.arrayElement(messageArray),
        sender: sender,
        timestamp: faker.date.between({ 
          from: conversation.created_at, 
          to: new Date() 
        }),
        emotion: faker.helpers.arrayElement(['happy', 'sad', 'angry', 'neutral'])
      };
      
      messages.push(message);
      messageCount++;
    }
  }
  
  console.log(`💌 Tạo ${messages.length} tin nhắn`);
  return await Message.insertMany(messages);
};

// Hàm xóa dữ liệu cũ
const clearDatabase = async () => {
  try {
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu cũ');
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
  }
};

// Hàm seed chính
const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Xóa dữ liệu cũ
    await clearDatabase();
    
    // Tạo dữ liệu mới
    console.log('🌱 Bắt đầu seed dữ liệu...');
    
    // Tạo users
    const users = await createUsers(5); // Tạo 5 users
    console.log(`✅ Đã tạo ${users.length} users`);
    
    // Tạo conversations
    const conversations = await createConversations(users, 2); // Mỗi user có 2 cuộc trò chuyện
    console.log(`✅ Đã tạo ${conversations.length} conversations`);
    
    // Tạo messages
    const messages = await createMessages(conversations, 6); // Mỗi cuộc trò chuyện có 6 tin nhắn
    console.log(`✅ Đã tạo ${messages.length} messages`);
    
    console.log('🎉 Seed dữ liệu thành công!');
    
    // Hiển thị thống kê
    console.log('\n📊 Thống kê dữ liệu:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Conversations: ${conversations.length}`);
    console.log(`- Messages: ${messages.length}`);
    
  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed:', error);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('🔐 Đã đóng kết nối database');
    process.exit(0);
  }
};

seedDatabase();


