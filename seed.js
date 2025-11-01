const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Book = require('./models/Book');
const User = require('./models/User');
const Borrow = require('./models/Borrow');
const Return = require('./models/Return');

(async () => {
  await connectDB(process.env.MONGO_URI);

  try {
 
    await Promise.all([
      Book.deleteMany({}),
      User.deleteMany({}),
      Borrow.deleteMany({}),
      Return.deleteMany({})
    ]);

    console.log('Cleared existing collections');


    const users = await User.insertMany([
      { name: 'Admin User', username: 'Jayveer', password: 'Jayveer123', email: 'jayveer@gmail.com', mobile: 7599851060, admin: true },
      { name: 'User1', username: 'user1', password: 'user1pass', email: 'user1@gmail.com', mobile: 7599851061 },
      { name: 'User2', username: 'user2', password: 'user2pass', email: 'user2@gmail.com', mobile: 7599851062 },
      { name: 'User3', username: 'user3', password: 'user3pass', email: 'user3@gmail.com', mobile: 7599851063 },
      { name: 'User4', username: 'user4', password: 'user4pass', email: 'user4@gmail.com', mobile: 7599851064 }
    ]);
    console.log('Users seeded');


    const books = await Book.insertMany([
      { name: 'Book1', author: 'Author1', genre: 'Fiction', type: 'Paperback' },
      { name: 'Book2', author: 'Author2', genre: 'Non-fiction', type: 'Hardcover' },
      { name: 'Book3', author: 'Author3', genre: 'Science', type: 'Paperback' },
      { name: 'Book4', author: 'Author4', genre: 'History', type: 'Ebook' },
      { name: 'Book5', author: 'Author5', genre: 'Mystery', type: 'Paperback' }
    ]);
    console.log('Books seeded');


    const borrows = await Borrow.insertMany([
      { username: users[1].username, bookid: books[0]._id },
      { username: users[2].username, bookid: books[1]._id },
      { username: users[3].username, bookid: books[2]._id },
      { username: users[4].username, bookid: books[3]._id },
      { username: users[1].username, bookid: books[4]._id }
    ]);
    console.log('Borrow records seeded');


    await Return.insertMany([
      { username: users[1].username, bookid: books[0]._id, duedate: new Date(), fine: 0 },
      { username: users[2].username, bookid: books[1]._id, duedate: new Date(), fine: 10 },
      { username: users[3].username, bookid: books[2]._id, duedate: new Date(), fine: 0 },
      { username: users[4].username, bookid: books[3]._id, duedate: new Date(), fine: 5 },
      { username: users[1].username, bookid: books[4]._id, duedate: new Date(), fine: 0 }
    ]);
    console.log('Return records seeded');

    console.log('\Database successfully seeded with Users, Books, Borrow, and Return data');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
