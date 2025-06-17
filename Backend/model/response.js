const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Từ khóa là bắt buộc'],
    trim: true,
    lowercase: true
  },
  reply_text: {
    type: String,
    required: [true, 'Câu trả lời là bắt buộc'],
    trim: true
  },
  emotion_type: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'neutral'],
    required: [true, 'Loại cảm xúc là bắt buộc']
  },
  priority: {
    type: Number,
    default: 1,
    min: [1, 'Độ ưu tiên thấp nhất là 1'],
    max: [10, 'Độ ưu tiên cao nhất là 10']
  }
});

module.exports = mongoose.model('Response', responseSchema);
