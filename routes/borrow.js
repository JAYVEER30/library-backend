const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const ReturnRecord = require('../models/Return');

router.post('/', auth, async (req, res) => {
  try {
    const username = req.user.username;
    const { bookid } = req.body;
    if (!bookid) return res.status(400).json({ message: 'bookid required' });

    const book = await Book.findById(bookid);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.available) return res.status(400).json({ message: 'Book is currently not available' });

    const borrow = new Borrow({ username, bookid });
    await borrow.save();
    book.available = false;
    await book.save();
    res.json({ message: 'Book borrowed', borrow });
  } catch (err) {
    console.error("❌ Borrow POST Error:", err); // <---- Add this
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/return', auth, async (req, res) => {
  try {
    const username = req.user.username;
    const { bookid } = req.body;
    if (!bookid) return res.status(400).json({ message: 'bookid required' });

    const borrow = await Borrow.findOne({ bookid, username });
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

    const due = borrow.duedate;
    const now = new Date();
    let fine = 0;
    if (now > due) {
      const msLate = now - due;
      const daysLate = Math.ceil(msLate / (24 * 60 * 60 * 1000));
      fine = daysLate * 10;
    }

    const returnRec = new ReturnRecord({
      username,
      bookid,
      duedate: borrow.duedate,
      fine
    });
    await returnRec.save();

    const book = await Book.findById(bookid);
    if (book) {
      book.available = true;
      await book.save();
    }
    await Borrow.deleteOne({ _id: borrow._id });
    res.json({ message: 'Book returned', fine, returnRec });
  } catch (err) {
    console.error("❌ Return POST Error:", err); // <---- Add this
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ message: 'Admin only' });
    const list = await Borrow.find().populate('bookid');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
