const mongoose = require('mongoose');
const { Schema } = mongoose;

const returnSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', unique: true, required: true },
  duedate: { type: Date, required: true },
  fine: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
