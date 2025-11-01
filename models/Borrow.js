const mongoose = require('mongoose');
const { Schema } = mongoose;

const borrowSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  duedate: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Borrow', borrowSchema);

